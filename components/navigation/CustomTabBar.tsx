import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({ state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  const routes = [
    {
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "/(tabs)",
    },
    {
      label: "Library",
      icon: "book-outline",
      activeIcon: "book",
      route: "/(tabs)/library",
    },
    {
      label: "Fish Care",
      icon: "fish-outline",
      activeIcon: "fish",
      route: "/(tabs)/fish-care",
    },
    {
      label: "Menu",
      icon: "menu-outline",
      activeIcon: "menu",
      route: "/(tabs)/menu",
    },
  ];

  const activeIndex = state.index;

  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          paddingBottom: bottomInset,
        },
      ]}
    >
      {/* FLOATING NAVIGATION BAR */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.textPrimary,
          },
        ]}
      >
        {/* HOME */}
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => router.push(routes[0].route as any)}
        >
          <View
            style={[
              styles.iconWrapper,
              activeIndex === 0 && {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name={
                activeIndex === 0
                  ? (routes[0].activeIcon as any)
                  : (routes[0].icon as any)
              }
              size={23}
              color={activeIndex === 0 ? colors.primary : colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                color:
                  activeIndex === 0 ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {routes[0].label}
          </Text>
        </Pressable>

        {/* LIBRARY */}
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => router.push(routes[1].route as any)}
        >
          <View
            style={[
              styles.iconWrapper,
              activeIndex === 1 && {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name={
                activeIndex === 1
                  ? (routes[1].activeIcon as any)
                  : (routes[1].icon as any)
              }
              size={23}
              color={activeIndex === 1 ? colors.primary : colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                color:
                  activeIndex === 1 ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {routes[1].label}
          </Text>
        </Pressable>

        {/* CENTER SCAN SPACE */}
        <View style={styles.centerSpace} />

        {/* FISH CARE */}
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => router.push(routes[2].route as any)}
        >
          <View
            style={[
              styles.iconWrapper,
              activeIndex === 2 && {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name={
                activeIndex === 2
                  ? (routes[2].activeIcon as any)
                  : (routes[2].icon as any)
              }
              size={23}
              color={activeIndex === 2 ? colors.primary : colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                color:
                  activeIndex === 2 ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {routes[2].label}
          </Text>
        </Pressable>

        {/* MENU */}
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => router.push(routes[3].route as any)}
        >
          <View
            style={[
              styles.iconWrapper,
              activeIndex === 3 && {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name={
                activeIndex === 3
                  ? (routes[3].activeIcon as any)
                  : (routes[3].icon as any)
              }
              size={23}
              color={activeIndex === 3 ? colors.primary : colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                color:
                  activeIndex === 3 ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {routes[3].label}
          </Text>
        </Pressable>
      </View>

      {/* FLOATING SCAN BUTTON */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scan fish"
        style={({ pressed }) => [
          styles.scanButton,
          {
            backgroundColor: colors.primary,
            borderColor: colors.card,
            shadowColor: colors.primary,
            bottom: bottomInset + 38,
            transform: [
              {
                scale: pressed ? 0.94 : 1,
              },
            ],
          },
        ]}
        onPress={() => router.push("/scan")}
      >
        <Ionicons name="scan-outline" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * The wrapper itself is completely transparent.
   * This removes the visual "black block" behind
   * the floating navigation bar.
   */
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  /*
   * Floating navigation surface.
   */
  tabBar: {
    height: 70,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,

    paddingHorizontal: 5,

    /*
     * Android
     */
    elevation: 10,

    /*
     * iOS
     */
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },

  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginTop: 2,
    fontSize: 10.5,
    fontWeight: "700",
  },

  /*
   * Space reserved for the floating Scan button.
   */
  centerSpace: {
    width: 76,
  },

  /*
   * Floating center action.
   */
  scanButton: {
    position: "absolute",

    alignSelf: "center",

    width: 66,
    height: 66,

    borderRadius: 33,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 4,

    elevation: 14,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});
