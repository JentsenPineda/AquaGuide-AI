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
      >
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    marginTop: 16,
    fontSize: 17,
    textAlign: "center",
    lineHeight: 28,
    maxWidth: 340,
  },
});
