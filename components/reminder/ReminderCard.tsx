import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface ReminderCardProps {
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
  note?: string;

  onDelete: (id: string) => void;
}

const getReminderIcon = (type: string) => {
  switch (type) {
    case "Feeding":
      return "🍽";
    case "Water Change":
      return "💧";
    case "Water Testing":
      return "🧪";
    case "Medication":
      return "💊";
    case "Tank Cleaning":
      return "🧹";
    case "Plant Maintenance":
      return "🌱";
    default:
      return "📌";
  }
};

export default function ReminderCard({
  id,
  type,
  repeat,
  weekDay,
  monthDay,
  time,
  note,
  onDelete,
}: ReminderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>
          {getReminderIcon(type)} {type}
        </Text>

        <Pressable onPress={() => onDelete(id)}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </Pressable>
      </View>

      <Text style={styles.date}>
        {repeat === "Daily"
          ? "🔁 Every Day"
          : repeat === "Weekly"
            ? `🔁 Every ${weekDay}`
            : `🔁 Every Month on Day ${monthDay}`}
      </Text>

      <Text style={styles.date}>🕒 {time}</Text>

      {!!note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    color: "#00D4FF",
    fontWeight: "800",
    fontSize: 12,
  },

  date: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },

  note: {
    color: "#B0BEC5",
    marginTop: 6,
  },
});
