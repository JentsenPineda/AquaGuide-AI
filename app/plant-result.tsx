import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { fishPlantCompatibility } from "../data/fishPlantCompatibility";
import { plantDatabase } from "../data/plantDatabase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CAROUSEL_WIDTH = SCREEN_WIDTH;
const CARD_WIDTH = SCREEN_WIDTH - 58;
const CARD_HEIGHT = 438;

type AppColors = ReturnType<typeof useAppColors>;

type PlantCardProps = {
  plant: any;
  colors: AppColors;
};

function PlantCardComponent({ plant, colors }: PlantCardProps) {
  if (!plant) {
    return <View style={styles.invalidSlide} />;
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
          <Image source={plant.image} style={styles.image} resizeMode="cover" />

          <View
            style={[
              styles.imageBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="leaf-outline" size={14} color={colors.primary} />

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

          {/* DETAILS */}

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
                numberOfLines={2}
              >
                {plant.placement}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const PlantCard = memo(PlantCardComponent, (previous, next) => {
  return (
    previous.plant === next.plant &&
    previous.colors.card === next.colors.card &&
    previous.colors.border === next.colors.border &&
    previous.colors.background === next.colors.background &&
    previous.colors.textPrimary === next.colors.textPrimary &&
    previous.colors.textSecondary === next.colors.textSecondary &&
    previous.colors.primary === next.colors.primary
  );
});

export default function PlantResult() {
  const colors = useAppColors();

  const { fish } = useLocalSearchParams<{
    fish?: string;
  }>();

  const fishKey = Array.isArray(fish) ? fish[0] : fish;

  const plants = useMemo(() => {
    if (!fishKey) {
      return [];
    }

    return (
      fishPlantCompatibility[fishKey as keyof typeof fishPlantCompatibility] ||
      []
    );
  }, [fishKey]);

  const plantItems = useMemo(() => {
    return plants
      .map((plantId) => {
        return plantDatabase[plantId as keyof typeof plantDatabase];
      })
      .filter(Boolean);
  }, [plants]);

  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * Keeps the last displayed index without forcing a render
   * for every carousel progress update.
   */
  const activeIndexRef = useRef(0);

  /*
   * Prevents the swipe hint from appearing again after
   * the user has already interacted with the carousel.
   */
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleProgressChange = useCallback(
    (_offsetProgress: number, absoluteProgress: number) => {
      if (!plantItems.length) {
        return;
      }

      const nextIndex = Math.round(absoluteProgress);

      if (
        nextIndex >= 0 &&
        nextIndex < plantItems.length &&
        nextIndex !== activeIndexRef.current
      ) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);

        if (!hasInteracted) {
          setHasInteracted(true);
        }
      }
    },
    [plantItems.length, hasInteracted],
  );

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }

      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [hasInteracted],
  );

  const renderPlant = useCallback(
    ({ item }: { item: any }) => {
      return <PlantCard plant={item} colors={colors} />;
    },
    [colors],
  );

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

      {/* INTRO */}

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

      {plantItems.length > 0 ? (
        <>
          {/* SECTION HEADER */}

          <View style={styles.carouselHeader}>
            <View style={styles.headerText}>
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
                Swipe to explore available options
              </Text>
            </View>

            {/* COUNTER */}

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
                  styles.counterCurrent,
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
                {plantItems.length}
              </Text>
            </View>
          </View>

          {/* CAROUSEL */}

          <View style={styles.carouselWrapper}>
            <Carousel
              width={CAROUSEL_WIDTH}
              height={CARD_HEIGHT}
              data={plantItems}
              loop={false}
              pagingEnabled
              snapEnabled
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.95,
                parallaxScrollingOffset: 44,
                parallaxAdjacentItemScale: 0.9,
              }}
              scrollAnimationDuration={300}
              onProgressChange={handleProgressChange}
              onSnapToItem={handleSnapToItem}
              renderItem={renderPlant}
            />

            {/* PAGINATION */}

            {plantItems.length > 1 && (
              <View style={styles.pagination} pointerEvents="none">
                {plantItems.map((_, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <View
                      key={`dot-${index}`}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isActive
                            ? colors.primary
                            : colors.border,
                          width: isActive ? 22 : 7,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            )}

            {/* SWIPE HINT */}

            {plantItems.length > 1 && activeIndex === 0 && !hasInteracted && (
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
                  size={18}
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
        </>
      ) : (
        /* EMPTY STATE */

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
  colors: AppColors;
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

  /* =====================================================
     INTRO
  ===================================================== */

  introCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 17,

    borderRadius: 20,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  introIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  introTextContainer: {
    flex: 1,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  introSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
  },

  /* =====================================================
     CAROUSEL HEADER
  ===================================================== */

  carouselHeader: {
    marginTop: 13,
    marginBottom: 7,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
  },

  /* =====================================================
     COUNTER
  ===================================================== */

  counter: {
    minWidth: 62,
    height: 36,

    paddingHorizontal: 10,

    borderRadius: 18,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  counterCurrent: {
    fontSize: 15,
    fontWeight: "900",
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
    height: CARD_HEIGHT,

    alignItems: "center",
    justifyContent: "center",
  },

  invalidSlide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,

    borderRadius: 26,
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
    height: 175,

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

    left: 13,
    bottom: 12,

    height: 31,

    paddingHorizontal: 10,

    borderRadius: 16,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",

    elevation: 2,
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
    padding: 16,
  },

  name: {
    fontSize: 21,
    fontWeight: "900",

    marginBottom: 12,
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  detailCard: {
    width: "48.5%",

    minHeight: 61,

    borderRadius: 14,
    borderWidth: 1,

    padding: 10,
    marginBottom: 8,

    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    flex: 1,
    marginLeft: 7,
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: "600",

    marginBottom: 2,
  },

  detailValue: {
    fontSize: 11,
    fontWeight: "800",
  },

  /* =====================================================
     PLACEMENT
  ===================================================== */

  placementRow: {
    marginTop: 1,

    borderRadius: 15,
    borderWidth: 1,

    padding: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  placementIcon: {
    width: 37,
    height: 37,

    borderRadius: 11,

    justifyContent: "center",
    alignItems: "center",
  },

  placementContent: {
    flex: 1,
    marginLeft: 9,
  },

  placementLabel: {
    fontSize: 9,
    fontWeight: "600",
  },

  placementValue: {
    marginTop: 2,

    fontSize: 12,
    fontWeight: "800",
  },

  /* =====================================================
     PAGINATION
  ===================================================== */

  pagination: {
    height: 18,

    marginTop: 2,

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
    marginTop: 5,

    paddingVertical: 9,
    paddingHorizontal: 14,

    borderRadius: 16,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  swipeHintText: {
    marginLeft: 7,

    fontSize: 12,
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
