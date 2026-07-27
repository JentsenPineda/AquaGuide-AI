import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fishImages } from "../data/fishImages";

import { allFish } from "../data/allFish";

export default function AquaPlantScreen() {
  const colors = useAppColors();
  const [search, setSearch] = useState("");
  const [selectedFish, setSelectedFish] = useState("goldfish");

  const filteredFish = useMemo(() => {
    return allFish.filter((fish) =>
      fish.commonName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Aqua Plants" />
      <View style={styles.content}>
        {/* Header */}

        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Text style={styles.logo}>🌿</Text>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Aqua Plant Guide
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Find compatible aquatic plants for your ornamental fish.
          </Text>
        </View>

        {/* Search */}

        <TextInput
          placeholder="Search fish species..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.search,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              color: colors.textPrimary,
            },
          ]}
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
              {
                backgroundColor: colors.card,
                borderColor:
                  selectedFish === item.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Image
              source={fishImages[item.id as keyof typeof fishImages]}
              style={styles.image}
            />
            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              {item.commonName}
            </Text>
          </Pressable>
        )}
      />

      {/* Button */}

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/plant-result",
            params: {
              fish: selectedFish,
            },
          })
        }
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: colors.white,
            },
          ]}
        >
          Show Compatible Plants
        </Text>
      </Pressable>
    </View>
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
