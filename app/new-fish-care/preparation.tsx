// app/(tabs)/new-fish-care/preparation.tsx

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

const checklist = [
  "My aquarium is fully cycled",
  "The filter is running properly",
  "The heater is working (if required)",
  "The water temperature is correct",
  "The aquarium lights are OFF or dimmed",
  "The fish bag is still sealed",
];

export default function PreparationScreen() {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(checklist.length).fill(false),
  );

  const completed = useMemo(() => checked.filter(Boolean).length, [checked]);

  const toggleItem = (index: number) => {
    const copy = [...checked];
    copy[index] = !copy[index];
    setChecked(copy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Preparation" variant="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="clipboard-outline" size={60} color="#00BCD4" />
          </View>

          <Text style={styles.title}>Preparation Checklist</Text>

          <Text style={styles.subtitle}>
            Before introducing your new fish into the aquarium, make sure
            everything below is ready.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress</Text>

          <Text style={styles.progressValue}>
            {completed} / {checklist.length}
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completed / checklist.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {checklist.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            activeOpacity={0.8}
            onPress={() => toggleItem(index)}
          >
            <Ionicons
              name={checked[index] ? "checkbox" : "square-outline"}
              size={28}
              color={checked[index] ? "#4CAF50" : "#90A4AE"}
            />

            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tipTitle}>AquaGuide AI Tip</Text>

            <Text style={styles.tipText}>
              Never open the transport bag until the temperature has adjusted.
              Sudden changes can cause severe stress and water shock.
            </Text>
          </View>
        </View>

        {completed === checklist.length ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/new-fish-care/acclimation")}
          >
            <Text style={styles.nextText}>Continue to Acclimation</Text>

            <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.disabledText}>
              Complete the checklist first
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8FAFD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003B57",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    color: "#607D8B",
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
  },

  progressTitle: {
    fontSize: 16,
    color: "#607D8B",
  },

  progressValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#00BCD4",
    marginVertical: 8,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },

  progressFill: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#00BCD4",
  },

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
  },

  itemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#37474F",
    lineHeight: 24,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    marginBottom: 30,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#795548",
    marginBottom: 6,
  },

  tipText: {
    color: "#6D4C41",
    lineHeight: 22,
    fontSize: 14,
  },

  nextButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  nextText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    marginRight: 10,
  },

  disabledButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#CFD8DC",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledText: {
    color: "#607D8B",
    fontWeight: "700",
    fontSize: 16,
  },
});
