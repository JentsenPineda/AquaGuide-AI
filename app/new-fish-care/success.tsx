// app/(tabs)/new-fish-care/success.tsx

import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="New Fish Care" variant="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.circle}>
            <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
          </View>

          <Text style={styles.title}>Congratulations!</Text>

          <Text style={styles.subtitle}>
            You have successfully completed the New Fish Care Guide. Your fish
            now has a much better chance of adapting safely to its new aquarium.
          </Text>
        </View>

        <View style={styles.achievementCard}>
          <Ionicons name="ribbon" size={34} color="#FFC107" />

          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Achievement Unlocked</Text>

            <Text style={styles.achievementText}>
              🏅 First Successful Fish Acclimation
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What You've Learned</Text>

        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <Text style={styles.cardText}>
            Proper acclimation reduces fish stress.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <Text style={styles.cardText}>
            Slow adjustment prevents water shock.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <Text style={styles.cardText}>
            Observe your fish during its first week.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <Text style={styles.cardText}>
            Feed lightly and maintain clean water.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tipTitle}>AquaGuide AI Recommendation</Text>

            <Text style={styles.tipText}>
              Continue observing your fish for the next seven days. If you
              notice unusual behavior, visit the Disease Guide or use AI Fish
              Recognition for additional guidance.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home" size={22} color="#FFFFFF" />

          <Text style={styles.primaryText}>Return to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/library")}
        >
          <Ionicons name="book" size={22} color="#00BCD4" />

          <Text style={styles.secondaryText}>Open Species Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/reminder")}
        >
          <Ionicons name="notifications" size={22} color="#00BCD4" />

          <Text style={styles.secondaryText}>Set Feeding Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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

  hero: {
    alignItems: "center",
    marginBottom: 30,
  },

  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8F9EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    color: "#607D8B",
    fontSize: 16,
    lineHeight: 26,
  },

  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    alignItems: "center",
  },

  achievementContent: {
    marginLeft: 15,
    flex: 1,
  },

  achievementTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#795548",
  },

  achievementText: {
    marginTop: 5,
    color: "#5D4037",
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  cardText: {
    marginLeft: 12,
    color: "#455A64",
    fontSize: 15,
    flex: 1,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#E8F8FD",
    borderRadius: 18,
    padding: 18,
    marginVertical: 25,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 8,
  },

  tipText: {
    color: "#607D8B",
    lineHeight: 23,
    fontSize: 15,
  },

  primaryButton: {
    height: 58,
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 10,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },

  secondaryText: {
    color: "#00BCD4",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },
});
