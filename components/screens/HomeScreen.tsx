import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToLogs } from "@/services/logbookService";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
import { subscribeToReminders } from "@/services/reminderService";
import { ScanItem, subscribeToScans } from "@/services/scanService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

type ModuleCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

function ModuleCard({ title, icon, route }: ModuleCardProps) {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <Pressable
      onPress={() => router.push(route as any)}
      style={({ pressed }) => [
        styles.moduleCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name={icon} size={26} color={colors.primary} />

      <Text
        style={[
          styles.moduleTitle,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { user } = useAuth();

  // ============================================================
  // FISH CARE
  // ============================================================

  const [programs, setPrograms] = useState<FishCareProgram[]>([]);

  // ============================================================
  // SCANS
  // ============================================================

  const [scans, setScans] = useState<ScanItem[]>([]);

  // ============================================================
  // REMINDERS
  // ============================================================

  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // ============================================================
  // LOGBOOK
  // ============================================================

  const [logs, setLogs] = useState<LogItem[]>([]);

  // ============================================================
  // SUBSCRIBE TO FISH CARE PROGRAMS
  // ============================================================

  useEffect(() => {
    if (!user) {
      setPrograms([]);
      return;
    }

    return subscribeToPrograms(user.uid, setPrograms);
  }, [user]);

  // ============================================================
  // SUBSCRIBE TO SCANS
  // ============================================================

  useEffect(() => {
    if (!user) {
      setScans([]);
      return;
    }

    return subscribeToScans(user.uid, setScans);
  }, [user]);

  // ============================================================
  // SUBSCRIBE TO REMINDERS
  // ============================================================

  useEffect(() => {
    if (!user) {
      setReminders([]);
      return;
    }

    return subscribeToReminders(user.uid, setReminders);
  }, [user]);

  // ============================================================
  // SUBSCRIBE TO LOGBOOK
  // ============================================================

  useEffect(() => {
    if (!user) {
      setLogs([]);
      return;
    }

    return subscribeToLogs(user.uid, setLogs);
  }, [user]);

  // ============================================================
  // FISH CARE STATISTICS
  // ============================================================

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

  // ============================================================
  // SCANS TODAY
  // ============================================================

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

  // ============================================================
  // DASHBOARD STATISTICS
  // ============================================================

  const activeReminderCount = reminders.length;

  const logbookCount = logs.length;

  const activeFishCareCount = activePrograms.length;

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: TAB_BAR_HEIGHT,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
          <View style={styles.appTitleRow}>
            <Image
              source={require("@/assets/images/image-library-UI/aquaguide-icon.png")}
              style={styles.appIcon}
            />

            <Text
              style={[
                styles.appName,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              AquaGuide AI
            </Text>
          </View>

          <Text
            style={[
              styles.tagline,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Ornamental Fish Management Assistant
          </Text>
        </View>

        {/* =====================================================
            WELCOME BANNER
        ===================================================== */}

        <View
          style={[
            styles.banner,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.bannerTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Welcome to AquaGuide AI
          </Text>

          <Text
            style={[
              styles.bannerText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Scan ornamental fish, access species information, receive care
            recommendations, and manage your aquarium in one application.
          </Text>
        </View>

        {/* =====================================================
            SCAN BUTTON
        ===================================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => router.push("/scan")}
        >
          <Ionicons name="scan-outline" size={40} color="#FFFFFF" />

          <Text style={styles.scanTitle}>Scan Ornamental Fish</Text>

          <Text style={styles.scanSubtitle}>
            AI-powered fish identification and care recommendation
          </Text>
        </Pressable>

        {/* =====================================================
            DASHBOARD STATISTICS
        ===================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Dashboard Statistics
        </Text>

        <View style={styles.statsRow}>
          {/* SCANS */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="scan-outline" size={24} color={colors.primary} />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {scansToday} / 3
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Scans Today
            </Text>
          </View>

          {/* LOGBOOK */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="book-outline" size={24} color={colors.primary} />

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
              Logbook Entries
            </Text>
          </View>

          {/* REMINDERS */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="alarm-outline" size={24} color={colors.primary} />

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
              Active Reminders
            </Text>
          </View>

          {/* FISH CARE */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="fish-outline" size={24} color={colors.primary} />

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
              Fish Care
            </Text>
          </View>
        </View>

        {/* =====================================================
            CONTINUE 7-DAY FISH CARE
        ===================================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.continueCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            pressed && { opacity: 0.9 },
          ]}
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
        >
          <View style={styles.continueHeader}>
            <Ionicons name="fish-outline" size={30} color={colors.primary} />

            <Text
              style={[
                styles.continueTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Continue 7-Day Fish Care
            </Text>
          </View>

          <Text
            style={[
              styles.continueDay,
              {
                color: colors.primary,
              },
            ]}
          >
            {activePrograms.length} Active Program
            {activePrograms.length === 1 ? "" : "s"}
          </Text>

          <Text
            style={[
              styles.continueTask,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {nextProgram
              ? `${nextProgram.fishName} • Day ${
                  nextProgramCompletedDays + 1
                } of 7`
              : "No active fish care program. Tap to start your first 7-Day Fish Care Guide."}
          </Text>

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
                  backgroundColor: colors.primary,
                  width: nextProgram
                    ? `${(nextProgramCompletedDays / 7) * 100}%`
                    : "0%",
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.progressText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {totalPrograms} Total • {completedPrograms.length} Completed
          </Text>

          <View
            style={[
              styles.continueButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.continueButtonText}>
              {nextProgram ? "Open Fish Care →" : "Start Fish Care →"}
            </Text>
          </View>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  appTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
  },

  tagline: {
    marginTop: 5,
  },

  banner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  bannerText: {
    marginTop: 10,
    lineHeight: 22,
  },

  scanButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },

  scanTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  scanSubtitle: {
    color: "#E0F7FA",
    textAlign: "center",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 13,
  },

  moduleCard: {
    width: "48%",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
  },

  moduleTitle: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },

  continueCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },

  continueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  continueTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
  },

  continueDay: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  continueTask: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  progressBackground: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressText: {
    fontSize: 14,
    marginBottom: 18,
  },

  continueButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
