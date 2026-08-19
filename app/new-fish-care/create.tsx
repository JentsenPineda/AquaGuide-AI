import ThemeButton from "@/components/buttons/ThemeButton";
import ThemeCard from "@/components/cards/ThemeCard";
import AppHeader from "@/components/layout/AppHeader";
import ReminderDatePickerModal from "@/components/reminder/ReminderDatePickerModal";
import ThemeText from "@/components/text/ThemeText";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/contexts/AuthContext";
import { createProgram } from "@/services/newFishCareService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SPECIES = [
  "Goldfish",
  "Betta",
  "Guppy",
  "Angelfish",
  "Molly",
  "Platy",
  "Swordtail",
  "Tetra",
  "Corydoras",
  "Discus",
  "Koi",
  "Oscar",
  "Flowerhorn",
  "Danio",
  "Gourami",
];

const OTHER_SPECIES = "Other / Not Listed";

export default function CreateFishCareProgramScreen() {
  const colors = useAppColors();
  const { user } = useAuth();

  const [fishName, setFishName] = useState("");
  const [species, setSpecies] = useState("");
  const [customSpecies, setCustomSpecies] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [showSpecies, setShowSpecies] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const dynamicStyles = {
    screen: {
      backgroundColor: colors.background,
    },

    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },

    input: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.textPrimary,
    },

    modal: {
      backgroundColor: colors.card,
    },

    speciesItem: {
      borderBottomColor: colors.border,
    },
  };

  const isOtherSpecies = species === OTHER_SPECIES;

  const finalSpecies = isOtherSpecies ? customSpecies.trim() : species;

  const handleStartProgram = async () => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please sign in to create and save a 7-Day Fish Care Program.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () =>
              router.push({
                pathname: "/auth/login",
                params: {
                  redirect: "newFishCare",
                },
              }),
          },
        ],
      );

      return;
    }

    if (!fishName.trim()) {
      Alert.alert("Validation", "Please enter a fish name.");
      return;
    }

    if (!species) {
      Alert.alert("Validation", "Please select a species.");
      return;
    }

    if (isOtherSpecies && !customSpecies.trim()) {
      Alert.alert(
        "Species Required",
        "Please enter the name of the fish species.",
      );
      return;
    }

    try {
      setLoading(true);

      const id = await createProgram(
        user.uid,
        fishName.trim(),
        finalSpecies,
        purchaseDate.toISOString(),
      );

      router.replace({
        pathname: "/new-fish-care/sevenDays",
        params: {
          programId: id,
        },
      });
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Failed to create program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, dynamicStyles.screen]}>
      <AppHeader
        title="New Fish Care"
        subtitle="Start a 7-Day Care Program"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ============================================================ */}
        {/* HERO                                                          */}
        {/* ============================================================ */}

        <ThemeCard style={[styles.heroCard, dynamicStyles.card]}>
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="fish" size={54} color={colors.primary} />
          </View>

          <ThemeText variant="title" style={styles.heroTitle}>
            Welcome Your New Fish
          </ThemeText>

          <ThemeText variant="body" style={styles.heroSubtitle}>
            Create a personalized 7-Day Care Program to help your fish adjust
            safely to its new aquarium.
          </ThemeText>
        </ThemeCard>

        {/* ============================================================ */}
        {/* FISH INFORMATION                                              */}
        {/* ============================================================ */}

        <ThemeCard style={[styles.formCard, dynamicStyles.card]}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            Fish Information
          </ThemeText>

          {/* Fish Name */}

          <ThemeText variant="body" style={styles.label}>
            Fish Name
          </ThemeText>

          <TextInput
            value={fishName}
            onChangeText={setFishName}
            placeholder="Example: Sunny"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, dynamicStyles.input]}
          />

          {/* Species */}

          <ThemeText variant="body" style={styles.label}>
            Species
          </ThemeText>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.selector, dynamicStyles.input]}
            onPress={() => setShowSpecies(true)}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: species ? colors.textPrimary : colors.textSecondary,
                },
              ]}
            >
              {species || "Select Species"}
            </Text>

            <Ionicons
              name="chevron-down"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Other / Not Listed Input */}

          {isOtherSpecies && (
            <View style={styles.customSpeciesContainer}>
              <ThemeText variant="body" style={styles.label}>
                Species Name
              </ThemeText>

              <TextInput
                value={customSpecies}
                onChangeText={setCustomSpecies}
                placeholder="Enter fish species"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                style={[styles.input, dynamicStyles.input]}
              />

              <View
                style={[
                  styles.customSpeciesNotice,
                  {
                    backgroundColor: colors.primary + "10",
                    borderColor: colors.primary + "25",
                  },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={19}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.customSpeciesNoticeText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  This species is not currently included in AquaGuide AI's
                  supported species library. The 7-Day Care Program will provide
                  general acclimation and observation guidance.
                </Text>
              </View>
            </View>
          )}

          {/* Number of Fish */}

          <ThemeText variant="body" style={styles.label}>
            Number of Fish
          </ThemeText>

          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            style={[styles.input, dynamicStyles.input]}
          />

          {/* Purchase Date */}

          <ThemeText variant="body" style={styles.label}>
            Purchase Date
          </ThemeText>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.selector, dynamicStyles.input]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {purchaseDate.toLocaleDateString()}
            </Text>

            <Ionicons
              name="calendar-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </ThemeCard>

        {/* ============================================================ */}
        {/* INFORMATION                                                   */}
        {/* ============================================================ */}

        <ThemeCard style={[styles.infoCard, dynamicStyles.card]}>
          <View style={styles.infoRow}>
            <Ionicons
              name="cloud-done-outline"
              size={22}
              color={colors.primary}
            />

            <ThemeText variant="body" style={styles.infoText}>
              Progress is automatically saved.
            </ThemeText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={22} color={colors.primary} />

            <ThemeText variant="body" style={styles.infoText}>
              Continue your 7-Day Care anytime.
            </ThemeText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="fish-outline" size={22} color={colors.primary} />

            <ThemeText variant="body" style={styles.infoText}>
              Manage multiple fish care programs.
            </ThemeText>
          </View>
        </ThemeCard>

        {/* ============================================================ */}
        {/* START PROGRAM                                                 */}
        {/* ============================================================ */}

        <ThemeButton
          title={loading ? "Creating Program..." : "Start 7-Day Care Program"}
          loading={loading}
          onPress={handleStartProgram}
        />

        {/* ============================================================ */}
        {/* SPECIES MODAL                                                  */}
        {/* ============================================================ */}

        <Modal
          visible={showSpecies}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSpecies(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowSpecies(false)}
          >
            <Pressable style={[styles.bottomSheet, dynamicStyles.modal]}>
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              />

              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Select Species
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {SPECIES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.speciesItem, dynamicStyles.speciesItem]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSpecies(item);
                      setCustomSpecies("");
                      setShowSpecies(false);
                    }}
                  >
                    <Ionicons
                      name="fish-outline"
                      size={22}
                      color={colors.primary}
                    />

                    <Text
                      style={[
                        styles.speciesText,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {item}
                    </Text>

                    {species === item && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}

                {/* OTHER / NOT LISTED */}

                <TouchableOpacity
                  style={[
                    styles.speciesItem,
                    dynamicStyles.speciesItem,
                    styles.otherSpeciesItem,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSpecies(OTHER_SPECIES);
                    setShowSpecies(false);
                  }}
                >
                  <View
                    style={[
                      styles.otherIcon,
                      {
                        backgroundColor: colors.primary + "14",
                      },
                    ]}
                  >
                    <Ionicons
                      name="create-outline"
                      size={21}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.otherSpeciesContent}>
                    <Text
                      style={[
                        styles.speciesText,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {OTHER_SPECIES}
                    </Text>

                    <Text
                      style={[
                        styles.otherSpeciesSubtitle,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Enter the species manually
                    </Text>
                  </View>

                  {species === OTHER_SPECIES && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* ============================================================ */}
        {/* DATE PICKER                                                    */}
        {/* ============================================================ */}

        <ReminderDatePickerModal
          visible={showDatePicker}
          date={purchaseDate}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={(date) => {
            setPurchaseDate(date);
            setShowDatePicker(false);
          }}
        />
      </ScrollView>
    </View>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT + 40,
    gap: 18,
  },

  /* Hero */

  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
  },

  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  heroTitle: {
    textAlign: "center",
    marginBottom: 10,
  },

  heroSubtitle: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },

  /* Form */

  formCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },

  sectionTitle: {
    marginBottom: 20,
    fontWeight: "700",
  },

  label: {
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },

  selector: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectorText: {
    fontSize: 16,
    fontWeight: "500",
  },

  /* Custom Species */

  customSpeciesContainer: {
    marginTop: 2,
  },

  customSpeciesNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    marginTop: 10,
  },

  customSpeciesNoticeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12.5,
    lineHeight: 19,
  },

  /* Info */

  infoCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 14,
    flex: 1,
    lineHeight: 21,
  },

  /* Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 40,
    maxHeight: "75%",
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  speciesItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  speciesText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
  },

  otherSpeciesItem: {
    paddingVertical: 14,
  },

  otherIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  otherSpeciesContent: {
    flex: 1,
    marginLeft: 2,
  },

  otherSpeciesSubtitle: {
    marginLeft: 14,
    marginTop: 3,
    fontSize: 12,
  },
});
