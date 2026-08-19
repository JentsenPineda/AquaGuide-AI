import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type ReminderRepeat = "Daily" | "Weekly" | "Monthly";

const SETTINGS_KEY = "notification_settings";

const CHANNEL_SOUND_VIBRATION = "aquaguide-reminders-sound-vibration";

const CHANNEL_SOUND_ONLY = "aquaguide-reminders-sound-only";

const CHANNEL_VIBRATION_ONLY = "aquaguide-reminders-vibration-only";

const CHANNEL_SILENT = "aquaguide-reminders-silent";

const weekDayMap: Record<string, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

type NotificationSettings = {
  reminders: boolean;
  sound: boolean;
  vibration: boolean;
  tips: boolean;
};

/**
 * Read the current notification preferences.
 */
async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const saved = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!saved) {
      return {
        reminders: true,
        sound: true,
        vibration: true,
        tips: false,
      };
    }

    const settings = JSON.parse(saved);

    return {
      reminders: settings.reminders ?? true,
      sound: settings.sound ?? true,
      vibration: settings.vibration ?? true,
      tips: settings.tips ?? false,
    };
  } catch (error) {
    console.log("Failed to read notification settings:", error);

    return {
      reminders: true,
      sound: true,
      vibration: true,
      tips: false,
    };
  }
}

/**
 * Determine which Android notification channel
 * should be used.
 */
function getNotificationChannelId(sound: boolean, vibration: boolean): string {
  if (sound && vibration) {
    return CHANNEL_SOUND_VIBRATION;
  }

  if (sound && !vibration) {
    return CHANNEL_SOUND_ONLY;
  }

  if (!sound && vibration) {
    return CHANNEL_VIBRATION_ONLY;
  }

  return CHANNEL_SILENT;
}

/**
 * Configure Android notification channels.
 */
export async function configureNotificationChannels() {
  if (Platform.OS !== "android") {
    return;
  }

  const vibrationPattern = [0, 250, 150, 250];

  await Notifications.setNotificationChannelAsync(CHANNEL_SOUND_VIBRATION, {
    name: "Fish Care Alerts",
    description: "AquaGuide AI reminders with sound and vibration.",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    enableVibrate: true,
    vibrationPattern,
    showBadge: false,
  });

  await Notifications.setNotificationChannelAsync(CHANNEL_SOUND_ONLY, {
    name: "Fish Care Alerts - Sound",
    description: "AquaGuide AI reminders with sound only.",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    enableVibrate: false,
    vibrationPattern: [0],
    showBadge: false,
  });

  await Notifications.setNotificationChannelAsync(CHANNEL_VIBRATION_ONLY, {
    name: "Fish Care Alerts - Vibration",
    description: "AquaGuide AI reminders with vibration only.",
    importance: Notifications.AndroidImportance.HIGH,
    sound: null,
    enableVibrate: true,
    vibrationPattern,
    showBadge: false,
  });

  await Notifications.setNotificationChannelAsync(CHANNEL_SILENT, {
    name: "Fish Care Alerts - Silent",
    description: "AquaGuide AI reminders without sound or vibration.",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
    enableVibrate: false,
    vibrationPattern: [0],
    showBadge: false,
  });
}

/**
 * Schedule one reminder notification.
 *
 * If Reminder Notifications are disabled,
 * nothing is scheduled and null is returned.
 */
export async function scheduleReminderNotification(
  title: string,
  body: string,
  reminder: {
    repeat: ReminderRepeat;
    hour: number;
    minute: number;
    weekDay?: string;
    monthDay?: number;
  },
): Promise<string | null> {
  const settings = await getNotificationSettings();

  if (!settings.reminders) {
    return null;
  }

  await configureNotificationChannels();

  const channelId = getNotificationChannelId(
    settings.sound,
    settings.vibration,
  );

  let trigger: Notifications.NotificationTriggerInput;

  switch (reminder.repeat) {
    case "Daily":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
        ...(Platform.OS === "android" ? { channelId } : {}),
      };
      break;

    case "Weekly":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekDayMap[reminder.weekDay ?? "Mon"],
        hour: reminder.hour,
        minute: reminder.minute,
        ...(Platform.OS === "android" ? { channelId } : {}),
      };
      break;

    case "Monthly":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: reminder.monthDay ?? 1,
        hour: reminder.hour,
        minute: reminder.minute,
        ...(Platform.OS === "android" ? { channelId } : {}),
      };
      break;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: settings.sound ? "default" : false,
      data: {
        type: "fish-care-reminder",
      },
    },
    trigger,
  });

  return notificationId;
}

/**
 * Cancel one scheduled reminder notification.
 */
export async function cancelReminderNotification(notificationId: string) {
  if (!notificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log("Failed to cancel reminder notification:", error);
  }
}

/**
 * Cancel all AquaGuide AI reminder notifications.
 *
 * This does NOT delete anything from Firestore.
 */
export async function cancelAllReminderNotifications() {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      const type = notification.content.data?.type;

      if (type === "fish-care-reminder") {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        );
      }
    }
  } catch (error) {
    console.log("Failed to cancel reminder notifications:", error);
  }
}

/**
 * Check whether reminder notifications are enabled.
 */
export async function areReminderNotificationsEnabled() {
  const settings = await getNotificationSettings();

  return settings.reminders;
}
