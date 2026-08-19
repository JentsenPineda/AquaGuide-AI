import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import ThemeInput from "@/components/inputs/ThemeInput";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { fishCareDatabase } from "../data/fishCareDatabase";

import { allFish } from "../data/allFish";
import { fishProfiles } from "../data/fishProfiles";

export default function TankCareScreen() {
  const colors = useAppColors();
  const { fish: fishParam } = useLocalSearchParams<{
    fish?: string | string[];
  }>();
  const passedFishId = Array.isArray(fishParam) ? fishParam[0] : fishParam;

  const [setupType, setSetupType] = useState<"Aquarium" | "Pond">("Aquarium");

  const [selectedFishId, setSelectedFishId] = useState(passedFishId ?? "");
  const [showFishDropdown, setShowFishDropdown] = useState(false);

  const [fishCount, setFishCount] = useState("");
  const [userTankSize, setUserTankSize] = useState("");

  const [showAssessment, setShowAssessment] = useState(false);
  const assessmentTranslateY = useRef(new Animated.Value(0)).current;

  const closeAssessment = () => {
    Animated.timing(assessmentTranslateY, {
      toValue: 700,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setShowAssessment(false);
      assessmentTranslateY.setValue(0);
    });
  };

  const assessmentPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          assessmentTranslateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 1.2) {
          closeAssessment();
        } else {
          Animated.spring(assessmentTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 70,
            friction: 10,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(assessmentTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;
  const selectedFish = useMemo(
    () => allFish.find((fish) => fish.id === selectedFishId),
    [selectedFishId],
  );
  const availableFish = useMemo(() => {
    if (setupType === "Pond") {
      return allFish.filter((fish) => fish.pondCompatible);
    }

    return allFish;
  }, [setupType]);

  useEffect(() => {
    if (!selectedFishId) return;

    const currentFish = allFish.find((fish) => fish.id === selectedFishId);

    if (setupType === "Pond" && currentFish && !currentFish.pondCompatible) {
      setSelectedFishId("");
      setFishCount("");
      setUserTankSize("");
      setShowAssessment(false);
    }
  }, [setupType, selectedFishId]);
  const profile = fishProfiles[selectedFishId as keyof typeof fishProfiles];

  const careData =
    fishCareDatabase[selectedFishId as keyof typeof fishCareDatabase];

  const quantity = Number(fishCount) || 1;

  const recommendedVolume = careData?.gallonsPerFish
    ? careData.gallonsPerFish * quantity
    : 0;
  const actualVolume = Number(userTankSize) || 0;

  const stockingStatus =
    actualVolume >= recommendedVolume ? "Suitable" : "Overcrowded";
  const environmentMismatch =
    careData &&
    ((setupType === "Aquarium" && careData.environment === "Pond") ||
      (setupType === "Pond" && careData.environment === "Aquarium"));
  const dynamicStyles = {
    safe: {
      backgroundColor: colors.background,
    },

    hero: {
      borderRadius: 28,
      padding: 24,
      marginBottom: 25,
    },

    heroTitleContainer: {
      flex: 1,
    },

    statusBadge: {
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: "flex-start",
    },

    heroIcon: {
      width: 65,
      height: 65,
      borderRadius: 20,
      marginRight: 16,
    },

    heroDescription: {
      marginTop: 12,
      lineHeight: 22,
    },

    selectorContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },

    selectorCardActive: {
      borderWidth: 2,
      transform: [
        {
          scale: 1.03,
        },
      ],
    },

    selectorTitle: {
      marginTop: 12,
      fontSize: 17,
      fontWeight: "700",
    },

    selectorSubtitle: {
      marginTop: 5,
      fontSize: 13,
    },

    heroSubtitle: {
      marginTop: 10,
      lineHeight: 22,
    },

    sectionTitle: {
      color: colors.textPrimary,
    },

    selectorCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    selectorActive: {
      borderColor: colors.primary,
    },

    input: {
      backgroundColor: colors.card,
      color: colors.textPrimary,
    },

    resultCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };
  const generateRecommendation = () => {
    if (!fishCount) {
      alert("Please enter the number of fish.");
      return;
    }

    if (!userTankSize) {
      alert(
        setupType === "Pond"
          ? "Please enter pond volume."
          : "Please enter tank size.",
      );
      return;
    }
    assessmentTranslateY.setValue(0);
    setShowAssessment(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.safe, dynamicStyles.safe]}>
        <AppHeader title="Tank & Care" showBack />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HERO */}

          <ThemeCard style={[styles.hero, dynamicStyles.hero]}>
            <View style={styles.heroHeader}>
              <Image
                source={require("@/assets/images/image-library-UI/aquaguide-icon.png")}
                style={styles.heroIcon}
              />

              <View style={styles.heroContent}>
                <ThemeText variant="title" style={styles.heroTitle}>
                  Tank & Pond Advisor
                </ThemeText>

                <ThemeText variant="caption" style={styles.heroCaption}>
                  AI Aquarium Planning Assistant
                </ThemeText>
              </View>
            </View>
            <ThemeText variant="subtitle" style={styles.heroSubtitle}>
              Get personalized aquarium and pond recommendations based on your
              fish species.
            </ThemeText>
          </ThemeCard>
          {/* SETUP TYPE */}

          <ThemeText
            variant="title"
            style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
          >
            Choose Environment
          </ThemeText>

          <View style={styles.row}>
            <Pressable
              style={{ width: "48%" }}
              onPress={() => {
                setSetupType("Aquarium");

                setFishCount("");
                setUserTankSize("");
                setShowAssessment(false);
              }}
            >
              <ThemeCard
                style={[
                  styles.selectorCard,
                  dynamicStyles.selectorCard,
                  setupType === "Aquarium" && [
                    styles.selectorActive,
                    dynamicStyles.selectorActive,
                  ],
                ]}
              >
                <Ionicons name="fish" size={42} color="#00BCD4" />
                <ThemeText variant="body" style={styles.selectorTitle}>
                  Aquarium
                </ThemeText>

                <ThemeText variant="caption" style={styles.selectorSubtitle}>
                  Indoor Fish Tanks
                </ThemeText>
              </ThemeCard>
            </Pressable>

            <Pressable
              style={{ width: "48%" }}
              onPress={() => {
                setSetupType("Pond");

                setFishCount("");
                setUserTankSize("");
                setShowAssessment(false);
              }}
            >
              <ThemeCard
                style={[
                  styles.selectorCard,
                  dynamicStyles.selectorCard,
                  setupType === "Pond" && [
                    styles.selectorActive,
                    dynamicStyles.selectorActive,
                  ],
                ]}
              >
                <Ionicons name="leaf" size={42} color="#4CAF50" />
                <ThemeText variant="body" style={styles.selectorTitle}>
                  Pond
                </ThemeText>

                <ThemeText variant="caption" style={styles.selectorSubtitle}>
                  Outdoor Pond Setup
                </ThemeText>
              </ThemeCard>
            </Pressable>
          </View>

          {/* FISH SELECTION */}

          <ThemeText
            variant="title"
            style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
          >
            Choose Fish Species
          </ThemeText>

          <Pressable
            style={[
              styles.fishDropdown,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowFishDropdown(true)}
          >
            <View style={styles.fishDropdownContent}>
              {selectedFish ? (
                <>
                  <Image
                    source={selectedFish.image}
                    style={styles.dropdownImage}
                    resizeMode="contain"
                  />

                  <View style={{ flex: 1 }}>
                    <ThemeText variant="body" style={styles.dropdownTitle}>
                      {selectedFish.commonName}
                    </ThemeText>

                    <ThemeText variant="caption">
                      {selectedFish.category}
                    </ThemeText>
                  </View>
                </>
              ) : (
                <ThemeText variant="body" style={{ flex: 1, opacity: 0.7 }}>
                  Select a fish species...
                </ThemeText>
              )}

              <Ionicons
                name="list-outline"
                size={22}
                color={colors.textPrimary}
              />
            </View>
          </Pressable>

          {/* FISH COUNT */}

          <ThemeText
            variant="title"
            style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
          >
            Number of Fish
          </ThemeText>

          <ThemeInput
            icon="fish"
            value={fishCount}
            onChangeText={setFishCount}
            keyboardType="numeric"
            placeholder="Enter fish quantity..."
          />

          <ThemeText
            variant="title"
            style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
          >
            {setupType === "Pond"
              ? "Pond Volume (Gallons)"
              : "Tank Size (Gallons)"}
          </ThemeText>

          <ThemeInput
            icon="water"
            value={userTankSize}
            onChangeText={setUserTankSize}
            keyboardType="numeric"
            placeholder={
              setupType === "Pond"
                ? "Enter pond volume..."
                : "Enter tank size..."
            }
          />
          {/* BUTTON */}

          <ThemeButton
            title="Generate Tank Assessment"
            onPress={generateRecommendation}
            style={[
              styles.generateButton,
              {
                marginTop: 16,
              },
            ]}
          />
          {/* RESULT */}

          <View style={{ height: 40 }} />
          <Modal
            visible={showAssessment}
            transparent
            animationType="none"
            onRequestClose={closeAssessment}
          >
            <View style={styles.modalOverlay}>
              {/* BACKGROUND / CREVICE — TAP TO CLOSE */}
              <Pressable
                style={styles.modalBackdrop}
                onPress={closeAssessment}
              />

              {/* ASSESSMENT SHEET */}
              <Animated.View
                style={[
                  styles.assessmentContainer,
                  {
                    backgroundColor: colors.card,
                    transform: [
                      {
                        translateY: assessmentTranslateY,
                      },
                    ],
                  },
                ]}
              >
                {/* DRAG HANDLE / CLOSE AREA */}

                <View
                  {...assessmentPanResponder.panHandlers}
                  style={styles.assessmentDragArea}
                >
                  <View style={styles.assessmentHandle} />

                  <Pressable onPress={closeAssessment}>
                    <ThemeText variant="title" style={styles.assessmentTitle}>
                      Tank Assessment
                    </ThemeText>
                  </Pressable>
                </View>

                {/* ASSESSMENT CONTENT */}

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {selectedFish && careData && (
                    <>
                      <ThemeText variant="title">
                        {setupType === "Pond"
                          ? `${selectedFish.commonName} Pond Recommendation`
                          : selectedFish.commonName}
                      </ThemeText>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Category</ThemeText>

                        <ThemeText variant="body">
                          {selectedFish.category}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Recommended Size
                        </ThemeText>

                        <ThemeText variant="body">
                          {recommendedVolume.toLocaleString()} Gallons
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Your Setup Size
                        </ThemeText>

                        <ThemeText variant="body">
                          {actualVolume} Gallons
                        </ThemeText>
                      </View>

                      <ThemeText variant="subtitle">Stocking Status</ThemeText>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              stockingStatus === "Suitable"
                                ? "#163B2A"
                                : "#402020",
                          },
                        ]}
                      >
                        <ThemeText
                          variant="body"
                          style={{
                            color:
                              stockingStatus === "Suitable"
                                ? "#4CAF50"
                                : "#FF6B6B",
                            fontWeight: "700",
                          }}
                        >
                          {stockingStatus === "Suitable"
                            ? "Suitable Setup"
                            : "Needs Adjustment"}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Temperature</ThemeText>

                        <ThemeText variant="body">
                          {careData.idealTemperature ??
                            selectedFish.temperature}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">pH</ThemeText>

                        <ThemeText variant="body">
                          {careData.idealPH ?? selectedFish.pH}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Diet</ThemeText>

                        <ThemeText variant="body">
                          {selectedFish.diet}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Difficulty</ThemeText>

                        <ThemeText variant="body">
                          {careData.difficulty}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Maintenance Level
                        </ThemeText>

                        <ThemeText variant="body">
                          {careData.maintenanceLevel ?? "Moderate"}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Feeding Schedule
                        </ThemeText>

                        <ThemeText variant="body">
                          {careData.feedingFrequency}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Water Change</ThemeText>

                        <ThemeText variant="body">
                          {careData.waterChange}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Filtration</ThemeText>

                        <ThemeText variant="body">
                          {careData.filtration}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">Compatibility</ThemeText>

                        <ThemeText variant="body">
                          {careData.compatibility}
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          AquaGuide Analysis
                        </ThemeText>

                        <ThemeText
                          variant="body"
                          style={[
                            styles.aiRecommendation,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Based on {quantity} {selectedFish.commonName}
                          {quantity > 1 ? "s" : ""}, AquaGuide recommends a
                          minimum system volume of {recommendedVolume} gallons.
                          Proper filtration, feeding schedule, and regular
                          maintenance are required for healthy growth and
                          disease prevention.
                        </ThemeText>
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Recommended Equipment
                        </ThemeText>

                        {profile?.equipment?.map((item) => (
                          <ThemeText key={item} variant="body">
                            {item}
                          </ThemeText>
                        ))}
                      </View>

                      <View style={styles.resultSection}>
                        <ThemeText variant="subtitle">
                          Expert Recommendation
                        </ThemeText>

                        <ThemeText
                          variant="body"
                          style={styles.aiRecommendation}
                        >
                          {careData.aiAdvice ??
                            profile?.aiRecommendation ??
                            "Maintain stable water quality and perform regular maintenance."}
                        </ThemeText>
                      </View>

                      <ThemeButton
                        title="Close Assessment"
                        onPress={closeAssessment}
                        style={{ marginTop: 24 }}
                      />
                    </>
                  )}
                </ScrollView>
              </Animated.View>
            </View>
          </Modal>
          <Modal
            visible={showFishDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowFishDropdown(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowFishDropdown(false)}
            >
              <Pressable
                style={[
                  styles.modalContainer,
                  { backgroundColor: colors.card },
                ]}
              >
                <ThemeText variant="title" style={styles.modalTitle}>
                  Choose Fish Species
                </ThemeText>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {availableFish.map((fish) => (
                    <Pressable
                      key={fish.id}
                      style={[
                        styles.modalFishItem,
                        selectedFishId === fish.id && {
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => {
                        setSelectedFishId(fish.id);

                        // Reset previous assessment
                        setFishCount("");
                        setUserTankSize("");
                        setShowAssessment(false);

                        setShowFishDropdown(false);
                      }}
                    >
                      <Image
                        source={fish.image}
                        style={styles.modalFishImage}
                        resizeMode="contain"
                      />

                      <View style={{ flex: 1 }}>
                        <ThemeText variant="body" style={{ fontWeight: "700" }}>
                          {fish.commonName}
                        </ThemeText>

                        <ThemeText variant="caption">{fish.category}</ThemeText>
                      </View>

                      {selectedFishId === fish.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </Pressable>
            </Pressable>
          </Modal>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    marginRight: 15,
  },

  heroContent: {
    flex: 1,
  },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: TAB_BAR_HEIGHT + 24,
  },

  hero: {
    backgroundColor: "#102331",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 23,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#245066",
    elevation: 6,
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
  },

  heroTitle: {
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  heroSubtitle: {
    color: "#C5D3D9",
    marginTop: 15,
    lineHeight: 23,
    fontSize: 14.5,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 13,
    marginTop: 16,
    letterSpacing: -0.25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 10,
    marginBottom: 22,
  },

  selectorCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    minHeight: 152,
    elevation: 3,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  selectorActive: {
    borderColor: "#00D4FF",
    borderWidth: 2,
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },

  selectorTitle: {
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
    letterSpacing: -0.15,
  },

  selectorSubtitle: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.72,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  generateButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 19,
    minHeight: 58,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 18,
    elevation: 5,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  resultCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  resultLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "700",
  },

  resultValue: {},

  equipment: {
    marginBottom: 4,
  },

  aiRecommendation: {
    lineHeight: 23,
    marginTop: 7,
  },

  resultSection: {
    marginTop: 18,
    paddingBottom: 2,
  },

  heroTitleContainer: {
    flex: 1,
  },

  heroCaption: {
    marginTop: 5,
    opacity: 0.78,
    fontSize: 12.5,
  },

  fishGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  fishCard: {
    width: "48%",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: "center",
    position: "relative",
  },

  fishCardSelected: {
    transform: [{ scale: 1.02 }],
  },

  fishImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  fishName: {
    fontWeight: "700",
    textAlign: "center",
  },

  fishCategory: {
    marginTop: 4,
    opacity: 0.7,
    textAlign: "center",
  },

  selectedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  fishDropdown: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginBottom: 22,
    minHeight: 78,
    justifyContent: "center",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
  },

  fishDropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },

  dropdownImage: {
    width: 54,
    height: 54,
    marginRight: 13,
    borderRadius: 16,
  },

  dropdownTitle: {
    fontWeight: "900",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.62)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 18,
    paddingTop: 11,
    paddingBottom: 30,
    maxHeight: "80%",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#2B5367",
    elevation: 16,
    shadowOpacity: 0.34,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
    paddingTop: 8,
    letterSpacing: -0.2,
  },

  modalFishItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 19,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 76,
  },

  modalFishImage: {
    width: 58,
    height: 58,
    marginRight: 13,
    borderRadius: 15,
  },

  assessmentContainer: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    maxHeight: "91%",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#2B5367",
    elevation: 18,
    shadowOpacity: 0.36,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: -9 },
  },

  assessmentDragArea: {
    alignItems: "center",
  },

  assessmentHandle: {
    width: 50,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#78909C",
    alignSelf: "center",
    marginBottom: 15,
  },
  assessmentCloseArea: {
    alignItems: "center",
  },
  assessmentTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 19,
    letterSpacing: -0.4,
  },

  assessmentFishImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
});
