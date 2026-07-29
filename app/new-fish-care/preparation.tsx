// app/(tabs)/new-fish-care/preparation.tsx

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

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
  const [checked, setChecked] = useState<boolean[]>(
    new Array(checklist.length).fill(false),
  );

  const completed = useMemo(() => checked.filter(Boolean).length, [checked]);

  const toggleItem = (index: number) => {
    const copy = [...checked];
    copy[index] = !copy[index];
    setChecked(copy);
  };
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    iconContainer: {
      backgroundColor: colors.card,
    },

    progressCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    item: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    sectionText: {
      color: colors.textPrimary,
    },
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="Preparation" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ThemeCard style={styles.header}>
          <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
            <Ionicons
              name="clipboard-outline"
              size={60}
              color={colors.primary}
            />
          </View>

          <ThemeText variant="title" style={styles.title}>
            Preparation Checklist
          </ThemeText>

          <ThemeText variant="body" style={styles.subtitle}>
            Before introducing your new fish into the aquarium, make sure
            everything below is ready.
          </ThemeText>
        </ThemeCard>

        <ThemeCard style={[styles.progressCard, dynamicStyles.progressCard]}>
          <ThemeText variant="subtitle" style={styles.progressTitle}>
            Progress
          </ThemeText>

          <ThemeText variant="title" style={styles.progressValue}>
            {completed} / {checklist.length}
          </ThemeText>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completed / checklist.length) * 100}%`,
                },
              ]}
            />
          </View>
        </ThemeCard>

        {checklist.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.item, dynamicStyles.item]}
            activeOpacity={0.8}
            onPress={() => toggleItem(index)}
          >
            <Ionicons
              name={checked[index] ? "checkbox" : "square-outline"}
              size={28}
              color={checked[index] ? "#4CAF50" : "#90A4AE"}
            />

            <ThemeText variant="body" style={styles.itemText}>
              {item}
            </ThemeText>
          </TouchableOpacity>
        ))}

        <ThemeCard style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemeText variant="subtitle" style={styles.tipTitle}>
              AquaGuide AI Tip
            </ThemeText>

            <ThemeText variant="body" style={styles.tipText}>
              Never open the transport bag until the temperature has adjusted.
              Sudden changes can cause severe stress and water shock.
            </ThemeText>
          </View>
        </ThemeCard>

        {completed === checklist.length ? (
          <ThemeButton
            title="Continue to Acclimation"
            onPress={() => router.push("/new-fish-care/acclimation")}
            style={styles.nextButton}
          />
        ) : (
          <View style={styles.disabledButton}>
            <ThemeText variant="subtitle" style={styles.disabledText}>
              Complete the checklist first
            </ThemeText>
          </View>
        )}
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

  header: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.85,
  },

  progressCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
  },

  progressTitle: {
    fontSize: 16,
    opacity: 0.8,
  },

  progressValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#00BCD4",
    marginVertical: 8,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "#00BCD4",
  },

  item: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
  },

  itemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    lineHeight: 24,
  },

  tipCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    marginBottom: 30,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },

  tipText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.85,
  },

  nextButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  nextText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    marginRight: 10,
  },

  disabledButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledText: {
    fontWeight: "700",
    fontSize: 16,
    opacity: 0.7,
  },
});
