import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { allFish } from "../../data/allFish";
import { fishImages } from "../../data/fishImages";
import { fishProfiles } from "../../data/fishProfiles";

export default function FishDetailsScreen() {
  const { colorScheme } = useTheme();
  const colors = useAppColors();
  const params = useLocalSearchParams();

  const isDark = colorScheme === "dark";

  const moduleBackground = isDark
    ? require("../../assets/images/dark-mode-bg3.png")
    : require("../../assets/images/light-mode-bg3.png");
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const fish = allFish.find((item) => item.id === id);

  if (!fish) {
    return (
      <View style={styles.safe}>
        <Image
          source={moduleBackground}
          resizeMode="cover"
          style={styles.backgroundImage}
        />

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

        <AppHeader title="Fish Details" />
        <View style={styles.center}>
          <Text
            style={[
              styles.notFound,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Fish not found
          </Text>
        </View>
      </View>
    );
  }

  const profile = fishProfiles[fish.id as keyof typeof fishProfiles];

  return (
    <View style={styles.safe}>
      <Image
        source={moduleBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

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

      <AppHeader title="Fish Details" showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
      >
        {/* Hero Image */}
        <Image
          source={fishImages[fish.id as keyof typeof fishImages]}
          style={styles.heroImage}
        />
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark
                ? "rgba(10, 29, 43, 0.72)"
                : "rgba(255, 255, 255, 0.62)",
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.badgeText}>{fish.category}</Text>
          </View>
          <Text
            style={[
              styles.name,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {fish.commonName}
          </Text>
          <Text
            style={[
              styles.scientificName,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {fish.scientificName}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {fish.description}
          </Text>
        </View>

        {/* Care Stats */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Care Requirements
          </Text>

          <View style={styles.statsGrid}>
            <StatCard icon="water-outline" title="Tank" value={fish.tankSize} />

            <StatCard
              icon="thermometer-outline"
              title="Temp"
              value={fish.temperature}
            />

            <StatCard icon="analytics-outline" title="pH" value={fish.pH} />

            <StatCard icon="time-outline" title="Life" value={fish.lifespan} />

            <StatCard icon="resize-outline" title="Size" value={fish.size} />

            <StatCard
              icon="restaurant-outline"
              title="Diet"
              value={fish.diet}
            />
          </View>
        </View>
        {/* Quick Guides */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Quick Guides
          </Text>

          <Pressable
            style={[
              styles.guideButton,
              {
                backgroundColor: isDark
                  ? "rgba(16,35,49,0.72)"
                  : "rgba(255,255,255,0.62)",
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/breeding-result",
                params: { fish: fish.id },
              })
            }
          >
            <View
              style={[
                styles.guideIcon,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Ionicons name="fish-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.guideContent}>
              <Text style={[styles.guideTitle, { color: colors.textPrimary }]}>
                Breeding Guide
              </Text>
              <Text
                style={[styles.guideSubtitle, { color: colors.textSecondary }]}
              >
                Learn how to breed {fish.commonName}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>

          <Pressable
            style={[
              styles.guideButton,
              {
                backgroundColor: isDark
                  ? "rgba(16,35,49,0.72)"
                  : "rgba(255,255,255,0.62)",
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/plant-result",
                params: { fish: fish.id },
              })
            }
          >
            <View
              style={[
                styles.guideIcon,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Ionicons name="leaf-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.guideContent}>
              <Text style={[styles.guideTitle, { color: colors.textPrimary }]}>
                Plant Compatibility
              </Text>
              <Text
                style={[styles.guideSubtitle, { color: colors.textSecondary }]}
              >
                Explore plants compatible with {fish.commonName}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>

          <Pressable
            style={[
              styles.guideButton,
              {
                backgroundColor: isDark
                  ? "rgba(16,35,49,0.72)"
                  : "rgba(255,255,255,0.62)",
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/tank-care",
                params: { fish: fish.id },
              })
            }
          >
            <View
              style={[
                styles.guideIcon,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Ionicons name="water-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.guideContent}>
              <Text style={[styles.guideTitle, { color: colors.textPrimary }]}>
                Tank & Care Recommendation
              </Text>
              <Text
                style={[styles.guideSubtitle, { color: colors.textSecondary }]}
              >
                Plan the ideal setup for {fish.commonName}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Variants */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Variants
          </Text>

          <Pressable
            style={[
              styles.variantButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/variants/[species]",
                params: {
                  species: fish.id,
                },
              })
            }
          >
            <Ionicons name="images-outline" size={20} color="#FFFFFF" />

            <Text style={styles.variantButtonText}>View Variants</Text>
          </Pressable>
        </View>
        {/* Diseases */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Common Diseases
          </Text>

          <View style={styles.chipsContainer}>
            {profile?.diseases?.map((disease) => (
              <View
                key={disease}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isDark
                      ? "rgba(16,35,49,0.72)"
                      : "rgba(255,255,255,0.62)",
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {disease}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Equipment */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Recommended Equipment
          </Text>

          {profile?.equipment?.map((item) => (
            <View
              key={item}
              style={[
                styles.card,
                {
                  backgroundColor: isDark
                    ? "rgba(16,35,49,0.72)"
                    : "rgba(255,255,255,0.62)",
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.cardText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
        {/* Breeding */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Breeding Guide
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark
                  ? "rgba(16,35,49,0.72)"
                  : "rgba(255,255,255,0.62)",
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {profile?.breedingGuide}
            </Text>
          </View>
        </View>
        {/* AI Recommendation */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            AquaGuide AI Recommendation
          </Text>

          <View
            style={[
              styles.aiCard,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />

            <Text style={styles.aiText}>{profile?.aiRecommendation}</Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) {
  const { colorScheme } = useTheme();
  const colors = useAppColors();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: isDark
            ? "rgba(16,35,49,0.72)"
            : "rgba(255,255,255,0.62)",
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />

      <Text
        style={[
          styles.statTitle,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.statValue,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFound: {
    fontSize: 18,
    fontWeight: "700",
  },

  heroImage: {
    width: "100%",
    height: 280,
  },

  header: {
    padding: 20,
    margin: 12,
    borderRadius: 22,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
  },

  scientificName: {
    fontStyle: "italic",
    marginTop: 4,
  },

  description: {
    marginTop: 12,
    lineHeight: 22,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statTitle: {
    marginTop: 8,
    fontSize: 12,
  },

  statValue: {
    fontWeight: "bold",
    marginTop: 4,
  },

  guideButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },

  guideIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  guideContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  guideTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  guideSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },

  variantButton: {
    borderRadius: 16,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  variantButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: 12,
  },

  card: {
    backgroundColor: "transparent",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardText: {
    marginLeft: 10,
  },

  infoCard: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 16,
  },

  infoText: {
    lineHeight: 24,
  },

  aiCard: {
    borderRadius: 18,
    padding: 18,
  },

  aiText: {
    color: "#FFFFFF",
    marginTop: 10,
    lineHeight: 24,
    fontWeight: "600",
  },
});
