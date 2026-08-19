import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { equipmentData } from "../../data/equipmentDatabase";

export default function EquipmentCategory() {
  const colors = useAppColors();
  const { category } = useLocalSearchParams();

  const categoryKey = String(category);

  const equipment =
    equipmentData[categoryKey as keyof typeof equipmentData] || [];

  const categoryTitle = categoryKey
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Equipment Categories" showBack />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text
            style={[
              styles.eyebrow,
              {
                color: colors.primary,
              },
            ]}
          >
            EQUIPMENT
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {categoryTitle}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Explore available equipment and learn how each one supports your
            aquarium.
          </Text>
        </View>

        {/* EQUIPMENT CARDS */}
        <View style={styles.list}>
          {equipment.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/equipment/equipment-detail",
                  params: {
                    category: categoryKey,
                    equipment: item.id,
                  },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.88 : 1,
                  transform: [
                    {
                      scale: pressed ? 0.985 : 1,
                    },
                  ],
                },
              ]}
            >
              {/* IMAGE */}
              <View
                style={[
                  styles.imageContainer,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {/* CONTENT */}
              <View style={styles.content}>
                <Text
                  style={[
                    styles.name,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.description,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>

                <View
                  style={[
                    styles.footer,
                    {
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.footerText,
                      {
                        color: colors.primary,
                      },
                    ]}
                  >
                    View details
                  </Text>

                  <View
                    style={[
                      styles.footerIcon,
                      {
                        backgroundColor: colors.primary + "15",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: TAB_BAR_HEIGHT + 25,
  },

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  list: {
    gap: 14,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: 155,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    padding: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
  },

  description: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 5,
  },

  footer: {
    borderTopWidth: 1,
    marginTop: 13,
    paddingTop: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "800",
  },

  footerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSpace: {
    height: 10,
  },
});
