import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="About"
        subtitle="Learn more about AquaGuide AI"
        showBack
        variant="light"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="fish" size={64} color="#00BCD4" />
          </View>

          <Text style={styles.title}>AquaGuide AI</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.heading}>About AquaGuide AI</Text>

          <Text style={styles.text}>
            AquaGuide AI is an intelligent ornamental fish care assistant
            designed to help aquarium hobbyists and fish breeders manage fish
            health, maintenance, and care more efficiently through educational
            guides, reminders, species information, and AI-assisted features.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.heading}>Core Features</Text>

          <FeatureItem title="AI Fish Identification" />
          <FeatureItem title="Species Library" />
          <FeatureItem title="Fish Care Guides" />
          <FeatureItem title="Disease Guide" />
          <FeatureItem title="Reminder System" />
          <FeatureItem title="Care Logbook" />
        </View>

        {/* Developers */}
        <View style={styles.card}>
          <Text style={styles.heading}>Development Team</Text>

          <DeveloperItem role="Programmer" name="Pineda, Reanze Jentsen" />

          <DeveloperItem role="Project Manager" name="Aguilar, Kyrene Erica" />

          <DeveloperItem role="UI/UX Designer" name="Ibe, Jairos Andrei" />

          <DeveloperItem role="Technical Writer" name="Baquing, Arjay" />

          <DeveloperItem role="Database Designer" name="Mallari, Jayron" />
        </View>

        {/* School */}
        <View style={styles.card}>
          <Text style={styles.heading}>Developed For</Text>

          <View style={styles.schoolRow}>
            <Ionicons name="school-outline" size={22} color="#00BCD4" />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.schoolTitle}>BSIT Capstone Project</Text>

              <Text style={styles.schoolText}>College of Computer Studies</Text>

              <Text style={styles.schoolText}>Dominican College of Tarlac</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          © 2026 AquaGuide AI{"\n"}
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

function FeatureItem({ title }: { title: string }) {
  return (
    <View style={styles.listItem}>
      <Ionicons name="checkmark-circle" size={22} color="#00BCD4" />
      <Text style={styles.listText}>{title}</Text>
    </View>
  );
}

function DeveloperItem({ role, name }: { role: string; name: string }) {
  return (
    <View style={styles.developerRow}>
      <Ionicons name="person-circle-outline" size={26} color="#00BCD4" />

      <View style={{ marginLeft: 12 }}>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 22,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },

  version: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
  },

  heading: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  text: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  listText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#374151",
  },

  developerRow: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "center",
  },

  role: {
    fontSize: 13,
    color: "#6B7280",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },

  schoolRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  schoolTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  schoolText: {
    marginTop: 4,
    fontSize: 15,
    color: "#4B5563",
  },

  footer: {
    textAlign: "center",
    color: "#6B7280",
    marginVertical: 20,
    lineHeight: 22,
    fontSize: 13,
  },
});
