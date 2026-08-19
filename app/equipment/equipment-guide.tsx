import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { equipmentCategories } from "../../data/equipmentDatabase";

const getCategoryIcon = (
  id: string,
): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (id) {
    case "filters":
      return "filter-variant";

    case "airpumps":
      return "air-purifier";

    case "heaters":
      return "thermometer";

    case "temperature-monitoring":
      return "thermometer-check";

    default:
      return "fishbowl-outline";
  }
};

export default function EquipmentGuide() {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Equipment Guide" showBack />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="tools"
              size={30}
              color={colors.primary}
            />
          </View>

          <View style={styles.heroContent}>
            <Text
              style={[
                styles.heroLabel,
                {
                  color: colors.primary,
                },
              ]}
            >
              AQUARIUM ESSENTIALS
            </Text>

            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Equipment Guide
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Explore essential equipment for maintaining a healthy and stable
              aquarium environment.
            </Text>
          </View>
        </View>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Equipment Categories
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Choose a category to learn more.
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {equipmentCategories.length}
            </Text>
          </View>
        </View>

        {/* CATEGORY CARDS */}
        <View style={styles.cards}>
          {equipmentCategories.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/equipment/equipment-category",
                  params: {
                    category: item.id,
                  },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                  transform: [
                    {
                      scale: pressed ? 0.985 : 1,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.primary + "15",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getCategoryIcon(item.id)}
                    size={27}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.description,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  <View style={styles.exploreRow}>
                    <Text
                      style={[
                        styles.exploreText,
                        {
                          color: colors.primary,
                        },
                      ]}
                    >
                      Explore category
                    </Text>

                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.arrowContainer,
                    {
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="chevron-right"
                    size={21}
                    color={colors.textSecondary}
                  />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: TAB_BAR_HEIGHT + 25,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 26,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  heroContent: {
    flex: 1,
  },

  heroLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 4,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
  },

  heroSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionText: {
    flex: 1,
    paddingRight: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    fontSize: 15,
    fontWeight: "800",
  },

  cards: {
    gap: 12,
  },

  card: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 15,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  description: {
    fontSize: 12.5,
    lineHeight: 18,
  },

  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  exploreText: {
    fontSize: 11.5,
    fontWeight: "700",
    marginRight: 4,
  },

  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  bottomSpace: {
    height: 10,
  },
});
