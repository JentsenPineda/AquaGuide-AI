import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  logoutUser,
  reloadCurrentUser,
  resendVerificationEmail,
} from "../../services/authService";

export default function VerifyEmailScreen() {
  const colors = useAppColors();

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCheckVerification = async () => {
    try {
      setChecking(true);

      const user = await reloadCurrentUser();

      if (user?.emailVerified) {
        Alert.alert(
          "Email Verified",
          "Your email has been successfully verified.",
          [
            {
              text: "Continue",
              onPress: () => {
                router.replace("/(tabs)/menu");
              },
            },
          ],
        );

        return;
      }

      Alert.alert(
        "Not Verified Yet",
        "Your email has not been verified yet. Please check your inbox and tap the verification link.",
      );
    } catch (error: any) {
      console.log("VERIFY EMAIL CHECK ERROR:", error);

      Alert.alert(
        "Unable to Check",
        "We couldn't check your verification status. Please try again.",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      await resendVerificationEmail();

      Alert.alert(
        "Verification Email Sent",
        "A new verification email has been sent. Please check your inbox.",
      );
    } catch (error: any) {
      console.log("RESEND VERIFICATION ERROR:", error);

      let message =
        "We couldn't send the verification email. Please try again.";

      switch (error?.code) {
        case "auth/too-many-requests":
          message =
            "Too many verification emails were requested. Please wait before trying again.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Please check your internet connection and try again.";
          break;

        case "auth/user-token-expired":
          message = "Your session has expired. Please sign in again.";
          break;
      }

      Alert.alert("Unable to Resend", message);
    } finally {
      setResending(false);
    }
  };

  const handleUseDifferentAccount = async () => {
    try {
      await logoutUser();
      router.replace("/auth/login");
    } catch (error) {
      console.log("VERIFY EMAIL SIGN OUT ERROR:", error);

      Alert.alert("Unable to Sign Out", "Please try again.");
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
      <AppHeader
        title="Email Verification"
        subtitle="Verify your AquaGuide AI account"
      />

      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${colors.primary}15`,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="mail-open-outline" size={58} color={colors.primary} />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Check Your Email
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          We've sent a verification link to:
        </Text>

        <Text
          style={[
            styles.email,
            {
              color: colors.textPrimary,
            },
          ]}
          numberOfLines={2}
        >
          {email || "your email address"}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Open the email and tap the verification link to verify your AquaGuide
          AI account.
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={handleCheckVerification}
          disabled={checking}
          activeOpacity={0.85}
        >
          {checking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />
              <Text style={styles.primaryButtonText}>
                I've Verified My Email
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          onPress={handleResend}
          disabled={resending}
          activeOpacity={0.8}
        >
          {resending ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons
                name="refresh-outline"
                size={20}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Resend Verification Email
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUseDifferentAccount}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.signOutText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Use a different account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 360,
  },

  email: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },

  primaryButton: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 15,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  signOutText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 24,
  },
});
