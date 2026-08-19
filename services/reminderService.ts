import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from "./notificationService";

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
/* Get Reminders                                                              */
/* -------------------------------------------------------------------------- */

export const getReminders = async (uid: string): Promise<Reminder[]> => {
  const q = query(
    collection(db, "users", uid, "reminders"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    ...(document.data() as Omit<Reminder, "id">),
    id: document.id,
  })) as Reminder[];
};

/* -------------------------------------------------------------------------- */
/* Real-Time Reminder Listener                                                */
/* -------------------------------------------------------------------------- */

export const subscribeToReminders = (
  uid: string,
  callback: (reminders: Reminder[]) => void,
) => {
  const q = query(
    collection(db, "users", uid, "reminders"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const reminders = snapshot.docs.map((document) => ({
        ...(document.data() as Omit<Reminder, "id">),
        id: document.id,
      })) as Reminder[];

      callback(reminders);
    },
    (error) => {
      if (error.code !== "permission-denied") {
        console.error(error);
      }
    },
  );
};

/* -------------------------------------------------------------------------- */
/* Add Reminder                                                               */
/* -------------------------------------------------------------------------- */

export const addReminder = async (
  uid: string,
  reminder: Omit<Reminder, "id">,
) => {
  const data: Record<string, any> = {
    createdAt: serverTimestamp(),
  };

  Object.entries(reminder).forEach(([key, value]) => {
    if (value !== undefined) {
      data[key] = value;
    }
  });

  const notificationsEnabled = await areReminderNotificationsEnabled();

  if (notificationsEnabled) {
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

    if (notificationId) {
      data.notificationId = notificationId;
    }
  }

  await addDoc(collection(db, "users", uid, "reminders"), data);
};

/* -------------------------------------------------------------------------- */
/* Update Reminder                                                            */
/* -------------------------------------------------------------------------- */

export const updateReminder = async (
  uid: string,
  id: string,
  reminder: Reminder,
) => {
  /*
   * Cancel the previous notification first.
   */
  if (reminder.notificationId) {
    await cancelReminderNotification(reminder.notificationId);
  }

  const notificationsEnabled = await areReminderNotificationsEnabled();

  let notificationId: string | null = null;

  if (notificationsEnabled) {
    notificationId = await scheduleReminderNotification(
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
  }

  const updateData: Record<string, any> = {
    ...reminder,
  };

  if (notificationId) {
    updateData.notificationId = notificationId;
  } else {
    delete updateData.notificationId;
  }

  await updateDoc(doc(db, "users", uid, "reminders", id), updateData);
};

/* -------------------------------------------------------------------------- */
/* Delete Reminder                                                            */
/* -------------------------------------------------------------------------- */

export const deleteReminder = async (uid: string, id: string) => {
  const reminderRef = doc(db, "users", uid, "reminders", id);

  /*
   * Find the existing reminder before deleting it.
   * This allows us to cancel its notification.
   */
  const snapshot = await getDocs(
    query(collection(db, "users", uid, "reminders")),
  );

  const existingReminder = snapshot.docs.find((document) => document.id === id);

  if (existingReminder) {
    const data = existingReminder.data() as Reminder;

    if (data.notificationId) {
      await cancelReminderNotification(data.notificationId);
    }
  }

  await deleteDoc(reminderRef);
};

/* -------------------------------------------------------------------------- */
/* Restore Missing Reminder Notifications                                     */
/* -------------------------------------------------------------------------- */

/**
 * Restores notifications for reminders that exist in
 * Firestore but don't currently have an active scheduled
 * notification on the device.
 *
 * This handles reminders created while notifications
 * were disabled, as well as reminders whose previous
 * notification was cancelled.
 *
 * Existing active notifications are not duplicated.
 */
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
   * Get all reminders stored in Firestore.
   */
  const reminders = await getReminders(uid);

  /*
   * Get notifications that are actually scheduled
   * on the device right now.
   */
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  /*
   * Store their IDs in a Set for quick lookup.
   */
  const scheduledNotificationIds = new Set(
    scheduledNotifications.map((notification) => notification.identifier),
  );

  let restoredCount = 0;

  for (const reminder of reminders) {
    /*
     * If Firestore contains a notificationId AND that
     * notification is actually scheduled on the device,
     * everything is already correct.
     *
     * Skip it to prevent duplicates.
     */
    if (
      reminder.notificationId &&
      scheduledNotificationIds.has(reminder.notificationId)
    ) {
      continue;
    }

    /*
     * At this point, the reminder either:
     *
     * - never had a notification
     * - had a notification that was cancelled
     * - has a stale notificationId
     *
     * Schedule a fresh notification.
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
     * Save the new device notification ID in Firestore.
     */
    await updateDoc(doc(db, "users", uid, "reminders", reminder.id), {
      notificationId,
    });

    restoredCount++;
  }

  return restoredCount;
};
