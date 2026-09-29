import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
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

import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from "./notificationService";

import { syncAllOfflineData } from "./syncService";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Reminder {
  id: string;

  type:
    | "Feeding"
    | "Water Change"
    | "Water Testing"
    | "Medication"
    | "Tank Cleaning"
    | "Plant Maintenance";

  repeat: "Daily" | "Weekly" | "Monthly";

  weekDay?: string;

  monthDay?: number;

  time: string;

  hour: number;

  minute: number;

  note?: string;

  notificationId?: string;

  /*
   * Existing Firestore reminders use serverTimestamp().
   * Offline reminders use an ISO string.
   *
   * The type remains flexible so both formats are supported.
   */
  createdAt?: any;
}

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

/* -------------------------------------------------------------------------- */
/* Notification Settings                                                      */
/* -------------------------------------------------------------------------- */

const areReminderNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);

    if (!saved) {
      return true;
    }

    const settings = JSON.parse(saved);

    return settings.reminders ?? true;
  } catch (error) {
    console.log("Failed to read notification settings:", error);

    return true;
  }
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Converts different createdAt formats into a number
 * that can be used for sorting.
 */
const getCreatedAtTime = (value: any): number => {
  if (!value) {
    return 0;
  }

  /*
   * Firestore Timestamp
   */
  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  /*
   * ISO string
   */
  if (typeof value === "string") {
    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
  }

  /*
   * Number
   */
  if (typeof value === "number") {
    return value;
  }

  return 0;
};

const sortReminders = (reminders: Reminder[]): Reminder[] => {
  return [...reminders].sort(
    (a, b) => getCreatedAtTime(b.createdAt) - getCreatedAtTime(a.createdAt),
  );
};

/* -------------------------------------------------------------------------- */
/* Apply Pending Offline Changes                                              */
/* -------------------------------------------------------------------------- */

/**
 * Firestore can return a snapshot that does not yet contain
 * local operations waiting in our offline queue.
 *
 * This function overlays those pending operations on top
 * of the Firestore data.
 */
const applyPendingOperations = async (
  uid: string,
  firestoreReminders: Reminder[],
): Promise<Reminder[]> => {
  const pending = await getPendingSyncs<Reminder>(uid, "reminders");

  if (pending.length === 0) {
    return sortReminders(firestoreReminders);
  }

  const merged = [...firestoreReminders];

  for (const operation of pending) {
    const existingIndex = merged.findIndex(
      (reminder) => reminder.id === operation.documentId,
    );

    /*
     * CREATE / UPDATE
     */
    if (operation.operation === "create" || operation.operation === "update") {
      if (!operation.data) {
        continue;
      }

      const reminder: Reminder = {
        ...(operation.data as Reminder),
        id: operation.documentId,
      };

      if (existingIndex >= 0) {
        merged[existingIndex] = reminder;
      } else {
        merged.push(reminder);
      }
    }

    /*
     * DELETE
     */
    if (operation.operation === "delete") {
      if (existingIndex >= 0) {
        merged.splice(existingIndex, 1);
      }
    }
  }

  return sortReminders(merged);
};

/* -------------------------------------------------------------------------- */
/* Get Reminders                                                              */
/* -------------------------------------------------------------------------- */

export const getReminders = async (uid: string): Promise<Reminder[]> => {
  /*
   * LOCAL FIRST
   *
   * This guarantees that the app has access to reminders
   * even when Firestore cannot be reached.
   */
  const localReminders = await getLocalData<Reminder>(uid, "reminders");

  /*
   * Try synchronization first.
   *
   * If the device is offline, syncAllOfflineData()
   * will fail safely and the local data remains available.
   */
  try {
    await syncAllOfflineData(uid);
  } catch (error) {
    console.log("Offline sync unavailable:", error);
  }

  /*
   * Try to retrieve the latest Firestore copy.
   */
  try {
    const q = query(
      collection(db, "users", uid, "reminders"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const firestoreReminders = snapshot.docs.map((document) => ({
      ...(document.data() as Omit<Reminder, "id">),
      id: document.id,
    })) as Reminder[];

    /*
     * Keep local pending changes visible.
     */
    const merged = await applyPendingOperations(uid, firestoreReminders);

    /*
     * Update local cache.
     */
    await saveLocalData(uid, "reminders", merged);

    return merged;
  } catch (error) {
    /*
     * Firestore unavailable.
     *
     * Return the cached local data instead.
     */
    console.log(
      "Unable to fetch reminders from Firestore. Using local data.",
      error,
    );

    return sortReminders(localReminders);
  }
};

/* -------------------------------------------------------------------------- */
/* Real-Time Reminder Listener                                                */
/* -------------------------------------------------------------------------- */

export const subscribeToReminders = (
  uid: string,
  callback: (reminders: Reminder[]) => void,
) => {
  let active = true;

  /*
   * STEP 1:
   *
   * Immediately load the local cache.
   */
  getLocalData<Reminder>(uid, "reminders").then((localReminders) => {
    if (!active) {
      return;
    }

    callback(sortReminders(localReminders));
  });

  const q = query(
    collection(db, "users", uid, "reminders"),
    orderBy("createdAt", "desc"),
  );

  /*
   * STEP 2:
   *
   * Continue listening to Firestore when available.
   */
  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      if (!active) {
        return;
      }

      try {
        const firestoreReminders = snapshot.docs.map((document) => ({
          ...(document.data() as Omit<Reminder, "id">),
          id: document.id,
        })) as Reminder[];

        /*
         * Don't allow an old Firestore snapshot to
         * overwrite a newer offline change.
         */
        const merged = await applyPendingOperations(uid, firestoreReminders);

        if (!active) {
          return;
        }

        /*
         * Save the merged result locally.
         */
        await saveLocalData(uid, "reminders", merged);

        callback(merged);
      } catch (error) {
        console.log("Failed to process reminder snapshot:", error);
      }
    },
    async (error) => {
      /*
       * Offline Firestore listener failure.
       *
       * The local cache is still usable.
       */
      if (error.code !== "permission-denied") {
        console.log("Reminder Firestore listener unavailable:", error);
      }

      if (!active) {
        return;
      }

      const localReminders = await getLocalData<Reminder>(uid, "reminders");

      callback(sortReminders(localReminders));
    },
  );

  return () => {
    active = false;
    unsubscribe();
  };
};

/* -------------------------------------------------------------------------- */
/* Add Reminder                                                               */
/* -------------------------------------------------------------------------- */

export const addReminder = async (
  uid: string,
  reminder: Omit<Reminder, "id">,
): Promise<string> => {
  /*
   * Generate a Firestore-compatible document ID locally.
   *
   * This does not upload anything.
   */
  const reminderRef = doc(collection(db, "users", uid, "reminders"));

  const id = reminderRef.id;

  const notificationsEnabled = await areReminderNotificationsEnabled();

  let notificationId: string | undefined;

  /*
   * Device notifications work locally.
   * They do not require Firebase.
   */
  if (notificationsEnabled) {
    const scheduledId = await scheduleReminderNotification(
      `AquaGuide AI - ${reminder.type}`,
      reminder.note || `${reminder.type} reminder`,
      {
        repeat: reminder.repeat,
        hour: reminder.hour,
        minute: reminder.minute,
        weekDay: reminder.weekDay,
        monthDay: reminder.monthDay,
      },
    );

    if (scheduledId) {
      notificationId = scheduledId;
    }
  }

  /*
   * Create the local reminder.
   */
  const localReminder: Reminder = {
    ...reminder,
    id,
    notificationId,
    createdAt: new Date().toISOString(),
  };

  /*
   * Get current local reminders.
   */
  const existing = await getLocalData<Reminder>(uid, "reminders");

  /*
   * Save locally FIRST.
   */
  await saveLocalData(
    uid,
    "reminders",
    sortReminders([
      localReminder,
      ...existing.filter((item) => item.id !== id),
    ]),
  );

  /*
   * Queue Firestore synchronization.
   */
  await addPendingSync(uid, "reminders", "create", id, localReminder);

  /*
   * Try to sync immediately.
   *
   * If offline, the queue remains safely stored.
   */
  try {
    await syncAllOfflineData(uid);
  } catch (error) {
    console.log(
      "Reminder saved locally. Cloud sync will be retried later:",
      error,
    );
  }

  return id;
};

/* -------------------------------------------------------------------------- */
/* Update Reminder                                                            */
/* -------------------------------------------------------------------------- */

export const updateReminder = async (
  uid: string,
  id: string,
  reminder: Reminder,
): Promise<void> => {
  /*
   * Cancel the previous device notification.
   */
  if (reminder.notificationId) {
    await cancelReminderNotification(reminder.notificationId);
  }

  const notificationsEnabled = await areReminderNotificationsEnabled();

  let notificationId: string | undefined;

  /*
   * Schedule the new notification locally.
   */
  if (notificationsEnabled) {
    const scheduledId = await scheduleReminderNotification(
      `AquaGuide AI - ${reminder.type}`,
      reminder.note || `${reminder.type} reminder`,
      {
        repeat: reminder.repeat,
        hour: reminder.hour,
        minute: reminder.minute,
        weekDay: reminder.weekDay,
        monthDay: reminder.monthDay,
      },
    );

    if (scheduledId) {
      notificationId = scheduledId;
    }
  }

  const updatedReminder: Reminder = {
    ...reminder,
    id,
    notificationId,
    createdAt: reminder.createdAt ?? new Date().toISOString(),
  };

  /*
   * Update local storage immediately.
   */
  const existing = await getLocalData<Reminder>(uid, "reminders");

  const updatedList = existing.some((item) => item.id === id)
    ? existing.map((item) => (item.id === id ? updatedReminder : item))
    : [updatedReminder, ...existing];

  await saveLocalData(uid, "reminders", sortReminders(updatedList));

  /*
   * Queue the update.
   */
  await addPendingSync(uid, "reminders", "update", id, updatedReminder);

  /*
   * Try synchronization.
   */
  try {
    await syncAllOfflineData(uid);
  } catch (error) {
    console.log(
      "Reminder updated locally. Cloud sync will be retried later:",
      error,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Delete Reminder                                                            */
/* -------------------------------------------------------------------------- */

export const deleteReminder = async (
  uid: string,
  id: string,
): Promise<void> => {
  /*
   * Find the local reminder.
   */
  const existing = await getLocalData<Reminder>(uid, "reminders");

  const reminder = existing.find((item) => item.id === id);

  /*
   * Cancel its device notification.
   */
  if (reminder?.notificationId) {
    await cancelReminderNotification(reminder.notificationId);
  }

  /*
   * Remove it from local storage immediately.
   */
  const remaining = existing.filter((item) => item.id !== id);

  await saveLocalData(uid, "reminders", remaining);

  /*
   * Queue the Firestore deletion.
   *
   * If the reminder was created offline and has
   * not yet reached Firestore, the sync queue will
   * collapse CREATE → DELETE.
   */
  await addPendingSync(uid, "reminders", "delete", id);

  /*
   * Try synchronization.
   */
  try {
    await syncAllOfflineData(uid);
  } catch (error) {
    console.log(
      "Reminder deleted locally. Cloud deletion will be retried later:",
      error,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Restore Missing Reminder Notifications                                     */
/* -------------------------------------------------------------------------- */

export const restoreMissingReminderNotifications = async (
  uid: string,
): Promise<number> => {
  if (!uid) {
    return 0;
  }

  const notificationsEnabled = await areReminderNotificationsEnabled();

  if (!notificationsEnabled) {
    return 0;
  }

  /*
   * Use local data first.
   *
   * This is important because notifications should
   * still work while offline.
   */
  let reminders = await getLocalData<Reminder>(uid, "reminders");

  /*
   * Try to synchronize first when possible.
   *
   * If offline, this simply falls back to local data.
   */
  try {
    await syncAllOfflineData(uid);

    reminders = await getReminders(uid);
  } catch (error) {
    console.log(
      "Unable to synchronize before notification restoration:",
      error,
    );
  }

  /*
   * Get notifications currently scheduled
   * on the device.
   */
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const scheduledNotificationIds = new Set(
    scheduledNotifications.map((notification) => notification.identifier),
  );

  let restoredCount = 0;

  for (const reminder of reminders) {
    /*
     * Already scheduled correctly.
     */
    if (
      reminder.notificationId &&
      scheduledNotificationIds.has(reminder.notificationId)
    ) {
      continue;
    }

    /*
     * Schedule locally.
     */
    const notificationId = await scheduleReminderNotification(
      `AquaGuide AI - ${reminder.type}`,
      reminder.note || `${reminder.type} reminder`,
      {
        repeat: reminder.repeat,
        hour: reminder.hour,
        minute: reminder.minute,
        weekDay: reminder.weekDay,
        monthDay: reminder.monthDay,
      },
    );

    if (!notificationId) {
      continue;
    }

    /*
     * Update local data.
     */
    const updatedReminder: Reminder = {
      ...reminder,
      notificationId,
    };

    const localReminders = await getLocalData<Reminder>(uid, "reminders");

    await saveLocalData(
      uid,
      "reminders",
      localReminders.map((item) =>
        item.id === reminder.id ? updatedReminder : item,
      ),
    );

    /*
     * Queue the Firestore update.
     *
     * If offline, this remains pending.
     */
    await addPendingSync(
      uid,
      "reminders",
      "update",
      reminder.id,
      updatedReminder,
    );

    /*
     * Try to synchronize immediately.
     */
    try {
      await syncAllOfflineData(uid);
    } catch (error) {
      console.log("Notification ID sync deferred:", error);
    }

    restoredCount++;
  }

  return restoredCount;
};
