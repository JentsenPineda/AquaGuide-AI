import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ReminderRepeat } from "./ReminderCard";

type Props = {
  repeat: ReminderRepeat;
  accentColor: string;
  selectedWeekDay: string;
  selectedMonthDay: number;
  onWeekDayChange: (day: string) => void;
  onMonthDayChange: (day: number) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ReminderScheduleSelector({
  repeat,
  accentColor,
  selectedWeekDay,
  selectedMonthDay,
  onWeekDayChange,
  onMonthDayChange,
}: Props) {
  if (repeat === "Daily") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {repeat === "Weekly" ? "Select Day" : "Day of Month"}
      </Text>

      {repeat === "Weekly" ? (
        <View style={styles.weekContainer}>
          {weekDays.map((day) => {
            const selected = selectedWeekDay === day;

            return (
              <Pressable
                key={day}
                onPress={() => onWeekDayChange(day)}
                style={[
                  styles.weekChip,
                  selected && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
              >
                <Text
                  style={[styles.weekText, selected && styles.weekTextSelected]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthContainer}
        >
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => {
            const selected = selectedMonthDay === day;

            return (
              <Pressable
                key={day}
                onPress={() => onMonthDayChange(day)}
                style={[
                  styles.monthChip,
                  selected && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthText,
                    selected && styles.monthTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  weekContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  weekChip: {
    minWidth: 56,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  weekText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  weekTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  monthContainer: {
    paddingRight: 20,
  },

  monthChip: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  monthText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  monthTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
