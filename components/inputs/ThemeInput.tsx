import React from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppColors } from "@/theme/useAppColors";

type ThemeInputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function ThemeInput({
  icon,
  containerStyle,
  style,
  placeholderTextColor,
  ...props
}: ThemeInputProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        containerStyle,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={colors.textMuted}
          style={styles.icon}
        />
      )}

      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor ?? colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
  },

  icon: {
    marginLeft: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
