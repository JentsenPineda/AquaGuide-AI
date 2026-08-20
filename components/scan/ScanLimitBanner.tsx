import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScanLimitBannerProps {
  remainingScans: number;
  limit?: number;
  loading?: boolean;
  primaryColor: string;
  textPrimary: string;
  textSecondary: string;
  cardColor: string;
  borderColor: string;
}

export default function ScanLimitBanner({
  remainingScans,
  limit = 5,
  loading = false,
  primaryColor,
  textPrimary,
  textSecondary,
  cardColor,
  borderColor,
}: ScanLimitBannerProps) {
  const limitReached = !loading && remainingScans <= 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: primaryColor + "18",
          },
        ]}
      >
        <Ionicons
          name={limitReached ? "lock-closed-outline" : "sparkles-outline"}
          size={19}
          color={primaryColor}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: textPrimary,
            },
          ]}
        >
          AI Scans Today
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: textSecondary,
            },
          ]}
        >
          {limitReached
            ? "Daily scan limit reached"
            : `${remainingScans} of ${limit} scans remaining`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    marginBottom: 12,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
  },
});
