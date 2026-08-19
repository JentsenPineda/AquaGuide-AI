import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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

  /*
   * Real-time validation
   */
  const validation = useMemo(() => {
    const trimmedName = fullName.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername);

    const fullNameValid =
      trimmedName.length >= 2 && /^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmedName);

    const passwordLength = password.length >= 8;
    const passwordUppercase = /[A-Z]/.test(password);
    const passwordLowercase = /[a-z]/.test(password);
    const passwordNumber = /[0-9]/.test(password);
    const passwordSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]/;'`~]/.test(
      password,
    );

    const passwordValid =
      passwordLength &&
      passwordUppercase &&
      passwordLowercase &&
      passwordNumber &&
      passwordSpecial;

    const confirmValid =
      confirmPassword.length > 0 && password === confirmPassword;

    const formValid =
      fullNameValid &&
      usernameValid &&
      emailValid &&
      passwordValid &&
      confirmValid;

    return {
      trimmedName,
      trimmedUsername,
      trimmedEmail,
      fullNameValid,
      usernameValid,
      emailValid,
      passwordLength,
      passwordUppercase,
      passwordLowercase,
      passwordNumber,
      passwordSpecial,
      passwordValid,
      confirmValid,
      formValid,
    };
  }, [fullName, username, email, password, confirmPassword]);

  /*
   * Registration
   */
  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    const normalizedFullName = fullName.trim();

    if (!normalizedFullName) {
      Alert.alert("Missing Information", "Please enter your full name.");
      return;
    }

    if (!validation.fullNameValid) {
      Alert.alert(
        "Invalid Full Name",
        "Please enter a valid name using letters, spaces, apostrophes, periods, or hyphens.",
      );
      return;
    }

    if (!normalizedUsername) {
      Alert.alert("Missing Information", "Please enter a username.");
      return;
    }

    if (!validation.usernameValid) {
      Alert.alert(
        "Invalid Username",
        "Username must be 3–20 characters and may only contain letters, numbers, and underscores.",
      );
      return;
    }

    if (!normalizedEmail) {
      Alert.alert("Missing Information", "Please enter your email address.");
      return;
    }

    if (!validation.emailValid) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!password) {
      Alert.alert("Missing Information", "Please enter a password.");
      return;
    }

    if (!validation.passwordValid) {
      Alert.alert(
        "Weak Password",
        "Please complete all password requirements.",
      );
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Missing Information", "Please confirm your password.");
      return;
    }

    if (!validation.confirmValid) {
      Alert.alert("Password Error", "Passwords do not match.");
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

      Alert.alert("Welcome!", `Hello ${normalizedFullName}`, [
        {
          text: "Proceed",
          onPress: () => {
            router.replace("/(tabs)/menu");
          },
        },
      ]);
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

  /*
   * Small reusable validation row
   */
  const ValidationRow = ({
    visible,
    valid,
    text,
  }: {
    visible: boolean;
    valid: boolean;
    text: string;
  }) => {
    if (!visible) return null;

    return (
      <View style={styles.validationRow}>
        <Ionicons
          name={valid ? "checkmark-circle" : "alert-circle"}
          size={16}
          color={valid ? "#2E7D32" : "#E53935"}
        />

        <Text
          style={[
            styles.validationText,
            {
              color: valid ? "#2E7D32" : "#E53935",
            },
          ]}
        >
          {text}
        </Text>
      </View>
    );
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
                borderColor:
                  fullName.length > 0
                    ? validation.fullNameValid
                      ? "#2E7D32"
                      : "#E53935"
                    : colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={60}
          />

          <ValidationRow
            visible={fullName.length > 0}
            valid={validation.fullNameValid}
            text={
              validation.fullNameValid
                ? "Full name looks good"
                : "Enter a valid full name"
            }
          />

          {/* USERNAME */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor:
                  username.length > 0
                    ? validation.usernameValid
                      ? "#2E7D32"
                      : "#E53935"
                    : colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
          />

          <ValidationRow
            visible={username.length > 0}
            valid={validation.usernameValid}
            text={
              validation.usernameValid
                ? "Username is valid"
                : "Use 3–20 letters, numbers, or underscores"
            }
          />

          {/* EMAIL */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor:
                  email.length > 0
                    ? validation.emailValid
                      ? "#2E7D32"
                      : "#E53935"
                    : colors.border,
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
            maxLength={100}
          />

          <ValidationRow
            visible={email.length > 0}
            valid={validation.emailValid}
            text={
              validation.emailValid
                ? "Email address is valid"
                : "Enter a valid email address"
            }
          />

          {/* PASSWORD */}
          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: colors.card,
                borderColor:
                  password.length > 0
                    ? validation.passwordValid
                      ? "#2E7D32"
                      : "#E53935"
                    : colors.border,
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
              maxLength={64}
            />

            <TouchableOpacity
              onPress={() => setSecure1(!secure1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={secure1 ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {password.length > 0 && (
            <View
              style={[
                styles.requirementsBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.requirementsTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Password requirements
              </Text>

              <ValidationRow
                visible
                valid={validation.passwordLength}
                text="At least 8 characters"
              />

              <ValidationRow
                visible
                valid={validation.passwordUppercase}
                text="At least one uppercase letter"
              />

              <ValidationRow
                visible
                valid={validation.passwordLowercase}
                text="At least one lowercase letter"
              />

              <ValidationRow
                visible
                valid={validation.passwordNumber}
                text="At least one number"
              />

              <ValidationRow
                visible
                valid={validation.passwordSpecial}
                text="At least one special character"
              />
            </View>
          )}

          {/* CONFIRM PASSWORD */}
          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: colors.card,
                borderColor:
                  confirmPassword.length > 0
                    ? validation.confirmValid
                      ? "#2E7D32"
                      : "#E53935"
                    : colors.border,
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
              maxLength={64}
            />

            <TouchableOpacity
              onPress={() => setSecure2(!secure2)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={secure2 ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ValidationRow
            visible={confirmPassword.length > 0}
            valid={validation.confirmValid}
            text={
              validation.confirmValid
                ? "Passwords match"
                : "Passwords do not match"
            }
          />

          {/* CREATE ACCOUNT */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                opacity: loading ? 0.7 : 1,
              },
            ]}
            disabled={loading}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.7}
          >
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
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
    lineHeight: 22,
  },

  input: {
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 6,
    borderWidth: 1,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },

  requirementsBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    marginTop: 2,
  },

  requirementsTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 5,
    paddingHorizontal: 2,
  },

  validationText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "600",
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
