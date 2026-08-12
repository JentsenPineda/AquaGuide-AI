import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { fishPlantCompatibility } from "../data/fishPlantCompatibility";
import { plantDatabase } from "../data/plantDatabase";

const { width } = Dimensions.get("window");

export default function PlantResult() {
  const colors = useAppColors();
  const { fish } = useLocalSearchParams();

  const plants =
    fishPlantCompatibility[fish as keyof typeof fishPlantCompatibility] || [];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Compatible Plants" showBack />

      {/* =====================================================
            INTRO
        ===================================================== */}

      <View
        style={[
          styles.introCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.introIcon,
            {
              backgroundColor: colors.primary + "18",
            },
          ]}
        >
          <Ionicons name="leaf-outline" size={25} color={colors.primary} />
        </View>

        <View style={styles.introTextContainer}>
          <Text
            style={[
              styles.introTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Compatible Plants
          </Text>

          <Text
            style={[
              styles.introSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Explore aquatic plants recommended for this fish.
          </Text>
        </View>
      </View>

      {/* =====================================================
            CAROUSEL LABEL
        ===================================================== */}

      {plants.length > 0 && (
        <View style={styles.carouselHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Recommended Plants
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Swipe to explore
            </Text>
          </View>

          <View
            style={[
              styles.counter,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.counterText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {activeIndex + 1}
            </Text>

            <Text
              style={[
                styles.counterDivider,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              /
            </Text>

            <Text
              style={[
                styles.counterTotal,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {plants.length}
            </Text>
          </View>
        </View>
      )}

      {/* =====================================================
            CAROUSEL
        ===================================================== */}

      {plants.length > 0 ? (
        <View style={styles.carouselWrapper}>
          <Carousel
            width={width}
            height={450}
            data={plants}
            loop={false}
            pagingEnabled
            snapEnabled
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.94,
              parallaxScrollingOffset: 52,
              parallaxAdjacentItemScale: 0.88,
            }}
            onSnapToItem={(index) => {
              setActiveIndex(index);
            }}
            renderItem={({ item }) => {
              const plant = plantDatabase[item as keyof typeof plantDatabase];

              if (!plant) {
                return <View />;
              }

              return (
                <View style={styles.slide}>
                  <View
                    style={[
                      styles.card,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {/* IMAGE */}

                    <View
                      style={[
                        styles.imageContainer,
                        {
                          backgroundColor: colors.background,
                        },
                      ]}
                    >
                      <Image
                        source={plant.image}
                        style={styles.image}
                        resizeMode="contain"
                      />

                      <View
                        style={[
                          styles.imageBadge,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name="leaf-outline"
                          size={14}
                          color={colors.primary}
                        />

                        <Text
                          style={[
                            styles.imageBadgeText,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          Aquatic Plant
                        </Text>
                      </View>
                    </View>

                    {/* INFORMATION */}

                    <View style={styles.info}>
                      <Text
                        style={[
                          styles.name,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {plant.name}
                      </Text>

                      {/* DETAILS GRID */}

                      <View style={styles.detailsGrid}>
                        <PlantDetail
                          icon="speedometer-outline"
                          label="Difficulty"
                          value={plant.difficulty}
                          colors={colors}
                        />

                        <PlantDetail
                          icon="sunny-outline"
                          label="Lighting"
                          value={plant.lighting}
                          colors={colors}
                        />

                        <PlantDetail
                          icon="trending-up-outline"
                          label="Growth"
                          value={plant.growthRate}
                          colors={colors}
                        />

                        <PlantDetail
                          icon="cloud-outline"
                          label="CO₂"
                          value={plant.co2}
                          colors={colors}
                        />
                      </View>

                      {/* PLACEMENT */}

                      <View
                        style={[
                          styles.placementRow,
                          {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.placementIcon,
                            {
                              backgroundColor: colors.primary + "18",
                            },
                          ]}
                        >
                          <Ionicons
                            name="layers-outline"
                            size={18}
                            color={colors.primary}
                          />
                        </View>

                        <View style={styles.placementContent}>
                          <Text
                            style={[
                              styles.placementLabel,
                              {
                                color: colors.textSecondary,
                              },
                            ]}
                          >
                            Recommended Placement
                          </Text>

                          <Text
                            style={[
                              styles.placementValue,
                              {
                                color: colors.textPrimary,
                              },
                            ]}
                          >
                            {plant.placement}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          {/* =================================================
                CAROUSEL DOTS
            ================================================= */}

          {plants.length > 1 && (
            <View style={styles.pagination}>
              {plants.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeIndex ? colors.primary : colors.border,
                      width: index === activeIndex ? 24 : 7,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* =================================================
                SWIPE HINT
            ================================================= */}

          {plants.length > 1 && activeIndex === 0 && (
            <View
              style={[
                styles.swipeHint,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.swipeHintText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Swipe to explore more plants
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* =====================================================
             NO PLANTS
          ===================================================== */

        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: colors.primary + "18",
              },
            ]}
          >
            <Ionicons name="leaf-outline" size={32} color={colors.primary} />
          </View>

          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            No Compatible Plants
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            There are currently no recommended aquatic plants available for this
            fish.
          </Text>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   PLANT DETAIL
========================================================= */

function PlantDetail({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={[
        styles.detailCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />

      <View style={styles.detailText}>
        <Text
          style={[
            styles.detailLabel,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.detailValue,
            {
              color: colors.textPrimary,
            },
          ]}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    paddingTop: 18,
  },

  /* =====================================================
     INTRO
  ===================================================== */

  introCard: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  introIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  introTextContainer: {
    flex: 1,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  introSubtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },

  /* =====================================================
     CAROUSEL HEADER
  ===================================================== */

  carouselHeader: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  counter: {
    minWidth: 58,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    fontSize: 14,
    fontWeight: "800",
  },

  counterDivider: {
    marginHorizontal: 3,
    fontSize: 13,
  },

  counterTotal: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* =====================================================
     CAROUSEL
  ===================================================== */

  carouselWrapper: {
    width: "100%",
    alignItems: "center",
  },

  slide: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: width - 58,
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  /* =====================================================
     IMAGE
  ===================================================== */

  imageContainer: {
    width: "100%",
    height: 185,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,

    height: 32,
    paddingHorizontal: 11,

    borderRadius: 16,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  imageBadgeText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "700",
  },

  /* =====================================================
     INFORMATION
  ===================================================== */

  info: {
    padding: 18,
  },

  name: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 15,
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  detailCard: {
    width: "48.5%",
    minHeight: 65,
    borderRadius: 15,
    borderWidth: 1,
    padding: 11,
    marginBottom: 9,

    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    flex: 1,
    marginLeft: 8,
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* =====================================================
     PLACEMENT
  ===================================================== */

  placementRow: {
    marginTop: 3,
    borderRadius: 16,
    borderWidth: 1,
    padding: 11,

    flexDirection: "row",
    alignItems: "center",
  },

  placementIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  placementContent: {
    flex: 1,
    marginLeft: 10,
  },

  placementLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  placementValue: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "800",
  },

  /* =====================================================
     PAGINATION
  ===================================================== */

  pagination: {
    height: 18,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    height: 7,
    borderRadius: 999,
    marginHorizontal: 3,
  },

  /* =====================================================
     SWIPE HINT
  ===================================================== */

  swipeHint: {
    marginTop: 7,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  swipeHintText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  emptyCard: {
    marginHorizontal: 20,
    marginTop: 25,
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
