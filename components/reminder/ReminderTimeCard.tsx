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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder Time</Text>

      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
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
          <Text style={styles.time}>{time}</Text>

          <Text style={styles.subtitle}>Tap to change reminder time</Text>
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
    color: "#0F172A",
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },
});
