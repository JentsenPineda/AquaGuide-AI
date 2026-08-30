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
      {/* SECTION TITLE */}
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

      {/* TIME CARD */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: accentColor,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        {/* CENTER TIME AREA */}
        <View style={styles.centerArea}>
          {/* CLOCK */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${accentColor}18`,
              },
            ]}
          >
            <Ionicons name="time-outline" size={30} color={accentColor} />
          </View>

          {/* TIME */}
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

          {/* SUBTITLE */}
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

        {/* RIGHT ARROW */}
        <View
          style={[
            styles.arrowContainer,
            {
              backgroundColor: `${accentColor}12`,
            },
          ]}
        >
          <Ionicons name="chevron-forward" size={20} color={accentColor} />
        </View>
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
    minHeight: 190,
    borderRadius: 22,
    borderWidth: 2,

    position: "relative",

    justifyContent: "center",
    alignItems: "center",

    paddingVertical: 24,
    paddingHorizontal: 22,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  centerArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  time: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.6,
    textAlign: "center",
    lineHeight: 38,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    textAlign: "center",
  },

  arrowContainer: {
    position: "absolute",
    right: 16,
    top: 16,

    width: 34,
    height: 34,
    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",
  },
});
