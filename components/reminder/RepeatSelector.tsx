import { useAppColors } from "@/theme/useAppColors";
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
        Repeat
      </Text>

      <View
        style={[
          styles.segment,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
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
              <Text
                style={[
                  styles.text,
                  {
                    color: selected ? "#FFFFFF" : colors.textSecondary,
                  },
                ]}
              >
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
    marginBottom: 14,
  },

  segment: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
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
  },
});
