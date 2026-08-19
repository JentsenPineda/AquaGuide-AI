import ModuleCard from "@/components/cards/ModuleCard";
import AppHeader from "@/components/layout/AppHeader";
import ThemeText from "@/components/text/ThemeText";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function FishCareScreen() {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Fish Care" showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 110,
          },
        ]}
      >
        {/* ---------------------------------------------------------------- */}
        {/* PAGE HEADER                                                      */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemeText
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              AquaGuide AI Modules
            </ThemeText>

            <ThemeText
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Everything you need to manage, understand, and care for your
              ornamental fish.
            </ThemeText>
          </View>

          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <Ionicons name="grid-outline" size={19} color={colors.primary} />

            <ThemeText
              style={[
                styles.countText,
                {
                  color: colors.primary,
                },
              ]}
            >
              7
            </ThemeText>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* FEATURES                                                         */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.sectionHeader}>
          <View>
            <ThemeText
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Features
            </ThemeText>

            <ThemeText
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Select a module to get started.
            </ThemeText>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* MODULE CARDS                                                     */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.cards}>
          <ModuleCard
            icon="leaf"
            title="Aqua Plants"
            subtitle="Compatible aquatic plants for ornamental fish"
            route="/aqua-plant"
            iconColor="#43A047"
            iconBackground="#E8F5E9"
          />

          <ModuleCard
            icon="flask"
            title="Breeding Guide"
            subtitle="Breeding techniques and fry care information"
            route="/breeding-guide"
            iconColor="#D81B60"
            iconBackground="#FCE4EC"
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
            icon="medkit"
            title="Disease Guide"
            subtitle="Identify symptoms and recommended treatments"
            route="/disease-guide"
            iconColor="#E53935"
            iconBackground="#FFEBEE"
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
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={17}
            color={colors.textSecondary}
          />

          <ThemeText
            style={[
              styles.footerText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Use these modules to make informed decisions about your aquarium.
          </ThemeText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  /* -------------------------------------------------------------------- */
  /* HEADER                                                               */
  /* -------------------------------------------------------------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
    paddingRight: 14,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },

  countBadge: {
    width: 48,
    height: 42,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginLeft: 8,
  },

  countText: {
    fontSize: 15,
    fontWeight: "800",
  },

  /* -------------------------------------------------------------------- */
  /* FEATURES                                                             */
  /* -------------------------------------------------------------------- */

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12.5,
    marginTop: 3,
  },

  /* -------------------------------------------------------------------- */
  /* MODULE CARDS                                                         */
  /* -------------------------------------------------------------------- */

  cards: {
    width: "100%",
    gap: 12,
  },

  /* -------------------------------------------------------------------- */
  /* FOOTER                                                               */
  /* -------------------------------------------------------------------- */

  footer: {
    marginTop: 26,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  footerText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    marginLeft: 7,
  },
});
