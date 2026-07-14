import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { equipmentCategories } from "../../data/equipmentDatabase";

export default function EquipmentGuide() {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Equipment Guide" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🛠 Equipment Guide</Text>

          <Text style={styles.heroSubtitle}>
            Learn the purpose and proper use of essential aquarium equipment.
          </Text>
        </View>

        {equipmentCategories.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/equipment/equipment-category",
                params: {
                  category: item.id,
                },
              })
            }
          >
            <Text style={styles.icon}>{item.icon}</Text>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>
          </Pressable>
        ))}
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

  card: {
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },

  icon: {
    fontSize: 35,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: "#B0BEC5",
    lineHeight: 22,
  },
});
