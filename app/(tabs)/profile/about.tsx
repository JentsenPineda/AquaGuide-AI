import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <>
      {/* KEEP ALL OF YOUR EXISTING JSX BELOW THIS */}

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Ionicons name="fish" size={70} color="#00BCD4" />

            <Text style={styles.title}>AquaGuide AI</Text>

            <Text style={styles.version}>Version 1.0.0</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>About</Text>

            <Text style={styles.text}>
              AquaGuide AI is an intelligent ornamental fish care assistant
              designed to help hobbyists and breeders manage fishkeeping more
              efficiently.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Features</Text>

            <Text style={styles.item}>• AI Fish Identification</Text>
            <Text style={styles.item}>• Species Library</Text>
            <Text style={styles.item}>• Tank Care Guide</Text>
            <Text style={styles.item}>• Disease Guide</Text>
            <Text style={styles.item}>• Reminder System</Text>
            <Text style={styles.item}>• Cloud Logbook</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Developed For</Text>

            <Text style={styles.text}>BSIT Capstone Project</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },

  version: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 14,
    padding: 18,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  text: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },

  item: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8,
  },
});
