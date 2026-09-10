import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
            backgroundColor: colors.primary + "20",
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <Text
        style={[
          styles.featureTitle,
          {
            color: colors.textPrimary,
          },
        ]}
        numberOfLines={1}
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
  const { colorScheme } = useTheme();
  const { user, loading } = useAuth();

  const { width, height } = useWindowDimensions();

  const isDark = colorScheme === "dark";

  /*
   * Responsive sizing.
   *
   * Short phones use a more compact layout so that
   * the complete Welcome screen fits without scrolling.
   */
  const isSmallScreen = height < 700;
  const isVerySmallScreen = height < 640;

  /*
   * Exact card width calculation.
   *
   * This keeps the four feature cards in a fixed
   * 2 x 2 layout across different Android widths.
   */
  const horizontalPadding = width < 360 ? 14 : 20;
  const contentWidth = width - horizontalPadding * 2;
  const cardGap = width < 360 ? 7 : 9;
  const cardWidth = (contentWidth - cardGap) / 2;

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
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      {/* =====================================================
          FULL SCREEN UNDERWATER BACKGROUND
          ===================================================== */}

      <Image
        source={require("../assets/images/welcome-screen-background.png")}
        style={[
          StyleSheet.absoluteFill,
          {
            /*
             * Keep Light Mode bright.
             *
             * Dark Mode uses the dark application palette
             * underneath the image so the underwater scene
             * remains visible without overpowering the text.
             */
            opacity: isDark ? 0.42 : 1,
          },
        ]}
        resizeMode="cover"
      />

      {/* =====================================================
          READABILITY OVERLAY
          ===================================================== */}

      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? "rgba(8, 20, 31, 0.10)"
              : "rgba(244, 247, 250, 0.04)",
          },
        ]}
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {/* ===================================================
            HERO
            =================================================== */}

        <View style={styles.hero}>
          <View
            style={[
              styles.logoOuter,
              {
                width: isVerySmallScreen ? 72 : isSmallScreen ? 82 : 92,

                height: isVerySmallScreen ? 72 : isSmallScreen ? 82 : 92,

                borderRadius: isVerySmallScreen ? 36 : isSmallScreen ? 41 : 46,

                backgroundColor: colors.card,
              },
            ]}
          >
            <View
              style={[
                styles.logoWrapper,
                {
                  width: isVerySmallScreen ? 62 : isSmallScreen ? 70 : 78,

                  height: isVerySmallScreen ? 62 : isSmallScreen ? 70 : 78,

                  borderRadius: isVerySmallScreen
                    ? 31
                    : isSmallScreen
                      ? 35
                      : 39,

                  backgroundColor: colors.card,
                },
              ]}
            >
              <Image
                source={require("../Icon/iconnn.png")}
                style={[
                  styles.logo,
                  {
                    width: isVerySmallScreen ? 50 : isSmallScreen ? 57 : 64,

                    height: isVerySmallScreen ? 50 : isSmallScreen ? 57 : 64,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,

                fontSize: isVerySmallScreen ? 24 : isSmallScreen ? 26 : 29,

                marginTop: isVerySmallScreen ? 5 : isSmallScreen ? 7 : 9,
              },
            ]}
          >
            AquaGuide <Text style={{ color: colors.primary }}>AI</Text>
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary + "20",

                marginTop: isVerySmallScreen ? 3 : isSmallScreen ? 4 : 6,
              },
            ]}
          >
            <Ionicons name="sparkles" size={11} color={colors.primary} />

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
                /*
                 * Dark Mode needs brighter text because
                 * the background is still visible behind it.
                 */
                color: isDark ? "#E6F7FA" : colors.textSecondary,

                marginTop: isVerySmallScreen ? 3 : isSmallScreen ? 4 : 6,
              },
            ]}
          >
            Your intelligent companion for better fish keeping.
          </Text>
        </View>

        {/* ===================================================
            FEATURES
            =================================================== */}

        <View
          style={[
            styles.featureSection,
            {
              marginTop: isVerySmallScreen ? 8 : isSmallScreen ? 11 : 15,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,

                fontSize: isVerySmallScreen ? 16 : isSmallScreen ? 17 : 18,
              },
            ]}
          >
            Everything you need for your aquarium
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: isDark ? "#D5EEF2" : colors.textSecondary,

                marginTop: isVerySmallScreen ? 1 : 3,
              },
            ]}
          >
            Tools and guides designed for better fish care.
          </Text>

          <View
            style={[
              styles.features,
              {
                columnGap: cardGap,

                rowGap: isVerySmallScreen ? 5 : isSmallScreen ? 6 : 8,

                marginTop: isVerySmallScreen ? 6 : isSmallScreen ? 8 : 10,
              },
            ]}
          >
            <View style={{ width: cardWidth }}>
              <FeatureCard
                icon="scan-outline"
                title="AI Identification"
                subtitle="Identify ornamental fish with AI"
              />
            </View>

            <View style={{ width: cardWidth }}>
              <FeatureCard
                icon="water-outline"
                title="Tank & Care"
                subtitle="Water, tank and maintenance guidance"
              />
            </View>

            <View style={{ width: cardWidth }}>
              <FeatureCard
                icon="library-outline"
                title="Species Library"
                subtitle="Explore ornamental fish species"
              />
            </View>

            <View style={{ width: cardWidth }}>
              <FeatureCard
                icon="medkit-outline"
                title="Disease Guide"
                subtitle="Learn about common fish diseases"
              />
            </View>
          </View>
        </View>

        {/* ===================================================
            ACTION BUTTONS
            =================================================== */}

        <View
          style={[
            styles.actions,
            {
              marginTop: isVerySmallScreen ? 7 : isSmallScreen ? 9 : 13,
            },
          ]}
        >
          {/* SIGN IN */}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                height: isVerySmallScreen ? 42 : isSmallScreen ? 45 : 48,

                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/login")}
          >
            <Ionicons name="log-in-outline" size={19} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* CREATE ACCOUNT */}

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                height: isVerySmallScreen ? 42 : isSmallScreen ? 45 : 48,

                backgroundColor: colors.card,
                borderColor: colors.primary,

                marginTop: isVerySmallScreen ? 5 : 7,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/register")}
          >
            <Ionicons
              name="person-add-outline"
              size={18}
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

          {/* GUEST */}

          <TouchableOpacity
            style={[
              styles.guestButton,
              {
                height: isVerySmallScreen ? 32 : isSmallScreen ? 35 : 38,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text
              style={[
                styles.guestText,
                {
                  /*
                   * White in Dark Mode for strong contrast.
                   */
                  color: isDark ? "#FFFFFF" : colors.textSecondary,
                },
              ]}
            >
              Continue as Guest
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color={isDark ? "#FFFFFF" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <View
          style={[
            styles.footer,
            {
              marginTop: isVerySmallScreen ? 1 : isSmallScreen ? 2 : 4,
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={11}
            color={isDark ? "#C8E2E6" : colors.textSecondary}
          />

          <Text
            style={[
              styles.footerText,
              {
                color: isDark ? "#C8E2E6" : colors.textSecondary,
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
              color: isDark ? "#B8D5DA" : colors.textSecondary,
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

  loadingContainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 18,
  },

  /* =====================================================
     HERO
     ===================================================== */

  hero: {
    alignItems: "center",
  },

  logoOuter: {
    justifyContent: "center",
    alignItems: "center",

    elevation: 6,

    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",

    elevation: 2,

    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  logo: {
    borderRadius: 18,
  },

  title: {
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9,
    paddingVertical: 4,

    borderRadius: 20,
  },

  badgeText: {
    marginLeft: 5,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.45,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 15,
  },

  /* =====================================================
     FEATURES
     ===================================================== */

  featureSection: {
    width: "100%",
  },

  sectionTitle: {
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 3,
  },

  sectionSubtitle: {
    fontSize: 10.5,
    lineHeight: 14,
    textAlign: "center",
    paddingHorizontal: 5,
  },

  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  featureCard: {
    width: "100%",
    minHeight: 94,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 6,
    paddingVertical: 7,

    alignItems: "center",
    justifyContent: "center",
  },

  featureIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 4,
  },

  featureTitle: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  featureSubtitle: {
    marginTop: 2,
    fontSize: 8.5,
    lineHeight: 11,
    textAlign: "center",
    paddingHorizontal: 2,
  },

  /* =====================================================
     ACTIONS
     ===================================================== */

  actions: {
    width: "100%",
  },

  primaryButton: {
    borderRadius: 15,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 7,
  },

  secondaryButton: {
    borderRadius: 15,

    borderWidth: 1.5,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 7,
  },

  guestButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  guestText: {
    fontSize: 12,
    fontWeight: "700",
    marginRight: 5,
  },

  /* =====================================================
     FOOTER
     ===================================================== */

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: 9,
    marginLeft: 4,
  },

  version: {
    textAlign: "center",
    fontSize: 8,
    marginTop: 1,
  },
});
