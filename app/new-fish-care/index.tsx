import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function NewFishCareScreen() {
  const colors = useAppColors();
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    heroIcon: {
      backgroundColor: colors.card,
    },

    sectionTitle: {
      color: colors.textPrimary,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    timeCard: {
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
        {/* Hero */}
        <ThemeCard style={styles.hero}>
          <View style={[styles.heroIcon, dynamicStyles.heroIcon]}>
            <Ionicons name="fish" size={70} color={colors.primary} />
          </View>

          <ThemeText variant="title" style={styles.title}>
            Welcome Your New Fish
          </ThemeText>

          <ThemeText variant="body" style={styles.subtitle}>
            Follow this interactive guide to safely acclimate your newly
            purchased fish. Proper acclimation reduces stress, prevents water
            shock, and lowers the risk of diseases.
          </ThemeText>
        </ThemeCard>

        {/* Benefits */}
        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          Why Proper Acclimation Matters
        </ThemeText>

        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="heart" size={30} color={colors.primary} />

          <View style={styles.cardContent}>
            <ThemeText variant="subtitle">Reduce Stress</ThemeText>

            <ThemeText variant="body" style={styles.cardText}>
              Fish experience stress during transportation. Proper acclimation
              helps them recover safely.
            </ThemeText>
          </View>
        </ThemeCard>

        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="water" size={30} color="#2196F3" />

          <View style={styles.cardContent}>
            <ThemeText variant="subtitle">Prevent Water Shock</ThemeText>

            <ThemeText variant="body" style={styles.cardText}>
              Sudden changes in temperature or water chemistry can seriously
              harm your fish.
            </ThemeText>
          </View>
        </ThemeCard>

        <ThemeCard style={[styles.card, dynamicStyles.card]}>
          <Ionicons name="shield-checkmark" size={30} color="#4CAF50" />

          <View style={styles.cardContent}>
            <ThemeText variant="subtitle">Prevent Diseases</ThemeText>

            <ThemeText variant="body" style={styles.cardText}>
              A stress-free acclimation process strengthens the immune system
              and reduces disease risk.
            </ThemeText>
          </View>
        </ThemeCard>

        {/* Time */}
        <ThemeCard style={[styles.timeCard, dynamicStyles.timeCard]}>
          <Ionicons name="time" size={32} color="#FF9800" />

          <ThemeText variant="subtitle" style={styles.timeTitle}>
            Estimated Guide Duration
          </ThemeText>

          <ThemeText variant="title" style={styles.timeValue}>
            30 – 45 Minutes
          </ThemeText>
        </ThemeCard>

        {/* Buttons */}
        <ThemeButton
          title="Start Guide"
          onPress={() => router.push("/new-fish-care/preparation")}
          style={styles.startButton}
        />

        <TouchableOpacity style={styles.learnButton}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#00BCD4"
          />

          <ThemeText variant="subtitle" style={styles.learnText}>
            Why Is Acclimation Important?
          </ThemeText>
        </TouchableOpacity>
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
    marginTop: 15,
    marginBottom: 30,
  },

  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    marginTop: 15,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  cardContent: {
    flex: 1,
    marginLeft: 15,
  },

  cardText: {
    lineHeight: 22,
    fontSize: 15,
  },

  timeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    padding: 25,
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },

  timeTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
  },

  timeValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#FF9800",
  },

  startButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },

  learnButton: {
    borderWidth: 2,
    borderColor: "#00BCD4",
    borderRadius: 18,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  learnText: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
});
