import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { OnboardingItem } from "@/constants/onboarding";
import { useAppColors } from "@/theme/useAppColors";

interface Props {
  item: OnboardingItem;
}

export default function OnboardingSlide({ item }: Props) {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {item.title}
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
          },
        ]}
        numberOfLines={3}
      >
        {item.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
  },

  image: {
    width: "100%",
    flex: 1,
    minHeight: 0,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  description: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 340,
  },
});
