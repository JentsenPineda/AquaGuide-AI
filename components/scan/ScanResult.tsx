import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ScanState =
  | "idle"
  | "ready"
  | "capturing"
  | "processing"
  | "done"
  | "error";

interface ScanResultProps {
  scanState: ScanState;
  result: any;
  confidence: number;
  confidenceStatus: string;
  matchedFish: any;
  matchedCare: any;
  colors: any;
}

export default function ScanResult({
  scanState,
  result,
  confidence,
  confidenceStatus,
  matchedFish,
  matchedCare,
  colors,
}: ScanResultProps) {
  return (
    <>
      {/* SUCCESSFUL SCAN */}
      {scanState === "done" && result && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* AI Analysis */}
          <View style={styles.resultHeader}>
            <View
              style={[
                styles.aiChip,
                {
                  backgroundColor: colors.primary + "22",
                  borderColor: colors.primary,
                },
              ]}
            >
              <Ionicons
                name="sparkles-outline"
                size={14}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.aiChipText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                AI Analysis
              </Text>
            </View>
          </View>

          {/* Fish Name */}
          <Text
            style={[
              styles.resultName,
              {
                color: colors.textPrimary,
                fontSize: 26,
                letterSpacing: 1,
              },
            ]}
          >
            {result.label.toUpperCase()}
          </Text>

          {result.scientificName && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontStyle: "italic",
                marginTop: -8,
                marginBottom: 16,
              }}
            >
              {result.scientificName}
            </Text>
          )}

          {result.variant && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "55",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginTop: -8,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Variant: {result.variant}
              </Text>
            </View>
          )}

          {/* Confidence */}
          <View style={styles.confidenceSection}>
            <View style={styles.confidenceRow}>
              <Text
                style={[
                  styles.confidenceLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Confidence
              </Text>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.confidencePercent,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  {confidence}%
                </Text>

                <Text
                  style={{
                    color:
                      confidence >= 90
                        ? "#4ADE80"
                        : confidence >= 70
                          ? "#FACC15"
                          : "#F87171",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {confidenceStatus}
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(result.confidence * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Quick Care */}
          {matchedFish && (
            <View
              style={[
                styles.quickCareCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Quick Care Header */}
              <View style={styles.quickCareHeader}>
                <View
                  style={[
                    styles.quickCareIcon,
                    {
                      backgroundColor: colors.primary + "18",
                    },
                  ]}
                >
                  <Ionicons
                    name="water-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.quickCareHeaderText}>
                  <Text
                    style={[
                      styles.quickCareTitle,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    Quick Care
                  </Text>

                  <Text
                    style={[
                      styles.quickCareSubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Essential care information
                  </Text>
                </View>
              </View>

              {/* Care Information */}
              <View style={styles.careGrid}>
                {/* Temperature */}
                <View
                  style={[
                    styles.careItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="thermometer-outline"
                    size={22}
                    color="#F97316"
                  />

                  <Text
                    style={[
                      styles.careLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Temperature
                  </Text>

                  <Text
                    style={[
                      styles.careValue,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    {matchedFish.temperature}
                  </Text>
                </View>

                {/* pH */}
                <View
                  style={[
                    styles.careItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="flask-outline" size={22} color="#8B5CF6" />

                  <Text
                    style={[
                      styles.careLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    pH Level
                  </Text>

                  <Text
                    style={[
                      styles.careValue,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    {matchedCare?.idealPH ?? matchedFish.pH}
                  </Text>
                </View>

                {/* Tank Size */}
                <View
                  style={[
                    styles.careItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="home-outline" size={22} color="#3B82F6" />

                  <Text
                    style={[
                      styles.careLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Tank Size
                  </Text>

                  <Text
                    style={[
                      styles.careValue,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    {matchedFish.tankSize}
                  </Text>
                </View>

                {/* Diet */}
                <View
                  style={[
                    styles.careItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={22}
                    color="#22C55E"
                  />

                  <Text
                    style={[
                      styles.careLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Diet
                  </Text>

                  <Text
                    style={[
                      styles.careValue,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    {matchedFish.diet}
                  </Text>
                </View>
              </View>

              {/* Care Recommendations */}
              {matchedCare && (
                <View
                  style={[
                    styles.careDetails,
                    {
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.careDetailsTitle,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    Care Recommendations
                  </Text>

                  {/* Water Change */}
                  {!!matchedCare.waterChange && (
                    <View style={styles.careDetailRow}>
                      <Ionicons
                        name="water-outline"
                        size={20}
                        color={colors.primary}
                      />

                      <View style={styles.careDetailContent}>
                        <Text
                          style={[
                            styles.careDetailLabel,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          Water Change
                        </Text>

                        <Text
                          style={[
                            styles.careDetailValue,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {matchedCare.waterChange}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Filtration */}
                  {!!matchedCare.filtration && (
                    <View style={styles.careDetailRow}>
                      <Ionicons
                        name="filter-outline"
                        size={20}
                        color={colors.primary}
                      />

                      <View style={styles.careDetailContent}>
                        <Text
                          style={[
                            styles.careDetailLabel,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          Filtration
                        </Text>

                        <Text
                          style={[
                            styles.careDetailValue,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {matchedCare.filtration}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Compatibility */}
                  {!!matchedCare.compatibility && (
                    <View style={styles.careDetailRow}>
                      <Ionicons
                        name="git-compare-outline"
                        size={20}
                        color={colors.primary}
                      />

                      <View style={styles.careDetailContent}>
                        <Text
                          style={[
                            styles.careDetailLabel,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          Compatibility
                        </Text>

                        <Text
                          style={[
                            styles.careDetailValue,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {matchedCare.compatibility}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* AI Description */}
              <View
                style={[
                  styles.descriptionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primary}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 15,
                      fontWeight: "800",
                      marginBottom: 6,
                    }}
                  >
                    About This Fish
                  </Text>

                  <Text
                    style={[
                      styles.resultDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {result.note}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* AI Description when no database match */}
          {!matchedFish && (
            <View
              style={[
                styles.descriptionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.primary}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: "800",
                    marginBottom: 6,
                  }}
                >
                  About This Fish
                </Text>

                <Text
                  style={[
                    styles.resultDescription,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {result.note}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Scan Error */}
      {scanState === "error" && (
        <View
          style={[
            styles.resultBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.resultTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Scan Failed
          </Text>

          <Text
            style={[
              styles.resultNote,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Please try again. Make sure the camera is available.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },

  resultTitle: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "900",
  },

  resultNote: {
    marginTop: 6,
    fontSize: 13,
  },

  resultCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  aiChipText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },

  resultName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  confidenceSection: {
    gap: 8,
  },

  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  confidenceLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "700",
  },

  confidencePercent: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#4ADE80",
  },

  descriptionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 14,
  },

  resultDescription: {
    flex: 1,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    lineHeight: 20,
  },

  quickCareCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  quickCareHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  quickCareIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  quickCareHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  quickCareTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  quickCareSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },

  careGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  careItem: {
    width: "48%",
    minHeight: 105,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },

  careLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  careValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
  },

  careDetails: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },

  careDetailsTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  careDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  careDetailContent: {
    flex: 1,
    marginLeft: 12,
  },

  careDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 3,
  },

  careDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
