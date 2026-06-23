import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { allGalleries } from "../../data/allGalleries";

export default function VariantsScreen() {
  const params = useLocalSearchParams();

  const species = Array.isArray(params.species)
    ? params.species[0]
    : (params.species ?? "");

  const gallery = allGalleries[species as keyof typeof allGalleries] ?? [];

  const [search, setSearch] = useState("");

  const filteredVariants = useMemo(() => {
    return (gallery as any[]).filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [gallery, search]);
  const speciesTitle = String(species)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredVariants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>{speciesTitle} Variants</Text>

              <Text style={styles.heroSubtitle}>
                Explore ornamental fish varieties, color morphs, fin types, and
                pattern variations.
              </Text>

              <View style={styles.statsCard}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {Array.isArray(gallery) ? gallery.length : 0}
                  </Text>

                  <Text style={styles.statLabel}>Variants</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.stat}>
                  <Ionicons name="fish" size={22} color="#00BCD4" />

                  <Text style={styles.statLabel}>AquaGuide AI</Text>
                </View>
              </View>

              <TextInput
                placeholder="Search variant..."
                placeholderTextColor="#90A4AE"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type}</Text>
              </View>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  hero: {
    padding: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
    lineHeight: 22,
  },

  statsCard: {
    backgroundColor: "#102331",
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    color: "#00BCD4",
    fontSize: 24,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#CFD8DC",
    marginTop: 5,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#21475D",
  },

  searchInput: {
    backgroundColor: "#102331",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  card: {
    width: "48%",
    backgroundColor: "#102331",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  image: {
    width: "100%",
    height: 140,
  },

  content: {
    padding: 12,
  },

  name: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    minHeight: 38,
  },

  badge: {
    backgroundColor: "#00BCD4",
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  description: {
    color: "#CFD8DC",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
});
