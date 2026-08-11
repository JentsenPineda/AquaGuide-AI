import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  date: string;
  time: string;
  onDatePress: () => void;
  onTimePress: () => void;
};

export default function LogDateTimeCard({
  date,
  time,
  onDatePress,
  onTimePress,
}: Props) {
  const colors = useAppColors();

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
      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        Date & Time
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Choose when this activity happened.
      </Text>

      {/* DATE */}

      <Pressable style={styles.row} onPress={onDatePress}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${colors.primary}18`,
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Date
            </Text>

            <Text
              style={[
                styles.value,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {date}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.border,
          },
        ]}
      />

      {/* TIME */}

      <Pressable style={styles.row} onPress={onTimePress}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${colors.primary}18`,
              },
            ]}
          >
            <Ionicons name="time-outline" size={22} color={colors.primary} />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Time
            </Text>

            <Text
              style={[
                styles.value,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {time}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  left: {
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
  },

  textContainer: {
    marginLeft: 14,
  },

  label: {
    fontSize: 13,
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    marginVertical: 12,
    marginLeft: 60,
  },
});
