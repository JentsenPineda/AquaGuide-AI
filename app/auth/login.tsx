import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect } from "react";
import { loginUser } from "../../services/authService";

export default function LoginScreen() {
  useEffect(() => {
    console.log("LOGIN SCREEN MOUNTED");
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [secure, setSecure] = useState(true);

  const [loading, setLoading] = useState(false);

  type LoginRedirect = "reminder" | "logbook";

  const { redirect } = useLocalSearchParams<{
    redirect?: LoginRedirect;
  }>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(email, password);

      // Email verification is temporarily disabled.

      Alert.alert("Welcome!", `Hello ${user.displayName ?? "Aquarist"}`);

      switch (redirect) {
        case "reminder":
          router.replace("/reminder");
          break;

        case "logbook":
          router.replace("/logbook");
          break;

        default:
          router.replace("/(tabs)/menu");
          break;
      }
    } catch (error: any) {
      let message = "Unable to login.";

      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;

        case "auth/wrong-password":
          message = "Incorrect password.";
          break;

        case "auth/invalid-email":
          message = "Invalid email address.";
          break;

        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;

        default:
          message = error.message;
      }

      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Welcome Back"
        subtitle="Sign in to continue using AquaGuide AI"
        showBack
        variant="light"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Ionicons
            name="fish"
            size={80}
            color="#00BCD4"
            style={{ alignSelf: "center" }}
          />

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue using AquaGuide AI.
          </Text>

          <TextInput
            placeholder="Email Address"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={secure}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#607D8B"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
    marginTop: 20,
  },

  subtitle: {
    textAlign: "center",
    color: "#607D8B",
    marginTop: 10,
    marginBottom: 35,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    fontSize: 16,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#00BCD4",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

  link: {
    textAlign: "center",
    color: "#00BCD4",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
  },
});
