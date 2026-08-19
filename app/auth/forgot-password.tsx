import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordScreen() {
  const colors = useAppColors();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  /*
   * Real-time email validation
   */
  const emailValidation = useMemo(() => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return {
        valid: false,
        touched: false,
      };
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    return {
      valid,
      touched: true,
    };
  }, [email]);

  /*
   * Resend countdown
   */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /*
   * Send reset email
   */
  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    if (!emailValidation.valid) {
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, normalizedEmail);

      setEmailSent(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (error: any) {
      console.log("FORGOT PASSWORD ERROR:", error);
      console.log("FORGOT PASSWORD ERROR CODE:", error?.code);

      /*
       * We intentionally avoid telling the user whether
       * an email exists in the system.
       */
      switch (error?.code) {
        case "auth/invalid-email":
          break;

        case "auth/too-many-requests":
          setCooldown(RESEND_COOLDOWN);
          break;

        case "auth/network-request-failed":
          break;

        default:
          break;
      }

      /*
       * We use the same screen for errors so the UI remains
       * simple and doesn't expose unnecessary account information.
       */
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Resend reset email
   */
  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    await handleResetPassword();
  };

  /*
   * Change email
   */
  const handleChangeEmail = () => {
    setEmailSent(false);
    setCooldown(0);
  };

  /*
   * SUCCESS / CHECK EMAIL SCREEN
   */
  if (emailSent) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="Check Your Email" showBack />

        <ScrollView
          contentContainerStyle={styles.successContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.successIconContainer,
              {
                backgroundColor: colors.primary + "18",
              },
            ]}
          >
            <Ionicons
              name="mail-open-outline"
              size={62}
              color={colors.primary}
            />
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
            If an AquaGuide AI account is associated with this email, we've sent
            password reset instructions.
          </Text>

          <View
            style={[
              styles.emailCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="mail-outline" size={22} color={colors.primary} />

            <Text
              style={[
                styles.emailText,
                {
                  color: colors.textPrimary,
                },
              ]}
              numberOfLines={1}
            >
              {email.trim().toLowerCase()}
            </Text>
          </View>

          {/* CHECK EMAIL INFO */}
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
              size={23}
              color={colors.primary}
            />

            <View style={styles.infoContent}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Didn't receive the email?
              </Text>

              <Text
                style={[
                  styles.infoText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Check your Spam, Junk, or Promotions folder. Make sure you
                entered the correct email address.
              </Text>
            </View>
          </View>

          {/* RESEND */}
          <TouchableOpacity
            style={[
              styles.resendButton,
              {
                borderColor: colors.primary,
                opacity: cooldown > 0 || loading ? 0.55 : 1,
              },
            ]}
            onPress={handleResend}
            disabled={cooldown > 0 || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name="refresh-outline"
                  size={21}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.resendText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {cooldown > 0
                    ? `Resend available in ${cooldown}s`
                    : "Resend Reset Email"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* CHANGE EMAIL */}
          <TouchableOpacity
            style={styles.changeEmailButton}
            onPress={handleChangeEmail}
            disabled={loading}
          >
            <Text
              style={[
                styles.changeEmailText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Use a different email
            </Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace("/auth/login")}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={19} color="#FFFFFF" />

            <Text style={styles.loginButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /*
   * FORGOT PASSWORD SCREEN
   */
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
          {/* ICON */}
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

          {/* TITLE */}
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

          {/* DESCRIPTION */}
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Enter the email address associated with your AquaGuide AI account.
            We'll send you instructions to create a new password.
          </Text>

          {/* LABEL */}
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

          {/* EMAIL INPUT */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: !emailValidation.touched
                  ? colors.border
                  : emailValidation.valid
                    ? "#2E7D32"
                    : "#E53935",
              },
            ]}
          >
            <Ionicons
              name={emailValidation.valid ? "checkmark-circle" : "mail-outline"}
              size={22}
              color={emailValidation.valid ? "#2E7D32" : colors.textSecondary}
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
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailSent(false);
              }}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
              maxLength={100}
            />
          </View>

          {/* LIVE VALIDATION */}
          {emailValidation.touched && (
            <View style={styles.validationRow}>
              <Ionicons
                name={
                  emailValidation.valid ? "checkmark-circle" : "alert-circle"
                }
                size={17}
                color={emailValidation.valid ? "#2E7D32" : "#E53935"}
              />

              <Text
                style={[
                  styles.validationText,
                  {
                    color: emailValidation.valid ? "#2E7D32" : "#E53935",
                  },
                ]}
              >
                {emailValidation.valid
                  ? "Email address looks valid"
                  : "Please enter a valid email address"}
              </Text>
            </View>
          )}

          {/* RESET BUTTON */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              {
                backgroundColor: colors.primary,
                opacity: loading || !emailValidation.valid ? 0.55 : 1,
              },
            ]}
            onPress={handleResetPassword}
            disabled={loading || !emailValidation.valid}
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

                <Text style={styles.resetButtonText}>Send Reset Email</Text>
              </>
            )}
          </TouchableOpacity>

          {/* BACK TO LOGIN */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/auth/login")}
            disabled={loading}
            activeOpacity={0.7}
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

          {/* INFO CARD */}
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
              name="shield-checkmark-outline"
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
              For your security, we'll only provide reset instructions if the
              email can be processed by AquaGuide AI.
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

  successContent: {
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

  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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

  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 3,
  },

  validationText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "600",
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

  emailCard: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  emailText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "700",
  },

  infoCard: {
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  resendButton: {
    height: 54,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  resendText: {
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },

  changeEmailButton: {
    alignItems: "center",
    marginTop: 20,
  },

  changeEmailText: {
    fontSize: 15,
    fontWeight: "700",
  },

  loginButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#00BCD4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
});
