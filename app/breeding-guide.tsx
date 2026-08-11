import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { router } from "expo-router";
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

export default function BreedingGuide() {
  const colors = useAppColors();
  const [selectedFish, setSelectedFish] = useState("");
  const [showFishModal, setShowFishModal] = useState(false);
  const selectedFishData = allFish.find((fish) => fish.id === selectedFish);

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Breeding Guide" showBack />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroHeader}>
          <Image
            source={require("@/assets/images/image-library-UI/aquaguide-icon.png")} // Change to your actual app icon path
            style={styles.heroIcon}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Fish Breeding Guide
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Generate species-specific breeding instructions, spawning
              requirements, fry care, and expert breeding recommendations.
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Select Fish Species
        </Text>

        <Pressable
          onPress={() => setShowFishModal(true)}
          style={[
            styles.selectorCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: selectedFish ? colors.textPrimary : colors.textSecondary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {selectedFish
              ? allFish.find((f) => f.id === selectedFish)?.commonName
              : "Choose a fish species"}
          </Text>

          <Text
            style={{
              color: colors.primary,
              fontWeight: "700",
            }}
          >
            ▼
          </Text>
        </Pressable>
        {selectedFishData && (
          <View
            style={[
              styles.selectedFishCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Image
              source={selectedFishData.image}
              style={styles.selectedFishImage}
              resizeMode="cover"
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {selectedFishData.commonName}
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Ready to generate a breeding guide.
              </Text>
            </View>
          </View>
        )}
        <Pressable
          style={[
            styles.generateButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/breeding-result",
              params: {
                fish: selectedFish,
              },
            })
          }
        >
          <Text
            style={[
              styles.generateText,
              {
                color: colors.white,
              },
            ]}
          >
            Generate Breeding Guide
          </Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
      <Modal
        visible={showFishModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFishModal(false)}
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
              Select Fish Species
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {allFish.map((fish) => (
                <Pressable
                  key={fish.id}
                  style={[
                    styles.fishItem,
                    {
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedFish(fish.id);
                    setShowFishModal(false);
                  }}
                >
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  >
                    {fish.commonName}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  hero: {
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
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
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    color: "#FFFFFF",
  },

  generateButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  generateText: {
    color: "#08141F",
    fontSize: 16,
    fontWeight: "800",
  },

  resultCard: {
    backgroundColor: "#102331",
    borderRadius: 24,
    padding: 20,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: {
    color: "#00D4FF",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "700",
  },

  value: {
    color: "#FFFFFF",
  },

  listItem: {
    color: "#CFD8DC",
    marginBottom: 5,
  },

  tip: {
    color: "#CFD8DC",
    lineHeight: 22,
    marginTop: 5,
  },

  selectorCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    maxHeight: "75%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  fishItem: {
    borderBottomWidth: 1,
    paddingVertical: 18,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  selectedFishCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },

  selectedFishImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    marginRight: 16,
  },
});
