import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToLogs } from "@/services/logbookService";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
import { subscribeToReminders } from "@/services/reminderService";
import {
  ScanItem,
  getDailyScanUsage,
  subscribeToScans,
} from "@/services/scanService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type LogItem = {
  id: string;
  type: string;
  note?: string;
  date: string;
};

type ReminderItem = {
  id: string;
  type: string;
  repeat: string;
  weekDay?: string;
  monthDay?: number;
  time: string;
  hour?: number;
  minute?: number;
  note?: string;
};

const DAILY_SCAN_LIMIT = 5;

export default function HomeScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { user } = useAuth();

  /* ------------------------------------------------------------------------ */
  /* Fish Care                                                                */
  /* ------------------------------------------------------------------------ */

  const [programs, setPrograms] = useState<FishCareProgram[]>([]);

  /* ------------------------------------------------------------------------ */
  /* Scans                                                                    */
  /* ------------------------------------------------------------------------ */

  const [scans, setScans] = useState<ScanItem[]>([]);

  const [dailyScanUsage, setDailyScanUsage] = useState({
    used: 0,
    remaining: DAILY_SCAN_LIMIT,
    limit: DAILY_SCAN_LIMIT,
  });

  const [loadingScanUsage, setLoadingScanUsage] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Reminders                                                                */
  /* ------------------------------------------------------------------------ */

  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  /* ------------------------------------------------------------------------ */
  /* Logbook                                                                  */
  /* ------------------------------------------------------------------------ */

  const [logs, setLogs] = useState<LogItem[]>([]);

  /* ------------------------------------------------------------------------ */
  /* Firebase subscriptions                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!user) {
      setPrograms([]);
      return;
    }

    return subscribeToPrograms(user.uid, setPrograms);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setScans([]);
      return;
    }

    return subscribeToScans(user.uid, setScans);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setReminders([]);
      return;
    }

    return subscribeToReminders(user.uid, setReminders);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      return;
    }

    return subscribeToLogs(user.uid, setLogs);
  }, [user]);

  /* ------------------------------------------------------------------------ */
  /* Daily Scan Usage                                                         */
  /*                                                                          */
  /* IMPORTANT: This is now the source of truth for the Home scan statistic.  */
  /* It uses the exact same Firestore scanUsage document as the Scan module.  */
  /* ------------------------------------------------------------------------ */

  const loadDailyScanUsage = useCallback(async () => {
    if (!user) {
      setDailyScanUsage({
        used: 0,
        remaining: DAILY_SCAN_LIMIT,
        limit: DAILY_SCAN_LIMIT,
      });

      return;
    }

    try {
      setLoadingScanUsage(true);

      const usage = await getDailyScanUsage(user.uid);

      setDailyScanUsage({
        used: usage.used,
        remaining: usage.remaining,
        limit: usage.limit,
      });
    } catch (error) {
      console.error("Failed to load daily scan usage:", error);
    } finally {
      setLoadingScanUsage(false);
    }
  }, [user]);

  /*
   * Refresh whenever Home becomes active.
   *
   * Example:
   *
   * Home → Scan → use 5th scan → Back
   *
   * Home will immediately request the current Firestore usage
   * and display 0 / 5.
   */
  useFocusEffect(
    useCallback(() => {
      loadDailyScanUsage();
    }, [loadDailyScanUsage]),
  );

  /* ------------------------------------------------------------------------ */
  /* Fish Care statistics                                                     */
  /* ------------------------------------------------------------------------ */

  const activePrograms = useMemo(
    () => programs.filter((program) => program.status === "active"),
    [programs],
  );

  const completedPrograms = useMemo(
    () => programs.filter((program) => program.status === "completed"),
    [programs],
  );

  const totalPrograms = programs.length;

  const nextProgram = activePrograms[0];

  const nextProgramCompletedDays = nextProgram
    ? nextProgram.days.filter((day) => day.completed).length
    : 0;

  /* ------------------------------------------------------------------------ */
  /* Scan history                                                             */
  /* ------------------------------------------------------------------------ */

  /*
   * This remains available for scan history-related functionality.
   *
   * IMPORTANT:
   * This value is NO LONGER used for the Home scan limit.
   *
   * The actual daily limit comes from dailyScanUsage above.
   */
  const scansToday = useMemo(() => {
    const now = new Date();

    return scans.filter((scan) => {
      if (!scan.createdAt) {
        return false;
      }

      try {
        const scanDate =
          typeof scan.createdAt?.toDate === "function"
            ? scan.createdAt.toDate()
            : new Date(scan.createdAt);

        if (Number.isNaN(scanDate.getTime())) {
          return false;
        }

        return (
          scanDate.getFullYear() === now.getFullYear() &&
          scanDate.getMonth() === now.getMonth() &&
          scanDate.getDate() === now.getDate()
        );
      } catch {
        return false;
      }
    }).length;
  }, [scans]);

  /* ------------------------------------------------------------------------ */
  /* Dashboard statistics                                                     */
  /* ------------------------------------------------------------------------ */

  const activeReminderCount = reminders.length;

  const logbookCount = logs.length;

  const activeFishCareCount = activePrograms.length;

  const fishCareProgress = nextProgram
    ? Math.min((nextProgramCompletedDays / 7) * 100, 100)
    : 0;

  /* ------------------------------------------------------------------------ */
  /* Scan UI values                                                           */
  /* ------------------------------------------------------------------------ */

  const scanLimitReached = dailyScanUsage.remaining <= 0;

  const scanRemainingText = scanLimitReached
    ? "Daily limit reached"
    : `${dailyScanUsage.remaining} remaining`;

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="AquaGuide AI" showBack={false} showLogo />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: TAB_BAR_HEIGHT + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Welcome                                                            */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.greetingRow}>
          <View style={styles.greetingContent}>
            <Text
              style={[
                styles.greeting,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              AQUARIUM MANAGEMENT
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Your aquarium,
              {"\n"}simplified.
            </Text>
          </View>

          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="water-outline" size={25} color={colors.primary} />
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Scan                                                               */}
        {/* ------------------------------------------------------------------ */}

        <Pressable
          onPress={() => router.push("/scan")}
          style={({ pressed }) => [
            styles.scanCard,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
              transform: [
                {
                  scale: pressed ? 0.985 : 1,
                },
              ],
            },
          ]}
        >
          <View style={styles.scanIconContainer}>
            <Ionicons name="scan-outline" size={28} color="#FFFFFF" />
          </View>

          <View style={styles.scanContent}>
            <Text style={styles.scanLabel}>AI FISH SCAN</Text>

            <Text style={styles.scanTitle}>Identify a fish</Text>

            <Text style={styles.scanDescription}>
              Scan an ornamental fish to identify its species and view care
              recommendations.
            </Text>
          </View>

          <View style={styles.scanArrow}>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        {/* ------------------------------------------------------------------ */}
        {/* Overview                                                           */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Overview
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Your aquarium activity
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {/* ================================================================= */}
          {/* Scans                                                             */}
          {/* ================================================================= */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons name="scan-outline" size={20} color={colors.primary} />
            </View>

            {loadingScanUsage ? (
              <Text
                style={[
                  styles.statValue,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                —
              </Text>
            ) : (
              <View style={styles.scanStatValueRow}>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {dailyScanUsage.remaining}
                </Text>

                <Text
                  style={[
                    styles.scanLimitText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  / {DAILY_SCAN_LIMIT}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              AI scans remaining
            </Text>

            <Text
              style={[
                styles.scanRemaining,
                {
                  color: scanLimitReached ? "#E53935" : colors.primary,
                },
              ]}
            >
              {scanRemainingText}
            </Text>
          </View>

          {/* ================================================================= */}
          {/* Logbook                                                           */}
          {/* ================================================================= */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons name="book-outline" size={20} color={colors.primary} />
            </View>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {logbookCount}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Logbook
            </Text>
          </View>

          {/* ================================================================= */}
          {/* Reminders                                                         */}
          {/* ================================================================= */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {activeReminderCount}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Reminders
            </Text>
          </View>

          {/* ================================================================= */}
          {/* Fish Care                                                         */}
          {/* ================================================================= */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons name="fish-outline" size={20} color={colors.primary} />
            </View>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {activeFishCareCount}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Fish care
            </Text>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Fish Care                                                         */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Fish Care
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Continue where you left off
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (activePrograms.length === 0) {
              router.push("/new-fish-care");
              return;
            }

            if (activePrograms.length === 1) {
              router.push({
                pathname: "/new-fish-care/sevenDays",
                params: {
                  programId: activePrograms[0].id,
                },
              });

              return;
            }

            router.push("/new-fish-care");
          }}
          style={({ pressed }) => [
            styles.careCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.careTop}>
            <View
              style={[
                styles.careIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons name="fish-outline" size={23} color={colors.primary} />
            </View>

            <View style={styles.careHeading}>
              <Text
                style={[
                  styles.careTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                7-Day Fish Care
              </Text>

              <Text
                style={[
                  styles.careSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {activePrograms.length} active program
                {activePrograms.length === 1 ? "" : "s"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color={colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.careFish,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {nextProgram ? nextProgram.fishName : "No active program"}
          </Text>

          <Text
            style={[
              styles.careDay,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {nextProgram
              ? `Day ${nextProgramCompletedDays + 1} of 7`
              : "Start your first fish care program"}
          </Text>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${fishCareProgress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.careFooter}>
            <Text
              style={[
                styles.progressText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {nextProgramCompletedDays}/7 completed
            </Text>

            <Text
              style={[
                styles.openText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {nextProgram ? "Continue" : "Start"}
            </Text>
          </View>
        </Pressable>

        {/* ------------------------------------------------------------------ */}
        {/* Summary                                                            */}
        {/* ------------------------------------------------------------------ */}

        <View
          style={[
            styles.summary,
            {
              borderTopColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.textSecondary}
          />

          <Text
            style={[
              styles.summaryText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            AquaGuide AI helps you identify, understand, and care for your
            ornamental fish.
          </Text>
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
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  /* ---------------------------------------------------------------------- */
  /* Greeting                                                               */
  /* ---------------------------------------------------------------------- */

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  greetingContent: {
    flex: 1,
  },

  greeting: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32,
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  /* ---------------------------------------------------------------------- */
  /* Scan                                                                   */
  /* ---------------------------------------------------------------------- */

  scanCard: {
    minHeight: 150,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
  },

  scanIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  scanContent: {
    flex: 1,
  },

  scanLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 3,
  },

  scanTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  scanDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  scanArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  /* ---------------------------------------------------------------------- */
  /* Sections                                                               */
  /* ---------------------------------------------------------------------- */

  sectionHeader: {
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12.5,
    marginTop: 3,
  },

  /* ---------------------------------------------------------------------- */
  /* Statistics                                                             */
  /* ---------------------------------------------------------------------- */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 27,
  },

  statCard: {
    width: "48.2%",
    minHeight: 108,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
  },

  statLabel: {
    fontSize: 11.5,
    marginTop: 2,
  },

  /* ---------------------------------------------------------------------- */
  /* Scan Statistic                                                         */
  /* ---------------------------------------------------------------------- */

  scanStatValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  scanLimitText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 2,
  },

  scanRemaining: {
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* Fish Care                                                              */
  /* ---------------------------------------------------------------------- */

  careCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
    marginBottom: 24,
  },

  careTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  careIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  careHeading: {
    flex: 1,
    marginLeft: 11,
  },

  careTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  careSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },

  careFish: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
  },

  careDay: {
    fontSize: 12.5,
    marginTop: 3,
    marginBottom: 13,
  },

  progressTrack: {
    height: 7,
    borderRadius: 99,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 99,
  },

  careFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },

  progressText: {
    fontSize: 11.5,
  },

  openText: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* ---------------------------------------------------------------------- */
  /* Summary                                                                */
  /* ---------------------------------------------------------------------- */

  summary: {
    borderTopWidth: 1,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  summaryText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    marginLeft: 8,
  },
});
