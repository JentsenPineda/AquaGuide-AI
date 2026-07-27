import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useAppColors } from "@/theme/useAppColors";

interface Props {
  title: string;
  onPress: () => void;
}

export default function NextButton({ title, onPress }: Props) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "#FFFFFF20",
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
