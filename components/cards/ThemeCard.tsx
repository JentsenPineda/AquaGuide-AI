import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useAppColors } from "@/theme/useAppColors";

type ThemeCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ThemeCard({ children, style }: ThemeCardProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
});
