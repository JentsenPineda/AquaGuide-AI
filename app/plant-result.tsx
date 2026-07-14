import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fishPlantCompatibility } from "../data/fishPlantCompatibility";
import { plantDatabase } from "../data/plantDatabase";

export default function PlantResult() {
  const { fish } = useLocalSearchParams();

  const plants =
    fishPlantCompatibility[fish as keyof typeof fishPlantCompatibility] || [];

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Compatible Plants" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🌿 Compatible Plants</Text>

          <Text style={styles.heroSubtitle}>
            Recommended aquatic plants for your selected fish species.
          </Text>
        </View>

        {plants.map((plantId) => {
          const plant = plantDatabase[plantId as keyof typeof plantDatabase];

          if (!plant) return null;

          return (
            <View key={plantId} style={styles.card}>
              <Image
                source={plant.image}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.info}>
                <Text style={styles.name}>{plant.name}</Text>

                <Text style={styles.detail}>
                  Difficulty: {plant.difficulty}
                </Text>

                <Text style={styles.detail}>Lighting: {plant.lighting}</Text>

                <Text style={styles.detail}>
                  Growth Rate: {plant.growthRate}
                </Text>

                <Text style={styles.detail}>CO₂: {plant.co2}</Text>

                <Text style={styles.detail}>Placement: {plant.placement}</Text>
              </View>
            </View>
          );
        })}
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
    fontSize: 26,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 180,
  },

  info: {
    padding: 15,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detail: {
    color: "#CFD8DC",
    marginBottom: 5,
  },
});
