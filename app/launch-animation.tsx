import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function LaunchAnimationScreen() {
  // ==================================================
  // FISH MOVEMENT
  // ==================================================

  const fishX = useRef(new Animated.Value(-300)).current;
  const fishY = useRef(new Animated.Value(0)).current;
  const fishRotate = useRef(new Animated.Value(0)).current;
  const fishScale = useRef(new Animated.Value(0.9)).current;
  const fishWiggle = useRef(new Animated.Value(0)).current;

  // ==================================================
  // BUBBLES
  // ==================================================

  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;

  // ==================================================
  // LOGO
  // ==================================================

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  // ==================================================
  // TEXT
  // ==================================================

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(15)).current;

  // ==================================================
  // FINAL FADE
  // ==================================================

  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ==================================================
    // 1. FISH SWIMS INTO THE SCREEN
    // ==================================================

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

      // Gentle up/down swimming movement
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

    // ==================================================
    // 2. NATURAL SWIMMING BODY MOVEMENT
    // ==================================================

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

    // ==================================================
    // 3. SUBTLE BODY MOVEMENT
    // ==================================================

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

    // ==================================================
    // 4. BUBBLE 1
    // ==================================================

    Animated.sequence([
      Animated.delay(650),

      Animated.timing(bubble1, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // ==================================================
    // 5. BUBBLE 2
    // ==================================================

    Animated.sequence([
      Animated.delay(850),

      Animated.timing(bubble2, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // ==================================================
    // 6. BUBBLE 3
    // ==================================================

    Animated.sequence([
      Animated.delay(1050),

      Animated.timing(bubble3, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // ==================================================
    // 7. LOGO APPEARS
    //
    // IMPORTANT:
    // THE FISH STAYS VISIBLE.
    // ==================================================

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

    // ==================================================
    // 8. AQUAGUIDE AI TEXT
    // ==================================================

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

    // ==================================================
    // 9. HOLD THEN FADE OUT
    // ==================================================

    const timer = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        router.replace("/welcome");
      });
    }, 3600);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeOut,
        },
      ]}
    >
      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <View style={styles.glow} />

      {/* ==================================================
          BUBBLES
      ================================================== */}

      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleOne,
          {
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

      {/* ==================================================
          COMPLETE AQUAGUIDE LOGO
      ================================================== */}

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              {
                scale: logoScale,
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/aquaguide-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ==================================================
          SWIMMING FISH
      ================================================== */}

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
          source={require("../assets/images/aquaguide-fish.png")}
          style={styles.fish}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ==================================================
          APP NAME
      ================================================== */}

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [
              {
                translateY: textTranslateY,
              },
            ],
          },
        ]}
      >
        <Text style={styles.appName}>
          AquaGuide <Text style={styles.ai}>AI</Text>
        </Text>

        <Text style={styles.tagline}>Smart care for ornamental fish</Text>
      </Animated.View>

      {/* ==================================================
          WATER WAVES
      ================================================== */}

      <View style={styles.bottomWater}>
        <View style={styles.waveOne} />
        <View style={styles.waveTwo} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAFBFE",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "#D6F7FA",
    opacity: 0.8,
  },

  // ==================================================
  // FISH
  // ==================================================

  fishContainer: {
    position: "absolute",
    width: 190,
    height: 190,
    justifyContent: "center",
    alignItems: "center",

    // Current alignment with the logo
    marginLeft: -10,
    marginTop: 18,
  },

  fish: {
    width: 82,
    height: 82,
  },

  // ==================================================
  // LOGO
  // ==================================================

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

  // ==================================================
  // BUBBLES
  // ==================================================

  bubble: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#00BCD4",
  },

  bubbleOne: {
    marginLeft: -120,
    marginTop: -90,
  },

  bubbleTwo: {
    marginLeft: -90,
    marginTop: -115,
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  bubbleThree: {
    marginLeft: -65,
    marginTop: -75,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ==================================================
  // TEXT
  // ==================================================

  textContainer: {
    position: "absolute",
    top: "67%",
    alignItems: "center",
  },

  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#006B87",
    letterSpacing: 0.5,
  },

  ai: {
    color: "#00BCD4",
  },

  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#607D8B",
  },

  // ==================================================
  // WATER
  // ==================================================

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
    backgroundColor: "#BDEFF5",
    top: 25,
  },

  waveTwo: {
    position: "absolute",
    width: "100%",
    height: 100,
    borderRadius: 70,
    backgroundColor: "#A8E8F0",
    top: 70,
    opacity: 0.65,
  },
});
