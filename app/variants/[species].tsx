import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allGalleries } from "../../data/allGalleries";

export default function VariantsScreen() {
  const { colorScheme } = useTheme();
  const colors = useAppColors();
  const params = useLocalSearchParams();

  const isDark = colorScheme === "dark";

  const species = Array.isArray(params.species)
    ? params.species[0]
    : (params.species ?? "");

  const gallery = allGalleries[species as keyof typeof allGalleries] ?? [];

  const [search, setSearch] = useState("");

  const filteredVariants = useMemo(() => {
    return (gallery as any[]).filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [gallery, search]);

  const speciesTitle = String(species)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  /*
   * MODULE BACKGROUND
   *
   * This is intentionally NOT AppBackground.
   * Variants uses its own module-specific background.
   */
  const moduleBackground = isDark
    ? require("../../assets/images/dark-mode-bg3.png")
    : require("../../assets/images/light-mode-bg3.png");

  /*
   * Translucent panels
   */
  const panelBackground = isDark
    ? "rgba(16, 35, 49, 0.72)"
    : "rgba(255, 255, 255, 0.62)";

  const innerPanelBackground = isDark
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(255, 255, 255, 0.45)";

  return (
    <View style={styles.container}>
      {/* ================================================================ */}
      {/* MODULE BACKGROUND                                                */}
      {/* ================================================================ */}

      <Image
        source={moduleBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      {/* Very subtle overlay for readability */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDark
              ? "rgba(3, 15, 25, 0.08)"
              : "rgba(255, 255, 255, 0.04)",
          },
        ]}
      />

      {/* ================================================================ */}
      {/* APP HEADER                                                        */}
      {/* ================================================================ */}

      <AppHeader title="Fish Variants" showBack />

      {/* ================================================================ */}
      {/* VARIANTS LIST                                                     */}
      {/* ================================================================ */}

      <FlatList
        data={filteredVariants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        ListHeaderComponent={
          <View
            style={[
              styles.hero,
              {
                backgroundColor: panelBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {/* ========================================================== */}
            {/* TITLE                                                        */}
            {/* ========================================================== */}

            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {speciesTitle} Variants
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Explore ornamental fish varieties, color morphs, fin types, and
              pattern variations.
            </Text>

            {/* ========================================================== */}
            {/* STATS                                                        */}
            {/* ========================================================== */}

            <View
              style={[
                styles.statsCard,
                {
                  backgroundColor: innerPanelBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* VARIANT COUNT */}
              <View style={styles.stat}>
                <Text
                  style={[
                    styles.statNumber,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {Array.isArray(gallery) ? gallery.length : 0}
                </Text>

                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Variants
                </Text>
              </View>

              {/* DIVIDER */}
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: colors.divider,
                  },
                ]}
              />

              {/* AQUAGUIDE AI */}
              <View style={styles.stat}>
                <Ionicons name="fish" size={22} color={colors.primary} />

                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  AquaGuide AI
                </Text>
              </View>
            </View>

            {/* ========================================================== */}
            {/* SEARCH                                                        */}
            {/* ========================================================== */}

            <TextInput
              placeholder="Search variant..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDark
                    ? "rgba(16, 35, 49, 0.72)"
                    : "rgba(255, 255, 255, 0.72)",
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: panelBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {/* ========================================================== */}
            {/* FISH IMAGE                                                    */}
            {/* ========================================================== */}

            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />

            {/* ========================================================== */}
            {/* CARD CONTENT                                                  */}
            {/* ========================================================== */}

            <View style={styles.content}>
              <Text
                style={[
                  styles.name,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {item.name}
              </Text>

              {/* TYPE BADGE */}
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{item.type}</Text>
              </View>

              {/* DESCRIPTION */}
              <Text
                style={[
                  styles.description,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * ================================================================
   * MAIN CONTAINER
   * ================================================================
   */

  container: {
    flex: 1,
  },

  /*
   * ================================================================
   * MODULE BACKGROUND
   * ================================================================
   */

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  /*
   * ================================================================
   * HERO PANEL
   * ================================================================
   */

  hero: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 16,

    padding: 20,

    borderRadius: 22,
    borderWidth: 1,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },

  heroSubtitle: {
    marginTop: 8,
    lineHeight: 22,
  },

  /*
   * ================================================================
   * STATS CARD
   * ================================================================
   */

  statsCard: {
    borderRadius: 20,

    marginTop: 20,
    marginBottom: 15,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    paddingVertical: 18,

    borderWidth: 1,
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },

  statLabel: {
    marginTop: 5,
  },

  divider: {
    width: 1,
    height: 40,
  },

  /*
   * ================================================================
   * SEARCH
   * ================================================================
   */

  searchInput: {
    borderRadius: 16,

    paddingHorizontal: 16,

    height: 55,

    borderWidth: 1,
  },

  /*
   * ================================================================
   * GRID
   * ================================================================
   */

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  /*
   * ================================================================
   * VARIANT CARD
   * ================================================================
   */

  card: {
    width: "48%",

    borderRadius: 20,

    overflow: "hidden",

    marginBottom: 16,

    borderWidth: 1,
  },

  /*
   * ================================================================
   * FISH IMAGE
   * ================================================================
   */

  image: {
    width: "100%",
    height: 140,
  },

  /*
   * ================================================================
   * CARD CONTENT
   * ================================================================
   */

  content: {
    padding: 12,
  },

  name: {
    fontWeight: "700",
    fontSize: 14,

    minHeight: 38,
  },

  /*
   * ================================================================
   * TYPE BADGE
   * ================================================================
   */

  badge: {
    alignSelf: "flex-start",

    borderRadius: 12,

    paddingHorizontal: 8,
    paddingVertical: 4,

    marginTop: 8,
  },

  badgeText: {
    color: "#FFFFFF",

    fontSize: 10,
    fontWeight: "700",
  },

  /*
   * ================================================================
   * DESCRIPTION
   * ================================================================
   */

  description: {
    fontSize: 11,

    lineHeight: 16,

    marginTop: 8,
  },
});
