import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { breedingDatabase } from "../data/breedingDatabase";

export default function BreedingResult() {
  const colors = useAppColors();

  const { fish } = useLocalSearchParams<{
    fish?: string;
  }>();

  const fishKey = Array.isArray(fish) ? fish[0] : fish;

  const guide = fishKey
    ? breedingDatabase[fishKey as keyof typeof breedingDatabase]
    : undefined;

  if (!guide) {
    return (
      <View
        style={[
          styles.safe,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="Breeding Guide" showBack />

        <View style={styles.errorContainer}>
          <View
            style={[
              styles.errorIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.errorTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Breeding Guide Not Found
          </Text>

          <Text
            style={[
              styles.errorText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            We couldn't find breeding information for the selected fish species.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Breeding Guide" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: TAB_BAR_HEIGHT + 35,
          },
        ]}
      >
        {/* HEADER */}

        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons name="fish-outline" size={34} color={colors.primary} />
          </View>

          <View style={styles.headerContent}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {guide.name}
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Step-by-step breeding guide
            </Text>
          </View>
        </View>

        {/* OVERVIEW */}

        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.introIcon,
              {
                backgroundColor: colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.introContent}>
            <Text
              style={[
                styles.introTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Breeding Process
            </Text>

            <Text
              style={[
                styles.introText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Follow each step carefully and maintain stable water conditions
              throughout the breeding process.
            </Text>
          </View>
        </View>

        {/* STEPS */}

        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Breeding Steps
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Follow the recommended sequence.
          </Text>
        </View>

        {guide.steps.map((step, index) => (
          <View
            key={`${step.title}-${index}`}
            style={[
              styles.stepCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.stepNumberContainer,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>

            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                STEP {index + 1}
              </Text>

              <Text
                style={[
                  styles.stepTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {step.title}
              </Text>

              <Text
                style={[
                  styles.stepDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        ))}

        {/* COMMON MISTAKES */}

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
                  backgroundColor: colors.primary + "15",
                },
              ]}
            >
              <Ionicons
                name="warning-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.sectionHeaderText}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Common Mistakes
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Things to avoid during breeding.
              </Text>
            </View>
          </View>

          {guide.mistakes?.map((mistake: string, index: number) => (
            <View
              key={`${mistake}-${index}`}
              style={[
                styles.listRow,
                {
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="close-circle-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.listText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {mistake}
              </Text>
            </View>
          ))}
        </View>

        {/* FRY CARE */}

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
                  backgroundColor: colors.primary + "15",
                },
              ]}
            >
              <Ionicons name="fish-outline" size={21} color={colors.primary} />
            </View>

            <View style={styles.sectionHeaderText}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Fry Care
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Important care after spawning.
              </Text>
            </View>
          </View>

          {guide.fryCare?.map((tip: string, index: number) => (
            <View
              key={`${tip}-${index}`}
              style={[
                styles.listRow,
                {
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.listText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {tip}
              </Text>
            </View>
          ))}
        </View>

        {/* PRO TIP */}

        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: colors.primary + "10",
              borderColor: colors.primary + "35",
            },
          ]}
        >
          <View
            style={[
              styles.tipIcon,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons name="bulb-outline" size={21} color="#FFFFFF" />
          </View>

          <View style={styles.tipContent}>
            <Text
              style={[
                styles.tipTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Pro Tip
            </Text>

            <Text
              style={[
                styles.tipText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {guide.tip}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  /* HEADER */

  headerCard: {
    borderRadius: 23,
    borderWidth: 1,

    padding: 17,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  headerIcon: {
    width: 62,
    height: 62,

    borderRadius: 19,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 18,

    marginTop: 4,
  },

  /* INTRO */

  introCard: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 23,
  },

  introIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  introText: {
    fontSize: 12,
    lineHeight: 18,

    marginTop: 3,
  },

  /* SECTION */

  sectionHeading: {
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 17,

    marginTop: 3,
  },

  /* STEPS */

  stepCard: {
    borderRadius: 19,
    borderWidth: 1,

    padding: 14,

    flexDirection: "row",

    marginBottom: 11,
  },

  stepNumberContainer: {
    width: 39,
    height: 39,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  stepNumber: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  stepContent: {
    flex: 1,
  },

  stepLabel: {
    fontSize: 9,
    fontWeight: "700",

    marginBottom: 2,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: "800",

    lineHeight: 21,

    marginBottom: 5,
  },

  stepDescription: {
    fontSize: 13,
    lineHeight: 20,
  },

  /* SECTIONS */

  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,

    padding: 15,

    marginTop: 7,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 7,
  },

  sectionIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  sectionHeaderText: {
    flex: 1,
  },

  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",

    paddingVertical: 10,

    borderBottomWidth: 1,
  },

  listText: {
    flex: 1,

    fontSize: 13,
    lineHeight: 20,

    marginLeft: 9,
  },

  /* PRO TIP */

  tipCard: {
    borderRadius: 20,
    borderWidth: 1,

    padding: 15,

    marginTop: 14,

    flexDirection: "row",
    alignItems: "flex-start",
  },

  tipIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  tipText: {
    fontSize: 13,
    lineHeight: 21,

    marginTop: 5,
  },

  /* ERROR */

  errorContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 35,
  },

  errorIcon: {
    width: 80,
    height: 80,

    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",
  },

  errorTitle: {
    fontSize: 21,
    fontWeight: "800",

    textAlign: "center",

    marginTop: 17,
  },

  errorText: {
    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    marginTop: 7,
  },
});
