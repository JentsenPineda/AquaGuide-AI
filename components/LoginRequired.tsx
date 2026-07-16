import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type LoginRedirect = "reminder" | "logbook";

type LoginRequiredProps = {
  redirect: LoginRedirect;
};

export default function LoginRequired({ redirect }: LoginRequiredProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={70} color="#00BCD4" />
      </View>

      <Text style={styles.title}>Sign in Required</Text>

      <Text style={styles.description}>
        This feature stores your personal data securely in your AquaGuide AI
        account.
      </Text>

      <View style={styles.card}>
        <Benefit icon="notifications" text="Personalized Feeding Reminders" />

        <Benefit icon="book" text="Cloud Logbook History" />

        <Benefit icon="cloud" text="Automatic Backup" />

        <Benefit icon="phone-portrait" text="Access Across Devices" />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          router.push({
            pathname: "/auth/login",
            params: {
              redirect,
            },
          })
        }
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.registerText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)");
          }
        }}
      >
        <Text style={styles.guest}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

function Benefit({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color="#00BCD4" />

      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
    justifyContent: "center",
    padding: 24,
  },

  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E6FAFD",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  title: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
  },

  description: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#607D8B",
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginVertical: 30,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  rowText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#455A64",
    flex: 1,
  },

  loginButton: {
    backgroundColor: "#00BCD4",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  registerButton: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#00BCD4",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#00BCD4",
    fontSize: 18,
    fontWeight: "700",
  },

  guest: {
    marginTop: 25,
    textAlign: "center",
    color: "#607D8B",
    fontWeight: "700",
    fontSize: 16,
  },
});
