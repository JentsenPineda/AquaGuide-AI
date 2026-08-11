import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { allFish } from "../data/allFish";
import { fishCompatibility } from "../data/fishCompatibility";

export default function CompatibilityChecker() {
  const colors = useAppColors();
  const [fish1, setFish1] = useState("");
  const [fish2, setFish2] = useState("");
  const [showFish1Modal, setShowFish1Modal] = useState(false);
  const [showFish2Modal, setShowFish2Modal] = useState(false);
  const fish1Data = allFish.find((fish) => fish.id === fish1);
  const fish2Data = allFish.find((fish) => fish.id === fish2);

  const result = () => {
    const fish1Data =
      fishCompatibility[fish1 as keyof typeof fishCompatibility];

    const fish2Data =
      fishCompatibility[fish2 as keyof typeof fishCompatibility];

    if (fish1 === fish2) {
      return {
        status: "Compatible",
        reason:
          "Same species. These fish can generally live together when given enough space.",
      };
    }

    const incompatible =
      fish1Data.incompatible.includes("all") ||
      fish2Data.incompatible.includes("all") ||
      fish1Data.incompatible.includes(fish2) ||
      fish2Data.incompatible.includes(fish1);

    if (incompatible) {
      return {
        status: "Not Compatible",
        reason:
          "These species have different care requirements, aggression levels, or water parameters.",
      };
    }

    const compatible =
      fish1Data.compatible.includes(fish2) ||
      fish2Data.compatible.includes(fish1);

    if (compatible) {
      return {
        status: "Compatible",
        reason:
          "These species generally share similar care requirements and can live together.",
      };
    }

    return {
      status: "Use Caution",
      reason:
        "There is limited compatibility data. Monitor behavior carefully and provide adequate space.",
    };
  };
  const compatibilityResult = fish1 && fish2 ? result() : null;
  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Compatibility Checker" showBack />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Fish Compatibility Checker
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Check whether two fish species can live together.
        </Text>
        <Text
          style={[
            styles.label,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          First Fish
        </Text>
        <Pressable
          style={[
            styles.fishCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowFish1Modal(true)}
        >
          {fish1Data?.image && (
            <Image
              source={fish1Data.image}
              style={styles.fishImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.fishInfo}>
            <Text
              style={[
                styles.fishName,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {fish1Data?.commonName ?? "Select a fish"}
            </Text>

            <Text
              style={[
                styles.scientificName,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {fish1Data?.scientificName}
            </Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {fish1Data?.category}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {fish1Data?.temperament}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.changeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {fish2Data ? "Change Fish →" : "Tap to select a fish"}
            </Text>
          </View>
        </Pressable>
        <Text
          style={[
            styles.label,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Second Fish
        </Text>
        <Pressable
          style={[
            styles.fishCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowFish2Modal(true)}
        >
          {fish2Data?.image && (
            <Image
              source={fish2Data.image}
              style={styles.fishImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.fishInfo}>
            <Text
              style={[
                styles.fishName,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {fish2Data?.commonName ?? "Select a fish"}
            </Text>

            <Text
              style={[
                styles.scientificName,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {fish2Data?.scientificName}
            </Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {fish2Data?.category}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {fish2Data?.temperament}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.changeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {fish1Data ? "Change Fish →" : "Tap to select a fish"}
            </Text>
          </View>
        </Pressable>

        <Modal
          visible={showFish1Modal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFish1Modal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Select First Fish
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {allFish.map((fish) => (
                  <Pressable
                    key={fish.id}
                    style={styles.modalFishItem}
                    onPress={() => {
                      setFish1(fish.id);
                      setShowFish1Modal(false);
                    }}
                  >
                    <Image source={fish.image} style={styles.modalFishImage} />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalFishName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {fish.commonName}
                      </Text>

                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 13,
                        }}
                      >
                        {fish.scientificName}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showFish2Modal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFish2Modal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Select Second Fish
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {allFish.map((fish) => (
                  <Pressable
                    key={fish.id}
                    style={styles.modalFishItem}
                    onPress={() => {
                      setFish2(fish.id);
                      setShowFish2Modal(false);
                    }}
                  >
                    <Image source={fish.image} style={styles.modalFishImage} />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalFishName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {fish.commonName}
                      </Text>

                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 13,
                        }}
                      >
                        {fish.scientificName}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {compatibilityResult && (
          <View
            style={[
              styles.resultCard,
              {
                backgroundColor: colors.card,
                borderWidth: 2,
                borderColor:
                  compatibilityResult.status === "Compatible"
                    ? colors.success
                    : compatibilityResult.status === "Use Caution"
                      ? colors.warning
                      : colors.danger,
              },
            ]}
          >
            <View style={styles.comparisonHeader}>
              <View style={styles.comparisonFish}>
                <Image
                  source={fish1Data!.image}
                  style={styles.comparisonImage}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.comparisonName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {fish1Data?.commonName}
                </Text>
              </View>

              <Text
                style={[
                  styles.compareSymbol,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                ⇄
              </Text>

              <View style={styles.comparisonFish}>
                <Image
                  source={fish2Data!.image}
                  style={styles.comparisonImage}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.comparisonName,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {fish2Data?.commonName}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.resultStatus,
                {
                  color:
                    compatibilityResult.status === "Compatible"
                      ? colors.success
                      : compatibilityResult.status === "Use Caution"
                        ? colors.warning
                        : colors.danger,
                },
              ]}
            >
              {compatibilityResult.status === "Compatible"
                ? "✅ Compatible"
                : compatibilityResult.status === "Use Caution"
                  ? "⚠ Use Caution"
                  : "❌ Not Compatible"}
            </Text>

            <Text
              style={[
                styles.reason,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {compatibilityResult.reason}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#B0BEC5",
    marginTop: 10,
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 15,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#102331",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    color: "#fff",
  },

  resultCard: {
    marginTop: 25,
    backgroundColor: "#102331",
    padding: 20,
    borderRadius: 20,
  },

  resultStatus: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 15,
  },

  reason: {
    color: "#B0BEC5",
    marginTop: 10,
    lineHeight: 22,
  },

  fishCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },

  fishImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },

  fishInfo: {
    flex: 1,
    marginLeft: 16,
  },

  fishName: {
    fontSize: 18,
    fontWeight: "700",
  },

  changeText: {
    marginTop: 6,
    fontSize: 14,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  comparisonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  comparisonFish: {
    alignItems: "center",
    flex: 1,
  },

  comparisonImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginBottom: 10,
  },

  comparisonName: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  compareSymbol: {
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  modalFishItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  modalFishImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 14,
  },

  modalFishName: {
    fontSize: 16,
    fontWeight: "700",
  },
});
