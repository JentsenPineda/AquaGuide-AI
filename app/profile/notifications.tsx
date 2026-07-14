import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={22} color="#00BCD4" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export default function NotificationsScreen() {
  const [reminders, setReminders] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [tips, setTips] = useState(false);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Notifications"
        subtitle="Manage your notification preferences"
        showBack
        variant="light"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Notification Settings</Text>

        <Text style={styles.description}>
          Manage how AquaGuide AI keeps you informed about your aquarium.
        </Text>

        <View style={styles.card}>
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
          />

          <SettingRow
            icon="phone-portrait-outline"
            title="Vibration"
            subtitle="Vibrate your phone for reminder alerts."
            value={vibration}
            onValueChange={setVibration}
          />

          <SettingRow
            icon="bulb-outline"
            title="Daily Fishkeeping Tips"
            subtitle="Receive helpful aquarium care tips."
            value={tips}
            onValueChange={setTips}
          />
        </View>

        <TouchableOpacity style={styles.testButton}>
          <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />

          <Text style={styles.testText}>Send Test Notification</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
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
