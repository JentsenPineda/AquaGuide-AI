import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ReminderRepeat } from "./ReminderCard";

type Props = {
  value: ReminderRepeat;
  accentColor: string;
  onChange: (value: ReminderRepeat) => void;
};

const options: ReminderRepeat[] = ["Daily", "Weekly", "Monthly"];

export default function RepeatSelector({
  value,
  accentColor,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat</Text>

      <View style={styles.segment}>
        {options.map((item) => {
          const selected = item === value;

          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={[
                styles.button,
                selected && {
                  backgroundColor: accentColor,
                },
              ]}
            >
              <Text style={[styles.text, selected && styles.selectedText]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
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

  segment: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 18,
    padding: 4,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  selectedText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
