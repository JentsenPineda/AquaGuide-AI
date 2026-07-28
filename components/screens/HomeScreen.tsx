import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
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

  return (
    <Pressable
      onPress={() => router.push(route as any)}
      style={({ pressed }) => [styles.moduleCard, pressed && { opacity: 0.9 }]}
    >
      <Ionicons name={icon} size={26} color="#00BCD4" />

      <Text style={styles.moduleTitle}>{title}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
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
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.appTitleRow}>
            <Image
              source={require("@/assets/images/image-library-UI/aquaguide-icon.png")}
              style={styles.appIcon}
            />

            <Text style={styles.appName}>AquaGuide AI</Text>
          </View>

          <Text style={styles.tagline}>
            Ornamental Fish Management Assistant
          </Text>
        </View>

        {/* Welcome Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Welcome to AquaGuide AI</Text>

          <Text style={styles.bannerText}>
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
        <Text style={styles.sectionTitle}>Dashboard Statistics</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="scan-outline" size={24} color="#00BCD4" />
            <Text style={styles.statValue}>0 / 3</Text>
            <Text style={styles.statLabel}>Scans Today</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="alarm-outline" size={24} color="#00BCD4" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Active Reminders</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#00BCD4" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Logbook Entries</Text>
          </View>
        </View>

        {/* Continue Fish Care */}
        <Pressable
          style={({ pressed }) => [
            styles.continueCard,
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

            <Text style={styles.continueTitle}>Continue 7-Day Fish Care</Text>
          </View>

          <Text style={styles.continueDay}>
            {activePrograms.length} Active Program
            {activePrograms.length === 1 ? "" : "s"}
          </Text>

          <Text style={styles.continueTask}>
            {nextProgram
              ? `${nextProgram.fishName} • Day ${nextProgramCompletedDays + 1} of 7`
              : "No active fish care program. Tap to start your first 7-Day Fish Care Guide."}
          </Text>

          <View style={styles.progressBackground}>
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

          <Text style={styles.progressText}>
            {totalPrograms} Total • {completedPrograms.length} Completed
          </Text>

          <View style={styles.continueButton}>
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
    backgroundColor: "#08141F",
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
    color: "#FFFFFF",
  },

  tagline: {
    color: "#B0BEC5",
    marginTop: 5,
  },

  banner: {
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  bannerText: {
    color: "#B0BEC5",
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

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "31%",
    backgroundColor: "#102331",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#B0BEC5",
    marginTop: 5,
  },

  sectionTitle: {
    color: "#FFFFFF",
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
    backgroundColor: "#102331",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
  },

  moduleTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },

  continueCard: {
    backgroundColor: "#102331",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1F3A4A",
  },

  continueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  continueTitle: {
    color: "#FFFFFF",
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
    color: "#B0BEC5",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  progressBackground: {
    height: 10,
    backgroundColor: "#1E3645",
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
    color: "#B0BEC5",
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
