import React from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from "react-native";

import ThemeText from "@/components/text/ThemeText";
import { useAppColors } from "@/theme/useAppColors";

type ThemeChipProps = PressableProps & {
  title: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function ThemeChip({
  title,
  selected = false,
  style,
  textStyle,
  ...props
}: ThemeChipProps) {
  const colors = useAppColors();

  return (
    <Pressable
      {...props}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
        style,
      ]}
    >
      <ThemeText
        variant="body"
        style={[
          styles.text,
          {
            color: selected ? colors.white : colors.primary,
          },
          textStyle,
        ]}
      >
        {title}
      </ThemeText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
  },
});
