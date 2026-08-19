import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { allFish } from "../../data/allFish";
import { beginnerFish } from "../../data/beginnerFish";
import { expertFish } from "../../data/expertFish";
import { intermediateFish } from "../../data/intermediateFish";

type Category = "All" | "Beginner" | "Intermediate" | "Expert";

const categories: Category[] = ["All", "Beginner", "Intermediate", "Expert"];

const getCategoryColors = (category: string) => {
  switch (category) {
    case "Beginner":
      return {
        background: "#E8F5E9",
        text: "#2E7D32",
      };

    case "Intermediate":
      return {
        background: "#FFF3E0",
        text: "#EF6C00",
      };

    case "Expert":
      return {
        background: "#FCE4EC",
        text: "#C2185B",
      };

    default:
      return {
        background: "#E8FAFD",
        text: "#008AA3",
      };
  }
};

const getFilterColors = (category: Category) => {
  switch (category) {
    case "Beginner":
      return {
        active: "#4CAF50",
        light: "#E8F5E9",
      };

    case "Intermediate":
      return {
        active: "#FF9800",
        light: "#FFF3E0",
      };

    case "Expert":
      return {
        active: "#E91E63",
        light: "#FCE4EC",
      };

    default:
      return {
        active: "#00BCD4",
        light: "#E8FAFD",
      };
  }
};

export default function LibraryScreen() {
  const colors = useAppColors();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const listRef = useRef<FlatList>(null);

  const fishData = useMemo(() => {
    switch (selectedCategory) {
      case "Beginner":
        return beginnerFish;

      case "Intermediate":
        return intermediateFish;

      case "Expert":
        return expertFish;

      default:
        return allFish;
    }
  }, [selectedCategory]);

  const filteredFish = useMemo(() => {
    return fishData.filter((fish) => {
      const keyword = search.toLowerCase().trim();

      return (
        fish.commonName.toLowerCase().includes(keyword) ||
        fish.scientificName.toLowerCase().includes(keyword)
      );
    });
  }, [fishData, search]);

  const renderFishCard = ({ item }: any) => {
    const categoryColors = getCategoryColors(item.category);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/fish/[id]",
            params: {
              id: item.id,
            },
          })
        }
      >
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />

          <View style={styles.overlay} />

          {/* CATEGORY BADGE ON IMAGE */}
          <View
            style={[
              styles.imageBadge,
              {
                backgroundColor: categoryColors.background,
              },
            ]}
          >
            <View
              style={[
                styles.categoryDot,
                {
                  backgroundColor: categoryColors.text,
                },
              ]}
            />

            <Text
              style={[
                styles.imageBadgeText,
                {
                  color: categoryColors.text,
                },
              ]}
            >
              {item.category}
            </Text>
          </View>
        </View>

        {/* CARD CONTENT */}
        <View style={styles.cardContent}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {item.commonName}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.scientific,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {item.scientificName}
          </Text>

          {/* INFO */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoItem,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Ionicons name="water" size={14} color="#00BCD4" />

              <Text
                style={[
                  styles.infoText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {item.pH}
              </Text>
            </View>

            <View
              style={[
                styles.infoItem,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Ionicons name="thermometer" size={14} color="#FFB300" />

              <Text
                style={[
                  styles.infoText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {item.temperature}
              </Text>
            </View>

            <View
              style={[
                styles.infoItem,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Ionicons name="resize" size={14} color="#8BC34A" />

              <Text
                style={[
                  styles.infoText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {item.tankSize}
              </Text>
            </View>
          </View>

          {/* VIEW DETAILS */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/fish/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <Text style={styles.buttonText}>View Details</Text>

            <Ionicons name="arrow-forward" color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Species Library" showBack={false} />

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
        <Ionicons name="search" size={20} color={colors.textSecondary} />

        <TextInput
          placeholder="Search fish..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            {
              color: colors.textPrimary,
            },
          ]}
        />
      </View>

      {/* CATEGORY FILTERS */}
      <View style={styles.categoryContainer}>
        {categories.map((item) => {
          const filterColors = getFilterColors(item);
          const isSelected = selectedCategory === item;

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                item === "Intermediate" && styles.intermediateButton,
                {
                  backgroundColor: isSelected
                    ? filterColors.active
                    : colors.surface,
                  borderColor: isSelected ? filterColors.active : colors.border,
                },
              ]}
              onPress={() => {
                setSelectedCategory(item);

                requestAnimationFrame(() => {
                  listRef.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                });
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isSelected ? "#FFFFFF" : colors.textPrimary,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* FISH LIST */}
      <FlatList
        ref={listRef}
        data={filteredFish}
        keyExtractor={(item) => item.id}
        renderItem={renderFishCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            {/* TOTAL */}
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="fish" size={24} color="#00BCD4" />

              <Text
                style={[
                  styles.statNumber,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {filteredFish.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Species
              </Text>
            </View>

            {/* BEGINNER */}
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="leaf" size={24} color="#4CAF50" />

              <Text
                style={[
                  styles.statNumber,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {beginnerFish.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Beginner
              </Text>
            </View>

            {/* INTERMEDIATE */}
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="flask" size={24} color="#FF9800" />

              <Text
                style={[
                  styles.statNumber,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {intermediateFish.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Intermediate
              </Text>
            </View>

            {/* EXPERT */}
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="diamond" size={24} color="#E91E63" />

              <Text
                style={[
                  styles.statNumber,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {expertFish.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Expert
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={70} color={colors.textMuted} />

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
                styles.emptySubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Try searching with another keyword.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 16,

    height: 55,

    flexDirection: "row",
    alignItems: "center",

    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 14,
    gap: 6,
  },

  categoryButton: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingHorizontal: 0,

    marginTop: 8,
    marginBottom: 18,
  },

  statCard: {
    width: "23%",

    borderRadius: 17,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 13,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  statNumber: {
    fontSize: 19,
    fontWeight: "800",
    marginTop: 5,
  },

  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,

    overflow: "hidden",

    marginBottom: 18,

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  imageContainer: {
    width: "100%",
    height: 150,

    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  imageBadge: {
    position: "absolute",

    top: 12,
    left: 12,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 20,

    paddingHorizontal: 11,
    paddingVertical: 6,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,

    marginRight: 6,
  },

  imageBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  cardContent: {
    padding: 15,
  },

  name: {
    fontSize: 21,
    fontWeight: "800",
  },

  scientific: {
    marginTop: 3,
    fontSize: 14,
    fontStyle: "italic",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 14,
    marginBottom: 14,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 12,

    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  infoText: {
    marginLeft: 5,

    fontWeight: "600",
    fontSize: 12,
  },

  button: {
    borderRadius: 13,

    height: 46,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginRight: 8,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: "700",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },

  intermediateButton: {
    minWidth: 105,
  },
});
