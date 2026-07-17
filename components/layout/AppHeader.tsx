import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  variant?: "dark" | "light";
};

export default function AppHeader({
  title,
  subtitle,
  showBack = true,
  variant,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors(variant);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "ios"
              ? Math.max(insets.top - 8, 0)
              : Math.max(insets.top, 6),
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              hitSlop={12}
              style={styles.backButton}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)");
                }
              }}
            >
              <Ionicons name="chevron-back" size={26} color={colors.primary} />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  header: {
    minHeight: 56,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  left: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  right: {
    width: 44,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 10,
  },

  placeholder: {
    width: 26,
  },

  backButton: {
    padding: 4,
  },
});
