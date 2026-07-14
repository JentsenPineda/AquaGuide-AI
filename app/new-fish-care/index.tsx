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

export default function NewFishCareScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="New Fish Care" variant="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="fish" size={70} color="#00BCD4" />
          </View>

          <Text style={styles.title}>Welcome Your New Fish</Text>

          <Text style={styles.subtitle}>
            Follow this interactive guide to safely acclimate your newly
            purchased fish. Proper acclimation reduces stress, prevents water
            shock, and lowers the risk of diseases.
          </Text>
        </View>

        {/* Benefits */}
        <Text style={styles.sectionTitle}>Why Proper Acclimation Matters</Text>

        <View style={styles.card}>
          <Ionicons name="heart" size={30} color="#00BCD4" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Reduce Stress</Text>
            <Text style={styles.cardText}>
              Fish experience stress during transportation. Proper acclimation
              helps them recover safely.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="water" size={30} color="#2196F3" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Prevent Water Shock</Text>
            <Text style={styles.cardText}>
              Sudden changes in temperature or water chemistry can seriously
              harm your fish.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="shield-checkmark" size={30} color="#4CAF50" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Prevent Diseases</Text>
            <Text style={styles.cardText}>
              A stress-free acclimation process strengthens the immune system
              and reduces disease risk.
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.timeCard}>
          <Ionicons name="time" size={32} color="#FF9800" />
          <Text style={styles.timeTitle}>Estimated Guide Duration</Text>
          <Text style={styles.timeValue}>30 – 45 Minutes</Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/new-fish-care/preparation")}
        >
          <Text style={styles.startText}>Start Guide</Text>

          <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.learnButton}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#00BCD4"
          />

          <Text style={styles.learnText}>Why Is Acclimation Important?</Text>
        </TouchableOpacity>
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

  hero: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },

  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E6FAFD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 16,
    lineHeight: 25,
    color: "#607D8B",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  cardContent: {
    flex: 1,
    marginLeft: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 6,
  },

  cardText: {
    color: "#607D8B",
    lineHeight: 22,
    fontSize: 15,
  },

  timeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    padding: 25,
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },

  timeTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: "#003B57",
  },

  timeValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#FF9800",
  },

  startButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },

  startText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    marginRight: 10,
  },

  learnButton: {
    borderWidth: 2,
    borderColor: "#00BCD4",
    borderRadius: 18,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  learnText: {
    color: "#00BCD4",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
});
