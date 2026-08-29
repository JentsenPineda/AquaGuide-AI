import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type AppBackgroundProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayOpacity?: number;
};

export default function AppBackground({
  children,
  style,
  overlayOpacity,
}: AppBackgroundProps) {
  const { colorScheme } = useTheme();

  const isDark = colorScheme === "dark";

  const backgroundImage = isDark
    ? require("@/assets/images/dark-mode-bg3.png")
    : require("@/assets/images/light-mode-bg3.png");

  const defaultOverlayOpacity = isDark ? 0.08 : 0.03;

  return (
    <View style={styles.container}>
      <Image
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            backgroundColor: isDark
              ? `rgba(8, 20, 31, ${overlayOpacity ?? defaultOverlayOpacity})`
              : `rgba(244, 247, 250, ${
                  overlayOpacity ?? defaultOverlayOpacity
                })`,
          },
        ]}
      />

      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
  },
});
