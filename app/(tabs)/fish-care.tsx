import ModuleCard from "@/components/cards/ModuleCard";
import AppHeader from "@/components/layout/AppHeader";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
export default function FishCareScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Fish Care"
        subtitle="Everything you need to keep your ornamental fish healthy."
        showBack={false}
        variant="light"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Care Modules</Text>

        <Text style={styles.sectionSubtitle}>
          Choose a fish care topic to learn more.
        </Text>

        <ModuleCard
          icon="fish"
          title="New Fish Care"
          subtitle="Safe acclimation and first-week guide"
          route="/new-fish-care"
          iconColor="#00BCD4"
          iconBackground="#E8FAFD"
        />

        <ModuleCard
          icon="water"
          title="Tank & Care"
          subtitle="Water quality, maintenance and aquarium care"
          route="/tank-care"
          iconColor="#1976D2"
          iconBackground="#E3F2FD"
        />

        <ModuleCard
          icon="medkit"
          title="Disease Guide"
          subtitle="Identify symptoms and recommended treatments"
          route="/disease-guide"
          iconColor="#E53935"
          iconBackground="#FFEBEE"
        />

        <ModuleCard
          icon="leaf"
          title="Aqua Plants"
          subtitle="Compatible aquatic plants for ornamental fish"
          route="/aqua-plant"
          iconColor="#43A047"
          iconBackground="#E8F5E9"
        />

        <ModuleCard
          icon="git-compare"
          title="Compatibility Checker"
          subtitle="Check fish compatibility before keeping them together"
          route="/compatibility-checker"
          iconColor="#8E24AA"
          iconBackground="#F3E5F5"
        />

        <ModuleCard
          icon="build"
          title="Equipment Guide"
          subtitle="Filters, heaters, lighting and aquarium accessories"
          route="/equipment/equipment-guide"
          iconColor="#FB8C00"
          iconBackground="#FFF3E0"
        />

        <ModuleCard
          icon="flask"
          title="Breeding Guide"
          subtitle="Breeding techniques and fry care information"
          route="/breeding-guide"
          iconColor="#D81B60"
          iconBackground="#FCE4EC"
        />
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
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003B57",
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 15,
    color: "#607D8B",
    marginBottom: 24,
    lineHeight: 22,
  },
});
