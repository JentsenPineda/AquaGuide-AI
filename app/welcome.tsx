import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
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
      <View
        style={[
          styles.featureIcon,
          {
            backgroundColor: colors.primary + "18",
          },
        ]}
      >
        <Ionicons name={icon} size={21} color={colors.primary} />
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
          styles.loadingContainer,
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
      <AppHeader title="" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.logoOuter}>
            <View
              style={[
                styles.logoWrapper,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Image
                source={require("../Icon/iconnn.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
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

          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons name="sparkles" size={14} color={colors.primary} />

            <Text
              style={[
                styles.badgeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              SMART ORNAMENTAL FISH CARE
            </Text>
          </View>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your intelligent companion for better fish keeping.
          </Text>
        </View>

        {/* FEATURES */}
        <View style={styles.featureSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Everything you need for your aquarium
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Explore tools and guides designed to help you care for your
            ornamental fish.
          </Text>

          <View style={styles.features}>
            <FeatureCard
              icon="scan-outline"
              title="AI Identification"
              subtitle="Identify ornamental fish with AI"
            />

            <FeatureCard
              icon="water-outline"
              title="Tank & Care"
              subtitle="Water, tank and maintenance guidance"
            />

            <FeatureCard
              icon="library-outline"
              title="Species Library"
              subtitle="Explore ornamental fish species"
            />

            <FeatureCard
              icon="medkit-outline"
              title="Disease Guide"
              subtitle="Learn about common fish diseases"
            />
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/login")}
          >
            <Ionicons name="log-in-outline" size={21} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/register")}
          >
            <Ionicons
              name="person-add-outline"
              size={21}
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
            />
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={14}
            color={colors.textSecondary}
          />

          <Text
            style={[
              styles.footerText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Built for ornamental fish keepers
          </Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  /* HERO */

  hero: {
    alignItems: "center",
    paddingTop: 10,
  },

  logoOuter: {
    width: 128,
    height: 128,
    borderRadius: 64,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  logoWrapper: {
    width: 108,
    height: 108,
    borderRadius: 54,

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 24,
  },

  title: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.5,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    marginTop: 10,
  },

  badgeText: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  /* FEATURES */

  featureSection: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    paddingHorizontal: 12,
  },

  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 10,
  },

  featureCard: {
    width: "48.5%",
    minHeight: 132,

    borderRadius: 18,
    borderWidth: 1,

    paddingHorizontal: 12,
    paddingVertical: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 9,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  featureSubtitle: {
    marginTop: 4,
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: "center",
  },

  /* ACTIONS */

  actions: {
    marginTop: 26,
  },

  primaryButton: {
    height: 56,
    borderRadius: 17,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 17,

    marginTop: 10,

    borderWidth: 1.5,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
  },

  guestButton: {
    height: 46,

    marginTop: 7,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  guestText: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 5,
  },

  /* FOOTER */

  footer: {
    marginTop: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: 11,
    marginLeft: 5,
  },

  version: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 6,
  },
});
