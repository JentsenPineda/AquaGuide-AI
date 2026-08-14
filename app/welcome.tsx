import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <Ionicons name={icon} size={22} color="#00BCD4" />
      </View>

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
        numberOfLines={2}
      >
        {subtitle}
      </Text>
    </View>
  );
}

export default function WelcomeScreen() {
  const colors = useAppColors();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)");
    }
  }, [loading, user]);

  if (loading || user) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      />
    );
  }

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

      <View style={styles.content}>
        {/* LOGO */}
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
            Intelligent Fish Care Assistant
          </Text>
        </View>

        {/* FEATURES */}
        <View style={styles.features}>
          <FeatureCard
            icon="scan-outline"
            title="AI Identification"
            subtitle="Identify fish with AI"
          />

          <FeatureCard
            icon="water-outline"
            title="Tank & Care"
            subtitle="Tank and water guidance"
          />

          <FeatureCard
            icon="library-outline"
            title="Species Library"
            subtitle="Explore ornamental fish"
          />

          <FeatureCard
            icon="medkit-outline"
            title="Disease Guide"
            subtitle="Learn common fish diseases"
          />
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => router.push("/auth/login")}
          >
            <Ionicons name="log-in-outline" size={21} color="#FFFFFF" />

            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                borderColor: colors.primary,
                backgroundColor: colors.card,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => router.push("/auth/register")}
          >
            <Ionicons
              name="person-add-outline"
              size={21}
              color={colors.primary}
            />

            <Text
              style={[
                styles.registerText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            activeOpacity={0.7}
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
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  hero: {
    alignItems: "center",
    marginTop: 8,
  },

  logoWrapper: {
    width: 105,
    height: 105,
    borderRadius: 52.5,

    backgroundColor: "#E8FAFD",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },

  title: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 18,
  },

  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 10,
  },

  featureCard: {
    flex: 1,
    minHeight: 150,

    borderRadius: 18,
    borderWidth: 1,

    paddingHorizontal: 10,
    paddingVertical: 12,

    alignItems: "center",
    justifyContent: "center",
  },

  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#E8FAFD",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 7,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  featureSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
  },

  actions: {
    marginTop: 20,
    paddingTop: 0,
  },

  loginButton: {
    height: 52,
    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    elevation: 4,

    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 7,
  },

  registerButton: {
    height: 52,
    borderRadius: 17,

    marginTop: 10,

    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  registerText: {
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 7,
  },

  guestButton: {
    height: 42,

    marginTop: 5,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  guestText: {
    fontSize: 14,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 3,
  },
});
