import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
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
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
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
        thumbColor={value ? "#FFFFFF" : "#F4F4F5"}
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const colors = useAppColors();
  const [reminders, setReminders] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [tips, setTips] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem("notification_settings");

        if (!saved) return;

        const settings = JSON.parse(saved);

        setReminders(settings.reminders ?? true);
        setSound(settings.sound ?? true);
        setVibration(settings.vibration ?? true);
        setTips(settings.tips ?? false);
      } catch (error) {
        console.log("Failed to load notification settings:", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          "notification_settings",
          JSON.stringify({
            reminders,
            sound,
            vibration,
            tips,
          }),
        );
      } catch (error) {
        console.log("Failed to save notification settings:", error);
      }
    };

    saveSettings();
  }, [reminders, sound, vibration, tips]);

  useEffect(() => {
    const registerForNotifications = async () => {
      if (!Device.isDevice) return;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permission not granted.");
      }
    };

    registerForNotifications();
  }, []);

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🐠 AquaGuide AI",
        body: "This is a test notification. Your reminder settings are working correctly!",
        sound: sound ? "default" : false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  };

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
          Manage how AquaGuide AI keeps you informed about your aquarium.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <SettingRow
            icon="notifications-outline"
            title="Reminder Notifications"
            subtitle="Feeding, water changes, medication and maintenance alerts."
            value={reminders}
            onValueChange={setReminders}
          />

          <SettingRow
            icon="volume-high-outline"
            title="Notification Sound"
            subtitle="Play a sound when reminders are triggered."
            value={sound}
            onValueChange={setSound}
            disabled={!reminders}
          />

          <SettingRow
            icon="phone-portrait-outline"
            title="Vibration"
            subtitle="Vibrate your phone for reminder alerts."
            value={vibration}
            onValueChange={setVibration}
            disabled={!reminders}
          />

          <SettingRow
            icon="bulb-outline"
            title="Daily Fishkeeping Tips"
            subtitle="Receive helpful aquarium care tips."
            value={tips}
            onValueChange={setTips}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.testButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={sendTestNotification}
        >
          <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />

          <Text style={styles.testText}>Send Test Notification</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.footer,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          These preferences will be synchronized with your account in a future
          update.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    marginTop: 10,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  left: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8FAFD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },

  testButton: {
    backgroundColor: "#00BCD4",
    marginTop: 30,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  testText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 30,
  },
});
