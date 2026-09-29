import AsyncStorage from "@react-native-async-storage/async-storage";

export type SyncOperation = "create" | "update" | "delete";

export interface PendingSync<T = any> {
  id: string;
  operation: SyncOperation;
  collection: "reminders" | "logs";
  documentId: string;
  data?: T;
  createdAt: string;
}

const getDataKey = (uid: string, collection: string) =>
  `offline_${collection}_${uid}`;

const getQueueKey = (uid: string, collection: string) =>
  `offline_${collection}_sync_queue_${uid}`;

/* -------------------------------------------------------------------------- */
/* LOCAL DATA                                                                 */
/* -------------------------------------------------------------------------- */

export const getLocalData = async <T>(
  uid: string,
  collection: "reminders" | "logs",
): Promise<T[]> => {
  try {
    const key = getDataKey(uid, collection);

    const saved = await AsyncStorage.getItem(key);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as T[];
  } catch (error) {
    console.error(`Failed to read local ${collection} data:`, error);

    return [];
  }
};

export const saveLocalData = async <T>(
  uid: string,
  collection: "reminders" | "logs",
  data: T[],
): Promise<void> => {
  try {
    const key = getDataKey(uid, collection);

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save local ${collection} data:`, error);

    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* SYNC QUEUE                                                                */
/* -------------------------------------------------------------------------- */

export const getPendingSyncs = async <T = any>(
  uid: string,
  collection: "reminders" | "logs",
): Promise<PendingSync<T>[]> => {
  try {
    const key = getQueueKey(uid, collection);

    const saved = await AsyncStorage.getItem(key);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as PendingSync<T>[];
  } catch (error) {
    console.error(`Failed to read ${collection} sync queue:`, error);

    return [];
  }
};

export const savePendingSyncs = async <T = any>(
  uid: string,
  collection: "reminders" | "logs",
  queue: PendingSync<T>[],
): Promise<void> => {
  const key = getQueueKey(uid, collection);

  await AsyncStorage.setItem(key, JSON.stringify(queue));
};

export const addPendingSync = async <T = any>(
  uid: string,
  collection: "reminders" | "logs",
  operation: SyncOperation,
  documentId: string,
  data?: T,
): Promise<void> => {
  const queue = await getPendingSyncs<T>(uid, collection);

  /*
   * If the same document already has a pending operation,
   * merge the operations instead of creating unnecessary
   * duplicate queue entries.
   */
  const existingIndex = queue.findIndex(
    (item) => item.documentId === documentId,
  );

  if (existingIndex !== -1) {
    const existing = queue[existingIndex];

    /*
     * CREATE → UPDATE
     *
     * The document hasn't reached Firestore yet, so we
     * can simply keep it as CREATE with its newest data.
     */
    if (existing.operation === "create" && operation === "update") {
      queue[existingIndex] = {
        ...existing,
        data,
      };

      await savePendingSyncs(uid, collection, queue);

      return;
    }

    /*
     * CREATE → DELETE
     *
     * It never needs to be uploaded to Firestore.
     */
    if (existing.operation === "create" && operation === "delete") {
      queue.splice(existingIndex, 1);

      await savePendingSyncs(uid, collection, queue);

      return;
    }

    /*
     * UPDATE → DELETE
     */
    if (existing.operation === "update" && operation === "delete") {
      queue[existingIndex] = {
        ...existing,
        operation: "delete",
        data: undefined,
      };

      await savePendingSyncs(uid, collection, queue);

      return;
    }

    /*
     * UPDATE → UPDATE
     *
     * Keep only the newest update.
     */
    if (existing.operation === "update" && operation === "update") {
      queue[existingIndex] = {
        ...existing,
        data,
      };

      await savePendingSyncs(uid, collection, queue);

      return;
    }

    /*
     * DELETE → CREATE
     *
     * The user recreated the same document.
     */
    if (existing.operation === "delete" && operation === "create") {
      queue[existingIndex] = {
        ...existing,
        operation: "create",
        data,
      };

      await savePendingSyncs(uid, collection, queue);

      return;
    }
  }

  queue.push({
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    operation,
    collection,
    documentId,
    data,
    createdAt: new Date().toISOString(),
  });

  await savePendingSyncs(uid, collection, queue);
};

/* -------------------------------------------------------------------------- */
/* REMOVE SYNC ITEM                                                           */
/* -------------------------------------------------------------------------- */

export const removePendingSync = async (
  uid: string,
  collection: "reminders" | "logs",
  syncId: string,
): Promise<void> => {
  const queue = await getPendingSyncs(uid, collection);

  const updatedQueue = queue.filter((item) => item.id !== syncId);

  await savePendingSyncs(uid, collection, updatedQueue);
};

/* -------------------------------------------------------------------------- */
/* CLEAR LOCAL DATA                                                           */
/* -------------------------------------------------------------------------- */

export const clearLocalData = async (
  uid: string,
  collection: "reminders" | "logs",
): Promise<void> => {
  await AsyncStorage.removeItem(getDataKey(uid, collection));

  await AsyncStorage.removeItem(getQueueKey(uid, collection));
};
