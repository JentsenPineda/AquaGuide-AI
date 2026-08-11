import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
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

import { auth } from "../../config/firebase";

export default function ForgotPasswordScreen() {
  const colors = useAppColors();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        "Email Required",
        "Please enter the email address associated with your AquaGuide AI account.",
      );
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, trimmedEmail);

      Alert.alert(
        "Reset Link Sent",
        "A password reset link has been sent to your email address. Please check your inbox and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login"),
          },
        ],
      );
    } catch (error: any) {
      let message =
        "Unable to send the password reset email. Please try again.";

      switch (error?.code) {
        case "auth/user-not-found":
          message = "No AquaGuide AI account was found with this email.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many reset attempts. Please wait a while before trying again.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Please check your internet connection and try again.";
          break;

        default:
          if (error?.message) {
            message = error.message;
          }
      }

      Alert.alert("Reset Password Failed", message);
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
      <AppHeader title="Forgot Password" showBack />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary + "18",
              },
            ]}
          >
            <Ionicons
              name="lock-open-outline"
              size={58}
              color={colors.primary}
            />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Reset Your Password
          </Text>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Enter the email address associated with your AquaGuide AI account.
            We'll send you a link to create a new password.
          </Text>

          {/* Email Label */}
          <Text
            style={[
              styles.label,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Email Address
          </Text>

          {/* Email Input */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={22}
              color={colors.textSecondary}
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
            />
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              {
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleResetPassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="paper-plane-outline"
                  size={22}
                  color="#FFFFFF"
                />

                <Text style={styles.resetButtonText}>Send Reset Link</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/auth/login")}
            disabled={loading}
          >
            <Ionicons
              name="arrow-back-outline"
              size={18}
              color={colors.primary}
            />

            <Text
              style={[
                styles.backText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>

          {/* Help Card */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.primary}
            />

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              If you don't see the email, check your spam or junk folder.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 32,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    height: "100%",
  },

  resetButton: {
    height: 58,
    borderRadius: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
  },

  backButton: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },

  infoCard: {
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
