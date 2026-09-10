import AppHeader from "@/components/layout/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppColors } from "@/theme/useAppColors";

export default function DarkModeScreen() {
  const { mode, colorScheme, setMode } = useTheme();
  const colors = useAppColors();

  const isDark = colorScheme === "dark";

  const modeBackground = isDark
    ? require("../../assets/images/dark-mode-bg3.png")
    : require("../../assets/images/light-mode-bg3.png");

  return (
    <View style={styles.screen}>
      {/* ======================================================== */}
      {/* LIGHT / DARK MODE BACKGROUND                             */}
      {/* ======================================================== */}

      <Image
        source={modeBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      {/* ======================================================== */}
      {/* APP HEADER                                                */}
      {/* ======================================================== */}

      <AppHeader title="Theme Settings" showBack />

      {/* ======================================================== */}
      {/* CONTENT                                                   */}
      {/* ======================================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ====================================================== */}
        {/* APPEARANCE HEADER                                       */}
        {/* ====================================================== */}

        <View style={styles.header}>
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

        {/* ====================================================== */}
        {/* SETTINGS CARD — SOLID                                   */}
        {/* ====================================================== */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* DARK MODE */}

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

          {/* DIVIDER */}

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* SYSTEM THEME */}

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

        {/* ====================================================== */}
        {/* PREVIEW BUTTON — SOLID                                  */}
        {/* ====================================================== */}

        <TouchableOpacity
          style={[
            styles.preview,
            {
              backgroundColor: colors.primary,
            },
          ]}
          activeOpacity={0.85}
        >
          <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />

          <Text style={styles.previewText}>Preview Theme</Text>
        </TouchableOpacity>

        {/* ====================================================== */}
        {/* FOOTER                                                   */}
        {/* ====================================================== */}

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
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },

  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
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
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },

  /* SOLID PANEL */

  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
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
  },

  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  divider: {
    height: 1,
  },

  /* SOLID BUTTON */

  preview: {
    marginTop: 30,
    height: 56,
    borderRadius: 16,
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
    lineHeight: 20,
  },
});
