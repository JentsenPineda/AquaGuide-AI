import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={26} color="#00BCD4" />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.featureTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.featureSubtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title=" " showBack={false} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}

        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <Image source={require("../Icon/iconnn.png")} style={styles.logo} />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            AquaGuide AI
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.primary,
              },
            ]}
          >
            Intelligent Aquarium Assistant
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Helping you identify ornamental fish, manage aquarium care, and
            receive AI-powered recommendations.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureCard
            icon="scan-outline"
            title="AI Fish Identification"
            subtitle="Recognize ornamental fish instantly using AI."
          />

          <FeatureCard
            icon="water-outline"
            title="Tank & Care Guide"
            subtitle="Receive tank size, care tips, and water recommendations."
          />

          <FeatureCard
            icon="notifications-outline"
            title="Smart Reminders"
            subtitle="Never miss feeding, maintenance, or water changes."
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              shadowColor: "#00BCD4",
            },
          ]}
          activeOpacity={0.9}
          onPress={() => router.push("/auth/login")}
        >
          <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />

          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.registerButton,
            {
              borderColor: "#00BCD4",
              backgroundColor: colors.card,
            },
          ]}
          activeOpacity={0.9}
          onPress={() => router.push("/auth/register")}
        >
          <Ionicons name="person-add-outline" size={22} color="#00BCD4" />

          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text
            style={[
              styles.guestText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Continue as Guest
          </Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.textSecondary}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.version,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          AquaGuide AI • Version 1.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
  },

  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,

    backgroundColor: "#E8FAFD",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 30,
  },

  title: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    marginTop: 18,
    textAlign: "center",
    lineHeight: 28,
    fontSize: 16,
    paddingHorizontal: 20,
  },

  features: {
    marginTop: 35,
    gap: 14,
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 18,

    borderRadius: 22,

    borderWidth: 1,

    marginBottom: 16,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  featureIcon: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: "#E8FAFD",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  featureSubtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 21,
  },

  loginButton: {
    marginTop: 34,

    height: 60,

    borderRadius: 20,

    backgroundColor: "#00BCD4",

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    elevation: 6,

    shadowOpacity: 0.25,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",

    marginLeft: 8,
  },

  registerButton: {
    marginTop: 18,

    height: 60,

    borderRadius: 20,

    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  registerText: {
    color: "#00BCD4",

    fontSize: 18,

    fontWeight: "800",

    marginLeft: 8,
  },

  guestButton: {
    marginTop: 24,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },

  guestText: {
    fontSize: 15,

    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    marginTop: 28,
    marginBottom: 15,
    fontSize: 13,
  },
});
