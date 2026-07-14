import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function ReminderNotesCard({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes (Optional)</Text>

      <Text style={styles.subtitle}>
        Add extra information about this reminder.
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Anything you'd like to remember?"
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
        style={styles.input}
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
    color: "#0F172A",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 130,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: "#0F172A",
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
