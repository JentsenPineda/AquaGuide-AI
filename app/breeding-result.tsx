import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { breedingDatabase } from "../data/breedingDatabase";

export default function BreedingResult() {
  const { fish } = useLocalSearchParams();

  const guide = breedingDatabase[fish as keyof typeof breedingDatabase];

  if (!guide) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Breeding guide not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🐟 {guide.name}</Text>

        <Text style={styles.subtitle}>Step-by-Step Breeding Guide</Text>

        {guide.steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP {index + 1}</Text>

            <Text style={styles.stepTitle}>{step.title}</Text>

            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚠ Common Mistakes</Text>

          {guide.mistakes?.map((mistake: string) => (
            <Text key={mistake} style={styles.listItem}>
              ✗ {mistake}
            </Text>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🐣 Fry Care</Text>

          {guide.fryCare?.map((tip: string) => (
            <Text key={tip} style={styles.listItem}>
              ✓ {tip}
            </Text>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💡 Pro Tip</Text>

          <Text style={styles.tipText}>{guide.tip}</Text>
        </View>

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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    color: "#B0BEC5",
    marginBottom: 20,
  },

  stepCard: {
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  stepTitle: {
    color: "#00D4FF",
    fontWeight: "700",
    marginBottom: 6,
  },

  stepText: {
    color: "#FFFFFF",
    lineHeight: 22,
  },

  sectionCard: {
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 16,
    marginTop: 15,
  },

  sectionTitle: {
    color: "#00D4FF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  listItem: {
    color: "#FFFFFF",
    marginBottom: 6,
  },

  tipText: {
    color: "#CFD8DC",
    lineHeight: 22,
  },

  stepNumber: {
    color: "#00D4FF",
    fontWeight: "700",
    marginBottom: 6,
  },

  stepDescription: {
    color: "#CFD8DC",
    lineHeight: 22,
  },
});
