import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";

export default function DarkModeScreen() {
  const { mode, colorScheme, setMode } = useTheme();
  const colors = useAppColors();
  console.log("Theme Mode:", mode);
  console.log("Color Scheme:", colorScheme);
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Theme Settings" showBack />

      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Ionicons name="moon" size={60} color="#00BCD4" />

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Appearance
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Personalize how AquaGuide AI looks on your device.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.left}>
              <Ionicons name="moon-outline" size={22} color="#00BCD4" />

              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Dark Mode
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Reduce eye strain in low-light environments.
                </Text>
              </View>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={(value) => setMode(value ? "dark" : "light")}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                mode === "dark"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#D1D5DB"
                    : "#FFFFFF"
              }
            />
          </View>
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />
          <View style={styles.row}>
            <View style={styles.left}>
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color="#00BCD4"
              />

              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Follow System Theme
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Automatically match your device appearance.
                </Text>
              </View>
            </View>

            <Switch
              value={mode === "system"}
              onValueChange={(value) => setMode(value ? "system" : "light")}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                mode === "system"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#D1D5DB"
                    : "#FFFFFF"
              }
            />
          </View>
        </View>

        <TouchableOpacity style={styles.preview}>
          <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />

          <Text style={styles.previewText}>Preview Theme</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.footer,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Theme synchronization with your AquaGuide AI account will be available
          in a future update.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },

  left: {
    flexDirection: "row",
    flex: 1,
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
  },

  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  rowSubtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F7",
  },

  preview: {
    marginTop: 30,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  previewText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },

  footer: {
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    color: "#94A3B8",
    lineHeight: 20,
  },
});
