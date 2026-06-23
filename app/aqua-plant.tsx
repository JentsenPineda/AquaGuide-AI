import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { allFish } from "../data/allFish";

export default function AquaPlants() {
  const [selectedFish, setSelectedFish] = useState("goldfish");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🌿 Aqua Plant Guide</Text>

          <Text style={styles.heroSubtitle}>
            Discover aquatic plants compatible with your ornamental fish.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Fish Species</Text>

        <View style={styles.chipContainer}>
          {allFish.map((fish) => (
            <Pressable
              key={fish.id}
              onPress={() => setSelectedFish(fish.id)}
              style={[
                styles.chip,
                selectedFish === fish.id && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFish === fish.id && styles.activeChipText,
                ]}
              >
                {fish.commonName}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.generateButton}
          onPress={() =>
            router.push({
              pathname: "/plant-result",
              params: {
                fish: selectedFish,
              },
            })
          }
        >
          <Text style={styles.generateText}>Generate Compatible Plants</Text>
        </Pressable>
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
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#102331",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#00D4FF",
  },

  chipText: {
    color: "#fff",
  },

  activeChipText: {
    color: "#08141F",
    fontWeight: "700",
  },

  generateButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },

  generateText: {
    color: "#08141F",
    fontWeight: "800",
    fontSize: 16,
  },
});
