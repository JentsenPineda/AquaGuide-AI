// app/(tabs)/new-fish-care/first24hours.tsx

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

const timeline = [
  {
    time: "0 - 1 Hour",
    icon: "moon",
    color: "#5C6BC0",
    title: "Let Your Fish Relax",
    tasks: [
      "Keep aquarium lights OFF.",
      "Do not tap the aquarium glass.",
      "Allow your fish to explore naturally.",
      "Avoid chasing or touching the fish.",
    ],
  },

  {
    time: "6 Hours",
    icon: "eye",
    color: "#00BCD4",
    title: "Observe Behavior",
    tasks: [
      "Check normal swimming.",
      "Observe breathing.",
      "Watch for hiding behavior.",
      "Look for signs of stress.",
    ],
  },

  {
    time: "12 Hours",
    icon: "search",
    color: "#4CAF50",
    title: "Continue Monitoring",
    tasks: [
      "Check fins for damage.",
      "Observe body color.",
      "Ensure fish is responsive.",
      "Avoid unnecessary disturbance.",
    ],
  },

  {
    time: "24 Hours",
    icon: "restaurant",
    color: "#FF9800",
    title: "First Feeding",
    tasks: [
      "Feed a very small amount.",
      "Remove uneaten food.",
      "Observe appetite.",
      "Continue monitoring water quality.",
    ],
  },
];

export default function First24HoursScreen() {
  const colors = useAppColors();
  const scrollRef = useRef<ScrollView>(null);

  const continueToCreate = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      router.push("/new-fish-care/create");
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: TAB_BAR_HEIGHT + 30,
          },
        ]}
      >
        {/* HEADER */}

        <ThemeCard style={styles.header}>
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="time-outline" size={46} color={colors.primary} />
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
                styles.stepText,
                {
                  color: colors.primary,
                },
              ]}
            >
              STEP 4 OF 5
            </ThemeText>
          </View>

          <ThemeText variant="title" style={styles.title}>
            First 24 Hours
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
            The first day is the most important. Follow these simple steps to
            help your fish settle into its new home.
          </ThemeText>
        </ThemeCard>

        {/* TIMELINE */}

        <View style={styles.sectionHeader}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            Your First Day
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
            Follow the timeline as your fish settles.
          </ThemeText>
        </View>

        {timeline.map((item, index) => (
          <View key={index} style={styles.timelineContainer}>
            <View style={styles.timelineSide}>
              <View
                style={[
                  styles.timelineCircle,
                  {
                    backgroundColor: item.color + "18",
                    borderColor: item.color + "35",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={21}
                  color={item.color}
                />
              </View>

              {index !== timeline.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <ThemeCard style={styles.timelineCard}>
              <View style={styles.timeBadge}>
                <ThemeText
                  variant="subtitle"
                  style={[
                    styles.timeText,
                    {
                      color: item.color,
                    },
                  ]}
                >
                  {item.time}
                </ThemeText>
              </View>

              <ThemeText variant="subtitle" style={styles.cardTitle}>
                {item.title}
              </ThemeText>

              {item.tasks.map((task, taskIndex) => (
                <View key={taskIndex} style={styles.taskRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />

                  <ThemeText
                    variant="body"
                    style={[
                      styles.taskText,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {task}
                  </ThemeText>
                </View>
              ))}
            </ThemeCard>
          </View>
        ))}

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
            <Ionicons name="bulb-outline" size={22} color="#FFC107" />
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
              It is completely normal if your new fish hides during the first
              day. Give it time to adjust before becoming concerned.
            </ThemeText>
          </View>
        </View>

        <ThemeButton
          title="Continue"
          onPress={continueToCreate}
          style={styles.button}
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

  header: {
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    marginBottom: 22,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  stepBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },

  stepText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionHint: {
    fontSize: 12,
    marginTop: 3,
  },

  timelineContainer: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  timelineSide: {
    width: 42,
    alignItems: "center",
  },

  timelineCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },

  timelineCard: {
    flex: 1,
    borderRadius: 18,
    padding: 17,
    marginLeft: 10,
    marginBottom: 14,
  },

  timeBadge: {
    alignSelf: "flex-start",
    marginBottom: 7,
  },

  timeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 11,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },

  taskText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13.5,
    lineHeight: 20,
  },

  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 24,
  },

  tipIcon: {
    width: 43,
    height: 43,
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

  button: {
    height: 56,
    borderRadius: 17,
  },
});
