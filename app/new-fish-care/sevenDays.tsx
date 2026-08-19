// app/(tabs)/new-fish-care/sevenDays.tsx

import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { auth } from "@/config/firebase";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import {
  completeFishCareDay,
  getPrograms,
} from "@/services/newFishCareService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

/* ============================================================
   7-DAY CARE PLAN CONTENT
   ============================================================ */

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

const DAY_DURATION_MS = 24 * 60 * 60 * 1000;

export default function SevenDaysScreen() {
  const colors = useAppColors();
  const user = auth.currentUser;

  const { programId: routeProgramId, unlockEarly } = useLocalSearchParams<{
    programId?: string;
    unlockEarly?: string;
  }>();

  /*
   * Early access is intentionally limited to ONE action.
   *
   * If the user comes from the Home progress bar:
   *
   * Day 1 -> can complete early
   *
   * After Day 1 is completed:
   * early access is consumed.
   *
   * Day 2 -> must wait 24 hours.
   *
   * This prevents the user from completing
   * all seven days continuously.
   */
  const initialEarlyAccess = unlockEarly === "true";

  const [programId] = useState<string | null>(
    typeof routeProgramId === "string" ? routeProgramId : null,
  );

  const [earlyAccessAvailable, setEarlyAccessAvailable] =
    useState(initialEarlyAccess);

  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState<boolean[]>(
    new Array(weekPlan.length).fill(false),
  );

  const [completedAt, setCompletedAt] = useState<Array<Timestamp | null>>(
    new Array(weekPlan.length).fill(null),
  );

  const [saving, setSaving] = useState<number | null>(null);

  const [showCompletion, setShowCompletion] = useState(false);

  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const completionOpacity = useRef(new Animated.Value(0)).current;

  const completionTranslate = useRef(new Animated.Value(12)).current;

  /* ============================================================
     LOAD PROGRAM
     ============================================================ */

  const loadProgram = useCallback(async () => {
    if (!user || !programId) {
      setLoading(false);
      return;
    }

    try {
      const programs = await getPrograms(user.uid);

      const program = programs.find((item) => item.id === programId);

      if (!program) {
        setLoading(false);
        router.back();
        return;
      }

      const programCompleted = program.days.map((day) =>
        Boolean(day.completed),
      );

      const programCompletedAt = program.days.map(
        (day) => day.completedAt ?? null,
      );

      setCompleted(programCompleted);
      setCompletedAt(programCompletedAt);
    } catch (error) {
      console.error("Failed to load Fish Care Program:", error);
    } finally {
      setLoading(false);
    }
  }, [user, programId]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  /* ============================================================
     PROGRESS
     ============================================================ */

  const finished = useMemo(() => completed.filter(Boolean).length, [completed]);

  const progress = useMemo(
    () => (finished / weekPlan.length) * 100,
    [finished],
  );

  /*
   * The next unfinished day is always the only
   * day that can potentially be completed.
   */
  const currentIndex = Math.min(finished, weekPlan.length - 1);

  const currentTask =
    finished < weekPlan.length ? weekPlan[currentIndex] : null;

  /* ============================================================
     24-HOUR LOCK
     ============================================================ */

  const nextDayLocked = useMemo(() => {
    /*
     * Day 1 is always available.
     */
    if (finished === 0) {
      return false;
    }

    /*
     * One-time early access can bypass the timer
     * for the CURRENT next day only.
     */
    if (earlyAccessAvailable) {
      return false;
    }

    const previousCompletedAt = completedAt[finished - 1];

    if (!previousCompletedAt) {
      return false;
    }

    const completedTime =
      previousCompletedAt instanceof Timestamp
        ? previousCompletedAt.toMillis()
        : new Date(previousCompletedAt as any).getTime();

    const elapsed = Date.now() - completedTime;

    return elapsed < DAY_DURATION_MS;
  }, [finished, completedAt, earlyAccessAvailable]);

  /* ============================================================
     COUNTDOWN
     ============================================================ */

  const calculateRemainingTime = useCallback(() => {
    if (!nextDayLocked) {
      return null;
    }

    const previousCompletedAt = completedAt[finished - 1];

    if (!previousCompletedAt) {
      return null;
    }

    const completedTime =
      previousCompletedAt instanceof Timestamp
        ? previousCompletedAt.toMillis()
        : new Date(previousCompletedAt as any).getTime();

    const remaining = Math.max(
      0,
      DAY_DURATION_MS - (Date.now() - completedTime),
    );

    if (remaining <= 0) {
      return null;
    }

    const hours = Math.floor(remaining / (60 * 60 * 1000));

    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  }, [nextDayLocked, completedAt, finished]);

  /*
   * Refresh countdown every minute.
   */
  useEffect(() => {
    const updateCountdown = () => {
      setRemainingTime(calculateRemainingTime());
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calculateRemainingTime]);

  /*
   * If the countdown expires while the screen
   * is open, immediately refresh the UI.
   */
  useEffect(() => {
    if (!nextDayLocked) {
      setRemainingTime(null);
    }
  }, [nextDayLocked]);

  /* ============================================================
     COMPLETION MESSAGE
     ============================================================ */

  const showCompletedMessage = useCallback(() => {
    setShowCompletion(true);

    completionOpacity.setValue(0);
    completionTranslate.setValue(12);

    Animated.parallel([
      Animated.timing(completionOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),

      Animated.spring(completionTranslate, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(completionOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(completionTranslate, {
          toValue: 12,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCompletion(false);
      });
    }, 2200);
  }, [completionOpacity, completionTranslate]);

  /* ============================================================
     COMPLETE CURRENT DAY
     ============================================================ */

  const toggle = async (index: number) => {
    if (!user || !programId) {
      return;
    }

    /*
     * Prevent rapid multiple taps.
     */
    if (saving !== null) {
      return;
    }

    /*
     * Only the CURRENT unfinished day can be tapped.
     */
    if (index !== finished) {
      return;
    }

    /*
     * Never allow a completed day to be completed again.
     */
    if (completed[index]) {
      return;
    }

    /*
     * Respect the 24-hour lock.
     *
     * earlyAccessAvailable can bypass it only ONCE.
     */
    if (index > 0 && nextDayLocked && !earlyAccessAvailable) {
      return;
    }

    /*
     * Lock immediately.
     */
    setSaving(index);

    const previousCompleted = [...completed];
    const previousCompletedAt = [...completedAt];

    const optimisticCompleted = [...completed];
    const optimisticCompletedAt = [...completedAt];

    const now = Timestamp.now();

    /*
     * Optimistic UI.
     */
    optimisticCompleted[index] = true;
    optimisticCompletedAt[index] = now;

    setCompleted(optimisticCompleted);
    setCompletedAt(optimisticCompletedAt);

    /*
     * IMPORTANT:
     *
     * Consume early access immediately.
     *
     * This means:
     *
     * Day 1 early access
     *      ↓
     * Day 1 completed
     *      ↓
     * Early access OFF
     *      ↓
     * Day 2 locked for 24 hours
     */
    const wasEarlyAccess = earlyAccessAvailable;

    setEarlyAccessAvailable(false);

    try {
      const result = await completeFishCareDay(user.uid, programId, index + 1, {
        allowEarlyCompletion: wasEarlyAccess,
      });

      /*
       * The service rejected the completion.
       */
      if (!result.success) {
        setCompleted(previousCompleted);

        setCompletedAt(previousCompletedAt);

        /*
         * Restore early access if nothing
         * was actually completed.
         */
        setEarlyAccessAvailable(wasEarlyAccess);

        setSaving(null);
        return;
      }

      /*
       * Day 7 completed.
       */
      if (result.programCompleted) {
        setSaving(null);

        setTimeout(() => {
          router.replace("/new-fish-care/success");
        }, 700);

        return;
      }

      /*
       * Normal successful completion.
       */
      setSaving(null);

      showCompletedMessage();

      /*
       * Recalculate countdown immediately.
       */
      setTimeout(() => {
        setRemainingTime(calculateRemainingTime());
      }, 50);
    } catch (error) {
      console.error("Failed to save fish care progress:", error);

      /*
       * Roll back optimistic UI.
       */
      setCompleted(previousCompleted);

      setCompletedAt(previousCompletedAt);

      /*
       * Restore early access if the
       * operation failed.
       */
      setEarlyAccessAvailable(earlyAccessAvailable);

      setSaving(null);
    }
  };

  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor: colors.primary + "14",
            },
          ]}
        >
          <Ionicons name="water" size={38} color={colors.primary} />
        </View>

        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingSpinner}
        />

        <ThemeText
          variant="subtitle"
          style={[
            styles.loadingText,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Loading your care plan...
        </ThemeText>
      </View>
    );
  }

  /* ============================================================
     MAIN SCREEN
     ============================================================ */

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: TAB_BAR_HEIGHT + 35,
          },
        ]}
      >
        {/* ======================================================
            HERO
        ====================================================== */}

        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={34}
              color={colors.primary}
            />
          </View>

          <View style={styles.heroText}>
            <ThemeText
              variant="title"
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              7-Day Care Plan
            </ThemeText>

            <ThemeText
              variant="body"
              style={[
                styles.heroSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Continue caring for your new fish during its first week. Complete
              each task as you go.
            </ThemeText>
          </View>
        </View>

        {/* ======================================================
            PROGRESS
        ====================================================== */}

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.progressTop}>
            <View>
              <ThemeText
                variant="subtitle"
                style={[
                  styles.progressLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                WEEKLY PROGRESS
              </ThemeText>

              <View style={styles.progressNumberRow}>
                <ThemeText
                  variant="title"
                  style={[
                    styles.progressNumber,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {finished}
                </ThemeText>

                <ThemeText
                  variant="body"
                  style={[
                    styles.progressTotal,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  / {weekPlan.length} days
                </ThemeText>
              </View>
            </View>

            <View
              style={[
                styles.percentCircle,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <ThemeText
                style={[
                  styles.percentText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {Math.round(progress)}%
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
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <ThemeText
              variant="body"
              style={[
                styles.progressFooterText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {finished === weekPlan.length
                ? "7-day plan completed"
                : `${weekPlan.length - finished} ${
                    weekPlan.length - finished === 1 ? "day" : "days"
                  } remaining`}
            </ThemeText>

            <Ionicons
              name={
                finished === weekPlan.length
                  ? "checkmark-circle"
                  : "trending-up-outline"
              }
              size={18}
              color={
                finished === weekPlan.length ? "#4CAF50" : colors.textSecondary
              }
            />
          </View>

          {earlyAccessAvailable && finished < weekPlan.length && (
            <View
              style={[
                styles.earlyAccessBadge,
                {
                  backgroundColor: colors.primary + "12",
                },
              ]}
            >
              <Ionicons name="flash-outline" size={16} color={colors.primary} />

              <ThemeText
                style={[
                  styles.earlyAccessText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                One-time early access
              </ThemeText>
            </View>
          )}
        </View>

        {/* ======================================================
            RECOMMENDED TODAY
        ====================================================== */}

        {currentTask ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <ThemeText
                  variant="subtitle"
                  style={[
                    styles.sectionLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  YOUR NEXT STEP
                </ThemeText>

                <ThemeText
                  variant="title"
                  style={[
                    styles.sectionHeading,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Recommended Today
                </ThemeText>
              </View>

              <View
                style={[
                  styles.todayBadge,
                  {
                    backgroundColor: colors.primary + "14",
                  },
                ]}
              >
                <View
                  style={[
                    styles.todayDot,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                />

                <ThemeText
                  style={[
                    styles.todayBadgeText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  TODAY
                </ThemeText>
              </View>
            </View>

            <View
              style={[
                styles.recommendedCard,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <View style={styles.recommendedTop}>
                <View style={styles.recommendedDayContainer}>
                  <ThemeText style={styles.recommendedDay}>
                    {currentTask.day}
                  </ThemeText>

                  <View style={styles.recommendedIndicator}>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={colors.primary}
                    />
                  </View>
                </View>

                <Ionicons
                  name="water-outline"
                  size={34}
                  color="#FFFFFF"
                  style={styles.recommendedWaterIcon}
                />
              </View>

              <ThemeText variant="title" style={styles.recommendedTitle}>
                {currentTask.title}
              </ThemeText>

              <ThemeText variant="body" style={styles.recommendedDescription}>
                {currentTask.task}
              </ThemeText>

              <View style={styles.recommendedDivider} />

              <View style={styles.recommendedFooter}>
                <View style={styles.recommendedStatus}>
                  <Ionicons name="time-outline" size={18} color="#FFFFFF" />

                  <ThemeText style={styles.recommendedStatusText}>
                    {nextDayLocked
                      ? `Available in ${remainingTime ?? "24h"}`
                      : "Ready to complete"}
                  </ThemeText>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View
              style={[
                styles.completedBanner,
                {
                  backgroundColor: "#4CAF50" + "14",
                  borderColor: "#4CAF50" + "35",
                },
              ]}
            >
              <View
                style={[
                  styles.completedBannerIcon,
                  {
                    backgroundColor: "#4CAF50",
                  },
                ]}
              >
                <Ionicons name="checkmark" size={25} color="#FFFFFF" />
              </View>

              <View style={styles.completedBannerText}>
                <ThemeText
                  variant="subtitle"
                  style={[
                    styles.completedBannerTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  7-Day Care Plan Complete
                </ThemeText>

                <ThemeText
                  variant="body"
                  style={[
                    styles.completedBannerSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  You have completed all care tasks.
                </ThemeText>
              </View>
            </View>
          </View>
        )}

        {/* ======================================================
            JOURNEY HEADER
        ====================================================== */}

        <View style={styles.journeyHeader}>
          <View>
            <ThemeText
              variant="subtitle"
              style={[
                styles.sectionLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              YOUR PROGRESS
            </ThemeText>

            <ThemeText
              variant="title"
              style={[
                styles.sectionHeading,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              7-Day Journey
            </ThemeText>
          </View>

          <View
            style={[
              styles.journeyCount,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemeText
              style={[
                styles.journeyCountText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {finished}/{weekPlan.length}
            </ThemeText>
          </View>
        </View>

        {/* ======================================================
            TIMELINE
        ====================================================== */}

        <View style={styles.timeline}>
          {weekPlan.map((item, index) => {
            const isCompleted = completed[index];

            const isCurrent = index === finished && finished < weekPlan.length;

            const isUpcoming = index > finished;

            const isSaving = saving === index;

            /*
             * ONLY the current unfinished
             * day can be tapped.
             */
            const canPress =
              isCurrent && !isCompleted && saving === null && !nextDayLocked;

            return (
              <View key={item.day} style={styles.timelineRow}>
                {/* TIMELINE */}

                <View style={styles.timelineColumn}>
                  <View
                    style={[
                      styles.timelineNode,
                      {
                        backgroundColor: isCompleted
                          ? "#4CAF50"
                          : isCurrent
                            ? colors.primary
                            : colors.card,

                        borderColor: isCompleted
                          ? "#4CAF50"
                          : isCurrent
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        isCompleted
                          ? "checkmark"
                          : isCurrent
                            ? "play"
                            : "ellipse-outline"
                      }
                      size={isCompleted ? 17 : 14}
                      color={
                        isCompleted || isCurrent
                          ? "#FFFFFF"
                          : colors.textSecondary
                      }
                    />
                  </View>

                  {index !== weekPlan.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: isCompleted
                            ? "#4CAF50"
                            : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>

                {/* DAY CARD */}

                <TouchableOpacity
                  activeOpacity={canPress ? 0.82 : 1}
                  disabled={!canPress}
                  onPress={() => toggle(index)}
                  style={[
                    styles.dayCard,
                    {
                      backgroundColor: colors.card,

                      borderColor:
                        isCurrent && !nextDayLocked
                          ? colors.primary
                          : colors.border,
                    },

                    isCurrent && styles.currentDayCard,

                    isCompleted && styles.completedDayCard,

                    isUpcoming && styles.upcomingDayCard,
                  ]}
                >
                  {isCurrent && (
                    <View
                      style={[
                        styles.currentAccent,
                        {
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  )}

                  <View style={styles.dayCardContent}>
                    <View style={styles.dayCardTop}>
                      <ThemeText
                        variant="subtitle"
                        style={[
                          styles.dayLabel,
                          {
                            color: isCompleted
                              ? "#4CAF50"
                              : isCurrent
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {item.day}
                      </ThemeText>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isCompleted
                              ? "#4CAF50" + "14"
                              : isCurrent
                                ? colors.primary + "14"
                                : colors.border + "80",
                          },
                        ]}
                      >
                        <ThemeText
                          style={[
                            styles.statusBadgeText,
                            {
                              color: isCompleted
                                ? "#4CAF50"
                                : isCurrent
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {isCompleted
                            ? "COMPLETED"
                            : isCurrent
                              ? nextDayLocked
                                ? "LOCKED"
                                : "TODAY"
                              : "UPCOMING"}
                        </ThemeText>
                      </View>
                    </View>

                    <ThemeText
                      variant="subtitle"
                      style={[
                        styles.dayTitle,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {item.title}
                    </ThemeText>

                    <ThemeText
                      variant="body"
                      style={[
                        styles.dayTask,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      {item.task}
                    </ThemeText>

                    {/* CURRENT DAY */}

                    {isCurrent && (
                      <View
                        style={[
                          styles.completeHint,
                          {
                            borderTopColor: colors.border,
                          },
                        ]}
                      >
                        {isSaving ? (
                          <>
                            <ActivityIndicator
                              size="small"
                              color={colors.primary}
                            />

                            <ThemeText
                              style={[
                                styles.completeHintText,
                                {
                                  color: colors.primary,
                                },
                              ]}
                            >
                              Saving progress...
                            </ThemeText>
                          </>
                        ) : nextDayLocked ? (
                          <>
                            <Ionicons
                              name="time-outline"
                              size={19}
                              color={colors.textSecondary}
                            />

                            <ThemeText
                              style={[
                                styles.completeHintText,
                                {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              Available in {remainingTime ?? "24h"}
                            </ThemeText>
                          </>
                        ) : (
                          <>
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={19}
                              color={colors.primary}
                            />

                            <ThemeText
                              style={[
                                styles.completeHintText,
                                {
                                  color: colors.primary,
                                },
                              ]}
                            >
                              Tap to mark complete
                            </ThemeText>
                          </>
                        )}
                      </View>
                    )}

                    {/* COMPLETED */}

                    {isCompleted && (
                      <View
                        style={[
                          styles.completedHint,
                          {
                            borderTopColor: colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#4CAF50"
                        />

                        <ThemeText
                          style={[
                            styles.completedHintText,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          Completed
                        </ThemeText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* ======================================================
            COMPLETION FEEDBACK
        ====================================================== */}

        {showCompletion && (
          <Animated.View
            style={[
              styles.completionCard,
              {
                backgroundColor: colors.card,
                borderColor: "#4CAF50" + "45",
                opacity: completionOpacity,
                transform: [
                  {
                    translateY: completionTranslate,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.completionIcon,
                {
                  backgroundColor: "#4CAF50",
                },
              ]}
            >
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </View>

            <View style={styles.completionContent}>
              <ThemeText
                variant="subtitle"
                style={[
                  styles.completionTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Day Completed
              </ThemeText>

              <ThemeText
                variant="body"
                style={[
                  styles.completionText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Great job! You have completed {finished} of {weekPlan.length}{" "}
                care tasks.
              </ThemeText>
            </View>
          </Animated.View>
        )}

        {/* ======================================================
            TIP
        ====================================================== */}

        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.tipIcon,
              {
                backgroundColor: "#FFC107" + "18",
              },
            ]}
          >
            <Ionicons name="bulb-outline" size={24} color="#FFC107" />
          </View>

          <View style={styles.tipContent}>
            <ThemeText
              variant="subtitle"
              style={[
                styles.tipTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
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
              A healthy fish will become more active, show brighter colors, and
              begin eating regularly within its first week.
            </ThemeText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================================================================
   STYLES
================================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  /* ============================================================
     LOADING
  ============================================================ */

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingSpinner: {
    marginTop: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  /* ============================================================
     HERO
  ============================================================ */

  hero: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  heroText: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
  },

  /* ============================================================
     PROGRESS
  ============================================================ */

  progressCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 28,
  },

  progressTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  progressNumberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 3,
  },

  progressNumber: {
    fontSize: 32,
    fontWeight: "800",
  },

  progressTotal: {
    marginLeft: 5,
    fontSize: 15,
  },

  percentCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },

  percentText: {
    fontSize: 14,
    fontWeight: "800",
  },

  progressBackground: {
    height: 9,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    height: 9,
    borderRadius: 20,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  progressFooterText: {
    fontSize: 13,
  },

  earlyAccessBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 12,
  },

  earlyAccessText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },

  /* ============================================================
     SECTIONS
  ============================================================ */

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  sectionHeading: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },

  /* ============================================================
     TODAY BADGE
  ============================================================ */

  todayBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  todayBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  /* ============================================================
     RECOMMENDED CARD
  ============================================================ */

  recommendedCard: {
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
  },

  recommendedTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recommendedDayContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  recommendedDay: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  recommendedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  recommendedWaterIcon: {
    opacity: 0.8,
  },

  recommendedTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
  },

  recommendedDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    opacity: 0.9,
  },

  recommendedDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#FFFFFF",
    opacity: 0.25,
    marginVertical: 18,
  },

  recommendedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recommendedStatus: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  recommendedStatusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 7,
    opacity: 0.9,
  },

  /* ============================================================
     COMPLETED BANNER
  ============================================================ */

  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },

  completedBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  completedBannerText: {
    flex: 1,
    marginLeft: 14,
  },

  completedBannerTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  completedBannerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  /* ============================================================
     JOURNEY
  ============================================================ */

  journeyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  journeyCount: {
    minWidth: 48,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  journeyCountText: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* ============================================================
     TIMELINE
  ============================================================ */

  timeline: {
    marginBottom: 6,
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  timelineColumn: {
    width: 30,
    alignItems: "center",
  },

  timelineNode: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    marginTop: 17,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 15,
  },

  /* ============================================================
     DAY CARDS
  ============================================================ */

  dayCard: {
    flex: 1,
    minHeight: 132,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 12,
    marginBottom: 14,
    overflow: "hidden",
  },

  currentDayCard: {
    borderWidth: 1.5,
  },

  completedDayCard: {
    opacity: 0.88,
  },

  upcomingDayCard: {
    opacity: 0.78,
  },

  currentAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  dayCardContent: {
    padding: 17,
    paddingLeft: 19,
  },

  dayCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dayLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  dayTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
  },

  dayTask: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },

  completeHint: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 14,
    paddingTop: 12,
  },

  completeHintText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  completedHint: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 14,
    paddingTop: 12,
  },

  completedHintText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  /* ============================================================
     COMPLETION FEEDBACK
  ============================================================ */

  completionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
    marginBottom: 22,
  },

  completionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  completionContent: {
    flex: 1,
    marginLeft: 13,
  },

  completionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  completionText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },

  /* ============================================================
     TIP
  ============================================================ */

  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 18,
  },

  tipIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 14,
  },

  tipTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  tipText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
});
