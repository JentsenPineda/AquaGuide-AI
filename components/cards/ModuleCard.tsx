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
      style={({ pressed }) => [
        styles.moduleCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => {
        if (onPress) {
          onPress();
        } else if (route) {
          router.push(route as any);
        }
      }}
    >
      {/* Icon */}
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

      {/* Text */}
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
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
          numberOfLines={1}
          ellipsizeMode="tail"
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

      {/* Arrow */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    height: 132,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,

    justifyContent: "center",
    alignItems: "center",

    position: "relative",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 8,
  },

  textContainer: {
    width: "100%",
    alignItems: "center",
  },

  moduleTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  moduleSubtitle: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.82,
  },
});
