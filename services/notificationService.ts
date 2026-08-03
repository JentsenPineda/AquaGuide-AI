import * as Notifications from "expo-notifications";

export type ReminderRepeat = "Daily" | "Weekly" | "Monthly";

const weekDayMap: Record<string, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

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
) {
  let trigger: Notifications.NotificationTriggerInput;

  switch (reminder.repeat) {
    case "Daily":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
      };
      break;

    case "Weekly":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekDayMap[reminder.weekDay ?? "Mon"],
        hour: reminder.hour,
        minute: reminder.minute,
      };
      break;

    case "Monthly":
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: reminder.monthDay ?? 1,
        hour: reminder.hour,
        minute: reminder.minute,
      };
      break;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger,
  });

  return id;
}

export async function cancelReminderNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
