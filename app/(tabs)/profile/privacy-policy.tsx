import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
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
              reminders, logbook records, profile information, and application
              preferences to provide personalized fishkeeping features.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>How Your Data Is Used</Text>

            <Text style={styles.body}>
              Your information is used only to operate AquaGuide AI, synchronize
              your reminders and logbook, improve user experience, and support
              future application updates.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Data Security</Text>

            <Text style={styles.body}>
              Your information is stored securely using Firebase services.
              AquaGuide AI does not intentionally share your personal data with
              third parties except when required to provide application
              functionality or comply with applicable laws.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>AI Image Recognition</Text>

            <Text style={styles.body}>
              Images submitted for fish identification are processed only to
              identify ornamental fish species and improve your experience.
              Images are not used for advertising purposes.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Contact</Text>

            <Text style={styles.body}>
              If you have any questions regarding this Privacy Policy, please
              contact the AquaGuide AI development team.
            </Text>
          </View>

          <Text style={styles.footer}>
            © 2026 AquaGuide AI. All Rights Reserved.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
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
    marginTop: 15,
    marginBottom: 30,
    textAlign: "center",
    color: "#94A3B8",
  },
});
