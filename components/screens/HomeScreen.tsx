import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
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
          borderWidth: 1,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name={icon} size={26} color="#00BCD4" />

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
  const colors = useAppColors();

  const router = useRouter();
  const { user } = useAuth();

  const [programs, setPrograms] = useState<FishCareProgram[]>([]);

  useEffect(() => {
    if (!user) return;

    return subscribeToPrograms(user.uid, setPrograms);
  }, [user]);

  const activePrograms = useMemo(
    () => programs.filter((p) => p.status === "active"),
    [programs],
  );

  const completedPrograms = useMemo(
    () => programs.filter((p) => p.status === "completed"),
    [programs],
  );

  const totalPrograms = programs.length;

  const nextProgram = activePrograms[0];

  const nextProgramCompletedDays = nextProgram
    ? nextProgram.days.filter((day) => day.completed).length
    : 0;

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
            backgroundColor: colors.background,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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
        {/* Welcome Banner */}
        <View
          style={[
            styles.banner,
            {
              backgroundColor: colors.card,
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
        {/* Scan Button */}
        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => router.push("/(tabs)/scan")}
        >
          <Ionicons name="scan-outline" size={40} color="#FFFFFF" />

          <Text style={styles.scanTitle}>Scan Ornamental Fish</Text>

          <Text style={styles.scanSubtitle}>
            AI-powered fish identification and care recommendation
          </Text>
        </Pressable>
        {/* Statistics */}
        {/* Statistics */}
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
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name="scan-outline" size={24} color="#00BCD4" />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              0 / 3
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

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name="alarm-outline" size={24} color="#00BCD4" />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              0
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

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name="book-outline" size={24} color="#00BCD4" />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              0
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
        </View>
        {/* Continue Fish Care */}

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
            <Ionicons name="fish-outline" size={30} color="#00BCD4" />

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

          <Text style={styles.continueDay}>
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
              ? `${nextProgram.fishName} • Day ${nextProgramCompletedDays + 1} of 7`
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

          <View style={styles.continueButton}>
            <Text style={styles.continueButtonText}>
              {nextProgram ? "Open Fish Care →" : "Start Fish Care →"}
            </Text>
          </View>
        </Pressable>
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
    paddingBottom: TAB_BAR_HEIGHT,
  },

  header: {
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  scanSubtitle: {
    color: "#E0F7FA",
    textAlign: "center",
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "31%",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },

  statLabel: {
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  moduleCard: {
    width: "48%",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
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
  },

  continueDay: {
    color: "#00BCD4",
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
    backgroundColor: "#00BCD4",
    borderRadius: 999,
  },

  progressText: {
    fontSize: 14,
    marginBottom: 18,
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

  continueButton: {
    backgroundColor: "#00BCD4",
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
