import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";

import { db } from "../config/firebase";

import {
  addPendingSync,
  getLocalData,
  getPendingSyncs,
  saveLocalData,
} from "./offlineStorageService";

import { syncAllOfflineData } from "./syncService";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface LogItem {
  id: string;

  type:
    | "Feeding"
    | "Water Change"
    | "Health Observation"
    | "Disease Treatment"
    | "New Fish Added"
    | "Tank Maintenance";

  note?: string;

  date: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const sortLogs = (logs: LogItem[]): LogItem[] => {
  return [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

/* -------------------------------------------------------------------------- */
/* Apply Pending Operations                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Applies locally queued operations on top of Firestore data.
 *
 * This prevents an old Firestore snapshot from temporarily
 * removing a log that was just created or edited offline.
 */
const applyPendingOperations = async (
  userId: string,
  firestoreLogs: LogItem[],
): Promise<LogItem[]> => {
  const pending = await getPendingSyncs<LogItem>(userId, "logs");

  if (pending.length === 0) {
    return sortLogs(firestoreLogs);
  }

  const merged = [...firestoreLogs];

  for (const operation of pending) {
    const existingIndex = merged.findIndex(
      (log) => log.id === operation.documentId,
    );

    /* -------------------------------------------------------------------- */
    /* CREATE / UPDATE                                                      */
    /* -------------------------------------------------------------------- */

    if (operation.operation === "create" || operation.operation === "update") {
      if (!operation.data) {
        continue;
      }

      const log: LogItem = {
        ...(operation.data as LogItem),
        id: operation.documentId,
      };

      if (existingIndex >= 0) {
        merged[existingIndex] = log;
      } else {
        merged.push(log);
      }
    }

    /* -------------------------------------------------------------------- */
    /* DELETE                                                               */
    /* -------------------------------------------------------------------- */

    if (operation.operation === "delete") {
      if (existingIndex >= 0) {
        merged.splice(existingIndex, 1);
      }
    }
  }

  return sortLogs(merged);
};

/* -------------------------------------------------------------------------- */
/* Get Logs                                                                   */
/* -------------------------------------------------------------------------- */

export const getLogs = async (userId: string): Promise<LogItem[]> => {
  /*
   * Read the local cache first.
   *
   * This allows Logbook to work without internet.
   */
  const localLogs = await getLocalData<LogItem>(userId, "logs");

  /*
   * Try to push any pending local changes.
   *
   * If offline, the queued operations remain safely stored.
   */
  try {
    await syncAllOfflineData(userId);
  } catch (error) {
    console.log("Offline log sync unavailable:", error);
  }

  /*
   * Try to retrieve the latest Firestore data.
   */
  try {
    const q = query(
      collection(db, "users", userId, "logs"),
      orderBy("date", "desc"),
    );

    const snapshot = await getDocs(q);

    const firestoreLogs = snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Omit<LogItem, "id">),
    }));

    /*
     * Preserve any pending local changes.
     */
    const merged = await applyPendingOperations(userId, firestoreLogs);

    /*
     * Update local cache.
     */
    await saveLocalData(userId, "logs", merged);

    return merged;
  } catch (error) {
    /*
     * Firestore is unavailable.
     *
     * Return the cached data instead.
     */
    console.log(
      "Unable to fetch logs from Firestore. Using local data.",
      error,
    );

    return sortLogs(localLogs);
  }
};

/* -------------------------------------------------------------------------- */
/* Real-Time Log Listener                                                     */
/* -------------------------------------------------------------------------- */

export const subscribeToLogs = (
  userId: string,
  callback: (logs: LogItem[]) => void,
) => {
  let active = true;

  /*
   * Immediately display local logs.
   */
  getLocalData<LogItem>(userId, "logs").then((localLogs) => {
    if (!active) {
      return;
    }

    callback(sortLogs(localLogs));
  });

  const q = query(
    collection(db, "users", userId, "logs"),
    orderBy("date", "desc"),
  );

  /*
   * Continue receiving Firestore updates when available.
   */
  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      if (!active) {
        return;
      }

      try {
        const firestoreLogs = snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<LogItem, "id">),
        }));

        /*
         * Merge pending offline changes.
         */
        const merged = await applyPendingOperations(userId, firestoreLogs);

        if (!active) {
          return;
        }

        /*
         * Save the merged version locally.
         */
        await saveLocalData(userId, "logs", merged);

        callback(merged);
      } catch (error) {
        console.log("Failed to process log snapshot:", error);
      }
    },
    async (error) => {
      /*
       * Firestore listener unavailable.
       *
       * Local data remains usable.
       */
      if (error.code !== "permission-denied") {
        console.log("Logbook Firestore listener unavailable:", error);
      }

      if (!active) {
        return;
      }

      const localLogs = await getLocalData<LogItem>(userId, "logs");

      callback(sortLogs(localLogs));
    },
  );

  return () => {
    active = false;
    unsubscribe();
  };
};

/* -------------------------------------------------------------------------- */
/* Add Log                                                                    */
/* -------------------------------------------------------------------------- */

export const addLog = async (
  userId: string,
  log: Omit<LogItem, "id">,
): Promise<string> => {
  /*
   * Generate a Firestore-compatible ID locally.
   */
  const logRef = doc(collection(db, "users", userId, "logs"));

  const id = logRef.id;

  const localLog: LogItem = {
    ...log,
    id,
  };

  /*
   * Read existing local logs.
   */
  const existing = await getLocalData<LogItem>(userId, "logs");

  /*
   * Save locally FIRST.
   */
  await saveLocalData(
    userId,
    "logs",
    sortLogs([localLog, ...existing.filter((item) => item.id !== id)]),
  );

  /*
   * Queue the Firestore create operation.
   */
  await addPendingSync(userId, "logs", "create", id, localLog);

  /*
   * Try synchronization immediately.
   *
   * If offline, the queue stays in AsyncStorage.
   */
  try {
    await syncAllOfflineData(userId);
  } catch (error) {
    console.log("Log saved locally. Cloud sync will be retried later:", error);
  }

  return id;
};

/* -------------------------------------------------------------------------- */
/* Update Log                                                                 */
/* -------------------------------------------------------------------------- */

export const updateLog = async (
  userId: string,
  logId: string,
  log: Omit<LogItem, "id">,
): Promise<void> => {
  const updatedLog: LogItem = {
    ...log,
    id: logId,
  };

  /*
   * Update local storage immediately.
   */
  const existing = await getLocalData<LogItem>(userId, "logs");

  const updatedList = existing.some((item) => item.id === logId)
    ? existing.map((item) => (item.id === logId ? updatedLog : item))
    : [updatedLog, ...existing];

  await saveLocalData(userId, "logs", sortLogs(updatedList));

  /*
   * Queue the Firestore update.
   */
  await addPendingSync(userId, "logs", "update", logId, updatedLog);

  /*
   * Try synchronization.
   */
  try {
    await syncAllOfflineData(userId);
  } catch (error) {
    console.log(
      "Log updated locally. Cloud sync will be retried later:",
      error,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Delete Log                                                                 */
/* -------------------------------------------------------------------------- */

export const deleteLog = async (
  userId: string,
  logId: string,
): Promise<void> => {
  /*
   * Remove from local storage immediately.
   */
  const existing = await getLocalData<LogItem>(userId, "logs");

  const remaining = existing.filter((item) => item.id !== logId);

  await saveLocalData(userId, "logs", remaining);

  /*
   * Queue the Firestore deletion.
   *
   * If the log was created offline and has never
   * reached Firestore, the queue will collapse
   * CREATE → DELETE.
   */
  await addPendingSync(userId, "logs", "delete", logId);

  /*
   * Try synchronization.
   */
  try {
    await syncAllOfflineData(userId);
  } catch (error) {
    console.log(
      "Log deleted locally. Cloud deletion will be retried later:",
      error,
    );
  }
};
