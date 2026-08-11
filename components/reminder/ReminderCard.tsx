import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ReminderType =
  | "Feeding"
  | "Water Change"
  | "Water Testing"
  | "Medication"
  | "Tank Cleaning"
  | "Plant Maintenance";

export type ReminderRepeat = "Daily" | "Weekly" | "Monthly";

export interface ReminderCardProps {
  id: string;
  type: ReminderType;
  repeat: ReminderRepeat;
  weekDay?: string;
  monthDay?: number;
  time: string;
  note?: string;
  onDelete: (id: string) => void;
}

const getReminderIcon = (
  type: ReminderType,
): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case "Feeding":
      return "restaurant-outline";

    case "Water Change":
      return "water-outline";

    case "Water Testing":
      return "flask-outline";

    case "Medication":
      return "medical-outline";

    case "Tank Cleaning":
      return "sparkles-outline";

    case "Plant Maintenance":
      return "leaf-outline";

    default:
      return "bookmark-outline";
  }
};

const getAccentColor = (type: ReminderType) => {
  switch (type) {
    case "Feeding":
      return "#F59E0B";

    case "Water Change":
      return "#3B82F6";

    case "Water Testing":
      return "#8B5CF6";

    case "Medication":
      return "#EF4444";

    case "Tank Cleaning":
      return "#06B6D4";

    case "Plant Maintenance":
      return "#22C55E";

    default:
      return "#00BCD4";
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
  const colors = useAppColors();
  const accentColor = getAccentColor(type);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${accentColor}15`,
              },
            ]}
          >
            <Ionicons
              name={getReminderIcon(type)}
              size={22}
              color={accentColor}
            />
          </View>

          <Text style={[styles.type, { color: accentColor }]}>{type}</Text>
        </View>

        <Pressable style={styles.deleteButton} onPress={() => onDelete(id)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons
            name="repeat-outline"
            size={18}
            color={colors.textSecondary}
          />

          <Text
            style={[
              styles.detailText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {repeat === "Daily"
              ? "Every Day"
              : repeat === "Weekly"
                ? `Every ${weekDay}`
                : `Day ${monthDay} of every month`}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.textSecondary}
          />

          <Text
            style={[
              styles.detailText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {time}
          </Text>
        </View>

        {!!note && (
          <View style={styles.detailRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.textSecondary}
            />

            <Text
              numberOfLines={2}
              style={[
                styles.detailText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {note}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 20,
    fontWeight: "700",
  },

  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  details: {
    marginTop: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  detailText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    lineHeight: 22,
  },
});
