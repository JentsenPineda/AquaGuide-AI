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

  const equipment = equipmentData[category as keyof typeof equipmentData] || [];

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
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {String(category).replace("-", " ").toUpperCase()}
        </Text>

        {equipment.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/equipment/equipment-detail",
                params: {
                  category: String(category),
                  equipment: item.id,
                },
              })
            }
          >
            <Image source={item.image} style={styles.image} />

            <View style={styles.content}>
              <Text
                style={[
                  styles.name,
                  {
                    color: colors.textPrimary,
                  },
                ]}
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

              <View style={styles.footer}>
                <Text
                  style={[
                    styles.footerText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Tap to View Details
                </Text>

                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={colors.primary}
                />
              </View>
            </View>
          </Pressable>
        ))}
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

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 15,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    color: "#B0BEC5",
    marginTop: 5,
  },

  footer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  footerText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
});
