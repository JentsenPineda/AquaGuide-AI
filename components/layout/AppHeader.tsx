import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  variant?: "dark" | "light";
};

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  showLogo = false,
  variant,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const colors = useAppColors(variant);

  const isDark =
    variant === "dark"
      ? true
      : variant === "light"
        ? false
        : colorScheme === "dark";

  /*
   * Translucent header:
   *
   * Light Mode:
   * Uses a softer white with lower opacity so the aquarium
   * background remains clearly visible.
   *
   * Dark Mode:
   * Uses the same dark translucent surface as the module cards.
   */
  const headerBackground = isDark
    ? "rgba(16,35,49,0.78)"
    : "rgba(255,255,255,0.50)";

  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,59,87,0.10)";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "ios"
              ? Math.max(insets.top - 8, 0)
              : Math.max(insets.top, 6),

          backgroundColor: headerBackground,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: dividerColor,
          },
        ]}
      >
        {/* ================================================================ */}
        {/* LEFT                                                             */}
        {/* ================================================================ */}

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
          ) : showLogo ? (
            <View
              style={[
                styles.logoWrapper,
                {
                  backgroundColor: isDark
                    ? "rgba(16,35,49,0.78)"
                    : "rgba(255,255,255,0.50)",
                },
              ]}
            >
              <Image
                source={require("../../Icon/iconnn.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* ================================================================ */}
        {/* TITLE                                                            */}
        {/* ================================================================ */}

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

        {/* ================================================================ */}
        {/* RIGHT                                                            */}
        {/* ================================================================ */}

        <View style={styles.right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * Header container.
   *
   * The background is supplied dynamically above so that
   * Light Mode and Dark Mode use the same structure.
   */
  container: {
    zIndex: 10,
  },

  /*
   * Fixed visual height.
   *
   * Keeping this consistent prevents the Home header
   * from appearing taller than headers without a logo.
   */
  header: {
    height: 62,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  /*
   * Left side always occupies the same amount of space.
   *
   * This keeps the title centered even when the screen
   * has no logo or has a back button.
   */
  left: {
    width: 44,

    height: "100%",

    alignItems: "flex-start",
    justifyContent: "center",
  },

  /*
   * Right side mirrors the left side.
   */
  right: {
    width: 44,

    height: "100%",
  },

  /*
   * Center title area.
   */
  titleContainer: {
    flex: 1,

    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Main title.
   */
  title: {
    textAlign: "center",

    fontSize: 20,
    fontWeight: "700",

    lineHeight: 24,
  },

  /*
   * Optional subtitle.
   */
  subtitle: {
    marginTop: 2,

    textAlign: "center",

    fontSize: 10,
    lineHeight: 13,
  },

  /*
   * Empty left-side space when there is no
   * back button and no logo.
   */
  placeholder: {
    width: 26,
    height: 26,
  },

  /*
   * Back button.
   */
  backButton: {
    padding: 4,
  },

  /*
   * Home logo container.
   *
   * It stays within the same 62px header,
   * so it does not increase the header height.
   */
  logoWrapper: {
    width: 38,
    height: 38,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  logo: {
    width: 32,
    height: 32,

    borderRadius: 8,
  },
});
