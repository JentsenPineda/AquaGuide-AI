import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  loading?: boolean;
  onPress: () => void;
};

export default function SaveLogButton({ loading = false, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !loading && styles.pressed,
      ]}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>Save Log Entry</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  text: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
