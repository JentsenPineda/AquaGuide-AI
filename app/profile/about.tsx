import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="About AquaGuide AI" showBack />

      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.hero}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="fish" size={64} color={colors.primary} />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            AquaGuide AI
          </Text>

          <Text
            style={[
              styles.version,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Version 1.0.0
          </Text>
        </View>

        {/* About */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.heading,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            About AquaGuide AI
          </Text>

          <Text
            style={[
              styles.text,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            AquaGuide AI is an intelligent ornamental fish care assistant
            designed to help aquarium hobbyists and fish breeders manage fish
            health, maintenance, and care more efficiently through educational
            guides, reminders, species information, and AI-assisted features.
          </Text>
        </View>

        {/* Features */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.heading,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Core Features
          </Text>

          <FeatureItem title="AI Fish Identification" colors={colors} />
          <FeatureItem title="Species Library" colors={colors} />
          <FeatureItem title="Fish Care Guides" colors={colors} />
          <FeatureItem title="Disease Guide" colors={colors} />
          <FeatureItem title="Reminder System" colors={colors} />
          <FeatureItem title="Care Logbook" colors={colors} />
        </View>

        {/* Developers */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.heading,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Development Team
          </Text>

          <DeveloperItem
            role="Programmer"
            name="Pineda, Reanze Jentsen"
            colors={colors}
          />

          <DeveloperItem
            role="Project Manager"
            name="Aguilar, Kyrene Erica"
            colors={colors}
          />

          <DeveloperItem
            role="UI/UX Designer"
            name="Ibe, Jairos Andrei"
            colors={colors}
          />

          <DeveloperItem
            role="Technical Writer"
            name="Baquing, Arjay"
            colors={colors}
          />

          <DeveloperItem
            role="Database Designer"
            name="Mallari, Jayron"
            colors={colors}
          />
        </View>

        {/* School */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.heading,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Developed For
          </Text>

          <View style={styles.schoolRow}>
            <Ionicons name="school-outline" size={22} color={colors.primary} />

            <View style={styles.schoolTextContainer}>
              <Text
                style={[
                  styles.schoolTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                BSIT Capstone Project
              </Text>

              <Text
                style={[
                  styles.schoolText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                College of Computer Studies
              </Text>

              <Text
                style={[
                  styles.schoolText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Dominican College of Tarlac
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.footer,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          © 2026 AquaGuide AI{"\n"}
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

function FeatureItem({
  title,
  colors,
}: {
  title: string;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.listItem}>
      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />

      <Text
        style={[
          styles.listText,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

function DeveloperItem({
  role,
  name,
  colors,
}: {
  role: string;
  name: string;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.developerRow}>
      <Ionicons name="person-circle-outline" size={26} color={colors.primary} />

      <View style={styles.developerTextContainer}>
        <Text
          style={[
            styles.role,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {role}
        </Text>

        <Text
          style={[
            styles.name,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 22,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    elevation: 3,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
  },

  version: {
    marginTop: 8,
    fontSize: 15,
  },

  card: {
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 16,
    padding: 18,

    borderWidth: 1,

    elevation: 2,
  },

  heading: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 16,
  },

  text: {
    fontSize: 15,
    lineHeight: 24,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  listText: {
    marginLeft: 12,
    fontSize: 15,
  },

  developerRow: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "center",
  },

  developerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  role: {
    fontSize: 13,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },

  schoolRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  schoolTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  schoolTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  schoolText: {
    marginTop: 4,
    fontSize: 15,
  },

  footer: {
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 22,
    fontSize: 13,
  },
});
