import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { allFish } from "../data/allFish";

export default function BreedingGuide() {
  const colors = useAppColors();

  const [selectedFish, setSelectedFish] = useState("");
  const [showFishModal, setShowFishModal] = useState(false);
  const [search, setSearch] = useState("");

  const selectedFishData = useMemo(() => {
    return allFish.find((fish) => fish.id === selectedFish);
  }, [selectedFish]);

  const filteredFish = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return allFish;
    }

    return allFish.filter((fish) =>
      fish.commonName.toLowerCase().includes(keyword),
    );
  }, [search]);

  const openFishModal = () => {
    setSearch("");
    setShowFishModal(true);
  };

  const closeFishModal = () => {
    setSearch("");
    setShowFishModal(false);
  };

  const selectFish = (fishId: string) => {
    setSelectedFish(fishId);
    closeFishModal();
  };

  const clearSelection = () => {
    setSelectedFish("");
  };

  const generateGuide = () => {
    if (!selectedFish) {
      return;
    }

    router.push({
      pathname: "/breeding-result",
      params: {
        fish: selectedFish,
      },
    });
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
      <AppHeader title="Breeding Guide" showBack />

      <FlatList
        data={filteredFish}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: TAB_BAR_HEIGHT + 35,
          },
        ]}
        ListHeaderComponent={
          <View>
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
                  name="fish-outline"
                  size={32}
                  color={colors.primary}
                />
              </View>

              <View style={styles.heroText}>
                <Text
                  style={[
                    styles.heroTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Fish Breeding Guide
                </Text>

                <Text
                  style={[
                    styles.heroSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Get species-specific breeding instructions, spawning
                  requirements, fry care, and practical recommendations.
                </Text>
              </View>
            </View>

            {/* SECTION TITLE */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Select Fish Species
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Choose a species to generate its breeding guide.
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {allFish.length}
                </Text>
              </View>
            </View>

            {/* SELECTOR */}
            <Pressable
              onPress={openFishModal}
              style={({ pressed }) => [
                styles.selectorCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selectedFish ? colors.primary : colors.border,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.selectorIcon,
                  {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
              >
                <Ionicons
                  name="fish-outline"
                  size={21}
                  color={colors.primary}
                />
              </View>

              <View style={styles.selectorContent}>
                <Text
                  style={[
                    styles.selectorLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Fish Species
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.selectorValue,
                    {
                      color: selectedFish
                        ? colors.textPrimary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {selectedFishData?.commonName ?? "Choose a fish species"}
                </Text>
              </View>

              {selectedFish ? (
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    clearSelection();
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
                  <Ionicons
                    name="close"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              ) : (
                <Ionicons
                  name="chevron-down"
                  size={21}
                  color={colors.textSecondary}
                />
              )}
            </Pressable>

            {/* SELECTED FISH */}
            {selectedFishData ? (
              <View
                style={[
                  styles.selectedCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Image
                  source={selectedFishData.image}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />

                <View style={styles.selectedContent}>
                  <View style={styles.selectedTopRow}>
                    <View style={styles.selectedTitleContainer}>
                      <Text
                        style={[
                          styles.selectedLabel,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        Selected Species
                      </Text>

                      <Text
                        numberOfLines={2}
                        style={[
                          styles.selectedName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {selectedFishData.commonName}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkBadge,
                        {
                          backgroundColor: colors.primary,
                        },
                      ]}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.readyRow,
                      {
                        backgroundColor: colors.primary + "10",
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={colors.primary}
                    />

                    <Text
                      style={[
                        styles.readyText,
                        {
                          color: colors.primary,
                        },
                      ]}
                    >
                      Breeding guide ready
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.emptySelectionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.emptySelectionIcon,
                    {
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name="fish-outline"
                    size={26}
                    color={colors.textSecondary}
                  />
                </View>

                <View style={styles.emptySelectionText}>
                  <Text
                    style={[
                      styles.emptySelectionTitle,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    No species selected
                  </Text>

                  <Text
                    style={[
                      styles.emptySelectionSubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Select a fish species above to continue.
                  </Text>
                </View>
              </View>
            )}

            {/* GENERATE BUTTON */}
            <Pressable
              onPress={generateGuide}
              disabled={!selectedFish}
              style={({ pressed }) => [
                styles.generateButton,
                {
                  backgroundColor: selectedFish
                    ? colors.primary
                    : colors.border,
                  opacity: pressed && selectedFish ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={21}
                color={selectedFish ? "#FFFFFF" : colors.textSecondary}
              />

              <Text
                style={[
                  styles.generateText,
                  {
                    color: selectedFish ? "#FFFFFF" : colors.textSecondary,
                  },
                ]}
              >
                Generate Breeding Guide
              </Text>

              {selectedFish && (
                <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
              )}
            </Pressable>

            <View style={styles.listHeading}>
              <Text
                style={[
                  styles.listTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Available Species
              </Text>

              <Text
                style={[
                  styles.listSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Search and select a species
              </Text>
            </View>

            {/* SEARCH */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
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
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedFish === item.id;

          return (
            <Pressable
              onPress={() => selectFish(item.id)}
              style={({ pressed }) => [
                styles.speciesCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Image
                source={item.image}
                style={styles.speciesImage}
                resizeMode="cover"
              />

              <View style={styles.speciesContent}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.speciesName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {item.commonName}
                </Text>

                <View style={styles.speciesBottomRow}>
                  <Text
                    style={[
                      styles.speciesAction,
                      {
                        color: isSelected
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Text>

                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "chevron-forward"}
                    size={17}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View
            style={[
              styles.noResults,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={34}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.noResultsTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              No species found
            </Text>

            <Text
              style={[
                styles.noResultsText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Try searching for another fish species.
            </Text>
          </View>
        }
      />

      {/* SPECIES SELECTOR MODAL */}
      <Modal
        visible={showFishModal}
        animationType="slide"
        transparent
        onRequestClose={closeFishModal}
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
                  Select Fish Species
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Choose the species you want to breed.
                </Text>
              </View>

              <Pressable
                onPress={closeFishModal}
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

            {/* MODAL SEARCH */}
            <View
              style={[
                styles.modalSearch,
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
                placeholder="Search species..."
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.modalSearchInput,
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

            <FlatList
              data={filteredFish}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => {
                const isSelected = selectedFish === item.id;

                return (
                  <Pressable
                    onPress={() => selectFish(item.id)}
                    style={({ pressed }) => [
                      styles.modalFishItem,
                      {
                        backgroundColor: isSelected
                          ? colors.primary + "10"
                          : colors.background,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Image
                      source={item.image}
                      style={styles.modalFishImage}
                      resizeMode="cover"
                    />

                    <View style={styles.modalFishText}>
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

                      <Text
                        style={[
                          styles.modalFishStatus,
                          {
                            color: isSelected
                              ? colors.primary
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {isSelected ? "Currently selected" : "Select species"}
                      </Text>
                    </View>

                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "chevron-forward"}
                      size={21}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Ionicons
                    name="search-outline"
                    size={30}
                    color={colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.modalEmptyText,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    No species found.
                  </Text>
                </View>
              }
            />

            {/* CLEAR SELECTION */}
            {selectedFish && (
              <Pressable
                onPress={() => {
                  clearSelection();
                  closeFishModal();
                }}
                style={[
                  styles.clearSelectionButton,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.textSecondary}
                />

                <Text
                  style={[
                    styles.clearSelectionText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Clear Selected Species
                </Text>
              </Pressable>
            )}
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

  listContent: {
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

  heroText: {
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

  sectionHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 38,
    height: 34,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* SELECTOR */

  selectorCard: {
    minHeight: 70,

    borderWidth: 1,
    borderRadius: 18,

    paddingHorizontal: 13,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  selectorIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  selectorContent: {
    flex: 1,
    marginLeft: 11,
  },

  selectorLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 3,
  },

  selectorValue: {
    fontSize: 15,
    fontWeight: "800",
  },

  clearButton: {
    width: 34,
    height: 34,

    borderRadius: 17,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 8,
  },

  /* SELECTED */

  selectedCard: {
    borderRadius: 19,
    borderWidth: 1,

    padding: 12,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  selectedImage: {
    width: 82,
    height: 82,

    borderRadius: 15,

    marginRight: 13,
  },

  selectedContent: {
    flex: 1,
  },

  selectedTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  selectedTitleContainer: {
    flex: 1,
    paddingRight: 7,
  },

  selectedLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 3,
  },

  selectedName: {
    fontSize: 17,
    fontWeight: "900",
  },

  checkBadge: {
    width: 27,
    height: 27,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  readyRow: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 5,

    marginTop: 9,
  },

  readyText: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 5,
  },

  /* EMPTY SELECTION */

  emptySelectionCard: {
    minHeight: 78,

    borderRadius: 18,
    borderWidth: 1,

    padding: 12,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  emptySelectionIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  emptySelectionText: {
    flex: 1,
    marginLeft: 12,
  },

  emptySelectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptySelectionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  /* GENERATE */

  generateButton: {
    minHeight: 56,

    borderRadius: 17,

    paddingHorizontal: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 25,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  generateText: {
    fontSize: 15,
    fontWeight: "800",

    marginHorizontal: 9,
  },

  /* AVAILABLE SPECIES */

  listHeading: {
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  listSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  searchContainer: {
    height: 52,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    marginLeft: 9,

    fontSize: 15,
  },

  /* SPECIES CARD */

  speciesCard: {
    minHeight: 82,

    borderRadius: 17,
    borderWidth: 1,

    padding: 10,

    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  speciesImage: {
    width: 62,
    height: 62,

    borderRadius: 13,
  },

  speciesContent: {
    flex: 1,
    marginLeft: 12,
  },

  speciesName: {
    fontSize: 15,
    fontWeight: "800",
  },

  speciesBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 7,
  },

  speciesAction: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* EMPTY */

  noResults: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 28,

    alignItems: "center",
  },

  noResultsTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
  },

  noResultsText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(0,0,0,0.48)",
  },

  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingTop: 10,
    paddingHorizontal: 18,

    height: "84%",
  },

  modalHandle: {
    alignSelf: "center",

    width: 42,
    height: 5,

    borderRadius: 3,

    backgroundColor: "#9E9E9E",

    marginBottom: 14,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 12,
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

  modalSearch: {
    height: 50,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  modalSearchInput: {
    flex: 1,

    height: "100%",

    marginLeft: 8,

    fontSize: 14,
  },

  modalList: {
    paddingBottom: 12,
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

  modalFishText: {
    flex: 1,
    marginLeft: 11,
  },

  modalFishName: {
    fontSize: 14,
    fontWeight: "800",
  },

  modalFishStatus: {
    fontSize: 10,
    marginTop: 4,
  },

  modalEmpty: {
    alignItems: "center",
    paddingVertical: 40,
  },

  modalEmptyText: {
    fontSize: 14,
    marginTop: 8,
  },

  clearSelectionButton: {
    minHeight: 50,

    borderWidth: 1,
    borderRadius: 15,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 5,
    marginBottom: 10,
  },

  clearSelectionText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 7,
  },
});
