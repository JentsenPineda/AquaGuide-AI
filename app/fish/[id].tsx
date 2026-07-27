import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
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
  const colors = useAppColors();
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const fish = allFish.find((item) => item.id === id);

  if (!fish) {
    return (
      <View
        style={[
          styles.safe,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
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
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Fish Details" />
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
              backgroundColor: colors.background,
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
                    backgroundColor: colors.surface,
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
                  backgroundColor: colors.card,
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
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
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

            <Text
              style={[
                styles.aiText,
                {
                  color: colors.white,
                },
              ]}
            >
              {profile?.aiRecommendation}
            </Text>
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
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
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
    backgroundColor: "#08141F",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFound: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  heroImage: {
    width: "100%",
    height: 280,
  },

  header: {
    padding: 20,
  },

  badge: {
    backgroundColor: "#00BCD4",
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
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  scientificName: {
    color: "#90CAF9",
    fontStyle: "italic",
    marginTop: 4,
  },

  description: {
    color: "#CFD8DC",
    marginTop: 12,
    lineHeight: 22,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
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
    backgroundColor: "#102331",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statTitle: {
    color: "#90CAF9",
    marginTop: 8,
    fontSize: 12,
  },

  statValue: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 4,
  },

  variantButton: {
    backgroundColor: "#00BCD4",
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
    backgroundColor: "#102331",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },

  infoCard: {
    backgroundColor: "#102331",
    borderRadius: 16,
    padding: 16,
  },

  infoText: {
    color: "#CFD8DC",
    lineHeight: 24,
  },

  aiCard: {
    backgroundColor: "#00BCD4",
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
