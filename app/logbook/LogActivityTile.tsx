import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  selected: boolean;
  onPress: () => void;
};

export default function LogActivityTile({
  title,
  icon,
  color,
  selected,
  onPress,
}: Props) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? `${color}10` : colors.card,
          borderColor: selected ? color : colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: selected ? color : `${color}18`,
          },
        ]}
      >
        <Ionicons name={icon} size={24} color={selected ? "#FFFFFF" : color} />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: selected ? color : colors.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 14,
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
