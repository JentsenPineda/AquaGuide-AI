import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Privacy Policy"
        subtitle="Learn how AquaGuide AI protects your information"
        showBack
        variant="light"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={65} color="#00BCD4" />

          <Text style={styles.title}>Privacy Policy</Text>

          <Text style={styles.subtitle}>
            Your privacy and data security are important to AquaGuide AI.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Information We Collect</Text>

          <Text style={styles.body}>
            AquaGuide AI may collect information such as your account details,
            reminders, care logbook records, profile information, and
            application preferences to provide personalized ornamental fish
            management features.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>How Your Data Is Used</Text>

          <Text style={styles.body}>
            Your information is used solely to operate AquaGuide AI, synchronize
            your reminders and care logbook, improve your user experience, and
            support future application enhancements.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Data Security</Text>

          <Text style={styles.body}>
            Your information is securely stored using Firebase services.
            AquaGuide AI does not intentionally sell or share your personal
            information with third parties except when necessary to provide
            application functionality or comply with applicable laws.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>AI Image Recognition</Text>

          <Text style={styles.body}>
            Images submitted for fish identification are processed only for
            ornamental fish recognition and related application features. They
            are not used for advertising purposes.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Contact</Text>

          <Text style={styles.body}>
            For questions regarding this Privacy Policy or your personal data,
            please contact the AquaGuide AI development team through your
            academic institution.
          </Text>
        </View>

        <Text style={styles.footer}>
          © 2026 AquaGuide AI{"\n"}
          All Rights Reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  body: {
    color: "#4B5563",
    lineHeight: 24,
    fontSize: 15,
  },

  footer: {
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    color: "#94A3B8",
    lineHeight: 22,
    fontSize: 13,
  },
});
