import AppHeader from "@/components/layout/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const { colorScheme } = useTheme();
  const colors = useAppColors();

  const isDark = colorScheme === "dark";

  const modeBackground = isDark
    ? require("../../assets/images/dark-mode-bg3.png")
    : require("../../assets/images/light-mode-bg3.png");

  return (
    <View style={styles.screen}>
      {/* ======================================================== */}
      {/* LIGHT / DARK MODE BACKGROUND                             */}
      {/* ======================================================== */}

      <Image
        source={modeBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      {/* ======================================================== */}
      {/* APP HEADER                                                */}
      {/* ======================================================== */}

      <AppHeader title="Privacy Policy" showBack />

      {/* ======================================================== */}
      {/* CONTENT                                                   */}
      {/* ======================================================== */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ====================================================== */}
        {/* HEADER                                                   */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* INFORMATION WE COLLECT                                  */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* HOW YOUR DATA IS USED                                   */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* DATA SECURITY                                            */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* AI IMAGE RECOGNITION                                    */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* CONTACT                                                  */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* FOOTER                                                   */}
        {/* ====================================================== */}

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
  /* ================================================================ */
  /* SCREEN                                                            */
  /* ================================================================ */

  screen: {
    flex: 1,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },

  /* ================================================================ */
  /* CONTENT                                                           */
  /* ================================================================ */

  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* ================================================================ */
  /* HEADER                                                            */
  /* ================================================================ */

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

  /* ================================================================ */
  /* SOLID PANELS                                                      */
  /* ================================================================ */

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

  /* ================================================================ */
  /* FOOTER                                                            */
  /* ================================================================ */

  footer: {
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 13,
  },
});
