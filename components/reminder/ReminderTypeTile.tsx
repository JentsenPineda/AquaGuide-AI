import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  accentColor: string;
  selected: boolean;
  onPress: () => void;
};

export default function ReminderTypeTile({
  icon,
  title,
  description,
  accentColor,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        selected && {
          borderColor: accentColor,
          backgroundColor: `${accentColor}12`,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: selected ? accentColor : `${accentColor}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={26}
          color={selected ? "#FFFFFF" : accentColor}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>
      </View>

      {selected && (
        <View
          style={[
            styles.check,
            {
              backgroundColor: accentColor,
            },
          ]}
        >
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },

  check: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
});
