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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Date & Time</Text>

      <Text style={styles.subtitle}>Choose when this activity happened.</Text>

      <Pressable style={styles.row} onPress={onDatePress}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={22} color="#00BCD4" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Date</Text>

            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </Pressable>

      <View style={styles.divider} />

      <Pressable style={styles.row} onPress={onTimePress}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <Ionicons name="time-outline" size={22} color="#00BCD4" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Time</Text>

            <Text style={styles.value}>{time}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    color: "#64748B",
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
    backgroundColor: "#E6FAFD",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    marginLeft: 14,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F7",
    marginVertical: 12,
    marginLeft: 60,
  },
});
