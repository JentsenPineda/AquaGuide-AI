import AppHeader from "@/components/layout/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
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
  const { colorScheme } = useTheme();
  const colors = useAppColors();

  const isDark = colorScheme === "dark";

  const authenticationBackground = isDark
    ? require("../../assets/images/authentication-background-dark.png")
    : require("../../assets/images/authentication-background-light.png");

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

  const navigateAfterKeyboardDismiss = (
    path: "/auth/forgot-password" | "/auth/register",
  ) => {
    Keyboard.dismiss();

    requestAnimationFrame(() => {
      setTimeout(() => {
        router.push(path);
      }, 100);
    });
  };

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
      console.log("LOGIN EMAIL VERIFIED:", user.emailVerified);

      /*
       * ---------------------------------------------------------------
       * EMAIL VERIFICATION CHECK
       * ---------------------------------------------------------------
       *
       * Firebase authentication can succeed even when the user's
       * email address has not yet been verified.
       *
       * For AquaGuide AI, unverified users are sent to the
       * Email Verification screen instead of continuing into
       * the application.
       */

      if (!user.emailVerified) {
        console.log("LOGIN BLOCKED: EMAIL NOT VERIFIED");

        router.replace({
          pathname: "/auth/verify-email",
          params: {
            email: user.email ?? normalizedEmail,
          },
        });

        return;
      }

      console.log("LOGIN EMAIL VERIFIED: CONTINUING");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      console.log("LOGIN ERROR CODE:", error?.code);
      console.log("LOGIN ERROR MESSAGE:", error?.message);

      let message = "Unable to login.";

      switch (error?.code) {
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

        case "auth/network-request-failed":
          message =
            "Network connection failed. Please check your internet connection and try again.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many login attempts. Please wait a moment and try again.";
          break;

        default:
          message = error?.message || "Unable to login.";
      }

      Alert.alert("Login Failed", message);

      return;
    } finally {
      setLoading(false);
    }

    console.log("LOGIN SUCCESSFUL");
    console.log("LOGIN REDIRECT:", redirect);

    /* ------------------------------------------------------------------ */
    /* MENU                                                               */
    /* ------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------ */
    /* NEW FISH CARE                                                      */
    /* ------------------------------------------------------------------ */

    if (redirect === "newFishCare") {
      /*
       * Important:
       *
       * Do NOT send the user directly to
       * /new-fish-care here.
       *
       * The New Fish Care screen is responsible
       * for checking whether the user has accepted
       * the New Fish Care notice.
       *
       * Therefore we return the user to the
       * New Fish Care entry screen first.
       *
       * If the notice has NOT been accepted:
       *     /new-fish-care
       *          ↓
       *     /new-fish-care/terms
       *
       * If the notice HAS already been accepted:
       *     /new-fish-care
       *          ↓
       *     Dashboard
       */

      Alert.alert("Welcome!", `Hello ${user.displayName ?? "Aquarist"}`, [
        {
          text: "Proceed",
          onPress: () => {
            router.replace("/new-fish-care/terms");
          },
        },
      ]);

      return;
    }

    /* ------------------------------------------------------------------ */
    /* OTHER LOGIN DESTINATIONS                                           */
    /* ------------------------------------------------------------------ */

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
    <View style={styles.container}>
      {/* Theme-specific authentication background */}
      <Image
        source={authenticationBackground}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      {/* Soft overlay keeps the form readable without hiding the artwork */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? "rgba(3, 15, 25, 0.18)"
              : "rgba(255, 255, 255, 0.08)",
          },
        ]}
      />

      <AppHeader title=" " subtitle=" " showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Translucent authentication panel */}
          <View
            style={[
              styles.authPanel,
              {
                backgroundColor: isDark
                  ? "rgba(10, 29, 43, 0.78)"
                  : "rgba(255, 255, 255, 0.66)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.72)",
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <Ionicons name="fish" size={58} color={colors.primary} />
            </View>

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

            {/* Email */}
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.58)",
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

            {/* Password */}
            <View
              style={[
                styles.passwordContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.58)",
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

              <TouchableOpacity onPress={() => setSecure(!secure)} hitSlop={8}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Login */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() =>
                navigateAfterKeyboardDismiss("/auth/forgot-password")
              }
            >
              <Text
                style={[
                  styles.link,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Register */}
            <TouchableOpacity
              onPress={() => navigateAfterKeyboardDismiss("/auth/register")}
            >
              <Text
                style={[
                  styles.link,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
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

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },

  authPanel: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,

    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 21,
  },

  input: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },

  button: {
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
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
  },
});
