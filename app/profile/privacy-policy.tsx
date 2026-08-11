import AppHeader from "@/components/layout/AppHeader";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
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
      <AppHeader title="Privacy Policy" showBack />

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
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={65} color={colors.primary} />

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Privacy Policy
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your privacy and data security are important to AquaGuide AI.
          </Text>
        </View>

        {/* Information We Collect */}
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
            Information We Collect
          </Text>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            AquaGuide AI may collect information such as your account details,
            reminders, care logbook records, profile information, and
            application preferences to provide personalized ornamental fish
            management features.
          </Text>
        </View>

        {/* How Your Data Is Used */}
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
            How Your Data Is Used
          </Text>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your information is used solely to operate AquaGuide AI, synchronize
            your reminders and care logbook, improve your user experience, and
            support future application enhancements.
          </Text>
        </View>

        {/* Data Security */}
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
            Data Security
          </Text>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your information is securely stored using Firebase services.
            AquaGuide AI does not intentionally sell or share your personal
            information with third parties except when necessary to provide
            application functionality or comply with applicable laws.
          </Text>
        </View>

        {/* AI Image Recognition */}
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
            AI Image Recognition
          </Text>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Images submitted for fish identification are processed only for
            ornamental fish recognition and related application features. They
            are not used for advertising purposes.
          </Text>
        </View>

        {/* Contact */}
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
            Contact
          </Text>

          <Text
            style={[
              styles.body,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            For questions regarding this Privacy Policy or your personal data,
            please contact the AquaGuide AI development team through your
            academic institution.
          </Text>
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
          All Rights Reserved.
        </Text>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  body: {
    lineHeight: 24,
    fontSize: 15,
  },

  footer: {
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 13,
  },
});
