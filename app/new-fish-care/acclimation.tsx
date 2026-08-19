// app/(tabs)/new-fish-care/acclimation.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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

  const scrollRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep],
  );

  const goToNextStep = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      setCurrentStep((previous) => previous + 1);
    }, 120);
  };

  const continueToInspection = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      router.push("/new-fish-care/inspection");
    }, 150);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="New Fish Care" showBack />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: TAB_BAR_HEIGHT + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP */}

        <View style={styles.stepHeader}>
          <View>
            <ThemeText
              variant="subtitle"
              style={[
                styles.stepLabel,
                {
                  color: colors.primary,
                },
              ]}
            >
              ACCLIMATION
            </ThemeText>

            <ThemeText variant="body" style={styles.stepCount}>
              Step {currentStep + 1} of {steps.length}
            </ThemeText>
          </View>

          <View
            style={[
              styles.stepBadge,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <ThemeText
              variant="subtitle"
              style={[
                styles.stepBadgeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {Math.round(progress)}%
            </ThemeText>
          </View>
        </View>

        <View
          style={[
            styles.progressBackground,
            {
              backgroundColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        {/* HERO */}

        <ThemeCard style={styles.hero}>
          <View
            style={[
              styles.heroIconContainer,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons
              name={step.icon as any}
              size={64}
              color={colors.primary}
            />
          </View>
        </ThemeCard>

        {/* TITLE */}

        <ThemeText variant="title" style={styles.title}>
          {step.title}
        </ThemeText>

        {/* DURATION */}

        <ThemeCard style={styles.durationCard}>
          <View
            style={[
              styles.durationIcon,
              {
                backgroundColor: "#FF980018",
              },
            ]}
          >
            <Ionicons name="time-outline" size={22} color="#FF9800" />
          </View>

          <View style={styles.durationContent}>
            <ThemeText
              variant="body"
              style={[
                styles.durationLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Recommended Time
            </ThemeText>

            <ThemeText
              variant="subtitle"
              style={[
                styles.durationValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {step.duration}
            </ThemeText>
          </View>
        </ThemeCard>

        {/* WHAT TO DO */}

        <View style={styles.sectionHeader}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            What To Do
          </ThemeText>
        </View>

        <ThemeCard style={styles.card}>
          <ThemeText
            variant="body"
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {step.description}
          </ThemeText>
        </ThemeCard>

        {/* WHY */}

        <View
          style={[
            styles.whyCard,
            {
              backgroundColor: colors.primary + "0D",
              borderColor: colors.primary + "25",
            },
          ]}
        >
          <View
            style={[
              styles.whyIcon,
              {
                backgroundColor: colors.primary + "16",
              },
            ]}
          >
            <Ionicons name="bulb-outline" size={22} color={colors.primary} />
          </View>

          <View style={styles.whyContent}>
            <ThemeText variant="subtitle" style={styles.whyTitle}>
              Why This Step Matters
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.whyText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {step.why}
            </ThemeText>
          </View>
        </View>

        {/* NAVIGATION */}

        {currentStep < steps.length - 1 ? (
          <ThemeButton
            title="Next Step"
            onPress={goToNextStep}
            style={styles.button}
          />
        ) : (
          <ThemeButton
            title="Continue to Health Inspection"
            onPress={continueToInspection}
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
  },

  content: {
    padding: 18,
  },

  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stepLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  stepCount: {
    fontSize: 13,
    marginTop: 2,
  },

  stepBadge: {
    minWidth: 50,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  stepBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  progressBackground: {
    height: 8,
    borderRadius: 20,
    marginTop: 13,
    marginBottom: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: 8,
    borderRadius: 20,
  },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18,
  },

  durationCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  durationIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  durationContent: {
    flex: 1,
    marginLeft: 12,
  },

  durationLabel: {
    fontSize: 12,
  },

  durationValue: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 3,
  },

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    padding: 19,
    marginBottom: 16,
  },

  description: {
    fontSize: 15,
    lineHeight: 25,
  },

  whyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginBottom: 26,
  },

  whyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  whyContent: {
    flex: 1,
    marginLeft: 12,
  },

  whyTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  whyText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  button: {
    height: 56,
    borderRadius: 17,
  },
});
