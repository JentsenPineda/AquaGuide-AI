import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fishImages } from "../data/fishImages";

import { allFish } from "../data/allFish";

export default function AquaPlantScreen() {
  const [search, setSearch] = useState("");
  const [selectedFish, setSelectedFish] = useState("goldfish");

  const filteredFish = useMemo(() => {
    return allFish.filter((fish) =>
      fish.commonName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Aqua Plants" />
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.hero}>
          <Text style={styles.logo}>🌿</Text>

          <Text style={styles.title}>Aqua Plant Guide</Text>

          <Text style={styles.subtitle}>
            Find compatible aquatic plants for your ornamental fish.
          </Text>
        </View>

        {/* Search */}

        <TextInput
          placeholder="Search fish species..."
          placeholderTextColor="#7D8B99"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Fish Cards */}

      <FlatList
        data={filteredFish}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + 70,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedFish(item.id)}
            style={[
              styles.card,
              selectedFish === item.id && styles.selectedCard,
            ]}
          >
            <Image
              source={fishImages[item.id as keyof typeof fishImages]}
              style={styles.image}
            />
            <Text style={styles.cardTitle}>{item.commonName}</Text>
          </Pressable>
        )}
      />

      {/* Button */}

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/plant-result",
            params: {
              fish: selectedFish,
            },
          })
        }
      >
        <Text style={styles.buttonText}>Show Compatible Plants</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08141F",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  hero: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
  },

  subtitle: {
    color: "#AAB7C2",
    textAlign: "center",
    marginTop: 8,
  },

  search: {
    backgroundColor: "#102331",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 55,
    color: "#FFFFFF",
    marginBottom: 18,
  },

  card: {
    flex: 1,
    backgroundColor: "#102331",
    borderRadius: 18,
    margin: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedCard: {
    borderColor: "#00D4FF",
  },

  image: {
    width: "100%",
    height: 120,
  },

  cardTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 10,
    fontWeight: "700",
  },

  button: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: TAB_BAR_HEIGHT - 20,
    backgroundColor: "#00D4FF",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#08141F",
  },
});
