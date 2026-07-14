import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ModuleCardProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  iconColor?: string;
  iconBackground?: string;
};

export default function ModuleCard({
  title,
  subtitle,
  icon,
  route,
  iconColor = "#00BCD4",
  iconBackground = "#E8FAFD",
}: ModuleCardProps) {
  return (
    <Pressable
      style={styles.moduleCard}
      onPress={() => router.push(route as any)}
    >
      <View style={styles.moduleLeft}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconBackground,
            },
          ]}
        >
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.moduleTitle}>{title}</Text>

          <Text style={styles.moduleSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#90A4AE" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E6EEF2",
  },

  moduleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E8FAFD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
  },

  moduleSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#607D8B",
    lineHeight: 20,
  },
});
