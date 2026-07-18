import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import ThemeChip from "@/components/chips/ThemeChip";
import ThemeInput from "@/components/inputs/ThemeInput";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";

import { useAppColors } from "@/theme/useAppColors";

import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { RF, RS } from "@/utils/responsive";

import { diseaseDatabase } from "../data/diseaseDatabase";
import { symptomDatabase } from "../data/symptomDatabase";
import { symptomIntentDatabase } from "../data/symptomIntentDatabase";

export default function DiseaseGuide() {
  const colors = useAppColors();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [exampleSearches, setExampleSearches] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const dynamicStyles = {
    safe: {
      backgroundColor: colors.background,
    },

    sectionTitle: {
      color: colors.textPrimary,
    },

    selectedCard: {
      backgroundColor: colors.card,
    },

    selectedTitle: {
      color: colors.textPrimary,
    },

    selectedItemText: {
      color: colors.textPrimary,
    },

    clearText: {
      color: colors.primary,
    },

    symptomCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    activeSymptomCard: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    symptomText: {
      color: colors.textPrimary,
    },

    activeSymptomText: {
      color: colors.background,
    },

    infoCard: {
      backgroundColor: colors.surface,
    },

    divider: {
      backgroundColor: colors.border,
    },

    confidenceBadge: {
      backgroundColor: colors.primary,
    },
  };
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
    <View style={[styles.safe, dynamicStyles.safe]}>
      <AppHeader title="Disease Guide" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ThemeCard style={styles.hero}>
          <ThemeText variant="title">🩺 AquaGuide AI</ThemeText>

          <ThemeText variant="subtitle" style={styles.heroSubtitle}>
            Select the symptoms you observe and AquaGuide AI will identify the
            most likely disease.
          </ThemeText>
        </ThemeCard>

        <ThemeText
          variant="title"
          style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
        >
          Select Symptoms
        </ThemeText>
        <ThemeCard style={styles.searchCard}>
          <Text style={styles.searchTitle}>Fish Observation</Text>

          <ThemeInput
            icon="search"
            placeholder="Describe what you observe..."
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
          />

          {isSearchFocused && searchQuery.trim() === "" && (
            <>
              <Text style={styles.exampleLabel}>Common Observations</Text>

              <View style={styles.exampleChips}>
                {exampleSearches.map((item) => (
                  <ThemeChip
                    key={item}
                    title={item}
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
                  />
                ))}
              </View>
            </>
          )}
        </ThemeCard>

        {selectedSymptoms.length > 0 && (
          <View style={[styles.selectedCard, dynamicStyles.selectedCard]}>
            <View style={styles.selectedHeader}>
              <ThemeText
                variant="body"
                style={[styles.selectedTitle, dynamicStyles.selectedTitle]}
              >
                Selected Symptoms ({selectedSymptoms.length})
              </ThemeText>

              <Pressable
                onPress={() => {
                  setSelectedSymptoms([]);
                  setResult(null);
                }}
              >
                <ThemeText
                  variant="body"
                  style={[styles.clearText, dynamicStyles.clearText]}
                >
                  Clear All
                </ThemeText>
              </Pressable>
            </View>

            {selectedSymptoms.map((symptom) => (
              <View key={symptom} style={styles.selectedItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />

                <ThemeText
                  variant="body"
                  style={[
                    styles.selectedItemText,
                    dynamicStyles.selectedItemText,
                  ]}
                >
                  {symptom}
                </ThemeText>
              </View>
            ))}
          </View>
        )}
        <View style={styles.categoryContainer}>
          {filteredCategories.map((category) => {
            const expanded = expandedCategory === category.title;

            return (
              <View
                key={category.title}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.card,
                  },
                ]}
              >
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
                      color={colors.primary}
                    />

                    <ThemeText
                      variant="body"
                      style={[
                        styles.categoryTitle,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {category.title}
                    </ThemeText>
                  </View>

                  <Ionicons
                    name={
                      expanded ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={22}
                    color={colors.textPrimary}
                  />
                </Pressable>

                {expanded &&
                  category.symptoms.map((symptom) => (
                    <Pressable
                      key={symptom}
                      onPress={() => toggleSymptom(symptom)}
                      style={[
                        styles.symptomCard,
                        dynamicStyles.symptomCard,
                        selectedSymptoms.includes(symptom) && [
                          styles.activeSymptomCard,
                          dynamicStyles.activeSymptomCard,
                        ],
                      ]}
                    >
                      <ThemeText
                        variant="body"
                        style={[
                          styles.symptomText,
                          dynamicStyles.symptomText,
                          selectedSymptoms.includes(symptom) && [
                            styles.activeSymptomText,
                            dynamicStyles.activeSymptomText,
                          ],
                        ]}
                      >
                        {symptom}
                      </ThemeText>
                    </Pressable>
                  ))}
              </View>
            );
          })}
        </View>

        <ThemeButton
          title="Analyze Symptoms"
          loading={loading}
          onPress={analyzeSymptoms}
          style={styles.analyzeButton}
        />

        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.loadingModal,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.primary} />

              <ThemeText
                variant="title"
                style={[
                  styles.loadingTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Analyzing Symptoms
              </ThemeText>

              <ThemeText
                variant="body"
                style={[
                  styles.loadingMessage,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                AquaGuide AI is comparing the selected symptoms with the disease
                database...
              </ThemeText>
            </View>
          </View>
        </Modal>

        <Modal
          visible={result !== null && !loading}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.resultModal,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultScrollContent}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={60}
                  color={colors.primary}
                  style={{ alignSelf: "center", marginBottom: 15 }}
                />
                <ThemeText
                  variant="title"
                  style={[
                    styles.resultModalTitle,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Disease Analysis
                </ThemeText>
                <ThemeText
                  variant="body"
                  style={[
                    styles.resultSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Diagnosis Complete
                </ThemeText>
                <View style={[styles.divider, dynamicStyles.divider]} />
                <ThemeText
                  variant="body"
                  style={[
                    styles.resultLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Most Likely Disease
                </ThemeText>
                <ThemeText
                  variant="title"
                  style={[
                    styles.resultDisease,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {result?.name}
                </ThemeText>
                <View
                  style={[
                    styles.confidenceBadge,
                    dynamicStyles.confidenceBadge,
                  ]}
                >
                  <Text style={styles.confidenceText}>HIGH MATCH</Text>
                </View>
                <View style={styles.divider} />
                <ThemeText
                  variant="title"
                  style={[
                    styles.resultSection,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Treatment
                </ThemeText>
                {result?.treatment.map((item: string) => (
                  <View
                    key={item}
                    style={[styles.infoCard, dynamicStyles.infoCard]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.primary}
                    />
                    <ThemeText
                      variant="body"
                      style={[
                        styles.infoText,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {item}
                    </ThemeText>
                  </View>
                ))}
                <ThemeText
                  variant="title"
                  style={[
                    styles.resultSection,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Prevention
                </ThemeText>
                {result?.prevention.map((item: string) => (
                  <View
                    key={item}
                    style={[styles.infoCard, dynamicStyles.infoCard]}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={colors.primary}
                    />
                    <ThemeText
                      variant="body"
                      style={[
                        styles.infoText,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {item}
                    </ThemeText>
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
                  <ThemeText
                    variant="body"
                    style={[
                      styles.closeButtonText,
                      {
                        color: colors.background,
                      },
                    ]}
                  >
                    Close
                  </ThemeText>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: RS(20),
    paddingBottom: TAB_BAR_HEIGHT,
  },

  hero: {
    padding: RS(22),
    borderRadius: RS(24),
    marginBottom: RS(20),
  },

  heroTitle: {
    fontSize: RF(28),
    fontWeight: "bold",
  },

  heroSubtitle: {
    marginTop: RS(8),
    lineHeight: RF(22),
    fontSize: RF(15),
  },

  sectionTitle: {
    fontSize: RF(18),
    fontWeight: "700",
    marginBottom: RS(12),
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  symptomCard: {
    borderRadius: RS(14),
    paddingVertical: RS(14),
    paddingHorizontal: RS(16),
    marginBottom: RS(10),
    borderWidth: 1,
  },

  activeSymptomCard: {},

  symptomText: {
    fontSize: RF(15),
    fontWeight: "600",
  },

  activeSymptomText: {
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
    marginTop: 15,
  },

  analyzeText: {
    color: "#08141F",
    fontWeight: "800",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingModal: {
    width: "85%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },

  loadingTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },

  loadingMessage: {
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    fontSize: 15,
  },
  resultModal: {
    width: "90%",
    maxHeight: "85%",
    borderRadius: 24,
    overflow: "hidden",
  },

  resultScrollContent: {
    padding: 24,
    paddingBottom: 35,
  },

  resultModalTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  resultDisease: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  resultSection: {
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
    marginVertical: 18,
  },

  resultLabel: {
    color: "#90A4AE",
    fontSize: 15,
  },

  confidenceBadge: {
    alignSelf: "flex-start",
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  infoText: {
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },

  categoryContainer: {
    marginTop: 10,
  },

  categoryCard: {
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
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 12,
  },

  selectedCard: {
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
    fontSize: 17,
    fontWeight: "700",
  },

  clearText: {
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  searchTitle: {
    color: "#000000ff",
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
