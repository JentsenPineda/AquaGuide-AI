// app/(tabs)/new-fish-care/inspection.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
  const [selected, setSelected] = useState<any>(null);

  const recommendation = useMemo(() => {
    return selected;
  }, [selected]);
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    header: {
      backgroundColor: colors.card,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    resultCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="New Fish Care" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemeCard style={[styles.header, dynamicStyles.header]}>
          <Ionicons name="search-circle" size={75} color={colors.primary} />
          <ThemeText variant="title" style={styles.title}>
            Health Inspection
          </ThemeText>
          <ThemeText variant="body" style={styles.subtitle}>
            Observe your fish after acclimation. Choose the condition that best
            matches its behavior.
          </ThemeText>
        </ThemeCard>
        {symptoms.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              dynamicStyles.card,
              selected?.id === item.id && {
                borderColor: item.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelected(item)}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: item.color,
                },
              ]}
            >
              <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
            </View>

            <View style={{ flex: 1 }}>
              <ThemeText variant="subtitle" style={styles.cardTitle}>
                {item.title}
              </ThemeText>
              <ThemeText
                variant="body"
                style={[styles.status, { color: item.color }]}
              >
                {item.status}
              </ThemeText>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#90A4AE" />
          </TouchableOpacity>
        ))}

        {recommendation && (
          <ThemeCard style={[styles.resultCard, dynamicStyles.resultCard]}>
            <ThemeText variant="subtitle" style={styles.resultTitle}>
              AquaGuide AI Recommendation
            </ThemeText>
            <ThemeText variant="body" style={styles.resultText}>
              {recommendation.advice}
            </ThemeText>
          </ThemeCard>
        )}

        <ThemeCard style={styles.warning}>
          <Ionicons name="medical" size={28} color="#F44336" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemeText variant="subtitle" style={styles.warningTitle}>
              Important Reminder
            </ThemeText>
            <ThemeText variant="body" style={styles.warningText}>
              If your fish shows severe breathing difficulty, continuous
              rolling, heavy bleeding, or cannot swim properly, isolate the fish
              immediately and check the Disease Guide for treatment options.
            </ThemeText>
          </View>
        </ThemeCard>
        <ThemeButton
          title="Continue"
          onPress={() => router.push("/new-fish-care/first24hours")}
          style={styles.button}
        />
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

  header: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
  },

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 15,
    opacity: 0.85,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  status: {
    marginTop: 4,
    fontWeight: "700",
    fontSize: 14,
  },

  resultCard: {
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  resultText: {
    lineHeight: 24,
    fontSize: 15,
    opacity: 0.9,
  },

  warning: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    marginBottom: 30,
  },

  warningTitle: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 8,
  },

  warningText: {
    lineHeight: 22,
    fontSize: 14,
    opacity: 0.9,
  },

  button: {
    height: 58,
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
