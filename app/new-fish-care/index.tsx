import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  FishCareProgram,
  subscribeToPrograms,
} from "@/services/newFishCareService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewFishCareScreen() {
  const colors = useAppColors();
  const { user } = useAuth();

  const [programs, setPrograms] = useState<FishCareProgram[]>([]);
  const [showEducation, setShowEducation] = useState(false);
  const [showAcclimationModal, setShowAcclimationModal] = useState(false);
  const [showActivePrograms, setShowActivePrograms] = useState(true);
  const [showCompletedPrograms, setShowCompletedPrograms] = useState(false);

  const activePrograms = programs.filter(
    (program) => program.status === "active",
  );

  const completedPrograms = programs.filter(
    (program) => program.status === "completed",
  );

  useEffect(() => {
    if (!user) {
      setPrograms([]);
      return;
    }

    return subscribeToPrograms(user.uid, setPrograms);
  }, [user]);

  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },

    heroIcon: {
      backgroundColor: colors.card,
    },

    sectionTitle: {
      color: colors.textPrimary,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    timeCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  };

  /*
   * Guest authentication gate.
   *
   * New Fish Care is personalized because programs and progress
   * are connected to the user's account.
   */
  if (!user) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <AppHeader title="New Fish Care" showBack />

        <ScrollView
          contentContainerStyle={styles.authContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.authIconContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="fish-outline" size={58} color={colors.primary} />
          </View>

          <ThemeText
            variant="title"
            style={[
              styles.authTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Personalized Fish Care
          </ThemeText>

          <ThemeText
            variant="body"
            style={[
              styles.authDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Sign in to create and save a personalized care plan for your new
            fish. Your progress, care programs, and recommendations can be
            available whenever you return.
          </ThemeText>

          <ThemeCard
            style={[
              styles.authInfoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.authInfoItem}>
              <View
                style={[
                  styles.authInfoIcon,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.authInfoText}>
                <ThemeText variant="subtitle">Save Your Progress</ThemeText>

                <ThemeText variant="body">
                  Continue your fish care program whenever you return.
                </ThemeText>
              </View>
            </View>

            <View style={styles.authInfoItem}>
              <View
                style={[
                  styles.authInfoIcon,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.authInfoText}>
                <ThemeText variant="subtitle">Track Your Care</ThemeText>

                <ThemeText variant="body">
                  Keep track of your 7-day fish care progress.
                </ThemeText>
              </View>
            </View>

            <View style={styles.authInfoItem}>
              <View
                style={[
                  styles.authInfoIcon,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.authInfoText}>
                <ThemeText variant="subtitle">
                  Personalized Experience
                </ThemeText>

                <ThemeText variant="body">
                  Your fish care programs are connected to your account.
                </ThemeText>
              </View>
            </View>
          </ThemeCard>

          <TouchableOpacity
            style={[
              styles.authPrimaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/auth/login",
                params: {
                  redirect: "newFishCare",
                },
              })
            }
          >
            <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />

            <ThemeText style={styles.authPrimaryButtonText}>Sign In</ThemeText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.authSecondaryButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/register")}
          >
            <Ionicons
              name="person-add-outline"
              size={22}
              color={colors.primary}
            />

            <ThemeText
              style={[
                styles.authSecondaryButtonText,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Create Account
            </ThemeText>
          </TouchableOpacity>

          <ThemeText
            variant="body"
            style={[
              styles.authFooter,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            You can continue using the other AquaGuide AI features as a guest.
          </ThemeText>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <AppHeader title="New Fish Care" showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View style={styles.dashboardTitleRow}>
            <Image
              source={require("@/assets/images/image-library-UI/aquaguide-icon.png")}
              style={styles.dashboardIcon}
            />

            <ThemeText variant="title" style={styles.dashboardTitle}>
              Fish Care Dashboard
            </ThemeText>
          </View>

          <ThemeText variant="body" style={styles.dashboardSubtitle}>
            Manage your active fish care programs and start new ones.
          </ThemeText>
        </View>

        {/* Learn About Acclimation */}
        <ThemeCard
          style={[
            styles.educationCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowEducation(!showEducation)}
            style={styles.educationHeader}
            activeOpacity={0.8}
          >
            <View style={styles.educationTitleRow}>
              <Ionicons
                name="school-outline"
                size={26}
                color={colors.primary}
              />

              <ThemeText variant="subtitle" style={styles.educationTitle}>
                Learn About Proper Acclimation
              </ThemeText>
            </View>

            <View style={styles.chevronContainer}>
              <Ionicons
                name={showEducation ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {showEducation && (
            <View style={styles.educationContent}>
              <View style={styles.educationItem}>
                <Ionicons name="heart" size={22} color="#E53935" />

                <View style={styles.educationText}>
                  <ThemeText variant="subtitle">Reduce Stress</ThemeText>

                  <ThemeText variant="body">
                    Fish experience stress during transportation. Proper
                    acclimation helps them recover safely.
                  </ThemeText>
                </View>
              </View>

              <View style={styles.educationItem}>
                <Ionicons name="water" size={22} color="#2196F3" />

                <View style={styles.educationText}>
                  <ThemeText variant="subtitle">Prevent Water Shock</ThemeText>

                  <ThemeText variant="body">
                    Sudden changes in water temperature or chemistry can
                    seriously harm your fish.
                  </ThemeText>
                </View>
              </View>

              <View style={styles.educationItem}>
                <Ionicons name="shield-checkmark" size={22} color="#4CAF50" />

                <View style={styles.educationText}>
                  <ThemeText variant="subtitle">Prevent Diseases</ThemeText>

                  <ThemeText variant="body">
                    A proper acclimation process strengthens the immune system
                    and lowers disease risk.
                  </ThemeText>
                </View>
              </View>

              <View style={styles.educationItem}>
                <Ionicons name="time-outline" size={22} color="#FF9800" />

                <View style={styles.educationText}>
                  <ThemeText variant="subtitle">Estimated Duration</ThemeText>

                  <ThemeText variant="body">
                    Approximately 30–45 minutes.
                  </ThemeText>
                </View>
              </View>
            </View>
          )}
        </ThemeCard>

        {/* My Fish Care Programs */}
        {user && (
          <>
            <ThemeText
              variant="title"
              style={[styles.sectionTitle, dynamicStyles.sectionTitle]}
            >
              My Fish Care Programs
            </ThemeText>

            <>
              {activePrograms.length > 0 && (
                <>
                  <TouchableOpacity
                    style={styles.educationHeader}
                    onPress={() => setShowActivePrograms(!showActivePrograms)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.educationTitleRow}>
                      <Ionicons
                        name="fish-outline"
                        size={24}
                        color={colors.primary}
                      />

                      <ThemeText
                        variant="subtitle"
                        style={styles.educationTitle}
                      >
                        Active Programs ({activePrograms.length})
                      </ThemeText>
                    </View>

                    <View style={styles.chevronContainer}>
                      <Ionicons
                        name={
                          showActivePrograms ? "chevron-up" : "chevron-down"
                        }
                        size={20}
                        color={colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>

                  {showActivePrograms &&
                    activePrograms.map((program) => {
                      const completedDays = program.days.filter(
                        (day) => day.completed,
                      ).length;

                      return (
                        <ThemeCard
                          key={program.id}
                          style={[styles.card, dynamicStyles.card]}
                        >
                          <View style={{ flex: 1 }}>
                            <ThemeText variant="subtitle">
                              {program.fishName}
                            </ThemeText>

                            <ThemeText variant="body">
                              {program.species}
                            </ThemeText>

                            <ThemeText variant="body" style={{ marginTop: 6 }}>
                              Day {completedDays + 1} of 7
                            </ThemeText>
                          </View>

                          <ThemeButton
                            title="Continue"
                            onPress={() =>
                              router.push({
                                pathname: "/new-fish-care/sevenDays",
                                params: {
                                  programId: program.id,
                                },
                              })
                            }
                          />
                        </ThemeCard>
                      );
                    })}
                </>
              )}

              {completedPrograms.length > 0 && (
                <>
                  <ThemeText
                    variant="subtitle"
                    style={{
                      marginTop: 20,
                      marginBottom: 12,
                    }}
                  >
                    Completed Programs
                  </ThemeText>

                  {completedPrograms.map((program) => (
                    <ThemeCard
                      key={program.id}
                      style={[styles.card, dynamicStyles.card]}
                    >
                      <View style={{ flex: 1 }}>
                        <ThemeText variant="subtitle">
                          {program.fishName}
                        </ThemeText>

                        <ThemeText variant="body">{program.species}</ThemeText>

                        <ThemeText variant="body" style={{ marginTop: 6 }}>
                          Completed
                        </ThemeText>
                      </View>

                      <ThemeButton
                        title="View"
                        onPress={() =>
                          router.push({
                            pathname: "/new-fish-care/sevenDays",
                            params: {
                              programId: program.id,
                            },
                          })
                        }
                      />
                    </ThemeCard>
                  ))}
                </>
              )}
            </>
          </>
        )}

        <ThemeButton
          title={
            activePrograms.length > 0
              ? "Start Another Fish Care Program"
              : "Start Fish Care Guide"
          }
          onPress={() => router.push("/new-fish-care/preparation")}
          style={styles.startButton}
        />

        <TouchableOpacity
          style={styles.learnButton}
          onPress={() => setShowAcclimationModal(true)}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#00BCD4"
          />

          <ThemeText variant="subtitle" style={styles.learnText}>
            Why Is Acclimation Important?
          </ThemeText>
        </TouchableOpacity>

        <Modal
          visible={showAcclimationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAcclimationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <ThemeText variant="title">🐟 Fish Acclimation Guide</ThemeText>

              <ScrollView showsVerticalScrollIndicator={false}>
                <ThemeText variant="subtitle" style={styles.modalSection}>
                  What is Fish Acclimation?
                </ThemeText>

                <ThemeText variant="body">
                  Fish acclimation is the process of slowly adjusting a newly
                  purchased fish to the conditions of its new aquarium. This
                  prevents stress caused by sudden changes in temperature, pH,
                  and water quality.
                </ThemeText>

                <ThemeText variant="subtitle" style={styles.modalSection}>
                  ❤️ Why is it Important?
                </ThemeText>

                <ThemeText variant="body">
                  • Reduces stress{"\n"}• Helps fish adapt safely{"\n"}•
                  Improves survival rate{"\n"}• Encourages normal eating
                  behavior{"\n"}• Strengthens fish immunity
                </ThemeText>

                <ThemeText variant="subtitle" style={styles.modalSection}>
                  ⚠️ What Problems Can It Prevent?
                </ThemeText>

                <ThemeText variant="body">
                  • Temperature shock{"\n"}• pH shock{"\n"}• Loss of appetite
                  {"\n"}• Increased disease risk{"\n"}• Sudden death after
                  introduction
                </ThemeText>

                <ThemeText variant="subtitle" style={styles.modalSection}>
                  💧 Proper Acclimation Tips
                </ThemeText>

                <ThemeText variant="body">
                  • Match water temperature first{"\n"}• Slowly mix aquarium
                  water{"\n"}• Avoid sudden parameter changes{"\n"}• Observe
                  fish behavior after release
                </ThemeText>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAcclimationModal(false)}
              >
                <ThemeText style={styles.closeText}>Close</ThemeText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  authContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: TAB_BAR_HEIGHT + 30,
  },

  authIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 24,
  },

  authTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  authDescription: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },

  authInfoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 28,
    marginBottom: 24,
  },

  authInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  authInfoIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  authInfoText: {
    flex: 1,
  },

  authPrimaryButton: {
    height: 56,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  authPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  authSecondaryButton: {
    height: 56,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
  },

  authSecondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },

  authFooter: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 20,
  },

  hero: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginTop: 15,
    marginBottom: 30,
  },

  dashboardHeader: {
    marginTop: 20,
    marginBottom: 30,
  },

  dashboardTitle: {
    fontSize: 28,
    fontWeight: "800",
  },

  dashboardSubtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
  },

  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
  },

  cardContent: {
    flex: 1,
    marginLeft: 15,
  },

  educationCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  cardText: {
    lineHeight: 22,
    fontSize: 15,
  },

  timeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    padding: 25,
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },

  timeTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
  },

  timeValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#FF9800",
  },

  startButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 18,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "80%",
  },

  modalSection: {
    marginTop: 20,
    marginBottom: 8,
  },

  closeButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  learnButton: {
    borderWidth: 2,
    borderColor: "#00BCD4",
    borderRadius: 18,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  chevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  learnText: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },

  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  educationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 16,
  },

  educationTitle: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "700",
  },

  educationContent: {
    marginTop: 22,
  },

  educationItem: {
    flexDirection: "row",
    marginBottom: 18,
  },

  educationText: {
    flex: 1,
    marginLeft: 12,
  },

  dashboardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dashboardIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    marginRight: 10,
  },
});
