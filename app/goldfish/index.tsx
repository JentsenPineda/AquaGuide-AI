import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { goldfishTypes } from "../../data/goldfishTypes";

export default function GoldfishTypesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🐟</Text>

          <Text style={styles.heroTitle}>Goldfish Variant Library</Text>

          <Text style={styles.heroSubtitle}>
            Explore 33 documented ornamental goldfish variants categorized into
            Common, Comet, and Shubunkin groups.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>33</Text>
              <Text style={styles.heroStatLabel}>Variants</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>3</Text>
              <Text style={styles.heroStatLabel}>Types</Text>
            </View>
          </View>
        </View>

        {/* Collection Cards */}
        {goldfishTypes.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => router.push(`/goldfish/${type.id}` as any)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🐠</Text>
              </View>

              <Ionicons
                name="chevron-forward-circle"
                size={30}
                color="#00BCD4"
              />
            </View>

            <Text style={styles.name}>{type.name}</Text>

            <Text style={styles.subtitle}>{type.subtitle}</Text>

            <Text style={styles.description}>{type.description}</Text>

            <View style={styles.bottomRow}>
              <View style={styles.variantBadge}>
                <Text style={styles.variantBadgeText}>
                  {type.variants} Variants
                </Text>
              </View>

              <Text style={styles.exploreText}>Explore →</Text>
            </View>
          </Pressable>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    padding: 20,
  },

  heroCard: {
    backgroundColor: "#102331",
    borderRadius: 26,
    padding: 22,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  heroEmoji: {
    fontSize: 40,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },

  heroStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#0B1E2A",
    borderRadius: 18,
    paddingVertical: 15,
  },

  heroStatBox: {
    alignItems: "center",
  },

  heroStatNumber: {
    color: "#00BCD4",
    fontSize: 24,
    fontWeight: "bold",
  },

  heroStatLabel: {
    color: "#CFD8DC",
    marginTop: 4,
  },

  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#21475D",
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#0B1E2A",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 30,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },

  subtitle: {
    color: "#00BCD4",
    marginTop: 6,
    fontWeight: "600",
    fontSize: 14,
  },

  description: {
    color: "#CFD8DC",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  variantBadge: {
    backgroundColor: "#00BCD4",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  variantBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  exploreText: {
    color: "#00BCD4",
    fontWeight: "700",
    fontSize: 14,
  },
});
