import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { allFish } from "../data/allFish";
import { fishCompatibility } from "../data/fishCompatibility";

export default function CompatibilityChecker() {
  const [fish1, setFish1] = useState("goldfish");
  const [fish2, setFish2] = useState("betta");

  const result = () => {
    const fish1Data =
      fishCompatibility[fish1 as keyof typeof fishCompatibility];

    const fish2Data =
      fishCompatibility[fish2 as keyof typeof fishCompatibility];

    if (fish1 === fish2) {
      return {
        status: "Compatible",
        reason:
          "Same species. These fish can generally live together when given enough space.",
      };
    }

    const incompatible =
      fish1Data.incompatible.includes("all") ||
      fish2Data.incompatible.includes("all") ||
      fish1Data.incompatible.includes(fish2) ||
      fish2Data.incompatible.includes(fish1);

    if (incompatible) {
      return {
        status: "Not Compatible",
        reason:
          "These species have different care requirements, aggression levels, or water parameters.",
      };
    }

    const compatible =
      fish1Data.compatible.includes(fish2) ||
      fish2Data.compatible.includes(fish1);

    if (compatible) {
      return {
        status: "Compatible",
        reason:
          "These species generally share similar care requirements and can live together.",
      };
    }

    return {
      status: "Use Caution",
      reason:
        "There is limited compatibility data. Monitor behavior carefully and provide adequate space.",
    };
  };
  const compatibilityResult = result();

  return (
    <View style={styles.safe}>
      <AppHeader title="Compatibility Checker" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Fish Compatibility Checker</Text>
        <Text style={styles.subtitle}>
          Check whether two fish species can live together.
        </Text>
        <Text style={styles.label}>Fish Species #1</Text>
        <View style={styles.chips}>
          {allFish.map((fish) => (
            <Pressable
              key={fish.id}
              onPress={() => setFish1(fish.id)}
              style={[styles.chip, fish1 === fish.id && styles.activeChip]}
            >
              <Text style={styles.chipText}>{fish.commonName}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Fish Species #2</Text>
        <View style={styles.chips}>
          {allFish.map((fish) => (
            <Pressable
              key={fish.id}
              onPress={() => setFish2(fish.id)}
              style={[styles.chip, fish2 === fish.id && styles.activeChip]}
            >
              <Text style={styles.chipText}>{fish.commonName}</Text>
            </Pressable>
          ))}
        </View>
        <View
          style={[
            styles.resultCard,
            {
              borderWidth: 2,
              borderColor:
                compatibilityResult.status === "Compatible"
                  ? "#22C55E"
                  : compatibilityResult.status === "Use Caution"
                    ? "#F59E0B"
                    : "#EF4444",
            },
          ]}
        >
          <Text
            style={[
              styles.resultStatus,
              {
                color:
                  compatibilityResult.status === "Compatible"
                    ? "#22C55E"
                    : compatibilityResult.status === "Use Caution"
                      ? "#F59E0B"
                      : "#EF4444",
              },
            ]}
          >
            {compatibilityResult.status === "Compatible"
              ? "✅ Compatible"
              : compatibilityResult.status === "Use Caution"
                ? "⚠ Use Caution"
                : "❌ Not Compatible"}
          </Text>

          <Text style={styles.reason}>{compatibilityResult.reason}</Text>
        </View>
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

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#B0BEC5",
    marginTop: 10,
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 15,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#102331",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#00D4FF",
  },

  chipText: {
    color: "#fff",
  },

  resultCard: {
    marginTop: 25,
    backgroundColor: "#102331",
    padding: 20,
    borderRadius: 20,
  },

  resultStatus: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 15,
  },

  reason: {
    color: "#B0BEC5",
    marginTop: 10,
    lineHeight: 22,
  },
});
