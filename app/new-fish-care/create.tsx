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

export default function CreateFishCareProgramScreen() {
  const colors = useAppColors();
  const { user } = useAuth();

  const [fishName, setFishName] = useState("");
  const [species, setSpecies] = useState("");
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
  };
  return (
    <View style={[styles.screen, dynamicStyles.screen]}>
      <AppHeader
        title="New Fish Care"
        subtitle="Start a 7-Day Care Program"
        showBack
        variant="light"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ThemeCard style={[styles.heroCard, dynamicStyles.card]}>
          <View style={styles.heroIcon}>
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

        <ThemeCard style={[styles.formCard, dynamicStyles.card]}>
          <ThemeText variant="subtitle" style={styles.sectionTitle}>
            Fish Information
          </ThemeText>

          <ThemeText variant="body" style={styles.label}>
            Fish Name
          </ThemeText>

          <TextInput
            value={fishName}
            onChangeText={setFishName}
            placeholder="Example: Sunny"
            placeholderTextColor="#94A3B8"
            style={[styles.input, dynamicStyles.input]}
          />

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

          <ThemeText variant="body" style={styles.label}>
            Number of Fish
          </ThemeText>

          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            style={[styles.input, dynamicStyles.input]}
          />
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

        <ThemeButton
          title={loading ? "Creating Program..." : "Start 7-Day Care Program"}
          loading={loading}
          onPress={async () => {
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
                    onPress: () => router.push("/auth/login"),
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

            try {
              setLoading(true);

              const id = await createProgram(
                user.uid,
                fishName.trim(),
                species,
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
          }}
        />
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
              <View style={styles.handle} />

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
                    style={styles.speciesItem}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSpecies(item);
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
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT + 40,
    gap: 18,
  },

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
    backgroundColor: "#EFF6FF",
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
    backgroundColor: "#CBD5E1",
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
    borderBottomColor: "#E2E8F0",
  },

  speciesText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
  },
});
