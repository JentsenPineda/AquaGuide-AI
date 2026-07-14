import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({ state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const routes = [
    {
      label: "Home",
      icon: "home",
      route: "/(tabs)",
    },
    {
      label: "Library",
      icon: "book",
      route: "/(tabs)/library",
    },
    {
      label: "Records",
      icon: "document-text",
      route: "/(tabs)/logbook",
    },
    {
      label: "Profile",
      icon: "person-circle",
      route: "/(tabs)/profile",
    },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabBar}>
        {routes.slice(0, 2).map((item) => (
          <Pressable
            key={item.label}
            style={styles.tab}
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons name={item.icon as any} size={24} color="#00BCD4" />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}

        <View style={{ width: 82 }} />

        {routes.slice(2).map((item) => (
          <Pressable
            key={item.label}
            style={styles.tab}
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons name={item.icon as any} size={24} color="#00BCD4" />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[
          styles.scanButton,
          {
            bottom: Math.max(insets.bottom, 12) + 30,
          },
        ]}
        onPress={() => router.push("/(tabs)/scan")}
      >
        <Ionicons name="scan" size={34} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    backgroundColor: "transparent",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    marginHorizontal: 12,

    borderRadius: 28,

    height: 82,

    paddingTop: 10,

    elevation: 12,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#003B57",
  },

  scanButton: {
    position: "absolute",
    alignSelf: "center",

    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor: "#00BCD4",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 5,
    borderColor: "#FFFFFF",

    elevation: 15,
  },
});
