import { useAppColors } from "@/theme/useAppColors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function ReminderNotesCard({ value, onChangeText }: Props) {
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
        Notes (Optional)
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Add extra information about this reminder.
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Anything you'd like to remember?"
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
      />
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
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 22,
  },

  input: {
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 130,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    lineHeight: 22,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },
});
