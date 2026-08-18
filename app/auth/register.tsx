import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

import { registerUser } from "../../services/authService";

export default function RegisterScreen() {
  const colors = useAppColors();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    const normalizedFullName = fullName.trim();

    // Check required fields
    if (
      !normalizedFullName ||
      !normalizedUsername ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.");
      return;
    }

    // Minimum password length
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 8 characters.",
      );
      return;
    }

    // Uppercase requirement
    if (!/[A-Z]/.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least one uppercase letter.",
      );
      return;
    }

    // Lowercase requirement
    if (!/[a-z]/.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least one lowercase letter.",
      );
      return;
    }

    // Number requirement
    if (!/[0-9]/.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least one number.",
      );
      return;
    }

    // Special character requirement
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\\[\]/;'`~]/.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least one special character.",
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        normalizedFullName,
        normalizedUsername,
        normalizedEmail,
        password,
      );

      Alert.alert("Success", "Account created successfully.");

      router.replace("/auth/login");
    } catch (error: any) {
      let message = "Unable to create your account.";

      switch (error?.code) {
        case "auth/email-already-in-use":
          message = "An account with this email already exists.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          message =
            "The password does not meet Firebase security requirements.";
          break;

        default:
          message = error?.message ?? message;
      }

      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
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
      <AppHeader title="Create Account" showBack />

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
            Create Account
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Join AquaGuide AI and manage your aquarium smarter.
          </Text>

          {/* FULL NAME */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* USERNAME */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* EMAIL */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
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
              style={[
                styles.passwordInput,
                {
                  color: colors.textPrimary,
                },
              ]}
              placeholderTextColor={colors.textSecondary}
              placeholder="Password"
              secureTextEntry={secure1}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setSecure1(!secure1)}>
              <Ionicons
                name={secure1 ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
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
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={secure2}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              style={[
                styles.passwordInput,
                {
                  color: colors.textPrimary,
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={() => setSecure2(!secure2)}>
              <Ionicons
                name={secure2 ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* CREATE ACCOUNT */}
          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={handleRegister}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.login}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
    justifyContent: "center",
    flexGrow: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003B57",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    textAlign: "center",
    color: "#607D8B",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#003B57",
  },

  button: {
    backgroundColor: "#00BCD4",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

  login: {
    textAlign: "center",
    color: "#00BCD4",
    marginTop: 24,
    fontWeight: "700",
    fontSize: 16,
  },
});
