import AppHeader from "@/components/layout/AppHeader";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function VerifyEmailScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Email Verification"
        subtitle="Verify your AquaGuide AI account"
        showBack
        variant="light"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Coming Soon</Text>

        <Text style={styles.subtitle}>
          Email verification will be available in a future update.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003B57",
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    color: "#607D8B",
  },
});
