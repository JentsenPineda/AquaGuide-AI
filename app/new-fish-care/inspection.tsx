// app/(tabs)/new-fish-care/inspection.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const symptoms = [
  {
    id: 1,
    icon: "happy",
    title: "Swimming Normally",
    status: "Healthy",
    color: "#4CAF50",
    advice:
      "Great! Your fish appears to be adjusting well. Continue observing it over the next 24 hours and avoid overfeeding.",
  },

  {
    id: 2,
    icon: "bed",
    title: "Staying at the Bottom",
    status: "Mild Stress",
    color: "#FFC107",
    advice:
      "This is common after transportation. Keep the lights off, avoid disturbing the fish, and monitor it for the next several hours.",
  },

  {
    id: 3,
    icon: "alert-circle",
    title: "Rapid Breathing",
    status: "Warning",
    color: "#FF9800",
    advice:
      "Check oxygen levels, water temperature, and ammonia. Increase aeration if necessary.",
  },

  {
    id: 4,
    icon: "snow",
    title: "White Spots",
    status: "Possible Ich",
    color: "#F44336",
    advice:
      "Your fish may have Ich (White Spot Disease). Consider quarantining the fish and begin treatment immediately.",
  },

  {
    id: 5,
    icon: "close-circle",
    title: "Torn Fins",
    status: "Possible Injury",
    color: "#E91E63",
    advice:
      "Inspect for aggressive tank mates or sharp decorations. Maintain clean water to prevent infection.",
  },

  {
    id: 6,
    icon: "sad",
    title: "Not Eating",
    status: "Monitor",
    color: "#9C27B0",
    advice:
      "Do not panic. Many new fish refuse food during the first day. Wait 24 hours before becoming concerned.",
  },
];

export default function InspectionScreen() {
  const colors = useAppColors();

  const scrollRef = useRef<ScrollView>(null);

  const [selected, setSelected] = useState<(typeof symptoms)[number] | null>(
    null,
  );

  const recommendation = useMemo(() => selected, [selected]);

  const selectCondition = (item: (typeof symptoms)[number]) => {
    setSelected(item);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  const continueToFirstDay = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      router.push("/new-fish-care/first24hours");
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
        {/* HEADER */}

        <ThemeCard style={styles.header}>
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons
              name="search-circle-outline"
              size={52}
              color={colors.primary}
            />
          </View>

          <View
            style={[
              styles.stepBadge,
              {
                backgroundColor: colors.primary + "12",
              },
            ]}
          >
            <ThemeText
              variant="subtitle"
              style={[
                styles.stepText,
                {
                  color: colors.primary,
                },
              ]}
            >
              STEP 3 OF 5
            </ThemeText>
          </View>

          <ThemeText variant="title" style={styles.title}>
            Health Inspection
          </ThemeText>

          <ThemeText
            variant="body"
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Observe your fish after acclimation. Choose the condition that best
            matches its current behavior.
          </ThemeText>
        </ThemeCard>

        {/* SECTION */}

        <View style={styles.sectionHeader}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            What Do You Observe?
          </ThemeText>

          <ThemeText
            variant="body"
            style={[
              styles.sectionHint,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Select one condition
          </ThemeText>
        </View>

        {/* CONDITIONS */}

        {symptoms.map((item) => {
          const isSelected = selected?.id === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => selectCondition(item)}
              style={[
                styles.conditionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? item.color : colors.border,
                },
                isSelected && {
                  borderWidth: 2,
                },
              ]}
            >
              <View
                style={[
                  styles.conditionIcon,
                  {
                    backgroundColor: item.color + "18",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color={item.color}
                />
              </View>

              <View style={styles.conditionContent}>
                <ThemeText variant="subtitle" style={styles.conditionTitle}>
                  {item.title}
                </ThemeText>

                <ThemeText
                  variant="body"
                  style={[
                    styles.conditionStatus,
                    {
                      color: item.color,
                    },
                  ]}
                >
                  {item.status}
                </ThemeText>
              </View>

              <Ionicons
                name={isSelected ? "checkmark-circle" : "chevron-forward"}
                size={25}
                color={isSelected ? item.color : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}

        {/* RECOMMENDATION */}

        {recommendation && (
          <View
            style={[
              styles.recommendation,
              {
                backgroundColor: colors.primary + "0D",
                borderColor: colors.primary + "25",
              },
            ]}
          >
            <View
              style={[
                styles.recommendationIcon,
                {
                  backgroundColor: colors.primary + "16",
                },
              ]}
            >
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.recommendationContent}>
              <ThemeText variant="subtitle" style={styles.recommendationTitle}>
                AquaGuide AI Recommendation
              </ThemeText>

              <ThemeText
                variant="body"
                style={[
                  styles.recommendationText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {recommendation.advice}
              </ThemeText>
            </View>
          </View>
        )}

        {/* WARNING */}

        <View
          style={[
            styles.warning,
            {
              backgroundColor: "#F443360D",
              borderColor: "#F4433628",
            },
          ]}
        >
          <View style={styles.warningIcon}>
            <Ionicons name="medical-outline" size={23} color="#F44336" />
          </View>

          <View style={styles.warningContent}>
            <ThemeText variant="subtitle" style={styles.warningTitle}>
              Important Reminder
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.warningText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              If your fish shows severe breathing difficulty, continuous
              rolling, heavy bleeding, or cannot swim properly, isolate the fish
              immediately and check the Disease Guide for treatment options.
            </ThemeText>
          </View>
        </View>

        {/* CONTINUE */}

        <ThemeButton
          title={
            selected ? "Continue to First 24 Hours" : "Select a Condition First"
          }
          onPress={continueToFirstDay}
          disabled={!selected}
          style={styles.button}
        />
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

  header: {
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    marginBottom: 22,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  stepBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },

  stepText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionHint: {
    fontSize: 12,
    marginTop: 3,
  },

  conditionCard: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  conditionIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  conditionContent: {
    flex: 1,
    marginLeft: 12,
  },

  conditionTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  conditionStatus: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  recommendation: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 12,
  },

  recommendationIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },

  recommendationTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  recommendationText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  warning: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 24,
  },

  warningIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F4433615",
    justifyContent: "center",
    alignItems: "center",
  },

  warningContent: {
    flex: 1,
    marginLeft: 12,
  },

  warningTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  warningText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  button: {
    height: 56,
    borderRadius: 17,
  },
});
