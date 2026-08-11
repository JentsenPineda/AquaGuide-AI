// app/(tabs)/new-fish-care/sevenDays.tsx
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { auth } from "@/config/firebase";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { getPrograms, updateProgram } from "@/services/newFishCareService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
const weekPlan = [
  {
    day: "Day 1",
    title: "Observe Your Fish",
    task: "Allow your fish to settle. Do not disturb the aquarium unnecessarily.",
  },
  {
    day: "Day 2",
    title: "Feed Lightly",
    task: "Feed a small amount and check if your fish is eating normally.",
  },
  {
    day: "Day 3",
    title: "Check Water Quality",
    task: "Test the temperature and pH to ensure they remain stable.",
  },
  {
    day: "Day 4",
    title: "Inspect Body & Fins",
    task: "Look for white spots, torn fins, redness, or unusual swimming.",
  },
  {
    day: "Day 5",
    title: "Clean the Aquarium Glass",
    task: "Remove algae from the glass without stressing your fish.",
  },
  {
    day: "Day 6",
    title: "Observe Fish Behavior",
    task: "Watch for active swimming, normal breathing, and healthy appetite.",
  },
  {
    day: "Day 7",
    title: "Perform Water Change",
    task: "Replace 20–30% of the aquarium water using dechlorinated water.",
  },
];

export default function SevenDaysScreen() {
  const colors = useAppColors();

  const user = auth.currentUser;

  const { programId: routeProgramId } = useLocalSearchParams<{
    programId?: string;
  }>();

  const [programId, setProgramId] = useState<string | null>(
    typeof routeProgramId === "string" ? routeProgramId : null,
  );

  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState<boolean[]>(
    new Array(weekPlan.length).fill(false),
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!programId) {
      setLoading(false);
      return;
    }

    const loadProgram = async () => {
      try {
        const programs = await getPrograms(user.uid);

        const program = programs.find((p) => p.id === programId);

        if (!program) {
          Alert.alert(
            "Program Not Found",
            "The selected Fish Care Program no longer exists.",
          );

          router.back();
          return;
        }

        setCompleted(program.days.map((day) => day.completed));
      } catch (error) {
        console.error("Failed to load Fish Care Program:", error);

        Alert.alert("Error", "Unable to load your Fish Care Program.");
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [user, programId]);
  const finished = useMemo(() => completed.filter(Boolean).length, [completed]);

  const toggle = async (index: number) => {
    if (!user || !programId) {
      Alert.alert(
        "No Active Program",
        "Please start a Fish Care Program first.",
      );
      return;
    }

    const copy = [...completed];

    // Already completed
    if (copy[index]) return;

    copy[index] = true;
    setCompleted(copy);

    const totalCompleted = copy.filter(Boolean).length;

    try {
      const programs = await getPrograms(user.uid);

      const program = programs.find((p) => p.id === programId);

      if (!program) {
        Alert.alert(
          "Program Not Found",
          "The selected Fish Care Program no longer exists.",
        );
        return;
      }

      const updatedDays = program.days.map((day, i) =>
        i === index
          ? {
              ...day,
              completed: true,
              completedAt: Timestamp.now(),
            }
          : day,
      );

      const updateData: any = {
        days: updatedDays,
        currentDay: Math.min(totalCompleted + 1, 7),
        status: totalCompleted >= 7 ? "completed" : "active",
      };

      if (totalCompleted >= 7) {
        updateData.completedAt = Timestamp.now();
      }

      await updateProgram(user.uid, programId, updateData);

      if (totalCompleted === weekPlan.length) {
        setTimeout(() => {
          router.replace("/new-fish-care/success");
        }, 800);
        return;
      }

      Alert.alert(
        "Task Completed 🎉",
        `Great job!\n\nYou have completed ${totalCompleted} of ${weekPlan.length} care tasks.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ],
      );
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Unable to save your progress. Please try again.");
    }
  };

  const progress = (finished / weekPlan.length) * 100;
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    header: {
      backgroundColor: colors.card,
    },

    progressCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="New Fish Care" showBack />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemeCard style={[styles.header, dynamicStyles.header]}>
          <Ionicons name="calendar" size={70} color={colors.primary} />
          <ThemeText variant="title" style={styles.title}>
            7-Day Care Plan
          </ThemeText>
          <ThemeText variant="body" style={styles.subtitle}>
            Continue caring for your new fish during its first week. Complete
            each task as you go.
          </ThemeText>
        </ThemeCard>
        <ThemeCard style={[styles.progressCard, dynamicStyles.progressCard]}>
          <ThemeText variant="subtitle" style={styles.progressTitle}>
            Weekly Progress
          </ThemeText>
          <ThemeText variant="title" style={styles.progressValue}>
            {finished} / {weekPlan.length}
          </ThemeText>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </ThemeCard>
        <ThemeCard style={[styles.recommendedCard, dynamicStyles.card]}>
          <View style={styles.recommendedHeader}>
            <Ionicons name="star" size={22} color="#FFC107" />

            <ThemeText variant="subtitle" style={styles.recommendedTitle}>
              Recommended Today
            </ThemeText>
          </View>

          <ThemeText variant="title" style={styles.recommendedDay}>
            {weekPlan[finished]?.day ?? "Program Complete"}
          </ThemeText>

          <ThemeText variant="subtitle" style={styles.recommendedTask}>
            {weekPlan[finished]?.title ?? "Great Job!"}
          </ThemeText>

          <ThemeText variant="body" style={styles.recommendedDescription}>
            {weekPlan[finished]?.task ??
              "You have successfully completed your 7-Day Fish Care Program."}
          </ThemeText>

          <View style={styles.statusRow}>
            <Ionicons
              name={finished === weekPlan.length ? "checkmark-circle" : "time"}
              size={18}
              color={finished === weekPlan.length ? "#4CAF50" : "#FF9800"}
            />

            <ThemeText variant="body" style={styles.statusText}>
              {finished === weekPlan.length
                ? "Completed"
                : "Recommended Next Task"}
            </ThemeText>
          </View>
        </ThemeCard>
        {weekPlan.map((item, index) => (
          <View key={index} style={styles.timelineRow}>
            <View style={styles.timelineColumn}>
              <View
                style={[
                  styles.timelineDot,
                  completed[index] && styles.timelineDotCompleted,
                ]}
              />

              {index !== weekPlan.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    completed[index] && styles.timelineLineCompleted,
                  ]}
                />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.card, dynamicStyles.card]}
              onPress={() => toggle(index)}
            >
              <Ionicons
                name={completed[index] ? "checkbox" : "square-outline"}
                size={28}
                color={completed[index] ? "#4CAF50" : "#90A4AE"}
              />
              <View style={styles.iconContainer}>
                <Ionicons
                  name={
                    completed[index]
                      ? "checkmark-circle"
                      : index === finished
                        ? "play-circle"
                        : "ellipse-outline"
                  }
                  size={34}
                  color={
                    completed[index]
                      ? "#4CAF50"
                      : index === finished
                        ? "#FFC107"
                        : "#B0BEC5"
                  }
                />
              </View>
              <View style={styles.info}>
                <View style={styles.dayRow}>
                  <ThemeText variant="subtitle" style={styles.day}>
                    {item.day}
                  </ThemeText>

                  <View
                    style={[
                      styles.statusBadge,
                      completed[index]
                        ? styles.completedBadge
                        : index === finished
                          ? styles.todayBadge
                          : styles.upcomingBadge,
                    ]}
                  >
                    <ThemeText style={styles.statusBadgeText}>
                      {completed[index]
                        ? "Completed"
                        : index === finished
                          ? "Today"
                          : "Upcoming"}
                    </ThemeText>
                  </View>
                </View>
                <ThemeText variant="subtitle" style={styles.cardTitle}>
                  {item.title}
                </ThemeText>
                <ThemeText variant="body" style={styles.task}>
                  {item.task}
                </ThemeText>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        <ThemeCard style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFC107" />

          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemeText variant="subtitle" style={styles.tipTitle}>
              AquaGuide AI Tip
            </ThemeText>
            <ThemeText variant="body" style={styles.tipText}>
              A healthy fish will become more active, show brighter colors, and
              begin eating regularly within its first week.
            </ThemeText>
          </View>
        </ThemeCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FBFD",
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

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 15,
    opacity: 0.85,
  },

  progressCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
  },

  progressTitle: {
    fontSize: 15,
    opacity: 0.8,
  },

  progressValue: {
    fontSize: 28,
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
    backgroundColor: "#00BCD4",
    borderRadius: 20,
  },

  recommendedCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
  },

  recommendedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  recommendedTitle: {
    marginLeft: 8,
    fontWeight: "700",
  },

  recommendedDay: {
    color: "#00BCD4",
    fontSize: 24,
    fontWeight: "800",
  },

  recommendedTask: {
    marginTop: 8,
    fontWeight: "700",
  },

  recommendedDescription: {
    marginTop: 10,
    lineHeight: 23,
    opacity: 0.85,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  statusText: {
    marginLeft: 8,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  day: {
    color: "#00BCD4",
    fontWeight: "700",
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  task: {
    lineHeight: 23,
    fontSize: 15,
    opacity: 0.85,
  },

  tipCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginVertical: 20,
  },

  tipTitle: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 8,
  },

  tipText: {
    lineHeight: 22,
    fontSize: 15,
    opacity: 0.85,
  },

  button: {
    height: 58,
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  timelineColumn: {
    width: 30,
    alignItems: "center",
  },

  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#CFD8DC",
    marginTop: 22,
  },

  timelineDotCompleted: {
    backgroundColor: "#4CAF50",
  },

  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: "#CFD8DC",
    marginTop: 4,
    marginBottom: -15,
  },

  timelineLineCompleted: {
    backgroundColor: "#4CAF50",
  },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  completedBadge: {
    backgroundColor: "#E8F5E9",
  },

  todayBadge: {
    backgroundColor: "#FFF8E1",
  },

  upcomingBadge: {
    backgroundColor: "#ECEFF1",
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    marginLeft: 6,
  },
});
