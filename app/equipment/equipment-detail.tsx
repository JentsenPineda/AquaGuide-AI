import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { equipmentData } from "../../data/equipmentDatabase";
export default function EquipmentDetail() {
  const { category, equipment } = useLocalSearchParams();

  const selected = equipmentData[category as keyof typeof equipmentData]?.find(
    (item) => item.id === equipment,
  );

  if (!selected) {
    return null;
  }

  return (
    <View style={styles.safe}>
      <AppHeader title="Equipment Details" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image source={selected.image} style={styles.image} />

        <Text style={styles.title}>{selected.name}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.text}>{selected.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Uses</Text>

          {selected.uses.map((use) => (
            <Text key={use} style={styles.list}>
              ✓ {use}
            </Text>
          ))}
        </View>
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

  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    resizeMode: "cover",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#00D4FF",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },

  text: {
    color: "#CFD8DC",
    lineHeight: 22,
  },

  list: {
    color: "#CFD8DC",
    marginBottom: 8,
  },
});
