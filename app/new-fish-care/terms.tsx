import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const TERMS_KEY = "new_fish_care_terms_accepted";
const TERMS_VERSION = "1.0";

export default function NewFishCareTerms() {
  const colors = useAppColors();

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!accepted || loading) {
      return;
    }

    try {
      setLoading(true);

      await AsyncStorage.setItem(TERMS_KEY, TERMS_VERSION);

      router.replace("/new-fish-care");
    } catch (error) {
      console.error("Failed to save New Fish Care terms:", error);
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
      <AppHeader title="New Fish Care" subtitle="Important Notice" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary + "14",
                borderColor: colors.primary + "30",
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={42}
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
            New Fish Care
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Important Notice & User Acknowledgement
          </Text>
        </View>

        {/* INTRODUCTION */}
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.noticeHeader}>
            <Ionicons
              name="information-circle-outline"
              size={23}
              color={colors.primary}
            />

            <Text
              style={[
                styles.noticeTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Please Read Before Continuing
            </Text>
          </View>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Before using the New Fish Care module, please read the following
            information carefully. This module provides general educational
            guidance intended to help aquarium keepers understand the basic
            process of introducing and acclimating newly acquired ornamental
            fish.
          </Text>
        </View>

        {/* SECTION 1 */}
        <TermsSection
          colors={colors}
          icon="book-outline"
          title="1. Educational Purpose"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            The information provided in AquaGuide AI's New Fish Care module is
            intended for educational and informational purposes. It is designed
            to provide general guidance about fish acclimation, aquarium
            preparation, observation, and basic first-week care.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            The recommendations provided by the application should not be
            considered a substitute for professional aquatic animal care,
            veterinary advice, or expert consultation.
          </Text>
        </TermsSection>

        {/* SECTION 2 */}
        <TermsSection
          colors={colors}
          icon="water-outline"
          title="2. Acclimation and Fish Health"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Moving a fish from one environment to another can cause significant
            stress. Differences in water temperature, pH, hardness, ammonia,
            nitrite, nitrate, salinity, and other water conditions may affect
            the health and behavior of the fish.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            The acclimation instructions provided by AquaGuide AI are general
            recommendations. They may not be suitable for every fish, species,
            individual condition, aquarium, transportation method, or water
            source.
          </Text>
        </TermsSection>

        {/* SECTION 3 */}
        <TermsSection
          colors={colors}
          icon="fish-outline"
          title="3. Individual Fish Differences"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Every fish is different. A fish's age, species, size, health
            condition, previous environment, transportation stress, nutritional
            condition, and history may influence how it responds to acclimation.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Even when recommended procedures are followed carefully, a fish may
            continue to experience stress, become ill, develop health problems,
            or fail to survive.
          </Text>
        </TermsSection>

        {/* SECTION 4 */}
        <TermsSection
          colors={colors}
          icon="flask-outline"
          title="4. Water Quality and Aquarium Conditions"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Successful acclimation depends on more than the acclimation
            procedure itself. Proper aquarium conditions are also important.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Users should consider water temperature, pH, water quality,
            filtration, oxygenation, tank size, stocking levels, cleanliness,
            compatibility, and other environmental factors before introducing a
            fish.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Poor aquarium conditions may negatively affect fish health
            regardless of whether the acclimation procedure is followed.
          </Text>
        </TermsSection>

        {/* SECTION 5 */}
        <TermsSection
          colors={colors}
          icon="list-outline"
          title="5. Following the Guide"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Users should read and understand each instruction before applying it
            to their aquarium.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Do not perform an instruction if you are unsure about its safety or
            suitability for your fish. Consider the specific needs of your fish
            species and aquarium before making changes.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            When necessary, seek assistance from an experienced fishkeeper,
            aquatic animal professional, or veterinarian.
          </Text>
        </TermsSection>

        {/* SECTION 6 */}
        <TermsSection
          colors={colors}
          icon="alert-circle-outline"
          title="6. No Guarantee of Results"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            AquaGuide AI does not guarantee that following the instructions in
            this module will prevent stress, illness, injury, or death of a
            fish.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Fish health and survival can be affected by circumstances outside
            the control of the application or its developers.
          </Text>
        </TermsSection>

        {/* SECTION 7 */}
        <TermsSection
          colors={colors}
          icon="shield-outline"
          title="7. Limitation of Responsibility"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            AquaGuide AI and its developers provide the information in this
            module on a general educational basis and do not guarantee the
            outcome of any procedure or recommendation.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            To the extent permitted by applicable law, AquaGuide AI and its
            developers are not responsible for fish loss, illness, injury,
            death, aquarium damage, equipment damage, financial loss, or other
            consequences that may occur from the use, interpretation, or
            application of information provided through this module.
          </Text>
        </TermsSection>

        {/* SECTION 8 */}
        <TermsSection
          colors={colors}
          icon="person-outline"
          title="8. User Responsibility"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            The user is responsible for evaluating whether any recommendation is
            appropriate for their particular fish and aquarium.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Users are responsible for monitoring their fish and aquarium
            conditions and for making appropriate decisions regarding their
            animals' care.
          </Text>
        </TermsSection>

        {/* SECTION 9 */}
        <TermsSection
          colors={colors}
          icon="medical-outline"
          title="9. When to Seek Professional Advice"
        >
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            If a fish shows severe distress, persistent abnormal behavior,
            serious injury, signs of disease, difficulty breathing, prolonged
            loss of appetite, or other concerning symptoms, users should seek
            advice from a qualified aquatic animal professional or veterinarian.
          </Text>

          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Do not rely solely on the application when dealing with serious or
            rapidly worsening fish health problems.
          </Text>
        </TermsSection>

        {/* FINAL ACKNOWLEDGEMENT */}
        <View
          style={[
            styles.finalCard,
            {
              backgroundColor: colors.primary + "0D",
              borderColor: colors.primary + "35",
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={28}
            color={colors.primary}
          />

          <Text
            style={[
              styles.finalTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Your Acknowledgement
          </Text>

          <Text
            style={[
              styles.finalText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            By continuing, you acknowledge that you have read and understood
            this notice. You understand that AquaGuide AI provides general
            educational fishkeeping guidance and that following the
            recommendations does not guarantee the health or survival of your
            fish.
          </Text>

          <Text
            style={[
              styles.finalText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            You understand that aquarium conditions, fish health, transportation
            stress, water quality, equipment, species requirements, and other
            circumstances may affect the outcome of fish acclimation and care.
          </Text>
        </View>

        {/* CHECKBOX */}
        <Pressable
          onPress={() => setAccepted((value) => !value)}
          style={styles.checkboxRow}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: accepted ? colors.primary : colors.border,
                backgroundColor: accepted ? colors.primary : "transparent",
              },
            ]}
          >
            {accepted && (
              <Ionicons name="checkmark" size={17} color="#FFFFFF" />
            )}
          </View>

          <Text
            style={[
              styles.checkboxText,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            I have read and understood this notice and agree to use the
            information provided by AquaGuide AI at my own discretion.
          </Text>
        </Pressable>

        {/* CONTINUE */}
        <Pressable
          disabled={!accepted || loading}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            {
              backgroundColor: accepted ? colors.primary : colors.border,
              opacity: loading ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.continueText,
              {
                color: accepted ? "#FFFFFF" : colors.textSecondary,
              },
            ]}
          >
            {loading ? "Saving..." : "Continue to New Fish Care"}
          </Text>

          {accepted && !loading && (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          )}
        </Pressable>

        <Text
          style={[
            styles.version,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Notice Version {TERMS_VERSION}
        </Text>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

/* ========================================================================== */
/* TERMS SECTION                                                              */
/* ========================================================================== */

function TermsSection({
  colors,
  icon,
  title,
  children,
}: {
  colors: ReturnType<typeof useAppColors>;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIcon,
            {
              backgroundColor: colors.primary + "12",
            },
          ]}
        >
          <Ionicons name={icon} size={21} color={colors.primary} />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 24,
  },

  iconContainer: {
    width: 82,
    height: 82,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },

  /* Introduction */

  introCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },

  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  noticeTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 9,
  },

  /* Sections */

  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 11,
  },

  sectionContent: {
    gap: 12,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
  },

  /* Final acknowledgement */

  finalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 19,
    marginTop: 6,
    marginBottom: 18,
  },

  finalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 10,
  },

  finalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },

  /* Checkbox */

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingHorizontal: 3,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
    marginTop: 1,
  },

  checkboxText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: "600",
  },

  /* Continue */

  continueButton: {
    minHeight: 56,
    borderRadius: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  continueText: {
    fontSize: 15.5,
    fontWeight: "800",
  },

  version: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 12,
  },

  bottomSpace: {
    height: 25,
  },
});
