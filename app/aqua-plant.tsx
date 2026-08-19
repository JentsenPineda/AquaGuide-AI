import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allFish } from "../data/allFish";
import { fishImages } from "../data/fishImages";

export default function AquaPlantScreen() {
  const colors = useAppColors();

  const [search, setSearch] = useState("");
  const [selectedFish, setSelectedFish] = useState("goldfish");

  const filteredFish = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return allFish;
    }

    return allFish.filter((fish) =>
      fish.commonName.toLowerCase().includes(keyword),
    );
  }, [search]);

  const selectedFishData = useMemo(() => {
    return allFish.find((fish) => fish.id === selectedFish);
  }, [selectedFish]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Aqua Plants" showBack />

      <FlatList
        data={filteredFish}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: 80,
          },
        ]}
        columnWrapperStyle={styles.columnWrapper}
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
                    backgroundColor: "#43A047" + "18",
                  },
                ]}
              >
                <Text style={styles.heroEmoji}>🌿</Text>
              </View>

              <View style={styles.heroTextContainer}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Aqua Plant Guide
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Find aquatic plants that are compatible with your ornamental
                  fish.
                </Text>
              </View>
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
                size={21}
                color={colors.textSecondary}
              />

              <TextInput
                placeholder="Search fish species..."
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                style={[
                  styles.searchInput,
                  {
                    color: colors.textPrimary,
                  },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
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

            {/* SECTION TITLE */}
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
                  Choose Your Fish
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Select a species to find suitable aquatic plants.
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.primary + "18",
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
                  {filteredFish.length}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedFish === item.id;

          return (
            <Pressable
              onPress={() => setSelectedFish(item.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              {/* FISH IMAGE */}
              <View style={styles.imageContainer}>
                <Image
                  source={fishImages[item.id as keyof typeof fishImages]}
                  style={styles.image}
                  resizeMode="cover"
                />

                {/* SELECTED INDICATOR */}
                {isSelected && (
                  <View
                    style={[
                      styles.selectedBadge,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* FISH NAME */}
              <View style={styles.cardContent}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.cardTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {item.commonName}
                </Text>

                <View
                  style={[
                    styles.selectIndicator,
                    {
                      backgroundColor: isSelected
                        ? colors.primary + "15"
                        : colors.surface,
                    },
                  ]}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={15}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.selectText,
                      {
                        color: isSelected
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={38}
                color={colors.textSecondary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              No Fish Found
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Try searching for another ornamental fish species.
            </Text>
          </View>
        }
      />

      {/* SELECTED FISH / ACTION AREA */}
      <View
        style={[
          styles.bottomContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.selectedFishCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.selectedFishIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons name="fish-outline" size={21} color={colors.primary} />
          </View>

          <View style={styles.selectedFishInfo}>
            <Text
              style={[
                styles.selectedLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Selected Fish
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.selectedName,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {selectedFishData?.commonName ?? "Goldfish"}
            </Text>
          </View>

          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/plant-result",
              params: {
                fish: selectedFish,
              },
            })
          }
        >
          <Ionicons name="leaf-outline" size={21} color="#FFFFFF" />

          <Text style={styles.buttonText}>Show Compatible Plants</Text>

          <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  /* HERO */

  heroCard: {
    borderRadius: 22,
    borderWidth: 1,

    padding: 18,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,

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
    width: 58,
    height: 58,
    borderRadius: 29,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  heroEmoji: {
    fontSize: 30,
  },

  heroTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  /* SEARCH */

  searchContainer: {
    height: 54,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 20,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    marginLeft: 10,

    fontSize: 15,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
    paddingRight: 15,
  },

  countBadge: {
    minWidth: 34,
    height: 34,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    fontSize: 13,
    fontWeight: "800",
  },

  /* FISH CARD */

  card: {
    width: "48.5%",

    borderRadius: 18,
    borderWidth: 1,

    overflow: "hidden",

    marginBottom: 14,
  },

  imageContainer: {
    width: "100%",
    height: 125,

    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  selectedBadge: {
    position: "absolute",

    top: 9,
    right: 9,

    width: 28,
    height: 28,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
  },

  cardContent: {
    padding: 11,
  },

  cardTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",

    minHeight: 38,
  },

  selectIndicator: {
    flexDirection: "row",
    alignItems: "center",

    alignSelf: "flex-start",

    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 5,

    marginTop: 8,
  },

  selectText: {
    fontSize: 10,
    fontWeight: "700",

    marginLeft: 4,
  },

  /* EMPTY */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 70,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 80,
    height: 80,

    borderRadius: 40,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",

    marginTop: 15,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    marginTop: 6,
  },

  /* BOTTOM */

  bottomContainer: {
    borderTopWidth: 2,

    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 50,
  },

  selectedFishCard: {
    minHeight: 52,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 11,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 9,
  },

  selectedFishIcon: {
    width: 36,
    height: 36,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
  },

  selectedFishInfo: {
    flex: 1,

    marginLeft: 9,
  },

  selectedLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  selectedName: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 1,
  },

  button: {
    height: 54,

    borderRadius: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "800",

    marginHorizontal: 8,
  },
});
