// app/(tabs)/new-fish-care/success.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SuccessScreen() {
  const colors = useAppColors();
  const scrollRef = useRef<ScrollView>(null);

  const returnHome = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      router.replace("/(tabs)");
    }, 150);
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
      <AppHeader title="New Fish Care" showBack />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: TAB_BAR_HEIGHT + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* SUCCESS HERO */}

        <ThemeCard style={styles.hero}>
          <View
            style={[
              styles.successCircle,
              {
                backgroundColor: "#4CAF5014",
                borderColor: "#4CAF5030",
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={82} color="#4CAF50" />
          </View>

          <View
            style={[
              styles.completeBadge,
              {
                backgroundColor: "#4CAF5014",
              },
            ]}
          >
            <ThemeText
              variant="subtitle"
              style={[
                styles.completeBadgeText,
                {
                  color: "#4CAF50",
                },
              ]}
            >
              CARE GUIDE COMPLETED
            </ThemeText>
          </View>

          <ThemeText variant="title" style={styles.title}>
            Congratulations!
          </ThemeText>

          <ThemeText
            variant="body"
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            You have successfully completed the New Fish Care Guide. Your fish
            now has a much better chance of adapting safely to its new aquarium.
          </ThemeText>
        </ThemeCard>

        {/* ACHIEVEMENT */}

        <View
          style={[
            styles.achievement,
            {
              backgroundColor: "#FFC10712",
              borderColor: "#FFC10730",
            },
          ]}
        >
          <View style={styles.achievementIcon}>
            <Ionicons name="ribbon" size={25} color="#FFC107" />
          </View>

          <View style={styles.achievementContent}>
            <ThemeText variant="subtitle" style={styles.achievementTitle}>
              Achievement Unlocked
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.achievementText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              First Successful Fish Acclimation
            </ThemeText>
          </View>

          <Ionicons name="checkmark-circle" size={23} color="#4CAF50" />
        </View>

        {/* LEARNED */}

        <View style={styles.sectionHeader}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            What You've Learned
          </ThemeText>

          <ThemeText
            variant="body"
            style={[
              styles.sectionSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Key practices from the New Fish Care Guide.
          </ThemeText>
        </View>

        {[
          "Proper acclimation reduces fish stress.",
          "Slow adjustment prevents water shock.",
          "Observe your fish during its first week.",
          "Feed lightly and maintain clean water.",
        ].map((item, index) => (
          <View
            key={index}
            style={[
              styles.learningCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.learningIcon}>
              <Ionicons name="checkmark" size={17} color="#4CAF50" />
            </View>

            <ThemeText
              variant="body"
              style={[
                styles.learningText,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {item}
            </ThemeText>
          </View>
        ))}

        {/* RECOMMENDATION */}

        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: colors.primary + "0D",
              borderColor: colors.primary + "28",
            },
          ]}
        >
          <View
            style={[
              styles.tipIcon,
              {
                backgroundColor: colors.primary + "16",
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={23}
              color={colors.primary}
            />
          </View>

          <View style={styles.tipContent}>
            <ThemeText variant="subtitle" style={styles.tipTitle}>
              AquaGuide AI Recommendation
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.tipText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Continue observing your fish for the next seven days. If you
              notice unusual behavior, visit the Disease Guide or use AI Fish
              Recognition for additional guidance.
            </ThemeText>
          </View>
        </View>

        {/* ACTIONS */}

        <ThemeButton
          title="Return to Home"
          onPress={returnHome}
          style={styles.primaryButton}
        />

        <ThemeButton
          title="Open Species Library"
          variant="outline"
          onPress={() => router.push("/library")}
          style={styles.secondaryButton}
        />

        <ThemeButton
          title="Set Feeding Reminder"
          variant="outline"
          onPress={() => router.push("/reminder")}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 18,
  },

  hero: {
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    marginBottom: 16,
  },

  successCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  completeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },

  completeBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 23,
  },

  achievement: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  achievementIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFC10718",
    justifyContent: "center",
    alignItems: "center",
  },

  achievementContent: {
    flex: 1,
    marginLeft: 12,
  },

  achievementTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  achievementText: {
    fontSize: 13,
    marginTop: 3,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  learningCard: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  learningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF5018",
    justifyContent: "center",
    alignItems: "center",
  },

  learningText: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13.5,
    lineHeight: 20,
  },

  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 24,
  },

  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 12,
  },

  tipTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  tipText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  primaryButton: {
    height: 56,
    borderRadius: 17,
    marginBottom: 10,
  },

  secondaryButton: {
    height: 54,
    borderRadius: 17,
    marginBottom: 10,
  },
});
