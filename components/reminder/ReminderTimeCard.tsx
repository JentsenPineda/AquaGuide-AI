import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  time: string;
  accentColor: string;
  onPress: () => void;
};

export default function ReminderTimeCard({
  time,
  accentColor,
  onPress,
}: Props) {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        Reminder Time
      </Text>

      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: accentColor,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${accentColor}18`,
            },
          ]}
        >
          <Ionicons name="time-outline" size={28} color={accentColor} />
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.time,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {time}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Tap to change reminder time
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color={accentColor} />
      </Pressable>
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
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 2,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  content: {
    flex: 1,
  },

  time: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
});
