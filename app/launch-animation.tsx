import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/theme/useAppColors";

export default function LaunchAnimationScreen() {
  const colors = useAppColors();

  // Fish animation
  const fishX = useRef(new Animated.Value(-300)).current;
  const fishY = useRef(new Animated.Value(0)).current;
  const fishRotate = useRef(new Animated.Value(0)).current;
  const fishScale = useRef(new Animated.Value(0.9)).current;
  const fishWiggle = useRef(new Animated.Value(0)).current;

  // Bubbles
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;

  // Logo
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const outroLogoScale = useRef(new Animated.Value(1)).current;

  // Text
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(15)).current;
  const outroTextY = useRef(new Animated.Value(0)).current;

  // Screen
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;

    // Fish entrance
    Animated.parallel([
      Animated.timing(fishX, {
        toValue: -10,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(fishScale, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(fishY, {
          toValue: -14,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishY, {
          toValue: 14,
          duration: 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishY, {
          toValue: -10,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishY, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Natural fish movement
    Animated.loop(
      Animated.sequence([
        Animated.timing(fishRotate, {
          toValue: 1,
          duration: 280,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishRotate, {
          toValue: -1,
          duration: 560,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishRotate, {
          toValue: 1,
          duration: 560,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishRotate, {
          toValue: 0,
          duration: 280,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Subtle fish body movement
    Animated.loop(
      Animated.sequence([
        Animated.timing(fishWiggle, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishWiggle, {
          toValue: -1,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(fishWiggle, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Bubble animations
    const animateBubble = (
      bubble: Animated.Value,
      delay: number,
      duration: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(bubble, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.delay(100),

          Animated.timing(bubble, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateBubble(bubble1, 650, 900);
    animateBubble(bubble2, 850, 850);
    animateBubble(bubble3, 1050, 800);

    // Logo entrance
    Animated.sequence([
      Animated.delay(1550),

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(logoScale, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Text entrance
    Animated.sequence([
      Animated.delay(2050),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Outro
    const timer = setTimeout(() => {
      if (!isMounted) return;

      Animated.parallel([
        // Text moves upward and fades
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(outroTextY, {
          toValue: -12,
          duration: 350,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),

        // Logo shrinks and fades
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(outroLogoScale, {
          toValue: 0.88,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),

        // Fish swims away
        Animated.timing(fishX, {
          toValue: 350,
          duration: 750,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(fishY, {
          toValue: -25,
          duration: 750,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        // Final fade
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 500,
          delay: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && isMounted) {
          router.replace("/welcome");
        }
      });
    }, 3200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          opacity: fadeOut,
        },
      ]}
    >
      {/* Soft theme-aware glow */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: colors.surface,
          },
        ]}
      />

      {/* Bubbles */}
      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleOne,
          {
            backgroundColor: colors.primary,
            opacity: bubble1,
            transform: [
              {
                translateY: bubble1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -55],
                }),
              },
              {
                scale: bubble1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleTwo,
          {
            backgroundColor: colors.primaryLight,
            opacity: bubble2,
            transform: [
              {
                translateY: bubble2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -65],
                }),
              },
              {
                scale: bubble2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleThree,
          {
            backgroundColor: colors.primary,
            opacity: bubble3,
            transform: [
              {
                translateY: bubble3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -45],
                }),
              },
              {
                scale: bubble3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              {
                scale: Animated.multiply(logoScale, outroLogoScale),
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/aquaguide-icon.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Swimming fish */}
      <Animated.View
        style={[
          styles.fishContainer,
          {
            transform: [
              {
                translateX: fishX,
              },
              {
                translateY: fishY,
              },
              {
                scale: fishScale,
              },
              {
                scaleX: fishWiggle.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.96, 1, 1.04],
                }),
              },
              {
                rotate: fishRotate.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ["-4deg", "4deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/aquaguide-fish.webp")}
          style={styles.fish}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [
              {
                translateY: Animated.add(textTranslateY, outroTextY),
              },
            ],
          },
        ]}
      >
        <Text
          style={[
            styles.appName,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          AquaGuide{" "}
          <Text
            style={[
              styles.ai,
              {
                color: colors.primary,
              },
            ]}
          >
            AI
          </Text>
        </Text>

        <Text
          style={[
            styles.tagline,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Smart care for ornamental fish
        </Text>
      </Animated.View>

      {/* Water */}
      <View style={styles.bottomWater}>
        <View
          style={[
            styles.waveOne,
            {
              backgroundColor: colors.card,
            },
          ]}
        />

        <View
          style={[
            styles.waveTwo,
            {
              backgroundColor: colors.surface,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    opacity: 0.8,
  },

  fishContainer: {
    position: "absolute",
    width: 190,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
    marginTop: 18,
  },

  fish: {
    width: 82,
    height: 82,
  },

  logoContainer: {
    position: "absolute",
    width: 190,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 190,
    height: 190,
  },

  bubble: {
    position: "absolute",
  },

  bubbleOne: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: -120,
    marginTop: -90,
  },

  bubbleTwo: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: -90,
    marginTop: -115,
  },

  bubbleThree: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -65,
    marginTop: -75,
  },

  textContainer: {
    position: "absolute",
    top: "67%",
    alignItems: "center",
  },

  appName: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  ai: {
    fontWeight: "900",
  },

  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },

  bottomWater: {
    position: "absolute",
    bottom: -100,
    width: "140%",
    height: 180,
  },

  waveOne: {
    position: "absolute",
    width: "100%",
    height: 120,
    borderRadius: 80,
    top: 25,
  },

  waveTwo: {
    position: "absolute",
    width: "100%",
    height: 100,
    borderRadius: 70,
    top: 70,
    opacity: 0.65,
  },
});
