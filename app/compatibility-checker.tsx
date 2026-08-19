import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allFish } from "../data/allFish";
import { fishCompatibility } from "../data/fishCompatibility";

type FishSlot = 1 | 2;

type CompatibilityStatus = "Compatible" | "Not Compatible" | "Use Caution";

export default function CompatibilityChecker() {
  const colors = useAppColors();

  const [fish1, setFish1] = useState("");
  const [fish2, setFish2] = useState("");

  const [activeSlot, setActiveSlot] = useState<FishSlot | null>(null);

  const [search, setSearch] = useState("");

  const fish1Data = useMemo(
    () => allFish.find((fish) => fish.id === fish1),
    [fish1],
  );

  const fish2Data = useMemo(
    () => allFish.find((fish) => fish.id === fish2),
    [fish2],
  );

  const filteredFish = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return allFish;
    }

    return allFish.filter((fish) => {
      return (
        fish.commonName.toLowerCase().includes(keyword) ||
        fish.scientificName?.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const getCompatibilityResult = () => {
    if (!fish1 || !fish2) {
      return null;
    }

    const fish1Compatibility =
      fishCompatibility[fish1 as keyof typeof fishCompatibility];

    const fish2Compatibility =
      fishCompatibility[fish2 as keyof typeof fishCompatibility];

    if (!fish1Compatibility || !fish2Compatibility) {
      return {
        status: "Use Caution" as CompatibilityStatus,
        reason:
          "There is limited compatibility data for one or both selected species. Monitor behavior carefully and provide adequate space.",
      };
    }

    if (fish1 === fish2) {
      return {
        status: "Compatible" as CompatibilityStatus,
        reason:
          "Same species. These fish can generally live together when given enough space.",
      };
    }

    const incompatible =
      fish1Compatibility.incompatible.includes("all") ||
      fish2Compatibility.incompatible.includes("all") ||
      fish1Compatibility.incompatible.includes(fish2) ||
      fish2Compatibility.incompatible.includes(fish1);

    if (incompatible) {
      return {
        status: "Not Compatible" as CompatibilityStatus,
        reason:
          "These species have different care requirements, aggression levels, or water parameters.",
      };
    }

    const compatible =
      fish1Compatibility.compatible.includes(fish2) ||
      fish2Compatibility.compatible.includes(fish1);

    if (compatible) {
      return {
        status: "Compatible" as CompatibilityStatus,
        reason:
          "These species generally share similar care requirements and can live together.",
      };
    }

    return {
      status: "Use Caution" as CompatibilityStatus,
      reason:
        "There is limited compatibility data. Monitor behavior carefully and provide adequate space.",
    };
  };

  const compatibilityResult = fish1 && fish2 ? getCompatibilityResult() : null;

  const getStatusColor = (status: CompatibilityStatus) => {
    if (status === "Compatible") {
      return colors.success;
    }

    if (status === "Use Caution") {
      return colors.warning;
    }

    return colors.danger;
  };

  const getStatusIcon = (status: CompatibilityStatus) => {
    if (status === "Compatible") {
      return "checkmark-circle";
    }

    if (status === "Use Caution") {
      return "alert-circle";
    }

    return "close-circle";
  };

  const getStatusDescription = (status: CompatibilityStatus) => {
    if (status === "Compatible") {
      return "These fish can generally be kept together with proper care.";
    }

    if (status === "Use Caution") {
      return "These fish may require closer monitoring and additional space.";
    }

    return "These fish should generally not be kept together.";
  };

  const openFishPicker = (slot: FishSlot) => {
    setSearch("");
    setActiveSlot(slot);
  };

  const closeFishPicker = () => {
    setSearch("");
    setActiveSlot(null);
  };

  const selectFish = (fishId: string) => {
    if (activeSlot === 1) {
      setFish1(fishId);
    } else if (activeSlot === 2) {
      setFish2(fishId);
    }

    closeFishPicker();
  };

  const clearFish = (slot: FishSlot) => {
    if (slot === 1) {
      setFish1("");
    } else {
      setFish2("");
    }
  };

  const resetComparison = () => {
    setFish1("");
    setFish2("");
  };

  const renderFishSelector = (slot: FishSlot, fishData: typeof fish1Data) => {
    const hasFish = !!fishData;

    return (
      <View style={styles.selectionSection}>
        <View style={styles.selectionHeader}>
          <View style={styles.selectionTitleRow}>
            <View
              style={[
                styles.selectionNumber,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.selectionNumberText}>{slot}</Text>
            </View>

            <View>
              <Text
                style={[
                  styles.selectionTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {slot === 1 ? "First Fish" : "Second Fish"}
              </Text>

              <Text
                style={[
                  styles.selectionSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {hasFish ? "Selected species" : "Choose a species to compare"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => openFishPicker(slot)}
          style={({ pressed }) => [
            styles.fishCard,
            {
              backgroundColor: colors.card,
              borderColor: hasFish ? colors.primary : colors.border,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          {hasFish && fishData ? (
            <>
              <Image
                source={fishData.image}
                style={styles.fishImage}
                resizeMode="cover"
              />

              <View style={styles.fishInfo}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fishName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {fishData.commonName}
                </Text>

                {fishData.scientificName && (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.scientificName,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {fishData.scientificName}
                  </Text>
                )}

                <View style={styles.badgeRow}>
                  {fishData.category && (
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
                        {fishData.category}
                      </Text>
                    </View>
                  )}

                  {fishData.temperament && (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {fishData.temperament}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.changeText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Change fish
                </Text>
              </View>

              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  clearFish(slot);
                }}
                hitSlop={8}
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.emptyFishIcon,
                  {
                    backgroundColor: colors.primary + "12",
                  },
                ]}
              >
                <Ionicons
                  name="fish-outline"
                  size={27}
                  color={colors.primary}
                />
              </View>

              <View style={styles.emptyFishContent}>
                <Text
                  style={[
                    styles.emptyFishTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Select a fish
                </Text>

                <Text
                  style={[
                    styles.emptyFishSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Tap to choose a species
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color={colors.textSecondary}
              />
            </>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Compatibility Checker" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: TAB_BAR_HEIGHT + 40,
          },
        ]}
      >
        {/* HERO */}

        <View
          style={[
            styles.heroCard,
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
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="git-compare-outline"
              size={32}
              color={colors.primary}
            />
          </View>

          <View style={styles.heroContent}>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Fish Compatibility
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Compare two ornamental fish species and determine whether they can
              live together.
            </Text>
          </View>
        </View>

        {/* SELECTION AREA */}

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
              Compare Fish
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Select two different species.
            </Text>
          </View>

          {(fish1 || fish2) && (
            <Pressable
              onPress={resetComparison}
              hitSlop={8}
              style={styles.resetButton}
            >
              <Text
                style={[
                  styles.resetText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Reset
              </Text>
            </Pressable>
          )}
        </View>

        {renderFishSelector(1, fish1Data)}

        {/* VS DIVIDER */}

        <View style={styles.vsContainer}>
          <View
            style={[
              styles.vsLine,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.vsBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.vsText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              VS
            </Text>
          </View>

          <View
            style={[
              styles.vsLine,
              {
                backgroundColor: colors.border,
              },
            ]}
          />
        </View>

        {renderFishSelector(2, fish2Data)}

        {/* RESULT */}

        {!compatibilityResult && (
          <View
            style={[
              styles.waitingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.waitingIcon,
                {
                  backgroundColor: colors.primary + "12",
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View style={styles.waitingContent}>
              <Text
                style={[
                  styles.waitingTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Ready to compare
              </Text>

              <Text
                style={[
                  styles.waitingText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Select both fish species above to see their compatibility
                result.
              </Text>
            </View>
          </View>
        )}

        {compatibilityResult && (
          <View
            style={[
              styles.resultCard,
              {
                backgroundColor: colors.card,
                borderColor: getStatusColor(compatibilityResult.status),
              },
            ]}
          >
            {/* RESULT HEADER */}

            <View style={styles.resultHeader}>
              <View>
                <Text
                  style={[
                    styles.resultLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  COMPATIBILITY RESULT
                </Text>

                <Text
                  style={[
                    styles.resultTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {compatibilityResult.status}
                </Text>
              </View>

              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor:
                      getStatusColor(compatibilityResult.status) + "18",
                  },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(compatibilityResult.status)}
                  size={30}
                  color={getStatusColor(compatibilityResult.status)}
                />
              </View>
            </View>

            {/* FISH COMPARISON */}

            <View
              style={[
                styles.comparisonCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.comparisonFish}>
                {fish1Data && (
                  <Image
                    source={fish1Data.image}
                    style={styles.comparisonImage}
                    resizeMode="cover"
                  />
                )}

                <Text
                  numberOfLines={2}
                  style={[
                    styles.comparisonName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {fish1Data?.commonName}
                </Text>
              </View>

              <View
                style={[
                  styles.comparisonIcon,
                  {
                    backgroundColor:
                      getStatusColor(compatibilityResult.status) + "15",
                  },
                ]}
              >
                <Ionicons
                  name="git-compare-outline"
                  size={20}
                  color={getStatusColor(compatibilityResult.status)}
                />
              </View>

              <View style={styles.comparisonFish}>
                {fish2Data && (
                  <Image
                    source={fish2Data.image}
                    style={styles.comparisonImage}
                    resizeMode="cover"
                  />
                )}

                <Text
                  numberOfLines={2}
                  style={[
                    styles.comparisonName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {fish2Data?.commonName}
                </Text>
              </View>
            </View>

            {/* STATUS */}

            <View
              style={[
                styles.statusBanner,
                {
                  backgroundColor:
                    getStatusColor(compatibilityResult.status) + "10",
                },
              ]}
            >
              <Ionicons
                name={getStatusIcon(compatibilityResult.status)}
                size={19}
                color={getStatusColor(compatibilityResult.status)}
              />

              <Text
                style={[
                  styles.statusBannerText,
                  {
                    color: getStatusColor(compatibilityResult.status),
                  },
                ]}
              >
                {compatibilityResult.status}
              </Text>
            </View>

            {/* REASON */}

            <View style={styles.reasonContainer}>
              <Text
                style={[
                  styles.reasonLabel,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Why?
              </Text>

              <Text
                style={[
                  styles.reason,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {compatibilityResult.reason}
              </Text>
            </View>

            {/* PRACTICAL GUIDANCE */}

            <View
              style={[
                styles.guidanceCard,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.guidanceText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {getStatusDescription(compatibilityResult.status)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* FISH PICKER */}

      <Modal
        visible={activeSlot !== null}
        transparent
        animationType="slide"
        onRequestClose={closeFishPicker}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {activeSlot === 1
                    ? "Select First Fish"
                    : "Select Second Fish"}
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Choose an ornamental fish species.
                </Text>
              </View>

              <Pressable
                onPress={closeFishPicker}
                style={[
                  styles.modalClose,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* SEARCH */}

            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={19}
                color={colors.textSecondary}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search fish species..."
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.searchInput,
                  {
                    color: colors.textPrimary,
                  },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={colors.textSecondary}
                  />
                </Pressable>
              )}
            </View>

            {/* FISH LIST */}

            <FlatList
              data={filteredFish}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => {
                const isSelected = item.id === fish1 || item.id === fish2;

                const isCurrentSelection =
                  item.id === (activeSlot === 1 ? fish1 : fish2);

                const isUsedByOtherFish =
                  activeSlot === 1 ? item.id === fish2 : item.id === fish1;

                return (
                  <Pressable
                    disabled={isUsedByOtherFish}
                    onPress={() => selectFish(item.id)}
                    style={({ pressed }) => [
                      styles.modalFishItem,
                      {
                        backgroundColor: isCurrentSelection
                          ? colors.primary + "10"
                          : colors.background,
                        borderColor: isCurrentSelection
                          ? colors.primary
                          : colors.border,
                        opacity: isUsedByOtherFish ? 0.45 : pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Image
                      source={item.image}
                      style={styles.modalFishImage}
                      resizeMode="cover"
                    />

                    <View style={styles.modalFishInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.modalFishName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {item.commonName}
                      </Text>

                      {item.scientificName && (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.modalScientificName,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          {item.scientificName}
                        </Text>
                      )}

                      <Text
                        style={[
                          styles.modalStatus,
                          {
                            color: isUsedByOtherFish
                              ? colors.textSecondary
                              : isCurrentSelection
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {isUsedByOtherFish
                          ? "Already selected"
                          : isCurrentSelection
                            ? "Currently selected"
                            : isSelected
                              ? "Selected"
                              : "Tap to select"}
                      </Text>
                    </View>

                    <Ionicons
                      name={
                        isCurrentSelection
                          ? "checkmark-circle"
                          : isUsedByOtherFish
                            ? "remove-circle-outline"
                            : "chevron-forward"
                      }
                      size={21}
                      color={
                        isCurrentSelection
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Ionicons
                    name="search-outline"
                    size={32}
                    color={colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.modalEmptyTitle,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    No fish found
                  </Text>

                  <Text
                    style={[
                      styles.modalEmptyText,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Try another species name.
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  /* HERO */

  heroCard: {
    borderRadius: 24,
    borderWidth: 1,

    padding: 18,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 24,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  heroIcon: {
    width: 62,
    height: 62,

    borderRadius: 19,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: "900",
  },

  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,

    marginTop: 5,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  resetText: {
    fontSize: 13,
    fontWeight: "800",
  },

  /* SELECTION */

  selectionSection: {
    marginBottom: 4,
  },

  selectionHeader: {
    marginBottom: 8,
  },

  selectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  selectionNumber: {
    width: 29,
    height: 29,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 9,
  },

  selectionNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  selectionTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  selectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  fishCard: {
    minHeight: 96,

    borderRadius: 19,
    borderWidth: 1,

    padding: 11,

    flexDirection: "row",
    alignItems: "center",
  },

  fishImage: {
    width: 74,
    height: 74,

    borderRadius: 15,
  },

  fishInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 4,
  },

  fishName: {
    fontSize: 16,
    fontWeight: "900",
  },

  scientificName: {
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginTop: 6,
  },

  badge: {
    borderRadius: 8,

    paddingHorizontal: 7,
    paddingVertical: 4,

    marginRight: 5,
    marginBottom: 3,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "800",
  },

  changeText: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },

  clearButton: {
    width: 32,
    height: 32,

    borderRadius: 16,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyFishIcon: {
    width: 56,
    height: 56,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyFishContent: {
    flex: 1,
    marginLeft: 12,
  },

  emptyFishTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  emptyFishSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  /* VS */

  vsContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 13,
  },

  vsLine: {
    flex: 1,
    height: 1,
  },

  vsBadge: {
    width: 38,
    height: 38,

    borderRadius: 19,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginHorizontal: 10,
  },

  vsText: {
    fontSize: 11,
    fontWeight: "900",
  },

  /* WAITING */

  waitingCard: {
    borderRadius: 19,
    borderWidth: 1,

    padding: 14,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 22,
  },

  waitingIcon: {
    width: 47,
    height: 47,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  waitingContent: {
    flex: 1,
    marginLeft: 11,
  },

  waitingTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  waitingText: {
    fontSize: 12,
    lineHeight: 18,

    marginTop: 3,
  },

  /* RESULT */

  resultCard: {
    borderRadius: 22,
    borderWidth: 2,

    padding: 16,

    marginTop: 24,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 14,
  },

  resultLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  resultTitle: {
    fontSize: 23,
    fontWeight: "900",

    marginTop: 3,
  },

  statusIcon: {
    width: 52,
    height: 52,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",
  },

  comparisonCard: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  comparisonFish: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 5,
  },

  comparisonImage: {
    width: 70,
    height: 70,

    borderRadius: 17,

    marginBottom: 7,
  },

  comparisonName: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  comparisonIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    justifyContent: "center",
    alignItems: "center",

    marginHorizontal: 5,
  },

  statusBanner: {
    minHeight: 44,

    borderRadius: 13,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 12,
  },

  statusBannerText: {
    fontSize: 14,
    fontWeight: "900",

    marginLeft: 7,
  },

  reasonContainer: {
    marginTop: 16,
  },

  reasonLabel: {
    fontSize: 14,
    fontWeight: "800",
  },

  reason: {
    fontSize: 13,
    lineHeight: 21,

    marginTop: 5,
  },

  guidanceCard: {
    borderRadius: 13,

    padding: 11,

    flexDirection: "row",
    alignItems: "flex-start",

    marginTop: 14,
  },

  guidanceText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 18,

    marginLeft: 8,
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  modalCard: {
    height: "84%",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingTop: 10,
    paddingHorizontal: 18,
  },

  modalHandle: {
    width: 42,
    height: 5,

    borderRadius: 3,

    backgroundColor: "#9E9E9E",

    alignSelf: "center",

    marginBottom: 14,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "900",
  },

  modalSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  modalClose: {
    width: 38,
    height: 38,

    borderRadius: 19,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    height: 50,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  modalList: {
    paddingBottom: 20,
  },

  modalFishItem: {
    minHeight: 70,

    borderRadius: 16,
    borderWidth: 1,

    padding: 8,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 8,
  },

  modalFishImage: {
    width: 54,
    height: 54,

    borderRadius: 12,
  },

  modalFishInfo: {
    flex: 1,

    marginLeft: 11,
    paddingRight: 8,
  },

  modalFishName: {
    fontSize: 14,
    fontWeight: "800",
  },

  modalScientificName: {
    fontSize: 10,
    fontStyle: "italic",

    marginTop: 2,
  },

  modalStatus: {
    fontSize: 10,
    fontWeight: "700",

    marginTop: 4,
  },

  modalEmpty: {
    alignItems: "center",

    paddingVertical: 45,
  },

  modalEmptyTitle: {
    fontSize: 16,
    fontWeight: "800",

    marginTop: 9,
  },

  modalEmptyText: {
    fontSize: 12,

    marginTop: 3,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontSize: 14,
  },
});
