import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { allFish } from "../data/allFish";

export default function BreedingGuide() {
  const [selectedFish, setSelectedFish] = useState("");

  return (
    <View style={styles.safe}>
      <AppHeader title="Breeding Guide" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🧬 Fish Breeding Guide </Text>
          <Text style={styles.heroSubtitle}>
            Learn breeding methods, fry care, and breeding tips for ornamental
            fish.
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
              pathname: "/breeding-result",
              params: {
                fish: selectedFish,
              },
            })
          }
        >
          <Text style={styles.generateText}>Generate Breeding Guide</Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  hero: {
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
    lineHeight: 22,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
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
    color: "#FFFFFF",
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
    marginTop: 15,
    marginBottom: 20,
  },

  generateText: {
    color: "#08141F",
    fontSize: 16,
    fontWeight: "800",
  },

  resultCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 20,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: {
    color: "#00D4FF",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "700",
  },

  value: {
    color: "#FFFFFF",
  },

  listItem: {
    color: "#CFD8DC",
    marginBottom: 5,
  },

  tip: {
    color: "#CFD8DC",
    lineHeight: 22,
    marginTop: 5,
  },
});
