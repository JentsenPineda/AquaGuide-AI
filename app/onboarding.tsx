import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="fish" size={120} color="#00BCD4" />

        <Text style={styles.title}>Welcome to AquaGuide AI</Text>

        <Text style={styles.description}>
          Your intelligent companion for ornamental fish keeping.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
    marginTop: 30,
    textAlign: "center",
  },

  description: {
    fontSize: 17,
    color: "#607D8B",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 26,
  },

  footer: {
    padding: 30,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CFD8DC",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#00BCD4",
    width: 26,
  },

  button: {
    backgroundColor: "#00BCD4",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

  skip: {
    textAlign: "center",
    color: "#607D8B",
    marginTop: 18,
    fontSize: 16,
    fontWeight: "600",
  },
});
