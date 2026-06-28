// app/(tabs)/new-fish-care/acclimation.tsx

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
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const progress = useMemo(() => {
    return ((currentStep + 1) / steps.length) * 100;
  }, [currentStep]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>
          STEP {currentStep + 1} OF {steps.length}
        </Text>

        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.hero}>
          <Ionicons name={step.icon as any} size={80} color="#00BCD4" />
        </View>

        <Text style={styles.title}>{step.title}</Text>

        <View style={styles.durationCard}>
          <Ionicons name="time" size={24} color="#FF9800" />

          <Text style={styles.duration}>Recommended Time</Text>

          <Text style={styles.durationValue}>{step.duration}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>What To Do</Text>

          <Text style={styles.description}>{step.description}</Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={28} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tipTitle}>Why This Step Matters</Text>

            <Text style={styles.tipText}>{step.why}</Text>
          </View>
        </View>

        {currentStep < steps.length - 1 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.buttonText}>Next Step</Text>

            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/new-fish-care/inspection")}
          >
            <Text style={styles.buttonText}>Continue</Text>

            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
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
    paddingBottom: 40,
  },

  step: {
    textAlign: "center",
    color: "#00BCD4",
    fontWeight: "700",
    fontSize: 15,
  },

  progressBackground: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#D9EEF3",
    marginTop: 15,
    marginBottom: 30,
  },

  progressFill: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#00BCD4",
  },

  hero: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003B57",
    textAlign: "center",
    marginBottom: 25,
  },

  durationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },

  duration: {
    marginTop: 8,
    color: "#607D8B",
    fontSize: 15,
  },

  durationValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: "#FF9800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#607D8B",
    lineHeight: 26,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#795548",
    marginBottom: 8,
  },

  tipText: {
    color: "#6D4C41",
    lineHeight: 23,
    fontSize: 15,
  },

  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    marginRight: 10,
  },
});
