import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { goldfishGallery } from "../../data/goldfishGallery";

export default function GoldfishGalleryScreen() {
  const { type } = useLocalSearchParams();

  const [search, setSearch] = useState("");

  const variants = goldfishGallery[type as keyof typeof goldfishGallery] || [];

  const title = String(type).charAt(0).toUpperCase() + String(type).slice(1);

  const filteredVariants = useMemo(() => {
    return variants.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, variants]);

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
              <Text style={styles.heroTitle}>{title} Goldfish</Text>

              <Text style={styles.heroSubtitle}>
                Explore ornamental goldfish color variants. This educational
                gallery helps users identify and learn different goldfish
                appearances.
              </Text>

              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{variants.length}</Text>

                  <Text style={styles.statLabel}>Variants</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>Species</Text>

                  <Text style={styles.statLabel}>Goldfish</Text>
                </View>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Search variant..."
                placeholderTextColor="#90A4AE"
                value={search}
                onChangeText={setSearch}
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
                <Text style={styles.badgeText}>Color Variant</Text>
              </View>

              <Text style={styles.description}>
                Ornamental color morph commonly observed in captive-bred
                goldfish collections.
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No variants found.</Text>
          </View>
        }
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
    paddingBottom: 10,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },

  statsCard: {
    marginTop: 20,
    backgroundColor: "#102331",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#183B4E",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    color: "#00BCD4",
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#CFD8DC",
    marginTop: 5,
    fontSize: 13,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#21475D",
  },

  searchInput: {
    marginTop: 20,
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
    fontSize: 14,
    fontWeight: "700",
    minHeight: 40,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#00BCD4",
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
    marginTop: 10,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    color: "#B0BEC5",
    fontSize: 16,
  },
});
