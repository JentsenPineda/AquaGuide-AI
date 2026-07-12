import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CustomTabBar({ state }: BottomTabBarProps) {
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
    <View style={styles.wrapper}>
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

        <View style={{ width: 80 }} />

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
        style={styles.scanButton}
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
    marginBottom: 12,
    borderRadius: 28,
    paddingVertical: 14,
    elevation: 12,
  },

  tab: {
    alignItems: "center",
    flex: 1,
  },

  label: {
    fontSize: 11,
    marginTop: 4,
    color: "#003B57",
    fontWeight: "600",
  },

  scanButton: {
    position: "absolute",
    alignSelf: "center",
    top: -26,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
    borderWidth: 5,
    borderColor: "#FFFFFF",
  },
});
