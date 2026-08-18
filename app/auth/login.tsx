import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
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

import { loginUser } from "../../services/authService";

type LoginRedirect =
  | "reminder"
  | "logbook"
  | "profile"
  | "scan"
  | "sevenDays"
  | "menu"
  | "newFishCare";

export default function LoginScreen() {
  const colors = useAppColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const { redirect } = useLocalSearchParams<{
    redirect?: LoginRedirect;
  }>();

  useEffect(() => {
    console.log("LOGIN SCREEN MOUNTED");
    console.log("LOGIN REDIRECT PARAM:", redirect);
  }, [redirect]);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    let user: User;

    try {
      setLoading(true);

      user = await loginUser(normalizedEmail, password);

      console.log("LOGIN FIREBASE SUCCESS:", user.uid);
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      console.log("LOGIN ERROR CODE:", error?.code);
      console.log("LOGIN ERROR MESSAGE:", error?.message);

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
          message = error.message || "Unable to login.";
      }

      Alert.alert("Login Failed", message);
      return;
    } finally {
      setLoading(false);
    }

    console.log("LOGIN SUCCESSFUL");
    console.log("LOGIN REDIRECT:", redirect);

    /*
     * MENU
     *
     * Menu → Login → Successful Login → Welcome → Proceed → Menu
     */
    if (redirect === "menu") {
      Alert.alert("Welcome!", `Hello ${user.displayName ?? "Aquarist"}`, [
        {
          text: "Proceed",
          onPress: () => {
            router.replace("/(tabs)/menu");
          },
        },
      ]);

      return;
    }

    /*
     * NEW FISH CARE
     *
     * Fish Care → New Fish Care → Login
     * → Successful Login → Welcome → Proceed
     * → New Fish Care
     *
     * IMPORTANT:
     * This must NOT go to /(tabs).
     */
    if (redirect === "newFishCare") {
      Alert.alert("Welcome!", `Hello ${user.displayName ?? "Aquarist"}`, [
        {
          text: "Proceed",
          onPress: () => {
            router.replace("/new-fish-care");
          },
        },
      ]);

      return;
    }

    /*
     * OTHER LOGIN DESTINATIONS
     */
    Alert.alert("Welcome!", `Hello ${user.displayName ?? "Aquarist"}`, [
      {
        text: "Proceed",
        onPress: () => {
          switch (redirect) {
            case "reminder":
              router.replace("/reminder");
              break;

            case "logbook":
              router.replace("/logbook");
              break;

            case "profile":
              router.replace("/profile");
              break;

            case "scan":
              router.replace("/scan");
              break;

            case "sevenDays":
              router.replace("/new-fish-care/sevenDays");
              break;

            default:
              router.replace("/(tabs)");
              break;
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader
        title="Welcome Back"
        subtitle="Sign in to continue using AquaGuide AI"
        showBack
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

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Welcome Back
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Sign in to continue using AquaGuide AI.
          </Text>

          <TextInput
            placeholder="Email Address"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={secure}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              style={[
                styles.passwordInput,
                {
                  color: colors.textPrimary,
                },
              ]}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={colors.textSecondary}
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
