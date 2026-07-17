import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from "react-native";

import { useAppColors } from "@/theme/useAppColors";

type Variant = "title" | "subtitle" | "body" | "caption" | "muted";

type ThemeTextProps = TextProps & {
  variant?: Variant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

export default function ThemeText({
  variant = "body",
  style,
  children,
  ...props
}: ThemeTextProps) {
  const colors = useAppColors();

  let color: string = colors.textPrimary;
  let textStyle = styles.body;

  switch (variant) {
    case "title":
      color = colors.textPrimary;
      textStyle = styles.title;
      break;

    case "subtitle":
      color = colors.textSecondary;
      textStyle = styles.subtitle;
      break;

    case "caption":
      color = colors.textMuted;
      textStyle = styles.caption;
      break;

    case "muted":
      color = colors.textMuted;
      textStyle = styles.body;
      break;

    default:
      color = colors.textPrimary;
      textStyle = styles.body;
  }

  return (
    <Text
      {...props}
      style={[
        textStyle,
        {
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  body: {
    fontSize: 16,
  },

  caption: {
    fontSize: 13,
  },
});
