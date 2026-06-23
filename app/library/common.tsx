import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allFish } from "../../data/allFish";

export default function SpeciesLibrary() {
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🐟 Species Library</Text>

        <Text style={styles.subtitle}>
          Browse ornamental fish species and care information.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9CA3AF" />

          <TextInput
            placeholder="Search fish..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>

        {filteredFish.map((fish) => (
          <Pressable key={fish.id} style={styles.card}>
            <Text style={styles.fishName}>{fish.commonName}</Text>

            <Text style={styles.scientificName}>{fish.scientificName}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{fish.category}</Text>
            </View>

            <Text style={styles.info}>Lifespan: {fish.lifespan}</Text>

            <Text style={styles.info}>Tank Size: {fish.tankSize}</Text>

            <Text style={styles.info}>Temperature: {fish.temperature}</Text>

            <Text style={styles.info}>pH Level: {fish.ph}</Text>
          </Pressable>
        ))}

        <View style={{ height: 30 }} />
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  subtitle: {
    color: "#B0BEC5",
    marginBottom: 20,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#102331",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    padding: 12,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  fishName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  scientificName: {
    color: "#90CAF9",
    marginBottom: 10,
    fontStyle: "italic",
  },

  badge: {
    backgroundColor: "#00BCD4",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  info: {
    color: "#CFD8DC",
    marginTop: 4,
  },
});
