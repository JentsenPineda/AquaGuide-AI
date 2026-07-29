// app/(tabs)/new-fish-care/success.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SuccessScreen() {
  const colors = useAppColors();
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    hero: {
      backgroundColor: colors.card,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="New Fish Care" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemeCard style={[styles.hero, dynamicStyles.hero]}>
          <View style={styles.circle}>
            <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
          </View>

          <ThemeText variant="title" style={styles.title}>
            Congratulations!
          </ThemeText>
          <ThemeText variant="body" style={styles.subtitle}>
            You have successfully completed the New Fish Care Guide. Your fish
            now has a much better chance of adapting safely to its new aquarium.
          </ThemeText>
        </ThemeCard>

        <ThemeCard style={styles.achievementCard}>
          <Ionicons name="ribbon" size={34} color="#FFC107" />

          <View style={styles.achievementContent}>
            <ThemeText variant="subtitle" style={styles.achievementTitle}>
              Achievement Unlocked
            </ThemeText>
            <ThemeText variant="body" style={styles.achievementText}>
              🏅 First Successful Fish Acclimation
            </ThemeText>
          </View>
        </ThemeCard>
        <ThemeText variant="subtitle" style={styles.sectionTitle}>
          What You've Learned
        </ThemeText>
        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <ThemeText variant="body" style={styles.cardText}>
            Proper acclimation reduces fish stress.
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <ThemeText variant="body" style={styles.cardText}>
            Slow adjustment prevents water shock.
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <ThemeText variant="body" style={styles.cardText}>
            Observe your fish during its first week.
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />

          <ThemeText variant="body" style={styles.cardText}>
            Feed lightly and maintain clean water.
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemeText variant="subtitle" style={styles.tipTitle}>
              AquaGuide AI Recommendation
            </ThemeText>
            <ThemeText variant="body" style={styles.tipText}>
              Continue observing your fish for the next seven days. If you
              notice unusual behavior, visit the Disease Guide or use AI Fish
              Recognition for additional guidance.
            </ThemeText>
          </View>
        </ThemeCard>
        <ThemeButton
          title="Return to Home"
          onPress={() => router.replace("/")}
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
    backgroundColor: "#F2FBFD",
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  hero: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 30,
  },

  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8F9EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.85,
  },

  achievementCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    alignItems: "center",
  },

  achievementContent: {
    marginLeft: 15,
    flex: 1,
  },

  achievementTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  achievementText: {
    marginTop: 5,
    fontSize: 15,
    opacity: 0.85,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  cardText: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
    opacity: 0.9,
  },

  tipCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginVertical: 25,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  tipText: {
    lineHeight: 23,
    fontSize: 15,
    opacity: 0.85,
  },

  primaryButton: {
    height: 58,
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
});
