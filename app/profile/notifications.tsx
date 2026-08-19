import AppHeader from "@/components/layout/AppHeader";
import { cancelAllReminderNotifications } from "@/services/notificationService";

import { useAuth } from "@/contexts/AuthContext";
import { restoreMissingReminderNotifications } from "@/services/reminderService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

/**
 * Notification handler
 *
 * Controls how notifications behave while AquaGuide AI
 * is currently open.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Storage
 */
const SETTINGS_KEY = "notification_settings";

/**
 * Notification channels
 *
 * Android channels are intentionally separated because
 * Android controls sound/vibration at the channel level.
 */
const CHANNEL_SOUND_VIBRATION = "aquaguide-reminders-sound-vibration";
const CHANNEL_SOUND_ONLY = "aquaguide-reminders-sound-only";
const CHANNEL_VIBRATION_ONLY = "aquaguide-reminders-vibration-only";
const CHANNEL_SILENT = "aquaguide-reminders-silent";

/**
 * Daily tip notification identifier.
 *
 * Using a fixed identifier allows us to replace/cancel
 * the existing daily tip instead of creating duplicates.
 */
const DAILY_TIP_NOTIFICATION_ID = "aquaguide-daily-fishkeeping-tip";

/**
 * Default time for daily fishkeeping tips.
 *
 * 9:00 AM local device time.
 */
const DAILY_TIP_HOUR = 9;
const DAILY_TIP_MINUTE = 0;

/**
 * Local fishkeeping tips.
 *
 * These do not require Gemini, Firebase billing,
 * an API, or an internet connection.
 */
const DAILY_TIPS = [
  "Check your aquarium temperature regularly and keep it stable for your fish.",
  "Remove uneaten food after feeding to help maintain good water quality.",
  "Observe your fish daily for changes in appetite, activity, or appearance.",
  "Perform regular water changes according to the needs of your aquarium.",
  "Clean filter media carefully without using untreated tap water.",
  "Avoid overcrowding your aquarium to reduce stress and water-quality problems.",
  "Test your aquarium water regularly and monitor important parameters.",
  "Introduce new fish gradually and allow them to acclimate before release.",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type NotificationSettings = {
  reminders: boolean;
  sound: boolean;
  vibration: boolean;
  tips: boolean;
};

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_SETTINGS: NotificationSettings = {
  reminders: true,
  sound: true,
  vibration: true,
  tips: false,
};

function getNotificationChannelId(sound: boolean, vibration: boolean) {
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

function getRandomDailyTip() {
  const index = Math.floor(Math.random() * DAILY_TIPS.length);

  return DAILY_TIPS[index];
}

/**
 * Creates Android notification channels.
 *
 * Android 8+ requires notifications to belong to channels.
 * Sound and vibration behavior are configured here.
 */
async function configureNotificationChannels() {
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
 * Requests notification permission when appropriate.
 */
async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return current;
  }

  if (!current.canAskAgain) {
    return current;
  }

  return await Notifications.requestPermissionsAsync();
}

/**
 * Setting row
 */
function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: SettingRowProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.primary + "12",
            },
          ]}
        >
          <Ionicons name={icon} size={21} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={value ? "#FFFFFF" : colors.textSecondary}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export default function NotificationsScreen() {
  const { user } = useAuth();
  const colors = useAppColors();

  const [reminders, setReminders] = useState(DEFAULT_SETTINGS.reminders);

  const [sound, setSound] = useState(DEFAULT_SETTINGS.sound);

  const [vibration, setVibration] = useState(DEFAULT_SETTINGS.vibration);

  const [tips, setTips] = useState(DEFAULT_SETTINGS.tips);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [permissionGranted, setPermissionGranted] = useState(false);

  const [canAskPermission, setCanAskPermission] = useState(true);

  /* ------------------------------------------------------------------------ */
  /* Load settings                                                            */
  /* ------------------------------------------------------------------------ */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      const saved = await AsyncStorage.getItem(SETTINGS_KEY);

      if (!saved) {
        setReminders(DEFAULT_SETTINGS.reminders);
        setSound(DEFAULT_SETTINGS.sound);
        setVibration(DEFAULT_SETTINGS.vibration);
        setTips(DEFAULT_SETTINGS.tips);

        return;
      }

      const settings: Partial<NotificationSettings> = JSON.parse(saved);

      setReminders(settings.reminders ?? DEFAULT_SETTINGS.reminders);

      setSound(settings.sound ?? DEFAULT_SETTINGS.sound);

      setVibration(settings.vibration ?? DEFAULT_SETTINGS.vibration);

      setTips(settings.tips ?? DEFAULT_SETTINGS.tips);
    } catch (error) {
      console.log("Failed to load notification settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Save settings                                                            */
  /* ------------------------------------------------------------------------ */

  const saveSettings = useCallback(
    async (nextSettings?: Partial<NotificationSettings>) => {
      try {
        setSaving(true);

        const current: NotificationSettings = {
          reminders,
          sound,
          vibration,
          tips,
          ...nextSettings,
        };

        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
      } catch (error) {
        console.log("Failed to save notification settings:", error);
      } finally {
        setSaving(false);
      }
    },
    [reminders, sound, vibration, tips],
  );

  /* ------------------------------------------------------------------------ */
  /* Permission                                                               */
  /* ------------------------------------------------------------------------ */

  const refreshPermissionStatus = useCallback(async () => {
    try {
      const permission = await Notifications.getPermissionsAsync();

      setPermissionGranted(permission.granted);
      setCanAskPermission(permission.canAskAgain);
    } catch (error) {
      console.log("Failed to check notification permission:", error);
    }
  }, []);

  const ensureNotificationPermission = useCallback(async () => {
    if (!Device.isDevice) {
      return false;
    }

    try {
      await configureNotificationChannels();

      const permission = await requestNotificationPermission();

      setPermissionGranted(permission.granted);
      setCanAskPermission(permission.canAskAgain);

      return permission.granted;
    } catch (error) {
      console.log("Notification permission error:", error);

      return false;
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Daily tips                                                               */
  /* ------------------------------------------------------------------------ */

  const cancelDailyTip = useCallback(async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(
        DAILY_TIP_NOTIFICATION_ID,
      );
    } catch {
      // Safe to ignore when the notification does not exist.
    }
  }, []);

  const scheduleDailyTip = useCallback(async () => {
    if (!tips) {
      await cancelDailyTip();
      return;
    }

    const permissionGranted = await ensureNotificationPermission();

    if (!permissionGranted) {
      return;
    }

    await cancelDailyTip();

    const channelId = getNotificationChannelId(sound, vibration);

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_TIP_NOTIFICATION_ID,

      content: {
        title: "AquaGuide AI",
        body: getRandomDailyTip(),

        sound: sound ? "default" : false,

        data: {
          type: "daily-fishkeeping-tip",
        },
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: DAILY_TIP_HOUR,
        minute: DAILY_TIP_MINUTE,
        channelId,
      },
    });
  }, [tips, sound, vibration, cancelDailyTip, ensureNotificationPermission]);

  /* ------------------------------------------------------------------------ */
  /* Initial setup                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const initialize = async () => {
      await loadSettings();

      if (Device.isDevice) {
        await configureNotificationChannels();
        await refreshPermissionStatus();
      }
    };

    initialize();
  }, [loadSettings, refreshPermissionStatus]);

  /* ------------------------------------------------------------------------ */
  /* Update daily tip when settings change                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (loading) return;

    const updateDailyTip = async () => {
      try {
        if (tips) {
          await scheduleDailyTip();
        } else {
          await cancelDailyTip();
        }
      } catch (error) {
        console.log("Failed to update daily tip:", error);
      }
    };

    updateDailyTip();
  }, [tips, sound, vibration, loading, scheduleDailyTip, cancelDailyTip]);

  /* ------------------------------------------------------------------------ */
  /* Test notification                                                        */
  /* ------------------------------------------------------------------------ */

  const sendTestNotification = async () => {
    if (testing) return;

    try {
      setTesting(true);

      if (!Device.isDevice) {
        Alert.alert(
          "Physical Device Required",
          "Local notification behavior should be tested on a physical device.",
        );
        return;
      }

      const granted = await ensureNotificationPermission();

      if (!granted) {
        Alert.alert(
          "Notifications Disabled",
          canAskPermission
            ? "Notification permission is required to send a test notification."
            : "Notifications are disabled for AquaGuide AI. Enable them in your device settings.",
        );

        return;
      }

      await configureNotificationChannels();

      const channelId = getNotificationChannelId(sound, vibration);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "AquaGuide AI",
          body: "Your notification settings are working correctly.",

          sound: sound ? "default" : false,

          data: {
            type: "notification-test",
          },
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          repeats: false,
          channelId,
        },
      });

      Alert.alert(
        "Test Scheduled",
        "The notification will appear in about 2 seconds.",
      );
    } catch (error) {
      console.log("Failed to send test notification:", error);

      Alert.alert(
        "Notification Error",
        "The test notification could not be scheduled. Please check your notification permissions.",
      );
    } finally {
      setTesting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Settings actions                                                         */
  /* ------------------------------------------------------------------------ */

  const handleReminderChange = async (value: boolean) => {
    setReminders(value);

    await saveSettings({
      reminders: value,
    });

    /*
     * Turning notifications OFF:
     * cancel scheduled reminder notifications,
     * but keep the reminders in Firestore.
     */
    if (!value) {
      await cancelAllReminderNotifications();
      return;
    }

    /*
     * Turning notifications ON:
     * first make sure the device allows notifications.
     */
    const granted = await ensureNotificationPermission();

    if (!granted) {
      Alert.alert(
        "Notifications Disabled",
        "Reminder notifications are enabled in AquaGuide AI, but notification permission is disabled on your device.",
      );

      return;
    }

    /*
     * Restore notifications for reminders that were
     * created while notifications were disabled.
     */
    if (!user?.uid) {
      Alert.alert(
        "Unable to Restore Notifications",
        "Please sign in to restore your saved reminder notifications.",
      );

      return;
    }

    try {
      const restoredCount = await restoreMissingReminderNotifications(user.uid);

      if (restoredCount > 0) {
        Alert.alert(
          "Notifications Restored",
          `${restoredCount} reminder${restoredCount === 1 ? "" : "s"} ${
            restoredCount === 1 ? "notification has" : "notifications have"
          } been scheduled.`,
        );
      }
    } catch (error) {
      console.log("Failed to restore reminder notifications:", error);
    }
  };

  const handleSoundChange = async (value: boolean) => {
    setSound(value);

    await saveSettings({
      sound: value,
    });
  };

  const handleVibrationChange = async (value: boolean) => {
    setVibration(value);

    await saveSettings({
      vibration: value,
    });
  };

  const handleTipsChange = async (value: boolean) => {
    setTips(value);

    await saveSettings({
      tips: value,
    });

    if (value) {
      const granted = await ensureNotificationPermission();

      if (!granted) {
        setTips(false);

        await saveSettings({
          tips: false,
        });

        Alert.alert(
          "Notifications Disabled",
          "Daily fishkeeping tips require notification permission. Please enable notifications and try again.",
        );
      }
    }
  };

  const openNotificationSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.log("Unable to open notification settings:", error);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="Notifications" showBack />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text
            style={[
              styles.loadingText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Loading notification settings...
          </Text>
        </View>
      </View>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Notifications" showBack />

      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.headerBlock}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.primary + "12",
                borderColor: colors.primary + "25",
              },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.headerText}>
            <Text
              style={[
                styles.header,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Notification Settings
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Control how AquaGuide AI alerts you about reminders and
              fishkeeping tips.
            </Text>
          </View>
        </View>

        {/* Permission Status */}

        <View
          style={[
            styles.permissionCard,
            {
              backgroundColor: colors.card,
              borderColor: permissionGranted
                ? colors.success + "35"
                : colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.permissionIcon,
              {
                backgroundColor: permissionGranted
                  ? colors.success + "12"
                  : colors.primary + "12",
              },
            ]}
          >
            <Ionicons
              name={
                !reminders
                  ? "notifications-off-outline"
                  : permissionGranted
                    ? "checkmark-circle-outline"
                    : "notifications-off-outline"
              }
              size={22}
              color={
                !reminders
                  ? colors.textSecondary
                  : permissionGranted
                    ? colors.success
                    : colors.primary
              }
            />
          </View>

          <View style={styles.permissionContent}>
            <Text
              style={[
                styles.permissionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {!reminders
                ? "Reminder notifications are turned off"
                : permissionGranted
                  ? "Notifications are enabled"
                  : "Notifications are disabled"}
            </Text>

            <Text
              style={[
                styles.permissionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {!reminders
                ? "You will not receive AquaGuide AI reminder alerts."
                : permissionGranted
                  ? "AquaGuide AI can send local reminder alerts."
                  : "Allow notifications to receive reminders and daily tips."}
            </Text>
          </View>

          {!permissionGranted && (
            <Pressable
              onPress={
                canAskPermission
                  ? ensureNotificationPermission
                  : openNotificationSettings
              }
              style={[
                styles.permissionButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.permissionButtonText}>
                {canAskPermission ? "Allow" : "Settings"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Main Settings */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingRow
            icon="notifications-outline"
            title="Reminder Notifications"
            subtitle="Receive alerts for feeding, water changes, medication, and maintenance."
            value={reminders}
            onValueChange={handleReminderChange}
          />

          <SettingRow
            icon="volume-high-outline"
            title="Notification Sound"
            subtitle="Play the default notification sound when an alert is delivered."
            value={sound}
            onValueChange={handleSoundChange}
            disabled={!reminders}
          />

          <SettingRow
            icon="phone-portrait-outline"
            title="Vibration"
            subtitle="Vibrate your device when a reminder notification is delivered."
            value={vibration}
            onValueChange={handleVibrationChange}
            disabled={!reminders}
          />

          <SettingRow
            icon="bulb-outline"
            title="Daily Fishkeeping Tips"
            subtitle="Receive one practical aquarium care tip every day at 9:00 AM."
            value={tips}
            onValueChange={handleTipsChange}
          />
        </View>

        {/* Test */}

        <View
          style={[
            styles.testCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.testHeader}>
            <View
              style={[
                styles.testIcon,
                {
                  backgroundColor: colors.primary + "12",
                },
              ]}
            >
              <Ionicons
                name="paper-plane-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.testHeaderText}>
              <Text
                style={[
                  styles.testTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Test Notifications
              </Text>

              <Text
                style={[
                  styles.testSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Verify your current sound and vibration settings.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={sendTestNotification}
            disabled={testing}
            style={({ pressed }) => [
              styles.testButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed || testing ? 0.75 : 1,
              },
            ]}
          >
            {testing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="notifications-outline"
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.testText}>Send Test Notification</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Current Configuration */}

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.primary + "08",
              borderColor: colors.primary + "20",
            },
          ]}
        >
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.primary}
            />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Current Alert Behavior
            </Text>

            <Text
              style={[
                styles.statusText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {reminders
                ? `Reminders are enabled with ${
                    sound ? "sound" : "no sound"
                  } and ${vibration ? "vibration" : "no vibration"}.`
                : "Reminder notifications are currently turned off."}
            </Text>

            <Text
              style={[
                styles.statusText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {tips
                ? "Daily fishkeeping tips are scheduled for 9:00 AM."
                : "Daily fishkeeping tips are turned off."}
            </Text>
          </View>
        </View>

        {/* Footer */}

        <Text
          style={[
            styles.footer,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Notification preferences are saved locally on this device. Your
          reminders and logbook data remain synchronized through your AquaGuide
          AI account.
        </Text>

        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />

            <Text
              style={[
                styles.savingText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Saving preferences...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 45,
  },

  /* Loading */

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
  },

  /* Header */

  headerBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,

    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  header: {
    fontSize: 22,
    fontWeight: "900",
  },

  description: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  /* Permission */

  permissionCard: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 16,
  },

  permissionIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  permissionContent: {
    flex: 1,
    marginHorizontal: 10,
  },

  permissionTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  permissionSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
  },

  permissionButton: {
    minWidth: 64,
    height: 36,

    paddingHorizontal: 10,

    borderRadius: 11,

    justifyContent: "center",
    alignItems: "center",
  },

  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  /* Settings */

  card: {
    borderRadius: 20,
    borderWidth: 1,

    overflow: "hidden",

    marginBottom: 16,
  },

  row: {
    minHeight: 86,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 15,
    paddingVertical: 12,

    borderBottomWidth: 1,
  },

  left: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    marginRight: 10,
  },

  iconCircle: {
    width: 43,
    height: 43,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,

    fontSize: 10,
    lineHeight: 15,
  },

  /* Test */

  testCard: {
    borderRadius: 20,
    borderWidth: 1,

    padding: 15,

    marginBottom: 16,
  },

  testHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  testIcon: {
    width: 43,
    height: 43,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  testHeaderText: {
    flex: 1,
    marginLeft: 11,
  },

  testTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  testSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
  },

  testButton: {
    height: 51,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginTop: 14,
  },

  testText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "800",

    marginLeft: 7,
  },

  /* Status */

  statusCard: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 13,

    flexDirection: "row",

    marginBottom: 16,
  },

  statusIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 10,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  statusText: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  /* Footer */

  footer: {
    textAlign: "center",

    fontSize: 10,
    lineHeight: 16,

    paddingHorizontal: 8,

    marginTop: 3,
  },

  savingIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 14,
  },

  savingText: {
    fontSize: 10,
    marginLeft: 6,
  },
});
