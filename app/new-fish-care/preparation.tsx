// app/(tabs)/new-fish-care/preparation.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const checklist = [
  "My aquarium is fully cycled",
  "The filter is running properly",
  "The heater is working (if required)",
  "The water temperature is correct",
  "The aquarium lights are OFF or dimmed",
  "The fish bag is still sealed",
];

export default function PreparationScreen() {
  const colors = useAppColors();

  const scrollRef = useRef<ScrollView>(null);

  const [checked, setChecked] = useState<boolean[]>(
    new Array(checklist.length).fill(false),
  );

  const completed = useMemo(() => checked.filter(Boolean).length, [checked]);

  const progress = (completed / checklist.length) * 100;

  const toggleItem = (index: number) => {
    const copy = [...checked];
    copy[index] = !copy[index];
    setChecked(copy);
  };

  const continueToAcclimation = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      router.push("/new-fish-care/acclimation");
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
      <AppHeader title="Preparation" showBack />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: TAB_BAR_HEIGHT + 30,
            },
          ]}
          automaticallyAdjustKeyboardInsets
        >
          {/* HEADER */}

          <ThemeCard style={styles.header}>
            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: colors.primary + "14",
                  borderColor: colors.primary + "28",
                },
              ]}
            >
              <Ionicons
                name="clipboard-outline"
                size={42}
                color={colors.primary}
              />
            </View>

            <View
              style={[
                styles.stepBadge,
                {
                  backgroundColor: colors.primary + "12",
                },
              ]}
            >
              <ThemeText
                variant="subtitle"
                style={[
                  styles.stepBadgeText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                STEP 1 OF 5
              </ThemeText>
            </View>

            <ThemeText variant="title" style={styles.title}>
              Prepare Your Aquarium
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
              Make sure your aquarium is ready before beginning the acclimation
              process.
            </ThemeText>
          </ThemeCard>

          {/* PROGRESS */}

          <ThemeCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <ThemeText variant="subtitle" style={styles.progressTitle}>
                  Preparation Progress
                </ThemeText>

                <ThemeText
                  variant="body"
                  style={[
                    styles.progressDescription,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Complete every item before continuing.
                </ThemeText>
              </View>

              <View
                style={[
                  styles.progressBadge,
                  {
                    backgroundColor:
                      completed === checklist.length
                        ? "#4CAF5018"
                        : colors.primary + "14",
                  },
                ]}
              >
                <ThemeText
                  variant="subtitle"
                  style={[
                    styles.progressBadgeText,
                    {
                      color:
                        completed === checklist.length
                          ? "#4CAF50"
                          : colors.primary,
                    },
                  ]}
                >
                  {completed}/{checklist.length}
                </ThemeText>
              </View>
            </View>

            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor:
                      completed === checklist.length
                        ? "#4CAF50"
                        : colors.primary,
                  },
                ]}
              />
            </View>
          </ThemeCard>

          {/* CHECKLIST */}

          <View style={styles.sectionHeader}>
            <ThemeText variant="subtitle" style={styles.sectionTitle}>
              Aquarium Checklist
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.sectionHint,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Tap each item when ready
            </ThemeText>
          </View>

          {checklist.map((item, index) => {
            const isChecked = checked[index];

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => toggleItem(index)}
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.card,
                    borderColor: isChecked ? "#4CAF50" : colors.border,
                  },
                  isChecked && {
                    backgroundColor: "#4CAF5009",
                  },
                ]}
              >
                <View
                  style={[
                    styles.checkCircle,
                    {
                      backgroundColor: isChecked
                        ? "#4CAF50"
                        : colors.background,
                      borderColor: isChecked ? "#4CAF50" : colors.border,
                    },
                  ]}
                >
                  {isChecked && (
                    <Ionicons name="checkmark" size={19} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.itemContent}>
                  <ThemeText
                    variant="body"
                    style={[styles.itemText, isChecked && styles.completedText]}
                  >
                    {item}
                  </ThemeText>

                  {isChecked && (
                    <ThemeText
                      variant="body"
                      style={[
                        styles.readyText,
                        {
                          color: "#4CAF50",
                        },
                      ]}
                    >
                      Ready
                    </ThemeText>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* TIP */}

          <View
            style={[
              styles.tipCard,
              {
                backgroundColor: "#FFC10712",
                borderColor: "#FFC10730",
              },
            ]}
          >
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={23} color="#FFC107" />
            </View>

            <View style={styles.tipContent}>
              <ThemeText variant="subtitle" style={styles.tipTitle}>
                AquaGuide AI Tip
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
                Never open the transport bag until the temperature has adjusted.
                Sudden changes can cause severe stress and water shock.
              </ThemeText>
            </View>
          </View>

          {/* CONTINUE */}

          {completed === checklist.length ? (
            <ThemeButton
              title="Continue to Acclimation"
              onPress={continueToAcclimation}
              style={styles.nextButton}
            />
          ) : (
            <View
              style={[
                styles.disabledButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.textSecondary}
              />

              <ThemeText
                variant="subtitle"
                style={[
                  styles.disabledText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Complete the checklist first
              </ThemeText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    padding: 18,
  },

  header: {
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    marginBottom: 16,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  stepBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 13,
  },

  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },

  progressCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  progressDescription: {
    fontSize: 12,
    marginTop: 3,
  },

  progressBadge: {
    minWidth: 52,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  progressBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },

  progressBackground: {
    height: 9,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 17,
  },

  progressFill: {
    height: 9,
    borderRadius: 20,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionHint: {
    fontSize: 12,
    marginTop: 3,
  },

  item: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  itemContent: {
    flex: 1,
    marginLeft: 13,
  },

  itemText: {
    fontSize: 15,
    lineHeight: 21,
  },

  completedText: {
    fontWeight: "600",
  },

  readyText: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 24,
  },

  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFC10718",
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

  nextButton: {
    height: 56,
    borderRadius: 17,
  },

  disabledButton: {
    height: 56,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  disabledText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
