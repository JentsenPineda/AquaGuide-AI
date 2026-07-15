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
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && {
          borderColor: color,
          backgroundColor: `${color}10`,
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
          selected && {
            color,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
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
    color: "#0F172A",
    textAlign: "center",
  },
});
