import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { fishPlantCompatibility } from "../data/fishPlantCompatibility";
import { plantDatabase } from "../data/plantDatabase";
const { width } = Dimensions.get("window");
export default function PlantResult() {
  const colors = useAppColors();
  const { fish } = useLocalSearchParams();

  const plants =
    fishPlantCompatibility[fish as keyof typeof fishPlantCompatibility] || [];

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Compatible Plants" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            alignItems: "center",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.heroTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            🌿 Compatible Plants
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            These aquatic plants are safe and highly recommended for your
            selected ornamental fish.
          </Text>

          <View
            style={[
              styles.swipeHint,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.swipeEmoji}>👈</Text>

            <Text
              style={[
                styles.swipeText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Swipe left or right to explore all compatible plants
            </Text>

            <Text style={styles.swipeEmoji}>👉</Text>
          </View>
        </View>

        <Carousel
          width={width}
          height={560}
          data={plants}
          loop={false}
          pagingEnabled
          renderItem={({ item }) => {
            const plant = plantDatabase[item as keyof typeof plantDatabase];

            if (!plant) {
              return <View />;
            }

            return (
              <View
                style={{
                  width,
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    styles.card,
                    {
                      width: width - 40,
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Image
                    source={plant.image}
                    style={styles.image}
                    resizeMode="contain"
                  />

                  <View style={styles.info}>
                    <Text
                      style={[
                        styles.name,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {plant.name}
                    </Text>

                    <Text
                      style={[
                        styles.detail,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Difficulty: {plant.difficulty}
                    </Text>

                    <Text
                      style={[
                        styles.detail,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Lighting: {plant.lighting}
                    </Text>

                    <Text
                      style={[
                        styles.detail,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Growth Rate: {plant.growthRate}
                    </Text>

                    <Text
                      style={[
                        styles.detail,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      CO₂: {plant.co2}
                    </Text>

                    <Text
                      style={[
                        styles.detail,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Placement: {plant.placement}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
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

  hero: {
    backgroundColor: "#102331",
    padding: 22,
    borderRadius: 24,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#B0BEC5",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },

  image: {
    width: "100%",
    height: 240,
  },

  info: {
    padding: 15,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detail: {
    color: "#CFD8DC",
    marginBottom: 5,
  },

  swipeHint: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
  },

  swipeText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },

  swipeEmoji: {
    fontSize: 18,
  },
});
