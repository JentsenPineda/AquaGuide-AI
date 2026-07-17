import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ModuleCardProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  onPress?: () => void;
  iconColor?: string;
  iconBackground?: string;
};

export default function ModuleCard({
  title,
  subtitle,
  icon,
  route,
  onPress,
  iconColor = "#00BCD4",
  iconBackground = "#E8FAFD",
}: ModuleCardProps) {
  const colors = useAppColors();

  return (
    <Pressable
      style={[
        styles.moduleCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => {
        if (onPress) {
          onPress();
        } else if (route) {
          router.push(route as any);
        }
      }}
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
          <Text
            style={[
              styles.moduleTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.moduleSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
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
  },

  moduleSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
