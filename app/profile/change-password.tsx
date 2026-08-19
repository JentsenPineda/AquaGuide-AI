import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { auth } from "../../config/firebase";

type PasswordFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
  colors: ReturnType<typeof useAppColors>;
  editable: boolean;
  error?: string;
};

function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  visible,
  onToggleVisibility,
  colors,
  editable,
  error,
}: PasswordFieldProps) {
  const hasError = !!error;

  return (
    <View style={styles.fieldWrapper}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: hasError
              ? colors.danger
              : value
                ? colors.primary
                : colors.border,
          },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={
            hasError
              ? colors.danger
              : value
                ? colors.primary
                : colors.textSecondary
          }
        />

        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          returnKeyType="done"
        />

        <Pressable
          onPress={onToggleVisibility}
          disabled={!editable}
          hitSlop={8}
          style={styles.visibilityButton}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={21}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={colors.danger}
          />

          <Text
            style={[
              styles.errorText,
              {
                color: colors.danger,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ChangePasswordScreen() {
  const colors = useAppColors();

  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const passwordRequirements = useMemo(() => {
    return {
      minLength: newPassword.length >= 6,
      hasLetter: /[A-Za-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialCharacter: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordIsValid =
    passwordRequirements.minLength &&
    passwordRequirements.hasLetter &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecialCharacter;

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const currentAndNewAreDifferent =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    currentPassword !== newPassword;

  const canSubmit =
    !!user &&
    !!user.email &&
    currentPassword.length > 0 &&
    passwordIsValid &&
    passwordsMatch &&
    currentAndNewAreDifferent &&
    !loading;

  const getCurrentPasswordError = () => {
    if (!currentPassword) {
      return "";
    }

    return "";
  };

  const getNewPasswordError = () => {
    if (!newPassword) {
      return "";
    }

    if (newPassword.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!/[A-Za-z]/.test(newPassword)) {
      return "Include at least one letter.";
    }

    if (!/\d/.test(newPassword)) {
      return "Include at least one number.";
    }

    if (currentPassword && newPassword === currentPassword) {
      return "New password must be different from your current password.";
    }

    return "";
  };

  const getConfirmPasswordError = () => {
    if (!confirmPassword) {
      return "";
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      Alert.alert(
        "Session Required",
        "Please sign in again before changing your password.",
      );
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        "Current Password Required",
        "Please enter your current password.",
      );
      return;
    }

    if (!passwordIsValid) {
      Alert.alert(
        "Password Requirements",
        "Your new password must contain at least 6 characters, one letter, one number, and one special character.",
      );
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        "Choose a New Password",
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please make sure both new password fields match.",
      );
      return;
    }

    try {
      setLoading(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      Alert.alert(
        "Password Updated",
        "Your AquaGuide AI password has been changed successfully.",
        [
          {
            text: "OK",
          },
        ],
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      let message = "We couldn't change your password. Please try again.";

      switch (error?.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "The current password you entered is incorrect.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many attempts. Please wait a while before trying again.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Please check your internet connection and try again.";
          break;

        case "auth/requires-recent-login":
          message =
            "For security, please sign out and sign in again before changing your password.";
          break;

        case "auth/weak-password":
          message =
            "Your new password is too weak. Please choose a stronger password.";
          break;

        case "auth/user-disabled":
          message = "This account has been disabled. Please contact support.";
          break;

        default:
          break;
      }

      Alert.alert("Unable to Change Password", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader
        title="Change Password"
        subtitle="Keep your AquaGuide AI account secure"
        showBack
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SECURITY HEADER */}

          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={34}
                color={colors.primary}
              />
            </View>

            <View style={styles.heroContent}>
              <Text
                style={[
                  styles.heroTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Secure Your Account
              </Text>

              <Text
                style={[
                  styles.heroText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Choose a strong password that you don't use anywhere else.
              </Text>
            </View>
          </View>

          {/* FORM CARD */}

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.formHeader}>
              <View>
                <Text
                  style={[
                    styles.formTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Update Password
                </Text>

                <Text
                  style={[
                    styles.formSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Verify your current password first.
                </Text>
              </View>

              <View
                style={[
                  styles.formIcon,
                  {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
              >
                <Ionicons name="key-outline" size={21} color={colors.primary} />
              </View>
            </View>

            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              visible={showCurrentPassword}
              onToggleVisibility={() =>
                setShowCurrentPassword((previous) => !previous)
              }
              colors={colors}
              editable={!loading}
              error={getCurrentPasswordError()}
            />

            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              visible={showNewPassword}
              onToggleVisibility={() =>
                setShowNewPassword((previous) => !previous)
              }
              colors={colors}
              editable={!loading}
              error={getNewPasswordError()}
            />

            {/* PASSWORD REQUIREMENTS */}

            <View
              style={[
                styles.requirementsCard,
                {
                  backgroundColor: colors.background,
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
                Password Requirements
              </Text>

              <PasswordRequirement
                text="At least 6 characters"
                valid={passwordRequirements.minLength}
                colors={colors}
              />

              <PasswordRequirement
                text="At least one letter"
                valid={passwordRequirements.hasLetter}
                colors={colors}
              />

              <PasswordRequirement
                text="At least one number"
                valid={passwordRequirements.hasNumber}
                colors={colors}
              />

              <PasswordRequirement
                text="At least one special character"
                valid={passwordRequirements.hasSpecialCharacter}
                colors={colors}
              />

              <PasswordRequirement
                text="Different from current password"
                valid={
                  currentPassword.length > 0 &&
                  newPassword.length > 0 &&
                  currentAndNewAreDifferent
                }
                colors={colors}
              />
            </View>

            <PasswordField
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              visible={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              colors={colors}
              editable={!loading}
              error={getConfirmPasswordError()}
            />

            {/* MATCH INDICATOR */}

            {confirmPassword.length > 0 && !getConfirmPasswordError() && (
              <View
                style={[
                  styles.matchRow,
                  {
                    backgroundColor: colors.success + "12",
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={17}
                  color={colors.success}
                />

                <Text
                  style={[
                    styles.matchText,
                    {
                      color: colors.success,
                    },
                  ]}
                >
                  Passwords match
                </Text>
              </View>
            )}

            {/* UPDATE BUTTON */}

            <Pressable
              onPress={handleChangePassword}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: canSubmit ? colors.primary : colors.border,
                  opacity: pressed && canSubmit ? 0.85 : 1,
                },
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text style={styles.buttonText}>Updating Password...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={canSubmit ? "#FFFFFF" : colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: canSubmit ? "#FFFFFF" : colors.textSecondary,
                      },
                    ]}
                  >
                    Update Password
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* SECURITY NOTE */}

          <View
            style={[
              styles.securityNote,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.securityIcon,
                {
                  backgroundColor: colors.primary + "15",
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={colors.primary}
              />
            </View>

            <View style={styles.securityContent}>
              <Text
                style={[
                  styles.securityTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Your password is protected
              </Text>

              <Text
                style={[
                  styles.securityText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Your current password is verified securely before your new
                password is saved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PasswordRequirement({
  text,
  valid,
  colors,
}: {
  text: string;
  valid: boolean;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={valid ? colors.success : colors.textSecondary}
      />

      <Text
        style={[
          styles.requirementText,
          {
            color: valid ? colors.success : colors.textSecondary,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
  },

  /* HERO */

  heroCard: {
    borderRadius: 23,
    borderWidth: 1,

    padding: 17,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  heroIcon: {
    width: 62,
    height: 62,

    borderRadius: 19,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  heroText: {
    fontSize: 12,
    lineHeight: 18,

    marginTop: 4,
  },

  /* FORM */

  formCard: {
    borderRadius: 23,
    borderWidth: 1,

    padding: 17,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 21,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  formSubtitle: {
    fontSize: 11,

    marginTop: 3,
  },

  formIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  /* INPUT */

  fieldWrapper: {
    marginBottom: 15,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "800",

    marginBottom: 7,
  },

  inputContainer: {
    height: 55,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,

    height: "100%",

    fontSize: 15,

    marginLeft: 9,
    marginRight: 7,
  },

  visibilityButton: {
    width: 30,
    height: 35,

    justifyContent: "center",
    alignItems: "center",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 5,
    paddingHorizontal: 2,
  },

  errorText: {
    fontSize: 11,

    marginLeft: 5,

    flex: 1,
  },

  /* REQUIREMENTS */

  requirementsCard: {
    borderRadius: 15,
    borderWidth: 1,

    padding: 12,

    marginBottom: 15,
  },

  requirementsTitle: {
    fontSize: 12,
    fontWeight: "800",

    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 5,
  },

  requirementText: {
    fontSize: 11,

    marginLeft: 7,
  },

  /* MATCH */

  matchRow: {
    borderRadius: 11,

    minHeight: 36,

    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",

    marginTop: -5,
    marginBottom: 14,
  },

  matchText: {
    fontSize: 11,
    fontWeight: "700",

    marginLeft: 6,
  },

  /* BUTTON */

  button: {
    minHeight: 56,

    borderRadius: 17,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 4,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "800",

    marginLeft: 8,
  },

  /* SECURITY NOTE */

  securityNote: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 14,
  },

  securityIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  securityContent: {
    flex: 1,

    marginLeft: 10,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  securityText: {
    fontSize: 11,
    lineHeight: 17,

    marginTop: 3,
  },
});
