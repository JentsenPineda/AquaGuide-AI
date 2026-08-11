import { useAppColors } from "@/theme/useAppColors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function LogNotesCard({ value, onChangeText }: Props) {
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
        Notes
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Record what happened during this activity.
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Example: Changed 30% of the water and cleaned the filter..."
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          {
            color: colors.textPrimary,
          },
        ]}
      />
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
    marginBottom: 16,
    fontSize: 14,
  },

  input: {
    minHeight: 130,
    fontSize: 16,
    lineHeight: 24,
  },
});
