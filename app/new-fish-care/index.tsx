// app/(tabs)/new-fish-care/index.tsx

import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TERMS_KEY = "new_fish_care_terms_accepted";
const TERMS_VERSION = "1.0";

export default function NewFishCareScreen() {
  const colors = useAppColors();
  const { user } = useAuth();

  const [programs, setPrograms] = useState<FishCareProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingTerms, setCheckingTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Check Terms Acceptance                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const checkTerms = async () => {
      try {
        if (!user) {
          setTermsAccepted(false);
          return;
        }

        const acceptedVersion = await AsyncStorage.getItem(TERMS_KEY);

        setTermsAccepted(acceptedVersion === TERMS_VERSION);
      } catch (error) {
        console.error("Failed to check New Fish Care terms:", error);
        setTermsAccepted(false);
      } finally {
        setCheckingTerms(false);
      }
    };

    checkTerms();
  }, [user]);

  /* ---------------------------------------------------------------------- */
  /* Subscribe to Fish Care Programs                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!user || !termsAccepted) {
      setPrograms([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToPrograms(user.uid, (data) => {
      setPrograms(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, termsAccepted]);

  /* ---------------------------------------------------------------------- */
  /* Separate Active / Completed Programs                                   */
  /* ---------------------------------------------------------------------- */

  const activePrograms = useMemo(
    () => programs.filter((program) => program.status === "active"),
    [programs],
  );

  const completedPrograms = useMemo(
    () => programs.filter((program) => program.status === "completed"),
    [programs],
  );

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (checkingTerms) {
    return (
      <View
        style={[
          styles.loadingScreen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Checking your access...
        </Text>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Guest User                                                            */
  /* ---------------------------------------------------------------------- */

  if (!user) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="New Fish Care" showBack />

        <View style={styles.centerContent}>
          <View
            style={[
              styles.accessIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="person-outline" size={38} color={colors.primary} />
          </View>

          <Text
            style={[
              styles.accessTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Account Required
          </Text>

          <Text
            style={[
              styles.accessDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            New Fish Care requires an AquaGuide AI account before you can begin.
          </Text>

          <Text
            style={[
              styles.accessDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Create an account or sign in to continue to the New Fish Care
            module.
          </Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/auth/login",
                params: {
                  redirect: "newFishCare",
                },
              })
            }
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>

            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/register")}
            style={[
              styles.secondaryButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Terms Not Accepted                                                     */
  /* ---------------------------------------------------------------------- */

  if (!termsAccepted) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="New Fish Care" showBack />

        <View style={styles.centerContent}>
          <View
            style={[
              styles.accessIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.accessTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Before You Begin
          </Text>

          <Text
            style={[
              styles.accessDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Please read and acknowledge the New Fish Care notice before
            accessing the module.
          </Text>

          <Text
            style={[
              styles.accessDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            The notice explains important information about fish acclimation,
            aquarium conditions, and the limitations of the guidance provided by
            AquaGuide AI.
          </Text>

          <Pressable
            onPress={() => router.push("/new-fish-care/terms")}
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.primaryButtonText}>Read Notice & Continue</Text>

            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Authenticated + Terms Accepted                                         */
  /* ---------------------------------------------------------------------- */

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="New Fish Care" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---------------------------------------------------------------- */}
        {/* PAGE HEADER                                                       */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.pageHeader}>
          <View
            style={[
              styles.pageIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="fish-outline" size={32} color={colors.primary} />
          </View>

          <View style={styles.pageHeaderText}>
            <Text
              style={[
                styles.pageTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              New Fish Care
            </Text>

            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              A guided approach to introducing and caring for a new ornamental
              fish.
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* GETTING STARTED                                                   */}
        {/* ---------------------------------------------------------------- */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.infoHeader}>
            <View
              style={[
                styles.infoIcon,
                {
                  backgroundColor: colors.primary + "14",
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.infoTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Getting Started
            </Text>
          </View>

          <Text
            style={[
              styles.infoText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Follow the preparation, acclimation, and first-week care guidance to
            help provide a stable transition for your new fish.
          </Text>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* START NEW GUIDE — ALWAYS NEAR THE TOP                            */}
        {/* ---------------------------------------------------------------- */}

        <Pressable
          onPress={() => router.push("/new-fish-care/preparation")}
          style={({ pressed }) => [
            styles.startCard,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.startIcon}>
            <Ionicons name="add" size={25} color="#FFFFFF" />
          </View>

          <View style={styles.startContent}>
            <Text style={styles.startTitle}>Start Fish Care Guide</Text>

            <Text style={styles.startSubtitle}>
              Begin a new preparation and acclimation journey.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </Pressable>

        {/* ---------------------------------------------------------------- */}
        {/* LOADING                                                           */}
        {/* ---------------------------------------------------------------- */}

        {loading ? (
          <View style={styles.programLoading}>
            <ActivityIndicator size="small" color={colors.primary} />

            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Loading your fish care programs...
            </Text>
          </View>
        ) : (
          <>
            {/* ============================================================ */}
            {/* ACTIVE PROGRAMS                                               */}
            {/* ============================================================ */}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Active Programs
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Continue caring for your fish
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.primary + "14",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countBadgeText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {activePrograms.length}
                </Text>
              </View>
            </View>

            {activePrograms.length > 0 ? (
              activePrograms.map((program) => (
                <Pressable
                  key={program.id}
                  onPress={() =>
                    router.push({
                      pathname: "/new-fish-care/sevenDays",
                      params: {
                        programId: program.id,
                      },
                    })
                  }
                  style={({ pressed }) => [
                    styles.activeCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.92 : 1,
                    },
                  ]}
                >
                  <View style={styles.programHeader}>
                    <View
                      style={[
                        styles.programIcon,
                        {
                          backgroundColor: colors.primary + "14",
                        },
                      ]}
                    >
                      <Ionicons
                        name="fish-outline"
                        size={23}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.programInfo}>
                      <Text
                        style={[
                          styles.programName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {program.fishName}
                      </Text>

                      <Text
                        style={[
                          styles.programSpecies,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {program.species}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.activeBadge,
                        {
                          backgroundColor: "#4CAF50" + "18",
                        },
                      ]}
                    >
                      <View style={styles.activeDot} />

                      <Text
                        style={[
                          styles.activeBadgeText,
                          {
                            color: "#4CAF50",
                          },
                        ]}
                      >
                        Active
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressRow}>
                    <Text
                      style={[
                        styles.progressText,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Day {Math.min(program.currentDay, 7)} of 7
                    </Text>

                    <Text
                      style={[
                        styles.progressPercent,
                        {
                          color: colors.primary,
                        },
                      ]}
                    >
                      {Math.round((Math.min(program.currentDay, 7) / 7) * 100)}%
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.progressTrack,
                      {
                        backgroundColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: colors.primary,
                          width: `${
                            (Math.min(program.currentDay, 7) / 7) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.continueRow}>
                    <Text
                      style={[
                        styles.continueText,
                        {
                          color: colors.primary,
                        },
                      ]}
                    >
                      Continue Care Plan
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                </Pressable>
              ))
            ) : (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    {
                      backgroundColor: colors.primary + "14",
                    },
                  ]}
                >
                  <Ionicons
                    name="fish-outline"
                    size={25}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.emptyContent}>
                  <Text
                    style={[
                      styles.emptyTitle,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    No active programs
                  </Text>

                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Start a guide above when you bring home a new fish.
                  </Text>
                </View>
              </View>
            )}

            {/* ============================================================ */}
            {/* COMPLETED PROGRAMS                                            */}
            {/* ============================================================ */}

            {completedPrograms.length > 0 && (
              <>
                <View style={[styles.sectionHeader, styles.completedHeader]}>
                  <View style={styles.sectionHeaderText}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      Completed Programs
                    </Text>

                    <Text
                      style={[
                        styles.sectionSubtitle,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Your completed care history
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.completedCountBadge,
                      {
                        backgroundColor: colors.border + "80",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countBadgeText,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      {completedPrograms.length}
                    </Text>
                  </View>
                </View>

                {completedPrograms.map((program) => (
                  <Pressable
                    key={program.id}
                    onPress={() =>
                      router.push({
                        pathname: "/new-fish-care/sevenDays",
                        params: {
                          programId: program.id,
                        },
                      })
                    }
                    style={({ pressed }) => [
                      styles.completedCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.completedIcon,
                        {
                          backgroundColor: "#4CAF50" + "14",
                        },
                      ]}
                    >
                      <Ionicons name="checkmark" size={20} color="#4CAF50" />
                    </View>

                    <View style={styles.completedContent}>
                      <Text
                        style={[
                          styles.completedName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {program.fishName}
                      </Text>

                      <Text
                        style={[
                          styles.completedSpecies,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {program.species} • 7-Day Care Completed
                      </Text>
                    </View>

                    <View style={styles.completedAction}>
                      <Text
                        style={[
                          styles.viewText,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        View
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={19}
                        color={colors.textSecondary}
                      />
                    </View>
                  </Pressable>
                ))}
              </>
            )}
          </>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

/* ====================================================================== */
/* STYLES                                                                 */
/* ====================================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  /* -------------------------------------------------------------------- */
  /* Loading                                                              */
  /* -------------------------------------------------------------------- */

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 13,
    marginTop: 10,
  },

  /* -------------------------------------------------------------------- */
  /* Guest / Terms Access                                                 */
  /* -------------------------------------------------------------------- */

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  accessIcon: {
    width: 82,
    height: 82,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  accessTitle: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  accessDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 8,
  },

  primaryButton: {
    width: "100%",
    minHeight: 55,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontWeight: "800",
  },

  secondaryButton: {
    width: "100%",
    minHeight: 55,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  /* -------------------------------------------------------------------- */
  /* Main Screen                                                          */
  /* -------------------------------------------------------------------- */

  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  pageIcon: {
    width: 60,
    height: 60,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  pageHeaderText: {
    flex: 1,
    marginLeft: 13,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
  },

  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3,
  },

  /* -------------------------------------------------------------------- */
  /* Information                                                          */
  /* -------------------------------------------------------------------- */

  infoCard: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 17,
    marginBottom: 14,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 9,
  },

  infoText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  /* -------------------------------------------------------------------- */
  /* Start Guide                                                          */
  /* -------------------------------------------------------------------- */

  startCard: {
    minHeight: 82,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  startIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },

  startContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  startTitle: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontWeight: "800",
  },

  startSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 3,
  },

  /* -------------------------------------------------------------------- */
  /* Loading Programs                                                     */
  /* -------------------------------------------------------------------- */

  programLoading: {
    alignItems: "center",
    paddingVertical: 35,
  },

  /* -------------------------------------------------------------------- */
  /* Section Headers                                                      */
  /* -------------------------------------------------------------------- */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  completedCountBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  countBadgeText: {
    fontSize: 13,
    fontWeight: "900",
  },

  completedHeader: {
    marginTop: 24,
  },

  /* -------------------------------------------------------------------- */
  /* Active Programs                                                      */
  /* -------------------------------------------------------------------- */

  activeCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
    marginBottom: 12,
  },

  programHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  programIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  programInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  programName: {
    fontSize: 17,
    fontWeight: "800",
  },

  programSpecies: {
    fontSize: 12,
    marginTop: 3,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 5,
  },

  activeBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 17,
    marginBottom: 7,
  },

  progressText: {
    fontSize: 12,
    fontWeight: "600",
  },

  progressPercent: {
    fontSize: 12,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 7,
    borderRadius: 10,
  },

  continueRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },

  continueText: {
    fontSize: 13,
    fontWeight: "800",
  },

  /* -------------------------------------------------------------------- */
  /* Empty State                                                          */
  /* -------------------------------------------------------------------- */

  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  emptyIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContent: {
    flex: 1,
    marginLeft: 11,
  },

  emptyTitle: {
    fontSize: 14.5,
    fontWeight: "800",
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  /* -------------------------------------------------------------------- */
  /* Completed Programs                                                   */
  /* -------------------------------------------------------------------- */

  completedCard: {
    minHeight: 68,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  completedIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  completedContent: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  completedName: {
    fontSize: 14.5,
    fontWeight: "800",
  },

  completedSpecies: {
    fontSize: 11.5,
    marginTop: 3,
  },

  completedAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  viewText: {
    fontSize: 11.5,
    fontWeight: "700",
  },

  /* -------------------------------------------------------------------- */
  /* Bottom                                                               */
  /* -------------------------------------------------------------------- */

  bottomSpace: {
    height: 30,
  },
});
