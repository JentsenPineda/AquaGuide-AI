import { deleteDoc, doc, setDoc } from "firebase/firestore";

import { db } from "../config/firebase";

import {
    getPendingSyncs,
    PendingSync,
    removePendingSync,
} from "./offlineStorageService";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type SyncCollection = "reminders" | "logs";

/* -------------------------------------------------------------------------- */
/* SYNC STATE                                                                 */
/* -------------------------------------------------------------------------- */

/*
 * Prevents multiple synchronization processes from running
 * at the same time.
 */
let isSyncing = false;

/* -------------------------------------------------------------------------- */
/* SYNC SINGLE ITEM                                                           */
/* -------------------------------------------------------------------------- */

const syncItem = async (uid: string, item: PendingSync): Promise<void> => {
  const collection = item.collection as SyncCollection;

  const documentRef = doc(db, "users", uid, collection, item.documentId);

  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                  */
  /* ---------------------------------------------------------------------- */

  if (item.operation === "create") {
    if (!item.data) {
      throw new Error(`Missing data for CREATE operation: ${item.documentId}`);
    }

    /*
     * setDoc() allows us to use the exact local document ID.
     *
     * This is important because the local record and Firestore
     * record must have the same ID.
     */
    await setDoc(documentRef, item.data);

    return;
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                  */
  /* ---------------------------------------------------------------------- */

  if (item.operation === "update") {
    if (!item.data) {
      throw new Error(`Missing data for UPDATE operation: ${item.documentId}`);
    }

    /*
     * merge: true prevents unrelated Firestore fields from
     * being overwritten.
     */
    await setDoc(documentRef, item.data, {
      merge: true,
    });

    return;
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                  */
  /* ---------------------------------------------------------------------- */

  if (item.operation === "delete") {
    await deleteDoc(documentRef);

    return;
  }

  throw new Error(`Unsupported sync operation: ${item.operation}`);
};

/* -------------------------------------------------------------------------- */
/* SYNC COLLECTION                                                            */
/* -------------------------------------------------------------------------- */

export const syncCollection = async (
  uid: string,
  collection: SyncCollection,
): Promise<{
  synced: number;
  failed: number;
}> => {
  if (!uid) {
    return {
      synced: 0,
      failed: 0,
    };
  }

  const pendingItems = await getPendingSyncs(uid, collection);

  if (pendingItems.length === 0) {
    return {
      synced: 0,
      failed: 0,
    };
  }

  let synced = 0;
  let failed = 0;

  /*
   * Process items in queue order.
   *
   * This is important because operations should normally
   * happen in the same order that the user performed them.
   */
  for (const item of pendingItems) {
    try {
      await syncItem(uid, item);

      /*
       * Only remove the queue item AFTER Firestore
       * confirms the operation succeeded.
       */
      await removePendingSync(uid, collection, item.id);

      synced++;
    } catch (error) {
      failed++;

      /*
       * IMPORTANT:
       *
       * Do NOT remove failed operations.
       *
       * They remain in AsyncStorage and can be retried
       * when the device is online again.
       */
      console.log(
        `Offline sync failed for ${collection}/${item.documentId}:`,
        error,
      );
    }
  }

  return {
    synced,
    failed,
  };
};

/* -------------------------------------------------------------------------- */
/* SYNC EVERYTHING                                                            */
/* -------------------------------------------------------------------------- */

export const syncAllOfflineData = async (
  uid: string,
): Promise<{
  reminders: {
    synced: number;
    failed: number;
  };
  logs: {
    synced: number;
    failed: number;
  };
}> => {
  if (!uid) {
    return {
      reminders: {
        synced: 0,
        failed: 0,
      },
      logs: {
        synced: 0,
        failed: 0,
      },
    };
  }

  /*
   * Prevent duplicate synchronization calls.
   */
  if (isSyncing) {
    return {
      reminders: {
        synced: 0,
        failed: 0,
      },
      logs: {
        synced: 0,
        failed: 0,
      },
    };
  }

  isSyncing = true;

  try {
    /*
     * Sync reminders first.
     */
    const reminders = await syncCollection(uid, "reminders");

    /*
     * Then sync logbook entries.
     */
    const logs = await syncCollection(uid, "logs");

    return {
      reminders,
      logs,
    };
  } finally {
    isSyncing = false;
  }
};
