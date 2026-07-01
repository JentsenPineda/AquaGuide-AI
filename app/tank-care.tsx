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
import { fishCareDatabase } from "../data/fishCareDatabase";

import { allFish } from "../data/allFish";
import { fishProfiles } from "../data/fishProfiles";

export default function TankCareScreen() {
  const [setupType, setSetupType] = useState<"Aquarium" | "Pond">("Aquarium");

  const [selectedFishId, setSelectedFishId] = useState("goldfish");

  const [fishCount, setFishCount] = useState("");
  const [userTankSize, setUserTankSize] = useState("");

  const [showResult, setShowResult] = useState(false);

  const selectedFish = useMemo(
    () => allFish.find((fish) => fish.id === selectedFishId),
    [selectedFishId],
  );
  const availableFish = useMemo(() => {
    if (setupType === "Pond") {
      return allFish.filter((fish) => fish.pondCompatible);
    }

    return allFish;
  }, [setupType]);
  const profile = fishProfiles[selectedFishId as keyof typeof fishProfiles];

  const careData =
    fishCareDatabase[selectedFishId as keyof typeof fishCareDatabase];

  const quantity = Number(fishCount) || 1;

  const recommendedVolume = careData?.gallonsPerFish
    ? careData.gallonsPerFish * quantity
    : 0;
  const actualVolume = Number(userTankSize) || 0;

  const stockingStatus =
    actualVolume >= recommendedVolume ? "Suitable" : "Overcrowded";
  const environmentMismatch =
    careData &&
    ((setupType === "Aquarium" && careData.environment === "Pond") ||
      (setupType === "Pond" && careData.environment === "Aquarium"));

  const generateRecommendation = () => {
    if (!fishCount) {
      alert("Please enter the number of fish.");
      return;
    }

    if (!userTankSize) {
      alert(
        setupType === "Pond"
          ? "Please enter pond volume."
          : "Please enter tank size.",
      );
      return;
    }

    setShowResult(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🐠 Tank & Pond Advisor</Text>

          <Text style={styles.heroSubtitle}>
            Get personalized aquarium and pond recommendations based on your
            fish species.
          </Text>
        </View>

        {/* SETUP TYPE */}

        <Text style={styles.sectionTitle}>Choose Environment</Text>

        <View style={styles.row}>
          <Pressable
            onPress={() => setSetupType("Aquarium")}
            style={[
              styles.selectorCard,
              setupType === "Aquarium" && styles.selectorActive,
            ]}
          >
            <Text style={styles.selectorEmoji}>🐠</Text>

            <Text style={styles.selectorTitle}>Aquarium</Text>

            <Text style={styles.selectorSubtitle}>Indoor Fish Tanks</Text>
          </Pressable>

          <Pressable
            onPress={() => setSetupType("Pond")}
            style={[
              styles.selectorCard,
              setupType === "Pond" && styles.selectorActive,
            ]}
          >
            <Text style={styles.selectorEmoji}>🐟</Text>

            <Text style={styles.selectorTitle}>Pond</Text>

            <Text style={styles.selectorSubtitle}>Outdoor Pond Setup</Text>
          </Pressable>
        </View>

        {/* FISH SELECTION */}

        <Text style={styles.sectionTitle}>Choose Fish Species</Text>

        <View style={styles.chipContainer}>
          {allFish
            .filter((fish) => {
              if (setupType === "Pond") {
                return fish.pondCompatible;
              }

              return true;
            })
            .map((fish) => (
              <Pressable
                key={fish.id}
                onPress={() => setSelectedFishId(fish.id)}
                style={[
                  styles.chip,
                  selectedFishId === fish.id && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedFishId === fish.id && styles.chipTextActive,
                  ]}
                >
                  {fish.commonName}
                </Text>
              </Pressable>
            ))}
        </View>

        {/* FISH COUNT */}

        <Text style={styles.sectionTitle}>Number of Fish</Text>

        <TextInput
          value={fishCount}
          onChangeText={setFishCount}
          keyboardType="numeric"
          placeholder="Enter fish quantity..."
          placeholderTextColor="#8AA4B2"
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>
          {setupType === "Pond"
            ? "Pond Volume (Gallons)"
            : "Tank Size (Gallons)"}
        </Text>

        <TextInput
          value={userTankSize}
          onChangeText={setUserTankSize}
          keyboardType="numeric"
          placeholder={
            setupType === "Pond" ? "Enter pond volume..." : "Enter tank size..."
          }
          placeholderTextColor="#8AA4B2"
          style={styles.input}
        />

        {/* BUTTON */}

        <Pressable
          style={styles.generateButton}
          onPress={generateRecommendation}
        >
          <Text style={styles.generateText}>Generate Recommendation</Text>
        </Pressable>

        {/* RESULT */}

        {showResult && selectedFish && careData && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {setupType === "Pond"
                ? `🐟 ${selectedFish.commonName} Pond Recommendation`
                : `🐠 ${selectedFish.commonName}`}
            </Text>
            <Text style={styles.resultLabel}>Category</Text>
            <Text style={styles.resultValue}>{selectedFish.category}</Text>
            <Text style={styles.resultLabel}>Recommended Size</Text>
            <Text style={styles.resultValue}>
              {recommendedVolume.toLocaleString()} Gallons
            </Text>
            <Text style={styles.resultLabel}>Your Setup Size</Text>

            <Text style={styles.resultValue}>{actualVolume} Gallons</Text>

            <Text style={styles.resultLabel}>Stocking Status</Text>

            <Text
              style={[
                styles.resultValue,
                {
                  color: stockingStatus === "Suitable" ? "#4CAF50" : "#FF6B6B",
                },
              ]}
            >
              {stockingStatus === "Suitable" ? "✅ Suitable" : "⚠ Overcrowded"}
            </Text>
            <Text style={styles.resultLabel}>Temperature</Text>
            <Text style={styles.resultValue}>
              {careData.idealTemperature ?? selectedFish.temperature}
            </Text>
            <Text style={styles.resultLabel}>pH</Text>
            <Text style={styles.resultValue}>
              {careData.idealPH ?? selectedFish.pH}
            </Text>
            <Text style={styles.resultLabel}>Diet</Text>
            <Text style={styles.resultValue}>{selectedFish.diet}</Text>
            <Text style={styles.resultLabel}>Difficulty</Text>
            <Text style={styles.resultValue}>{careData.difficulty}</Text>
            <Text style={styles.resultLabel}>Maintenance Level</Text>
            <Text style={styles.resultValue}>
              {careData.maintenanceLevel ?? "Moderate"}
            </Text>
            <Text style={styles.resultLabel}>Feeding Schedule</Text>
            <Text style={styles.resultValue}>{careData.feedingFrequency}</Text>
            <Text style={styles.resultLabel}>Water Change</Text>
            <Text style={styles.resultValue}>{careData.waterChange}</Text>
            <Text style={styles.resultLabel}>Filtration</Text>
            <Text style={styles.resultValue}>{careData.filtration}</Text>
            <Text style={styles.resultLabel}>Compatibility</Text>
            <Text style={styles.resultValue}>{careData.compatibility}</Text>
            <Text style={styles.resultLabel}>AquaGuide AI Analysis</Text>
            <Text style={styles.aiRecommendation}>
              Based on {quantity} {selectedFish.commonName}
              {quantity > 1 ? "s" : ""}, AquaGuide AI recommends a minimum
              system volume of {recommendedVolume} gallons. Proper filtration,
              feeding schedule, and regular maintenance are required for healthy
              growth and disease prevention.
            </Text>
            <Text style={styles.resultLabel}>Recommended Equipment</Text>
            {profile?.equipment?.map((item) => (
              <Text key={item} style={styles.equipment}>
                ✓ {item}
              </Text>
            ))}
            <Text style={styles.resultLabel}>Expert Recommendation</Text>
            <Text style={styles.aiRecommendation}>
              {careData.aiAdvice ??
                profile?.aiRecommendation ??
                "Maintain stable water quality and perform regular maintenance."}
            </Text>
          </View>
        )}

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
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 10,
    lineHeight: 22,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  selectorCard: {
    width: "48%",
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  selectorActive: {
    borderColor: "#00D4FF",
  },

  selectorEmoji: {
    fontSize: 30,
  },

  selectorTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 10,
  },

  selectorSubtitle: {
    color: "#B0BEC5",
    marginTop: 4,
    fontSize: 12,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  chip: {
    backgroundColor: "#102331",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: "#00D4FF",
  },

  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  chipTextActive: {
    color: "#08141F",
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#102331",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    color: "#FFFFFF",
    marginBottom: 20,
  },

  generateButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  generateText: {
    color: "#08141F",
    fontWeight: "800",
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  resultLabel: {
    color: "#00D4FF",
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "700",
  },

  resultValue: {
    color: "#FFFFFF",
  },

  equipment: {
    color: "#FFFFFF",
    marginBottom: 4,
  },

  aiRecommendation: {
    color: "#CFD8DC",
    lineHeight: 22,
    marginTop: 6,
  },
});
