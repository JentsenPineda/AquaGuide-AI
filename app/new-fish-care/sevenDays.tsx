// app/(tabs)/new-fish-care/sevenDays.tsx

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

const weekPlan = [
  {
    day: "Day 1",
    title: "Observe Your Fish",
    task: "Allow your fish to settle. Do not disturb the aquarium unnecessarily.",
  },
  {
    day: "Day 2",
    title: "Feed Lightly",
    task: "Feed a small amount and check if your fish is eating normally.",
  },
  {
    day: "Day 3",
    title: "Check Water Quality",
    task: "Test the temperature and pH to ensure they remain stable.",
  },
  {
    day: "Day 4",
    title: "Inspect Body & Fins",
    task: "Look for white spots, torn fins, redness, or unusual swimming.",
  },
  {
    day: "Day 5",
    title: "Clean the Aquarium Glass",
    task: "Remove algae from the glass without stressing your fish.",
  },
  {
    day: "Day 6",
    title: "Observe Fish Behavior",
    task: "Watch for active swimming, normal breathing, and healthy appetite.",
  },
  {
    day: "Day 7",
    title: "Perform Water Change",
    task: "Replace 20–30% of the aquarium water using dechlorinated water.",
  },
];

export default function SevenDaysScreen() {
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(weekPlan.length).fill(false),
  );

  const finished = useMemo(() => completed.filter(Boolean).length, [completed]);

  const toggle = (index: number) => {
    const copy = [...completed];
    copy[index] = !copy[index];
    setCompleted(copy);
  };

  const progress = (finished / weekPlan.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="calendar" size={70} color="#00BCD4" />

          <Text style={styles.title}>7-Day Care Plan</Text>

          <Text style={styles.subtitle}>
            Continue caring for your new fish during its first week. Complete
            each task as you go.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly Progress</Text>

          <Text style={styles.progressValue}>
            {finished} / {weekPlan.length}
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {weekPlan.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => toggle(index)}
          >
            <Ionicons
              name={completed[index] ? "checkbox" : "square-outline"}
              size={28}
              color={completed[index] ? "#4CAF50" : "#90A4AE"}
            />

            <View style={styles.info}>
              <Text style={styles.day}>{item.day}</Text>

              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.task}>{item.task}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tipTitle}>AquaGuide AI Tip</Text>

            <Text style={styles.tipText}>
              A healthy fish will become more active, show brighter colors, and
              begin eating regularly within its first week.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/new-fish-care/success")}
        >
          <Text style={styles.buttonText}>Finish Guide</Text>

          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
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
    paddingBottom: 40,
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

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
  },

  progressTitle: {
    color: "#607D8B",
    fontSize: 15,
  },

  progressValue: {
    fontSize: 28,
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
    backgroundColor: "#00BCD4",
    borderRadius: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  day: {
    color: "#00BCD4",
    fontWeight: "700",
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 8,
  },

  task: {
    color: "#607D8B",
    lineHeight: 23,
    fontSize: 15,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 18,
    padding: 18,
    marginVertical: 20,
  },

  tipTitle: {
    fontWeight: "700",
    color: "#795548",
    fontSize: 17,
    marginBottom: 8,
  },

  tipText: {
    color: "#6D4C41",
    lineHeight: 22,
    fontSize: 15,
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
    fontWeight: "700",
    fontSize: 18,
    marginRight: 10,
  },
});
