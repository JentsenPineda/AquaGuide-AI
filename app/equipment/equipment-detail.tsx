import AppHeader from "@/components/layout/AppHeader";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { equipmentData } from "../../data/equipmentDatabase";

export default function EquipmentDetail() {
  const colors = useAppColors();
  const { category, equipment } = useLocalSearchParams();

  const selected = equipmentData[
    String(category) as keyof typeof equipmentData
  ]?.find((item) => item.id === String(equipment));

  if (!selected) {
    return (
      <View
        style={[
          styles.safe,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppHeader title="Equipment Details" showBack />

        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={42}
            color={colors.textSecondary}
          />

          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Equipment information could not be found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Equipment Details" showBack />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE */}
        <View
          style={[
            styles.imageCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Image
            source={selected.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* TITLE */}
        <View style={styles.titleSection}>
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
            {selected.name}
          </Text>
        </View>

        {/* DESCRIPTION */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                {
                  backgroundColor: colors.primary + "15",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Description
            </Text>
          </View>

          <Text
            style={[
              styles.text,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {selected.description}
          </Text>
        </View>

        {/* USES */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                {
                  backgroundColor: colors.primary + "15",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Uses
            </Text>
          </View>

          <View style={styles.usesList}>
            {selected.uses.map((use, index) => (
              <View key={`${use}-${index}`} style={styles.useRow}>
                <View
                  style={[
                    styles.checkCircle,
                    {
                      backgroundColor: colors.primary + "15",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={15}
                    color={colors.primary}
                  />
                </View>

                <Text
                  style={[
                    styles.list,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {use}
                </Text>
              </View>
            ))}
          </View>
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

  imageCard: {
    height: 205,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: "90%",
    height: "90%",
  },

  titleSection: {
    marginTop: 20,
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  text: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  usesList: {
    gap: 10,
  },

  useRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  checkCircle: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },

  list: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },

  bottomSpace: {
    height: 10,
  },
});
