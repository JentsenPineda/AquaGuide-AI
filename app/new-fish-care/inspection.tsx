// app/(tabs)/new-fish-care/inspection.tsx

import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [selected, setSelected] = useState<any>(null);

  const recommendation = useMemo(() => {
    return selected;
  }, [selected]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="New Fish Care" variant="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="search-circle" size={75} color="#00BCD4" />

          <Text style={styles.title}>Health Inspection</Text>

          <Text style={styles.subtitle}>
            Observe your fish after acclimation. Choose the condition that best
            matches its behavior.
          </Text>
        </View>

        {symptoms.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={[
              styles.card,
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
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={[styles.status, { color: item.color }]}>
                {item.status}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#90A4AE" />
          </TouchableOpacity>
        ))}

        {recommendation && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>AquaGuide AI Recommendation</Text>

            <Text style={styles.resultText}>{recommendation.advice}</Text>
          </View>
        )}

        <View style={styles.warning}>
          <Ionicons name="medical" size={28} color="#F44336" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.warningTitle}>Important Reminder</Text>

            <Text style={styles.warningText}>
              If your fish shows severe breathing difficulty, continuous
              rolling, heavy bleeding, or cannot swim properly, isolate the fish
              immediately and check the Disease Guide for treatment options.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/new-fish-care/first24hours")}
        >
          <Text style={styles.buttonText}>Continue</Text>

          <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 25,
  },

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: "#003B57",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#607D8B",
    lineHeight: 24,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
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
    color: "#003B57",
  },

  status: {
    marginTop: 4,
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#E8F8FD",
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 10,
  },

  resultText: {
    color: "#546E7A",
    lineHeight: 24,
    fontSize: 15,
  },

  warning: {
    backgroundColor: "#FFEBEE",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    marginBottom: 30,
  },

  warningTitle: {
    fontWeight: "700",
    color: "#C62828",
    fontSize: 17,
    marginBottom: 8,
  },

  warningText: {
    color: "#7B1F1F",
    lineHeight: 22,
    fontSize: 14,
  },

  button: {
    height: 58,
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
});
