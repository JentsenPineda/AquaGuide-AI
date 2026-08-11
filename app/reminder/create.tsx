import AppHeader from "@/components/layout/AppHeader";
import {
  ReminderRepeat,
  ReminderType,
} from "@/components/reminder/ReminderCard";
import ReminderNotesCard from "@/components/reminder/ReminderNotesCard";
import ReminderScheduleSelector from "@/components/reminder/ReminderScheduleSelector";
import ReminderTimeCard from "@/components/reminder/ReminderTimeCard";
import ReminderTimePickerModal from "@/components/reminder/ReminderTimePickerModal";
import ReminderTypeTile from "@/components/reminder/ReminderTypeTile";
import RepeatSelector from "@/components/reminder/RepeatSelector";
import SaveReminderButton from "@/components/reminder/SaveReminderButton";
import { useAuth } from "@/contexts/AuthContext";
import { addReminder } from "@/services/reminderService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const reminderTypes: {
  title: ReminderType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { title: "Feeding", icon: "restaurant-outline" },
  { title: "Water Change", icon: "water-outline" },
  { title: "Water Testing", icon: "flask-outline" },
  { title: "Medication", icon: "medical-outline" },
  { title: "Tank Cleaning", icon: "sparkles-outline" },
  { title: "Plant Maintenance", icon: "leaf-outline" },
];

const reminderAccentColors: Record<ReminderType, string> = {
  Feeding: "#F59E0B",
  "Water Change": "#3B82F6",
  "Water Testing": "#8B5CF6",
  Medication: "#EF4444",
  "Tank Cleaning": "#06B6D4",
  "Plant Maintenance": "#22C55E",
};

export default function CreateReminderScreen() {
  const colors = useAppColors();
  const [selectedType, setSelectedType] = useState<ReminderType>("Feeding");
  const { user } = useAuth();
  const [selectedRepeat, setSelectedRepeat] = useState<ReminderRepeat>("Daily");
  const [selectedWeekDay, setSelectedWeekDay] = useState("Mon");
  const [selectedMonthDay, setSelectedMonthDay] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const accentColor = reminderAccentColors[selectedType];
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "Unable to identify the current user.");
      return;
    }

    try {
      setSaving(true);

      await addReminder(user.uid, {
        type: selectedType,

        repeat: selectedRepeat,

        weekDay: selectedRepeat === "Weekly" ? selectedWeekDay : undefined,

        monthDay: selectedRepeat === "Monthly" ? selectedMonthDay : undefined,

        time: formatTime(time),

        hour: time.getHours(),

        minute: time.getMinutes(),

        note: notes.trim() || undefined,
      });

      Alert.alert("Success", "Reminder created successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Failed to save reminder.");
    } finally {
      setSaving(false);
    }
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
      <AppHeader title="Create Reminder" showBack />

      <KeyboardAwareScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={30}
        extraHeight={120}
      >
        {/* HERO */}

        <View style={styles.hero}>
          <Text
            style={[
              styles.heroTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Create a new reminder
          </Text>

          <Text
            style={[
              styles.heroDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Never miss an important aquarium task.
            {"\n"}
            Choose a reminder type to begin.
          </Text>
        </View>

        <View style={styles.section}>
          {reminderTypes.map((item) => (
            <ReminderTypeTile
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={
                item.title === "Feeding"
                  ? "Daily feeding reminders"
                  : item.title === "Water Change"
                    ? "Scheduled aquarium maintenance"
                    : item.title === "Water Testing"
                      ? "Monitor water quality"
                      : item.title === "Medication"
                        ? "Treatment schedules"
                        : item.title === "Tank Cleaning"
                          ? "Routine cleaning tasks"
                          : "Care for aquatic plants"
              }
              accentColor={
                item.title === "Feeding"
                  ? "#F59E0B"
                  : item.title === "Water Change"
                    ? "#3B82F6"
                    : item.title === "Water Testing"
                      ? "#8B5CF6"
                      : item.title === "Medication"
                        ? "#EF4444"
                        : item.title === "Tank Cleaning"
                          ? "#06B6D4"
                          : "#22C55E"
              }
              selected={selectedType === item.title}
              onPress={() => setSelectedType(item.title)}
            />
          ))}
        </View>

        <ReminderTimeCard
          time={formatTime(time)}
          accentColor={accentColor}
          onPress={() => setShowTimePicker(true)}
        />

        <RepeatSelector
          value={selectedRepeat}
          accentColor={accentColor}
          onChange={setSelectedRepeat}
        />

        <ReminderScheduleSelector
          repeat={selectedRepeat}
          accentColor={accentColor}
          selectedWeekDay={selectedWeekDay}
          selectedMonthDay={selectedMonthDay}
          onWeekDayChange={setSelectedWeekDay}
          onMonthDayChange={setSelectedMonthDay}
        />

        <ReminderNotesCard value={notes} onChangeText={setNotes} />

        <View style={styles.footer}>
          <SaveReminderButton
            accentColor={accentColor}
            loading={saving}
            onPress={handleSave}
          />
        </View>
      </KeyboardAwareScrollView>
      <ReminderTimePickerModal
        visible={showTimePicker}
        hours={time.getHours()}
        minutes={time.getMinutes()}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={(hours, minutes) => {
          const newTime = new Date(time);

          newTime.setHours(hours);
          newTime.setMinutes(minutes);

          setTime(newTime);
          setShowTimePicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 140,
  },

  hero: {
    marginBottom: 30,
  },

  section: {
    marginBottom: 28,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 14,
  },

  heroDescription: {
    fontSize: 17,
    lineHeight: 28,
  },

  footer: {
    paddingTop: 12,
    paddingBottom: 24,
  },
});
