import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { diseaseDatabase } from "../data/diseaseDatabase";
import { symptomDatabase } from "../data/symptomDatabase";

export default function DiseaseGuide() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);

    setTimeout(() => {
      let bestMatch = null;
      let highestScore = 0;

      diseaseDatabase.forEach((disease) => {
        const matches = disease.symptoms.filter((symptom) =>
          selectedSymptoms.includes(symptom),
        ).length;

        if (matches > highestScore) {
          highestScore = matches;
          bestMatch = disease;
        }
      });

      setResult(bestMatch);

      setLoading(false);
    }, 2000);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🩺 AquaGuide AI</Text>

          <Text style={styles.heroSubtitle}>
            Select the symptoms you observe and AquaGuide AI will identify the
            most likely disease.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Symptoms</Text>

        <View style={styles.chipContainer}>
          {symptomDatabase.map((symptom) => (
            <Pressable
              key={symptom}
              onPress={() => toggleSymptom(symptom)}
              style={[
                styles.chip,
                selectedSymptoms.includes(symptom) && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSymptoms.includes(symptom) && styles.activeChipText,
                ]}
              >
                {symptom}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.analyzeButton} onPress={analyzeSymptoms}>
          <Text style={styles.analyzeText}>Analyze Symptoms</Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00D4FF" />

            <Text style={styles.loadingText}>🔍 Checking Symptoms...</Text>

            <Text style={styles.loadingSub}>
              Searching the disease database.
            </Text>
          </View>
        )}

        {result && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>🩺 Most Likely Disease</Text>

            <Text style={styles.diseaseName}>{result.name}</Text>

            <Text style={styles.sectionLabel}>💊 Treatment</Text>

            {result.treatment.map((item: string) => (
              <Text key={item} style={styles.resultItem}>
                • {item}
              </Text>
            ))}

            <Text style={styles.sectionLabel}>🛡 Prevention</Text>

            {result.prevention.map((item: string) => (
              <Text key={item} style={styles.resultItem}>
                • {item}
              </Text>
            ))}
          </View>
        )}
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
  },

  hero: {
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
    lineHeight: 22,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#102331",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#00D4FF",
  },

  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  activeChipText: {
    color: "#08141F",
    fontWeight: "700",
  },

  analyzeButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 15,
  },

  analyzeText: {
    color: "#08141F",
    fontWeight: "800",
    fontSize: 16,
  },

  loadingCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    marginTop: 20,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },

  loadingSub: {
    color: "#B0BEC5",
    marginTop: 10,
    textAlign: "center",
  },

  resultCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
  },

  resultTitle: {
    color: "#00D4FF",
    fontSize: 18,
    fontWeight: "700",
  },

  diseaseName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  sectionLabel: {
    color: "#00D4FF",
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "700",
  },

  resultItem: {
    color: "#CFD8DC",
    marginBottom: 5,
  },
});
