import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allFish } from "../../data/allFish";
import { fishImages } from "../../data/fishImages";

export default function LibraryScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const filteredFish = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return allFish;

    return allFish.filter(
      (fish) =>
        fish.commonName.toLowerCase().includes(q) ||
        fish.scientificName.toLowerCase().includes(q),
    );
  }, [search]);

  const beginnerFish = filteredFish.filter(
    (fish) => fish.category === "Beginner",
  );

  const intermediateFish = filteredFish.filter(
    (fish) => fish.category === "Intermediate",
  );

  const expertFish = filteredFish.filter((fish) => fish.category === "Expert");

  const renderFishCard = (fish: any) => (
    <Pressable
      key={fish.id}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() =>
        router.push({
          pathname: "/fish/[id]",
          params: { id: fish.id },
        })
      }
    >
      <Image
        source={fishImages[fish.id as keyof typeof fishImages]}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.fishName}>{fish.commonName}</Text>

        <Text style={styles.scientificName}>{fish.scientificName}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{fish.category}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="water-outline" size={14} color="#00BCD4" />
            <Text style={styles.infoText}>{fish.tankSize}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="thermometer-outline" size={14} color="#00BCD4" />
            <Text style={styles.infoText}>{fish.temperature}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Species Library</Text>

          <Text style={styles.subtitle}>
            Explore 15 ornamental fish species approved for AquaGuide AI.
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#90A4AE" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search fish..."
            placeholderTextColor="#90A4AE"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionTitle}>🐟 Beginner Fish</Text>

        {beginnerFish.map(renderFishCard)}

        <Text style={styles.sectionTitle}>🐠 Intermediate Fish</Text>

        {intermediateFish.map(renderFishCard)}

        <Text style={styles.sectionTitle}>🐡 Expert Fish</Text>

        {expertFish.map(renderFishCard)}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    padding: 20,
  },

  hero: {
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#B0BEC5",
    marginTop: 8,
    lineHeight: 22,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#102331",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    padding: 14,
  },

  sectionTitle: {
    color: "#00BCD4",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 16,
  },

  fishName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  scientificName: {
    color: "#90CAF9",
    marginTop: 4,
    fontStyle: "italic",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#00BCD4",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  infoContainer: {
    marginTop: 15,
    gap: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    color: "#CFD8DC",
    marginLeft: 8,
    fontSize: 13,
  },
});
