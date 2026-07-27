import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { equipmentCategories } from "../../data/equipmentDatabase";
const getCategoryIcon = (id: string) => {
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
      <AppHeader title="Equipment Guide" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.heroLabel,
              {
                color: colors.primary,
              },
            ]}
          >
            AQUARIUM GUIDE
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
            Learn about the essential aquarium equipment used to maintain a
            healthy environment for ornamental fish.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
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
              Select a category to explore its purpose and recommended
              equipment.
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary + "18",
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

        {equipmentCategories.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/equipment/equipment-category",
                params: {
                  category: item.id,
                },
              })
            }
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.primary + "15",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getCategoryIcon(item.id) as any}
                    size={28}
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
                </View>
              </View>

              <MaterialIcons
                name="chevron-right"
                size={26}
                color={colors.textSecondary}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  hero: {
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
    lineHeight: 22,
  },

  heroLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
  },

  badge: {
    minWidth: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    fontSize: 16,
    fontWeight: "700",
  },

  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: "#B0BEC5",
    lineHeight: 22,
  },

  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2A7FFF20",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  heroIcon: {
    fontSize: 36,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
  },
});
