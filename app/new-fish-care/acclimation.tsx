// app/(tabs)/new-fish-care/acclimation.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
const steps = [
  {
    icon: "water",
    title: "Float the Sealed Bag",
    duration: "15–20 Minutes",
    description:
      "Place the unopened fish bag on the surface of your aquarium. This allows the temperature inside the bag to slowly match your aquarium water.",
    why: "Prevents sudden temperature shock that may stress or kill the fish.",
  },

  {
    icon: "flask",
    title: "Slowly Add Aquarium Water",
    duration: "20–30 Minutes",
    description:
      "Open the bag and add a small amount of aquarium water every 5 minutes until the volume inside the bag doubles.",
    why: "Allows your fish to gradually adjust to the new pH, hardness, and water chemistry.",
  },

  {
    icon: "repeat",
    title: "Continue Mixing Water",
    duration: "10–15 Minutes",
    description:
      "Repeat adding small amounts of water several times until the fish is fully acclimated.",
    why: "Reduces osmotic stress and prevents water shock.",
  },

  {
    icon: "fish",
    title: "Transfer Using a Fish Net",
    duration: "1 Minute",
    description: "Use a fish net to gently move your fish into the aquarium.",
    why: "Never pour the pet store water into your aquarium because it may contain parasites, bacteria, or medications.",
  },

  {
    icon: "moon",
    title: "Let Your Fish Rest",
    duration: "24 Hours",
    description:
      "Keep aquarium lights OFF for several hours. Avoid feeding immediately and observe your fish quietly.",
    why: "This minimizes stress while allowing the fish to adapt to its new environment.",
  },
];

export default function AcclimationScreen() {
  const colors = useAppColors();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const progress = useMemo(() => {
    return ((currentStep + 1) / steps.length) * 100;
  }, [currentStep]);
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    durationCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    hero: {
      backgroundColor: colors.card,
    },

    textPrimary: {
      color: colors.textPrimary,
    },
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="New Fish Care" showBack />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemeText variant="subtitle" style={styles.step}>
          STEP {currentStep + 1} OF {steps.length}
        </ThemeText>

        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <ThemeCard style={[styles.hero, dynamicStyles.hero]}>
          <Ionicons name={step.icon as any} size={80} color={colors.primary} />
        </ThemeCard>

        <ThemeText variant="title" style={styles.title}>
          {step.title}
        </ThemeText>
        <ThemeCard style={[styles.durationCard, dynamicStyles.durationCard]}>
          <Ionicons name="time" size={24} color="#FF9800" />

          <ThemeText variant="subtitle" style={styles.duration}>
            Recommended Time
          </ThemeText>

          <ThemeText variant="title" style={styles.durationValue}>
            {step.duration}
          </ThemeText>
        </ThemeCard>

        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <ThemeText variant="subtitle" style={styles.heading}>
            What To Do
          </ThemeText>
          <ThemeText variant="body" style={styles.description}>
            {step.description}
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={styles.tipCard}>
          <Ionicons name="bulb" size={28} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemeText variant="subtitle" style={styles.tipTitle}>
              Why This Step Matters
            </ThemeText>

            <ThemeText variant="body" style={styles.tipText}>
              {step.why}
            </ThemeText>
          </View>
        </ThemeCard>

        {currentStep < steps.length - 1 ? (
          <ThemeButton
            title="Next Step"
            onPress={() => setCurrentStep(currentStep + 1)}
            style={styles.button}
          />
        ) : (
          <ThemeButton
            title="Continue"
            onPress={() => router.push("/new-fish-care/inspection")}
            style={styles.button}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FBFD",
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  step: {
    textAlign: "center",
    color: "#00BCD4",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  progressBackground: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#D9EEF3",
    marginTop: 15,
    marginBottom: 30,
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#00BCD4",
  },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    borderRadius: 24,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
  },

  durationCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },

  duration: {
    marginTop: 8,
    fontSize: 15,
    opacity: 0.8,
  },

  durationValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: "#FF9800",
  },

  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.85,
  },

  tipCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  tipText: {
    fontSize: 15,
    lineHeight: 23,
    opacity: 0.85,
  },

  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
