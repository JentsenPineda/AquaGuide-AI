// app/(tabs)/library.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
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

export default function LibraryScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

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
      const keyword = search.toLowerCase();

      return (
        fish.commonName.toLowerCase().includes(keyword) ||
        fish.scientificName.toLowerCase().includes(keyword)
      );
    });
  }, [fishData, search]);

  const renderFishCard = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/fish/[id]",
          params: {
            id: item.id,
          },
        })
      }
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      <View style={styles.overlay} />

      <View style={styles.cardContent}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>

        <Text numberOfLines={1} style={styles.name}>
          {item.commonName}
        </Text>

        <Text numberOfLines={1} style={styles.scientific}>
          {item.scientificName}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="water" size={14} color="#00E5FF" />
            <Text style={styles.infoText}>{item.pH}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="thermometer" size={14} color="#FFB300" />
            <Text style={styles.infoText}>{item.temperature}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="resize" size={14} color="#8BC34A" />
            <Text style={styles.infoText}>{item.tankSize}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
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

          <Ionicons name="arrow-forward" color="#fff" size={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Species Library</Text>

        <Text style={styles.subtitle}>
          Explore ornamental fish species with AI-powered care information.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />

        <TextInput
          placeholder="Search fish..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredFish}
        keyExtractor={(item) => item.id}
        renderItem={renderFishCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="fish" size={24} color="#00BCD4" />
              <Text style={styles.statNumber}>{filteredFish.length}</Text>
              <Text style={styles.statLabel}>Species</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="leaf" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{beginnerFish.length}</Text>
              <Text style={styles.statLabel}>Beginner</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="flask" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>{intermediateFish.length}</Text>
              <Text style={styles.statLabel}>Intermediate</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="diamond" size={24} color="#E91E63" />
              <Text style={styles.statNumber}>{expertFish.length}</Text>
              <Text style={styles.statLabel}>Expert</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={70} color="#BDBDBD" />

            <Text style={styles.emptyTitle}>No Fish Found</Text>

            <Text style={styles.emptySubtitle}>
              Try searching with another keyword.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FAFC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
  },

  subtitle: {
    marginTop: 5,
    color: "#607D8B",
    fontSize: 15,
    lineHeight: 21,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
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
    color: "#222",
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    minWidth: 10,
    paddingHorizontal: 8,
    height: 44,
    marginHorizontal: 1,
    borderRadius: 22,
    backgroundColor: "#E8F7FA",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCategory: {
    backgroundColor: "#00BCD4",
  },

  categoryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#008AA3",
    textAlign: "center",
  },

  activeCategoryText: {
    color: "#fff",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 22,
  },

  statCard: {
    width: "23%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003B57",
    marginTop: 6,
  },

  statLabel: {
    fontSize: 11,
    color: "#78909C",
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 22,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 210,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  cardContent: {
    padding: 18,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F7FA",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 10,
  },

  badgeText: {
    color: "#0097A7",
    fontWeight: "700",
    fontSize: 12,
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003B57",
  },

  scientific: {
    marginTop: 4,
    fontSize: 15,
    color: "#78909C",
    fontStyle: "italic",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 18,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4FBFD",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  infoText: {
    marginLeft: 6,
    color: "#455A64",
    fontWeight: "600",
    fontSize: 13,
  },

  button: {
    backgroundColor: "#00BCD4",
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
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
    color: "#37474F",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#90A4AE",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});
