import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import ThemeChip from "@/components/chips/ThemeChip";
import ThemeInput from "@/components/inputs/ThemeInput";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { fishCareDatabase } from "../data/fishCareDatabase";

import { allFish } from "../data/allFish";
import { fishProfiles } from "../data/fishProfiles";

export default function TankCareScreen() {
  const colors = useAppColors();
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
  const dynamicStyles = {
    safe: {
      backgroundColor: colors.background,
    },

    hero: {
      backgroundColor: colors.card,
    },

    sectionTitle: {
      color: colors.textPrimary,
    },

    selectorCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    selectorActive: {
      borderColor: colors.primary,
    },

    input: {
      backgroundColor: colors.card,
      color: colors.textPrimary,
    },

    resultCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };
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
    <View style={[styles.safe, dynamicStyles.safe]}>
      <AppHeader title="Tank & Care" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}

        <ThemeCard style={[styles.hero, dynamicStyles.hero]}>
          <ThemeText variant="title">Tank & Pond Advisor</ThemeText>
          <ThemeText variant="subtitle" style={styles.heroSubtitle}>
            Get personalized aquarium and pond recommendations based on your
            fish species.
          </ThemeText>
        </ThemeCard>
        {/* SETUP TYPE */}

        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          Choose Environment
        </ThemeText>

        <View style={styles.row}>
          <Pressable
            style={{ width: "48%" }}
            onPress={() => setSetupType("Aquarium")}
          >
            <ThemeCard
              style={[
                styles.selectorCard,
                dynamicStyles.selectorCard,
                setupType === "Aquarium" && [
                  styles.selectorActive,
                  dynamicStyles.selectorActive,
                ],
              ]}
            >
              <ThemeText style={styles.selectorEmoji}>🐠</ThemeText>

              <ThemeText variant="body" style={styles.selectorTitle}>
                Aquarium
              </ThemeText>

              <ThemeText variant="caption" style={styles.selectorSubtitle}>
                Indoor Fish Tanks
              </ThemeText>
            </ThemeCard>
          </Pressable>

          <Pressable
            style={{ width: "48%" }}
            onPress={() => setSetupType("Pond")}
          >
            <ThemeCard
              style={[
                styles.selectorCard,
                dynamicStyles.selectorCard,
                setupType === "Pond" && [
                  styles.selectorActive,
                  dynamicStyles.selectorActive,
                ],
              ]}
            >
              <ThemeText style={styles.selectorEmoji}>🐟</ThemeText>

              <ThemeText variant="body" style={styles.selectorTitle}>
                Pond
              </ThemeText>

              <ThemeText variant="caption" style={styles.selectorSubtitle}>
                Outdoor Pond Setup
              </ThemeText>
            </ThemeCard>
          </Pressable>
        </View>

        {/* FISH SELECTION */}

        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          Choose Fish Species
        </ThemeText>

        <View style={styles.chipContainer}>
          {allFish
            .filter((fish) => {
              if (setupType === "Pond") {
                return fish.pondCompatible;
              }

              return true;
            })
            .map((fish) => (
              <ThemeChip
                key={fish.id}
                title={fish.commonName}
                selected={selectedFishId === fish.id}
                onPress={() => setSelectedFishId(fish.id)}
              />
            ))}
        </View>

        {/* FISH COUNT */}

        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          Number of Fish
        </ThemeText>

        <ThemeInput
          icon="fish"
          value={fishCount}
          onChangeText={setFishCount}
          keyboardType="numeric"
          placeholder="Enter fish quantity..."
        />

        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          {setupType === "Pond"
            ? "Pond Volume (Gallons)"
            : "Tank Size (Gallons)"}
        </ThemeText>

        <ThemeInput
          icon="water"
          value={userTankSize}
          onChangeText={setUserTankSize}
          keyboardType="numeric"
          placeholder={
            setupType === "Pond" ? "Enter pond volume..." : "Enter tank size..."
          }
        />
        {/* BUTTON */}

        <ThemeButton
          title="Generate Recommendation"
          onPress={generateRecommendation}
          style={styles.generateButton}
        />

        {/* RESULT */}

        {showResult && selectedFish && careData && (
          <ThemeCard style={[styles.resultCard, dynamicStyles.resultCard]}>
            <ThemeText variant="title">
              {setupType === "Pond"
                ? `🐟 ${selectedFish.commonName} Pond Recommendation`
                : `🐠 ${selectedFish.commonName}`}
            </ThemeText>
            <ThemeText variant="subtitle">Category</ThemeText>
            <ThemeText variant="body">{selectedFish.category}</ThemeText>
            <ThemeText variant="subtitle">Recommended Size</ThemeText>
            <ThemeText variant="body">
              {recommendedVolume.toLocaleString()} Gallons
            </ThemeText>
            <ThemeText variant="subtitle">Your Setup Size</ThemeText>

            <ThemeText variant="body">{actualVolume} Gallons</ThemeText>

            <ThemeText variant="subtitle">Stocking Status</ThemeText>
            <ThemeText
              variant="body"
              style={{
                color: stockingStatus === "Suitable" ? "#4CAF50" : "#FF6B6B",
              }}
            >
              {stockingStatus === "Suitable" ? "✅ Suitable" : "⚠ Overcrowded"}
            </ThemeText>
            <ThemeText variant="subtitle">Temperature</ThemeText>

            <ThemeText variant="body">
              {careData.idealTemperature ?? selectedFish.temperature}
            </ThemeText>
            <ThemeText variant="subtitle">pH</ThemeText>

            <ThemeText variant="body">
              {careData.idealPH ?? selectedFish.pH}
            </ThemeText>
            <ThemeText variant="subtitle">Diet</ThemeText>

            <ThemeText variant="body">{selectedFish.diet}</ThemeText>
            <ThemeText variant="subtitle">Difficulty</ThemeText>

            <ThemeText variant="body">{careData.difficulty}</ThemeText>
            <ThemeText variant="subtitle">Maintenance Level</ThemeText>

            <ThemeText variant="body">
              {careData.maintenanceLevel ?? "Moderate"}
            </ThemeText>
            <ThemeText variant="subtitle">Feeding Schedule</ThemeText>

            <ThemeText variant="body">{careData.feedingFrequency}</ThemeText>
            <ThemeText variant="subtitle">Water Change</ThemeText>

            <ThemeText variant="body">{careData.waterChange}</ThemeText>
            <ThemeText variant="subtitle">Filtration</ThemeText>

            <ThemeText variant="body">{careData.filtration}</ThemeText>
            <ThemeText variant="subtitle">Compatibility</ThemeText>

            <ThemeText variant="body">{careData.compatibility}</ThemeText>
            <ThemeText variant="subtitle">AquaGuide AI Analysis</ThemeText>
            <ThemeText variant="body" style={styles.aiRecommendation}>
              Based on {quantity} {selectedFish.commonName}
              {quantity > 1 ? "s" : ""}, AquaGuide AI recommends a minimum
              system volume of {recommendedVolume} gallons. Proper filtration,
              feeding schedule, and regular maintenance are required for healthy
              growth and disease prevention.
            </ThemeText>
            <ThemeText variant="subtitle">Recommended Equipment</ThemeText>
            {profile?.equipment?.map((item) => (
              <ThemeText key={item} variant="body">
                ✓ {item}
              </ThemeText>
            ))}
            <ThemeText variant="subtitle">Expert Recommendation</ThemeText>
            <ThemeText variant="body" style={styles.aiRecommendation}>
              {careData.aiAdvice ??
                profile?.aiRecommendation ??
                "Maintain stable water quality and perform regular maintenance."}
            </ThemeText>
          </ThemeCard>
        )}

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
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    minHeight: 145,
  },

  selectorActive: {
    borderColor: "#00D4FF",
  },

  selectorEmoji: {
    fontSize: 34,
    marginBottom: 12,
  },

  selectorTitle: {
    fontWeight: "700",
    textAlign: "center",
  },

  selectorSubtitle: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  generateButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
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
