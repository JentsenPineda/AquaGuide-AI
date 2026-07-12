import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/theme/colors";
import { RF, RS } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { diseaseDatabase } from "../data/diseaseDatabase";
import { symptomDatabase } from "../data/symptomDatabase";
import { symptomIntentDatabase } from "../data/symptomIntentDatabase";

export default function DiseaseGuide() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [exampleSearches, setExampleSearches] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  useEffect(() => {
    const observations = [
      ...new Set(
        symptomIntentDatabase.flatMap((intent) => intent.displayExamples),
      ),
    ];

    const shuffled = [...observations];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setExampleSearches(shuffled.slice(0, 8));
  }, []);

  const toggleSymptom = (symptom: string) => {
    // Clear previous analysis whenever the selection changes

    setResult(null);
    setLoading(false);

    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const findMatchingSymptoms = (query: string): string[] => {
    const normalizedQuery = query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "");

    if (!normalizedQuery) return [];

    return symptomIntentDatabase
      .map((intent) => {
        let score = 0;

        intent.keywords.forEach((keyword) => {
          const normalizedKeyword = keyword
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, "");

          if (normalizedQuery.includes(normalizedKeyword)) {
            score += 100;
            return;
          }

          const keywordWords = normalizedKeyword
            .split(/\s+/)
            .filter((word) => word.length > 3);

          const queryWords = normalizedQuery
            .split(/\s+/)
            .filter((word) => word.length > 3);

          const matchedWords = keywordWords.filter((word) =>
            queryWords.includes(word),
          );

          if (matchedWords.length >= 2) {
            score += matchedWords.length;
          }
        });

        return {
          symptom: intent.symptom,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.symptom);
  };
  const suggestedSymptoms = findMatchingSymptoms(searchQuery);

  const filteredCategories = symptomDatabase
    .map((category) => ({
      ...category,
      symptoms: category.symptoms.filter((symptom) => {
        if (searchQuery.trim() === "") return true;

        return (
          symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestedSymptoms.includes(symptom)
        );
      }),
    }))
    .filter((category) => category.symptoms.length > 0);

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

        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Fish Observation</Text>

          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#8FA3B0"
              style={{ marginLeft: 12 }}
            />

            <TextInput
              placeholder="Describe what you observe..."
              placeholderTextColor="#8FA3B0"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);

                if (text.trim() !== "") {
                  setIsSearchFocused(false);

                  const matches = findMatchingSymptoms(text);

                  const matchedCategory = symptomDatabase.find((category) =>
                    category.symptoms.some(
                      (symptom) =>
                        symptom.toLowerCase().includes(text.toLowerCase()) ||
                        matches.includes(symptom),
                    ),
                  );

                  if (matchedCategory) {
                    setExpandedCategory(matchedCategory.title);
                  }
                } else {
                  setIsSearchFocused(true);
                  setExpandedCategory(null);
                }
              }}
              onFocus={() => setIsSearchFocused(true)}
              style={styles.searchInput}
            />
          </View>

          {isSearchFocused && searchQuery.trim() === "" && (
            <>
              <Text style={styles.exampleLabel}>Common Observations</Text>

              <View style={styles.exampleChips}>
                {exampleSearches.map((item) => (
                  <Pressable
                    key={item}
                    style={styles.exampleChip}
                    onPress={() => {
                      const query = item.toLowerCase();

                      setSearchQuery(query);
                      setIsSearchFocused(false);

                      const matchedCategory = symptomDatabase.find((category) =>
                        category.symptoms.some(
                          (symptom) =>
                            symptom.toLowerCase().includes(query) ||
                            symptomIntentDatabase
                              .find((intent) => intent.symptom === symptom)
                              ?.keywords.some((keyword) =>
                                keyword.toLowerCase().includes(query),
                              ),
                        ),
                      );

                      if (matchedCategory) {
                        setExpandedCategory(matchedCategory.title);
                      }
                    }}
                  >
                    <Text style={styles.exampleChipText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>

        {selectedSymptoms.length > 0 && (
          <View style={styles.selectedCard}>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedTitle}>
                Selected Symptoms ({selectedSymptoms.length})
              </Text>

              <Pressable
                onPress={() => {
                  setSelectedSymptoms([]);
                  setResult(null);
                }}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </Pressable>
            </View>

            {selectedSymptoms.map((symptom) => (
              <View key={symptom} style={styles.selectedItem}>
                <Ionicons name="checkmark-circle" size={18} color="#00BCD4" />

                <Text style={styles.selectedItemText}>{symptom}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.categoryContainer}>
          {filteredCategories.map((category) => {
            const expanded = expandedCategory === category.title;

            return (
              <View key={category.title} style={styles.categoryCard}>
                <Pressable
                  style={styles.categoryHeader}
                  onPress={() =>
                    setExpandedCategory(expanded ? null : category.title)
                  }
                >
                  <View style={styles.categoryLeft}>
                    <Ionicons
                      name={category.icon as any}
                      size={22}
                      color="#00BCD4"
                    />

                    <Text style={styles.categoryTitle}>{category.title}</Text>
                  </View>

                  <Ionicons
                    name={
                      expanded ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={22}
                    color="#FFFFFF"
                  />
                </Pressable>

                {expanded &&
                  category.symptoms.map((symptom) => (
                    <Pressable
                      key={symptom}
                      onPress={() => toggleSymptom(symptom)}
                      style={[
                        styles.symptomCard,
                        selectedSymptoms.includes(symptom) &&
                          styles.activeSymptomCard,
                      ]}
                    >
                      <Text
                        style={[
                          styles.symptomText,
                          selectedSymptoms.includes(symptom) &&
                            styles.activeSymptomText,
                        ]}
                      >
                        {symptom}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            );
          })}
        </View>

        <Pressable style={styles.analyzeButton} onPress={analyzeSymptoms}>
          <Text style={styles.analyzeText}>Analyze Symptoms</Text>
        </Pressable>

        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.loadingModal}>
              <ActivityIndicator size="large" color="#00BCD4" />

              <Text style={styles.loadingTitle}>Analyzing Symptoms</Text>

              <Text style={styles.loadingMessage}>
                AquaGuide AI is comparing the selected symptoms with the disease
                database...
              </Text>
            </View>
          </View>
        </Modal>

        <Modal
          visible={result !== null && !loading}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.resultModal}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultScrollContent}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={60}
                  color="#00BCD4"
                  style={{ alignSelf: "center", marginBottom: 15 }}
                />
                <Text style={styles.resultModalTitle}>Disease Analysis</Text>
                <Text style={styles.resultSubtitle}>Diagnosis Complete</Text>
                <View style={styles.divider} />
                <Text style={styles.resultLabel}>Most Likely Disease</Text>
                <Text style={styles.resultDisease}>{result?.name}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>HIGH MATCH</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.resultSection}>Treatment</Text>
                {result?.treatment.map((item: string) => (
                  <View key={item} style={styles.infoCard}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#00BCD4"
                    />
                    <Text style={styles.infoText}>{item}</Text>
                  </View>
                ))}
                <Text style={styles.resultSection}>Prevention</Text>
                {result?.prevention.map((item: string) => (
                  <View key={item} style={styles.infoCard}>
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color="#00BCD4"
                    />
                    <Text style={styles.infoText}>{item}</Text>
                  </View>
                ))}
                <Pressable
                  style={styles.closeButton}
                  onPress={() => {
                    setResult(null);
                    setSelectedSymptoms([]);
                    setSearchQuery("");
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: RS(20),
  },

  hero: {
    backgroundColor: Colors.card,
    padding: RS(22),
    borderRadius: RS(24),
    marginBottom: RS(20),
  },

  heroTitle: {
    color: Colors.white,
    fontSize: RF(28),
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: Colors.textSecondary,
    marginTop: RS(8),
    lineHeight: RF(22),
    fontSize: RF(15),
  },

  sectionTitle: {
    color: Colors.white,
    fontSize: RF(18),
    fontWeight: "700",
    marginBottom: RS(12),
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  symptomCard: {
    backgroundColor: Colors.card,
    borderRadius: RS(14),
    paddingVertical: RS(14),
    paddingHorizontal: RS(16),
    marginBottom: RS(10),
    borderWidth: 1,
    borderColor: Colors.border,
  },

  activeSymptomCard: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },

  symptomText: {
    color: Colors.white,
    fontSize: RF(15),
    fontWeight: "600",
  },

  activeSymptomText: {
    color: Colors.background,
    fontWeight: "700",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingModal: {
    width: "85%",
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },

  loadingTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },

  loadingMessage: {
    color: "#B0BEC5",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    fontSize: 15,
  },
  resultModal: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#102331",
    borderRadius: 24,
    overflow: "hidden",
  },

  resultScrollContent: {
    padding: 24,
    paddingBottom: 35,
  },

  resultModalTitle: {
    color: "#00D4FF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  resultDisease: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  resultSection: {
    color: "#00D4FF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
  },

  closeButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 25,
  },

  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },

  resultSubtitle: {
    color: "#90A4AE",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#263C4D",
    marginVertical: 18,
  },

  resultLabel: {
    color: "#90A4AE",
    fontSize: 15,
  },

  confidenceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#00BCD4",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
  },

  confidenceText: {
    color: "#08141F",
    fontWeight: "700",
    fontSize: 13,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#173344",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  infoText: {
    color: "#FFFFFF",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },

  categoryContainer: {
    marginTop: 10,
  },

  categoryCard: {
    backgroundColor: "#102331",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },

  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 12,
  },

  selectedCard: {
    backgroundColor: "#102331",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  selectedTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  clearText: {
    color: "#00BCD4",
    fontWeight: "700",
  },

  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  selectedItemText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 15,
  },

  searchCard: {
    backgroundColor: "#102331",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  searchTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  searchDescription: {
    color: "#90A4AE",
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 22,
    fontSize: 14,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#08141F",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E3A4C",
  },

  exampleTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },

  exampleContainer: {
    gap: 10,
  },

  exampleText: {
    color: "#00BCD4",
    fontSize: 15,
    fontWeight: "600",
  },

  exampleChipsContainer: {
    marginTop: 14,
  },

  exampleLabel: {
    color: "#90A4AE",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },

  exampleChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  exampleChip: {
    backgroundColor: "#173344",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  exampleChipText: {
    color: "#00BCD4",
    fontSize: 14,
    fontWeight: "600",
  },
});
