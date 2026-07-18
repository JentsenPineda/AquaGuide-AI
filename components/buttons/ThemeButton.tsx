import React from "react";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from "react-native";

import ThemeText from "@/components/text/ThemeText";
import { useAppColors } from "@/theme/useAppColors";

type ThemeButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function ThemeButton({
  title,
  loading = false,
  variant = "primary",
  style,
  textStyle,
  disabled,
  ...props
}: ThemeButtonProps) {
  const colors = useAppColors();

  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.surface
        : variant === "danger"
          ? colors.danger
          : "transparent";

  const borderColor = variant === "outline" ? colors.primary : backgroundColor;

  const textColor =
    variant === "primary" || variant === "danger"
      ? colors.white
      : colors.primary;

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemeText
          style={[
            styles.text,
            {
              color: textColor,
            },
            textStyle,
          ]}
        >
          {title}
        </ThemeText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
