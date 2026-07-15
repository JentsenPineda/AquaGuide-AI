import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function LogNotesCard({ value, onChangeText }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Notes</Text>

      <Text style={styles.subtitle}>
        Record what happened during this activity.
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Example: Changed 30% of the water and cleaned the filter..."
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
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
    marginBottom: 16,
    fontSize: 14,
    color: "#64748B",
  },

  input: {
    minHeight: 130,
    fontSize: 16,
    color: "#0F172A",
    lineHeight: 24,
  },
});
