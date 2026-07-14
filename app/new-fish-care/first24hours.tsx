// app/(tabs)/new-fish-care/first24hours.tsx

import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const timeline = [
  {
    time: "0 - 1 Hour",
    icon: "moon",
    color: "#5C6BC0",
    title: "Let Your Fish Relax",
    tasks: [
      "Keep aquarium lights OFF.",
      "Do not tap the aquarium glass.",
      "Allow your fish to explore naturally.",
      "Avoid chasing or touching the fish.",
    ],
  },

  {
    time: "6 Hours",
    icon: "eye",
    color: "#00BCD4",
    title: "Observe Behavior",
    tasks: [
      "Check normal swimming.",
      "Observe breathing.",
      "Watch for hiding behavior.",
      "Look for signs of stress.",
    ],
  },

  {
    time: "12 Hours",
    icon: "search",
    color: "#4CAF50",
    title: "Continue Monitoring",
    tasks: [
      "Check fins for damage.",
      "Observe body color.",
      "Ensure fish is responsive.",
      "Avoid unnecessary disturbance.",
    ],
  },

  {
    time: "24 Hours",
    icon: "restaurant",
    color: "#FF9800",
    title: "First Feeding",
    tasks: [
      "Feed a very small amount.",
      "Remove uneaten food.",
      "Observe appetite.",
      "Continue monitoring water quality.",
    ],
  },
];

export default function First24HoursScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="New Fish Care" variant="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Ionicons name="time" size={70} color="#00BCD4" />

          <Text style={styles.title}>First 24 Hours</Text>

          <Text style={styles.subtitle}>
            The first day is the most important. Follow these simple steps to
            help your fish settle into its new home.
          </Text>
        </View>

        {timeline.map((item, index) => (
          <View key={index} style={styles.timelineContainer}>
            <View style={styles.leftSide}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: item.color,
                  },
                ]}
              >
                <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
              </View>

              {index !== timeline.length - 1 && <View style={styles.line} />}
            </View>

            <View style={styles.card}>
              <Text style={styles.time}>{item.time}</Text>

              <Text style={styles.cardTitle}>{item.title}</Text>

              {item.tasks.map((task, i) => (
                <View key={i} style={styles.taskRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />

                  <Text style={styles.taskText}>{task}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={28} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tipTitle}>AquaGuide AI Tip</Text>

            <Text style={styles.tipText}>
              It is completely normal if your new fish hides during the first
              day. Give it time to adjust before becoming concerned.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/new-fish-care/sevenDays")}
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
    marginBottom: 30,
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
    fontSize: 15,
    lineHeight: 24,
  },

  timelineContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  leftSide: {
    alignItems: "center",
    width: 50,
  },

  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  line: {
    width: 3,
    flex: 1,
    backgroundColor: "#CFD8DC",
    marginTop: 6,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginLeft: 12,
    elevation: 2,
  },

  time: {
    color: "#00BCD4",
    fontWeight: "700",
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 12,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  taskText: {
    marginLeft: 8,
    color: "#546E7A",
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 30,
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
