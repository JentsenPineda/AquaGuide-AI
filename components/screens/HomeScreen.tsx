import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>🐠 AquaGuide AI</Text>

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
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Logs</Text>
          </View>
        </View>

        {/* Modules */}
        <Text style={styles.sectionTitle}>Modules</Text>

        <View style={styles.moduleGrid}>
          <ModuleCard
            title="Species Library"
            icon="book-outline"
            route="/(tabs)/library"
          />

          <ModuleCard
            title="Tank & Care"
            icon="water-outline"
            route="/tank-care"
          />

          <ModuleCard
            title="Disease Guide"
            icon="medkit-outline"
            route="/disease-guide"
          />

          <ModuleCard
            title="Breeding Guide"
            icon="fish-outline"
            route="/breeding-guide"
          />

          <ModuleCard
            title="Aqua Plants"
            icon="leaf-outline"
            route="/aqua-plant"
          />

          <ModuleCard
            title="Equipment"
            icon="construct-outline"
            route="/equipment/equipment-guide"
          />

          <ModuleCard
            title="New Fish Care"
            icon="sparkles-outline"
            route="/new-fish-care"
          />

          <ModuleCard
            title="Reminder & Logbook"
            icon="alarm-outline"
            route="/(tabs)/logbook"
          />

          <ModuleCard
            title="Compatibility"
            icon="git-compare-outline"
            route="/compatibility-checker"
          />
        </View>

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
});
