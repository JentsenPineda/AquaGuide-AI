import AppHeader from "@/components/layout/AppHeader";
import ScanControls from "@/components/scan/ScanControls";
import ScanLimitBanner from "@/components/scan/ScanLimitBanner";
import { useAuth } from "@/contexts/AuthContext";
import { allFish } from "@/data/allFish";
import { fishCareDatabase } from "@/data/fishCareDatabase";
import useDailyScanLimit from "@/hooks/useDailyScanLimit";
import { askVisionAI } from "@/services/aiService";
import { addScan } from "@/services/scanService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ScanState =
  | "idle"
  | "ready"
  | "capturing"
  | "processing"
  | "done"
  | "error";

export default function ScanScreen() {
  const colors = useAppColors();
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth();
  const { remainingScans, reserveScan, releaseScan } = useDailyScanLimit();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const [result, setResult] = useState<{
    label: string;
    confidence: number;
    note: string;
    variant: string | null;
    scientificName: string | null;
  } | null>(null);

  // Animations
  const scanLineY = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const scannerHeight = 260;

  const statusText = useMemo(() => {
    switch (scanState) {
      case "idle":
        return "Camera permission required";
      case "ready":
        return "Align the ornamental fish inside the frame";
      case "capturing":
        return "Capturing image…";
      case "processing":
        return `Analyzing… ${progress}%`;
      case "done":
        return "Scan complete";
      case "error":
        return "Something went wrong. Try again.";
      default:
        return "";
    }
  }, [scanState, progress]);

  // Start/stop the scanner animation depending on state

  const startScanAnimations = () => {
    scanLineY.setValue(0);
    pulse.setValue(0);

    Animated.loop(
      Animated.timing(scanLineY, {
        toValue: 1,
        duration: 1600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopScanAnimations = () => {
    scanLineY.stopAnimation();
    pulse.stopAnimation();
  };

  // Progress simulation
  useEffect(() => {
    if (scanState !== "processing") return;

    setProgress(0);
    const start = Date.now();
    const duration = 1200; // ms

    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);

      if (p >= 100) {
        clearInterval(t);
        // Progress animation finished.
        // Wait for the AI request to complete.
        // Do not set a fake result here.
        clearInterval(t);
      }
    }, 60);

    return () => clearInterval(t);
  }, [scanState]);

  // Permission flow
  useEffect(() => {
    if (!permission) return;
    if (permission.granted) setScanState("ready");
    else setScanState("idle");
  }, [permission]);

  const onRequestPermission = async () => {
    const res = await requestPermission();
    if (res.granted) setScanState("ready");
  };

  const onFlip = () =>
    setFacing((prev) => (prev === "back" ? "front" : "back"));

  const onReset = () => {
    setCapturedUri(null);
    setResult(null);
    setProgress(0);
    setScanState(permission?.granted ? "ready" : "idle");
  };
  const waitForProgress = () =>
    new Promise<void>((resolve) => {
      setProgress(0);

      const start = Date.now();
      const duration = 1400;

      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const value = Math.min(100, Math.round((elapsed / duration) * 100));

        setProgress(value);

        if (value >= 100) {
          clearInterval(timer);
          resolve();
        }
      }, 30);
    });
  const onScan = async () => {
    let scanReserved = false;

    try {
      if (!cameraRef.current) return;
      if (!user) {
        Alert.alert(
          "Login Required",
          "Please sign in to use AI Fish Identification.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => router.push("/auth/login?redirect=scan"),
            },
          ],
        );

        return;
      }

      const scanReservation = await reserveScan();

      if (!scanReservation.allowed) {
        return;
      }

      scanReserved = true;

      setScanState("capturing");
      setResult(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
        base64: true,
      });

      if (!photo?.base64) {
        throw new Error("Failed to capture image.");
      }

      setCapturedUri(photo.uri ?? null);
      setScanState("processing");

      const aiTask = askVisionAI(
        photo.base64,
        `You are AquaGuide AI, an expert ornamental fish identification assistant.

Your primary task is to identify the actual fish shown in the image as accurately as possible.

IDENTIFICATION PRIORITY:

1. Identify the actual species first.
2. Determine the scientific name only when it can be reliably identified.
3. Determine the variant, morph, strain, or color variety only when there is sufficient visual evidence.
4. Estimate confidence based on the strength of the visible evidence.
5. Provide a short 1–2 sentence introduction about the identified fish.

IMPORTANT IDENTIFICATION RULES:

- Identify ornamental fish broadly, including species outside the AquaGuide database.
- The fish does NOT have to be one of the 15 AquaGuide-supported species.
- Never force an unfamiliar fish into one of the 15 supported species.
- Do not automatically classify an unfamiliar fish as Betta Fish, Gourami, Guppy, or another common aquarium fish.
- Identify the fish primarily from morphology, not popularity or color.

Carefully examine:

- overall body shape
- body length and proportions
- head shape
- snout shape
- mouth position and size
- eye position
- body depth
- scale pattern
- dorsal fin structure
- anal fin structure
- pectoral fins
- pelvic fins
- caudal/tail shape
- fin placement
- number and appearance of fins
- barbels when present
- distinctive markings and patterns
- coloration only as supporting evidence

COLOR RULE:

- Color alone is NEVER sufficient to identify a species.
- Do not identify a fish as Betta merely because it has bright colors or large fins.
- Do not identify a fish as Guppy merely because it has a colorful or large tail.
- Do not identify a fish as Gourami merely because it has long fins or an attractive body pattern.
- Do not identify a fish as another species simply because its color resembles that species.

BETTA IDENTIFICATION:

- Before identifying a fish as Betta Fish, compare its morphology against other visually similar fish.
- A Betta Fish should have morphology consistent with Betta, including its body proportions, head shape, mouth, fin arrangement, dorsal fin, anal fin, and caudal fin.
- Long or colorful fins alone are NOT evidence of Betta.
- Do not use "Fighting Fish" or "Siamese Fighting Fish" as the species label. If it is genuinely a Betta, return exactly "Betta Fish".

CHanna / SNAKEHEAD IDENTIFICATION:

- Channa/Snakehead must NOT automatically be classified as Betta Fish, Gourami, Paradise Fish, or another aquarium fish.
- If the fish appears to be a Channa/Snakehead, carefully evaluate:
  - elongated body
  - snake-like or broad head
  - large mouth
  - body proportions
  - long dorsal fin
  - long anal fin
  - fin placement
  - overall Channa-like morphology
- Bright or unusual coloration does NOT make a Channa a Betta.
- Colorful Channa/Snakehead species must still be considered when the morphology supports them.
- If the fish has an elongated body and Channa-like morphology, strongly consider Channa/Snakehead even when the fish is brightly colored.

OTHER COMMON FALSE IDENTIFICATIONS:

- Do not identify a Ghost Knife Fish as Betta.
- Do not identify a Molly as Betta.
- Do not identify a Platy as Betta.
- Do not identify a Swordtail as Betta.
- Do not identify a Guppy as Betta.
- Do not identify a Tiger Barb as Betta.
- Do not identify a Catfish as Betta.
- Do not identify a Loach or Knife Fish as Betta.
- Do not identify a fish based only on long fins.
- Do not identify a fish based only on a colorful appearance.

VISUALLY SIMILAR SPECIES:

Before selecting the final species, internally compare the image against the most plausible alternatives.

For colorful or elongated fish, specifically compare the visible morphology against:

- Channa/Snakehead
- Betta Fish
- Gourami
- other elongated freshwater fish

For livebearers, carefully distinguish:

- Guppy
- Molly
- Platy
- Swordtail

For large cichlids, carefully distinguish:

- Oscar
- Flowerhorn
- Discus
- Angelfish
- other cichlids

Do not choose a species simply because it is common in the AquaGuide database.

AQUAGUIDE SUPPORTED SPECIES:

If the fish clearly belongs to one of these species, use the EXACT canonical species name:

1. Goldfish
2. Betta Fish
3. Guppy
4. Platy
5. Zebra Danio
6. Angelfish
7. Gourami
8. Molly
9. Swordtail
10. Tiger Barb
11. Discus
12. Arowana
13. Flowerhorn
14. Oscar
15. Koi

CANONICAL NAME RULES:

- Betta → "Betta Fish"
- Siamese Fighting Fish → "Betta Fish" only when the morphology genuinely supports Betta
- Fighting Fish → "Betta Fish" only when the morphology genuinely supports Betta
- Zebra Fish → "Zebra Danio"
- Zebra Danio → "Zebra Danio"

IMPORTANT:

- The 15 supported species are NOT the complete list of possible fish.
- If the fish is not one of the 15 supported species, identify its actual species if the evidence allows it.
- Never force an unknown fish into the supported list.
- If you cannot reliably determine the exact species, use the most defensible broader identification and reduce confidence rather than inventing a species.

SCIENTIFIC NAME:

- Return a scientific name only when you are reasonably confident it is correct.
- Never invent a scientific name.
- If the scientific name cannot be reliably determined, return null.

VARIANT IDENTIFICATION:

- Only identify a variant, morph, strain, or color variety when the visible characteristics strongly support it.
- Do not invent a commercial variant name.
- Do not treat ordinary coloration as a confirmed named variant.
- Do not infer a variant simply because the fish has a particular color pattern.
- If the exact variant cannot be confidently determined, return null.
- Species identification is more important than variant identification.

CONFIDENCE:

- Confidence must be a number between 0 and 1.
- Confidence represents confidence in the species identification, not how attractive, clear, or colorful the fish is.
- Do not give 90%+ confidence when there are significant competing species.
- If the image is blurry, partially hidden, photographed from an unusual angle, or otherwise unclear, reduce confidence.
- If multiple species remain plausible, use a lower confidence score.
- Never use high confidence simply because one species looks generally similar.

IMAGE QUALITY:

- If the fish is too blurry, too small, partially obscured, heavily distorted, or otherwise impossible to identify reliably, do not guess.
- Return the most defensible identification only if there is enough visual evidence.
- Otherwise use a lower confidence score.

FINAL CHECK:

Before returning the answer, internally verify:

1. Does the body shape support the selected species?
2. Does the head and mouth support the selected species?
3. Do the dorsal, anal, and caudal fins support the selected species?
4. Could another species better explain the morphology?
5. Am I relying too heavily on color?
6. Am I incorrectly forcing the fish into the AquaGuide 15?
7. If I selected Betta Fish, did I actually rule out Channa/Snakehead, Gourami, and other visually similar fish?
8. If I selected a variant, is there enough evidence for that exact variant?

Return ONLY valid JSON.

Do not include markdown.
Do not include code fences.
Do not include explanations outside the JSON.

Use exactly this structure:

{
  "species": "Fish Name",
  "variant": "Variant Name or null",
  "scientificName": "Scientific Name or null",
  "confidence": 0.95,
  "introduction": "Short 1–2 sentence introduction about the fish."
}`,
      );

      const [response] = await Promise.all([aiTask, waitForProgress()]);

      if (!response.success) {
        throw new Error(response.error ?? "AI request failed.");
      }

      let aiResult: {
        species: string;
        variant: string | null;
        scientificName: string | null;
        confidence: number;
        introduction: string;
      };

      try {
        let cleanedResponse = response.message.trim();

        // Remove markdown code fences if the model included them.
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        // Try to isolate the JSON object if the model added extra text.
        const firstBrace = cleanedResponse.indexOf("{");
        const lastBrace = cleanedResponse.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanedResponse = cleanedResponse.slice(firstBrace, lastBrace + 1);
        }

        aiResult = JSON.parse(cleanedResponse);

        // Basic validation.
        if (
          !aiResult ||
          typeof aiResult.species !== "string" ||
          typeof aiResult.confidence !== "number"
        ) {
          throw new Error("Invalid fish identification response.");
        }

        // Normalize optional fields.
        aiResult.variant =
          typeof aiResult.variant === "string" && aiResult.variant.trim()
            ? aiResult.variant.trim()
            : null;

        aiResult.scientificName =
          typeof aiResult.scientificName === "string" &&
          aiResult.scientificName.trim()
            ? aiResult.scientificName.trim()
            : null;

        aiResult.introduction =
          typeof aiResult.introduction === "string" &&
          aiResult.introduction.trim()
            ? aiResult.introduction.trim()
            : "The fish could not be confidently identified from this image.";

        // Keep confidence between 0 and 1.
        aiResult.confidence = Math.max(0, Math.min(1, aiResult.confidence));
      } catch (parseError) {
        console.error("Invalid AI JSON response:", response.message);
        console.error("JSON parsing error:", parseError);

        throw new Error(
          "The AI could not provide a valid identification. Please try a clearer photo.",
        );
      }
      setResult({
        label: aiResult.species,
        confidence: aiResult.confidence,
        note: aiResult.introduction,
        variant: aiResult.variant ?? null,
        scientificName: aiResult.scientificName ?? null,
      });

      if (user) {
        await addScan(user.uid, {
          label: aiResult.species,
          confidence: aiResult.confidence,
          note: aiResult.introduction,
        });
      }

      setScanState("done");
    } catch (error) {
      console.error(error);

      if (scanReserved) {
        await releaseScan();
      }

      setScanState("error");
    }
  };

  const scanLineTranslateY = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scannerHeight - 2],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.85],
  });

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  const confidenceStatus =
    confidence >= 90
      ? "High Confidence"
      : confidence >= 70
        ? "Medium Confidence"
        : "Low Confidence";

  const matchedFish = useMemo(() => {
    if (!result?.label) return undefined;

    const normalize = (value: string) =>
      value
        .trim()
        .toLowerCase()
        .replace(/fish/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const normalizedLabel = normalize(result.label);

    // Canonical aliases for supported AquaGuide fish.
    // Different AI models may use different common names
    // for the same fish.
    const fishAliases: Record<string, string[]> = {
      betta: [
        "betta",
        "betta fish",
        "fighting fish",
        "siamese fighting fish",
        "siamese fighter",
      ],

      goldfish: ["goldfish", "gold fish", "carassius auratus"],

      guppy: ["guppy", "guppy fish", "millionfish", "million fish"],

      platy: ["platy", "platy fish", "platyfish", "southern platyfish"],

      danio: ["danio", "zebra danio", "zebra fish", "zebrafish"],

      angelfish: ["angelfish", "freshwater angelfish", "freshwater angel"],

      gourami: [
        "gourami",
        "gourami fish",
        "three spot gourami",
        "three spot gourami fish",
        "labyrinth fish",
      ],

      molly: ["molly", "molly fish", "mollies"],

      swordtail: ["swordtail", "swordtail fish", "swordtail livebearer"],

      tigerbarb: [
        "tiger barb",
        "tiger barbs",
        "tiger barb fish",
        "sumatran barb",
        "sumatra barb",
      ],

      discus: ["discus", "discus fish", "discus cichlid"],

      arowana: ["arowana", "arowana fish", "dragon fish", "dragonfish"],

      flowerhorn: ["flowerhorn", "flowerhorn cichlid", "flower horn"],

      oscar: ["oscar", "oscar fish", "oscar cichlid", "tiger oscar"],

      koi: ["koi", "koi fish", "koi carp", "ornamental carp"],
    };

    // First: convert an AI alias into the canonical AquaGuide ID.
    const aliasEntry = Object.entries(fishAliases).find(([, aliases]) =>
      aliases.some((alias) => normalize(alias) === normalizedLabel),
    );

    if (aliasEntry) {
      const [canonicalId] = aliasEntry;

      const aliasMatch = allFish.find(
        (fish) => normalize(fish.id) === normalize(canonicalId),
      );

      if (aliasMatch) {
        return aliasMatch;
      }
    }

    // Second: exact normalized match against the existing database.
    const exactMatch = allFish.find((fish) => {
      const commonName = normalize(fish.commonName);
      const id = normalize(fish.id);

      return commonName === normalizedLabel || id === normalizedLabel;
    });

    if (exactMatch) {
      return exactMatch;
    }

    // Third: partial match against the existing database.
    const partialMatch = allFish.find((fish) => {
      const commonName = normalize(fish.commonName);
      const id = normalize(fish.id);

      return (
        normalizedLabel.includes(commonName) ||
        commonName.includes(normalizedLabel) ||
        normalizedLabel.includes(id) ||
        id.includes(normalizedLabel)
      );
    });

    return partialMatch;
  }, [result]);

  const matchedCare = matchedFish
    ? fishCareDatabase[matchedFish.id as keyof typeof fishCareDatabase]
    : undefined;
  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="AI Fish Scan" showBack />

      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Scan Limit */}
        <ScanLimitBanner
          remainingScans={remainingScans}
          limit={5}
          primaryColor={colors.primary}
          textPrimary={colors.textPrimary}
          textSecondary={colors.textSecondary}
          cardColor={colors.card}
          borderColor={colors.border}
        />

        {/* Camera / Preview */}
        <View
          style={[
            styles.previewWrap,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {permission?.granted ? (
            capturedUri ? (
              <Image source={{ uri: capturedUri }} style={styles.preview} />
            ) : (
              <CameraView
                ref={cameraRef}
                style={styles.preview}
                facing={facing}
              />
            )
          ) : (
            <View style={[styles.preview, styles.permissionBox]}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.permissionTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Camera Access Needed
              </Text>
              <Text
                style={[
                  styles.permissionText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Allow camera permission to scan and identify ornamental fish.
              </Text>
              <Pressable
                onPress={onRequestPermission}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Grant Permission
                </Text>
              </Pressable>
            </View>
          )}

          {/* Scanner Overlay */}
          {permission?.granted && (
            <View pointerEvents="none" style={styles.overlay}>
              <Animated.View
                style={[
                  styles.scannerFrame,
                  {
                    transform: [{ scale: pulseScale }],
                    opacity: 1,
                    borderColor: colors.primary,
                  },
                ]}
              />

              {/* Corner accents */}
              <Animated.View
                style={[
                  styles.cornerTL,
                  {
                    opacity: pulseOpacity,
                    borderColor: colors.primary,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.cornerTR,
                  {
                    opacity: pulseOpacity,
                    borderColor: colors.primary,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.cornerBL,
                  {
                    opacity: pulseOpacity,
                    borderColor: colors.primary,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.cornerBR,
                  {
                    opacity: pulseOpacity,
                    borderColor: colors.primary,
                  },
                ]}
              />

              {/* Scan line */}
              {(scanState === "ready" || scanState === "processing") && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLineTranslateY }],
                      opacity: 0.9,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              )}
            </View>
          )}
        </View>

        {/* Status + Result */}
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Status */}
          <View style={styles.statusRow}>
            {scanState === "processing" ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={colors.primary}
              />
            )}

            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 15,
                fontWeight: "800",
                letterSpacing: 0.2,
                flex: 1,
              }}
            >
              {statusText}
            </Text>
          </View>

          {/* SUCCESSFUL SCAN */}
          {scanState === "done" && result && (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* AI Analysis */}
              <View style={styles.resultHeader}>
                <View
                  style={[
                    styles.aiChip,
                    {
                      backgroundColor: colors.primary + "22",
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color={colors.primary}
                  />

                  <Text
                    style={[
                      styles.aiChipText,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    AI Analysis
                  </Text>
                </View>
              </View>

              {/* Fish Name */}
              <Text
                style={[
                  styles.resultName,
                  {
                    color: colors.textPrimary,
                    fontSize: 26,
                    letterSpacing: 1,
                  },
                ]}
              >
                {result.label.toUpperCase()}
              </Text>
              {result.scientificName && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    fontStyle: "italic",
                    marginTop: -8,
                    marginBottom: 16,
                  }}
                >
                  {result.scientificName}
                </Text>
              )}

              {result.variant && (
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: colors.primary + "18",
                    borderColor: colors.primary + "55",
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: -8,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    Variant: {result.variant}
                  </Text>
                </View>
              )}

              {/* Confidence */}
              <View style={styles.confidenceSection}>
                <View style={styles.confidenceRow}>
                  <Text
                    style={[
                      styles.confidenceLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Confidence
                  </Text>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.confidencePercent,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      {confidence}%
                    </Text>

                    <Text
                      style={{
                        color:
                          confidence >= 90
                            ? "#4ADE80"
                            : confidence >= 70
                              ? "#FACC15"
                              : "#F87171",
                        fontSize: 11,
                        fontWeight: "700",
                      }}
                    >
                      {confidenceStatus}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.round(result.confidence * 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Quick Care */}
              {matchedFish && (
                <View
                  style={[
                    styles.quickCareCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {/* Quick Care Header */}
                  <View style={styles.quickCareHeader}>
                    <View
                      style={[
                        styles.quickCareIcon,
                        {
                          backgroundColor: colors.primary + "18",
                        },
                      ]}
                    >
                      <Ionicons
                        name="water-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.quickCareHeaderText}>
                      <Text
                        style={[
                          styles.quickCareTitle,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        Quick Care
                      </Text>

                      <Text
                        style={[
                          styles.quickCareSubtitle,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        Essential care information
                      </Text>
                    </View>
                  </View>

                  {/* Care Information */}
                  <View style={styles.careGrid}>
                    {/* Temperature */}
                    <View
                      style={[
                        styles.careItem,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="thermometer-outline"
                        size={22}
                        color="#F97316"
                      />

                      <Text
                        style={[
                          styles.careLabel,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        Temperature
                      </Text>

                      <Text
                        style={[
                          styles.careValue,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {matchedFish.temperature}
                      </Text>
                    </View>

                    {/* pH */}
                    <View
                      style={[
                        styles.careItem,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="flask-outline"
                        size={22}
                        color="#8B5CF6"
                      />

                      <Text
                        style={[
                          styles.careLabel,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        pH Level
                      </Text>

                      <Text
                        style={[
                          styles.careValue,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {matchedCare?.idealPH ?? matchedFish.pH}
                      </Text>
                    </View>

                    {/* Tank Size */}
                    <View
                      style={[
                        styles.careItem,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons name="home-outline" size={22} color="#3B82F6" />

                      <Text
                        style={[
                          styles.careLabel,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        Tank Size
                      </Text>

                      <Text
                        style={[
                          styles.careValue,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {matchedFish.tankSize}
                      </Text>
                    </View>

                    {/* Diet */}
                    <View
                      style={[
                        styles.careItem,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="restaurant-outline"
                        size={22}
                        color="#22C55E"
                      />

                      <Text
                        style={[
                          styles.careLabel,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        Diet
                      </Text>

                      <Text
                        style={[
                          styles.careValue,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {matchedFish.diet}
                      </Text>
                    </View>
                  </View>

                  {/* Care Recommendations */}
                  {matchedCare && (
                    <View
                      style={[
                        styles.careDetails,
                        {
                          borderTopColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.careDetailsTitle,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        Care Recommendations
                      </Text>

                      {/* Water Change */}
                      {!!matchedCare.waterChange && (
                        <View style={styles.careDetailRow}>
                          <Ionicons
                            name="water-outline"
                            size={20}
                            color={colors.primary}
                          />

                          <View style={styles.careDetailContent}>
                            <Text
                              style={[
                                styles.careDetailLabel,
                                {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              Water Change
                            </Text>

                            <Text
                              style={[
                                styles.careDetailValue,
                                {
                                  color: colors.textPrimary,
                                },
                              ]}
                            >
                              {matchedCare.waterChange}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Filtration */}
                      {!!matchedCare.filtration && (
                        <View style={styles.careDetailRow}>
                          <Ionicons
                            name="filter-outline"
                            size={20}
                            color={colors.primary}
                          />

                          <View style={styles.careDetailContent}>
                            <Text
                              style={[
                                styles.careDetailLabel,
                                {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              Filtration
                            </Text>

                            <Text
                              style={[
                                styles.careDetailValue,
                                {
                                  color: colors.textPrimary,
                                },
                              ]}
                            >
                              {matchedCare.filtration}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Compatibility */}
                      {!!matchedCare.compatibility && (
                        <View style={styles.careDetailRow}>
                          <Ionicons
                            name="git-compare-outline"
                            size={20}
                            color={colors.primary}
                          />

                          <View style={styles.careDetailContent}>
                            <Text
                              style={[
                                styles.careDetailLabel,
                                {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              Compatibility
                            </Text>

                            <Text
                              style={[
                                styles.careDetailValue,
                                {
                                  color: colors.textPrimary,
                                },
                              ]}
                            >
                              {matchedCare.compatibility}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* AI Description */}
                  <View
                    style={[
                      styles.descriptionCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color={colors.primary}
                    />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.textPrimary,
                          fontSize: 15,
                          fontWeight: "800",
                          marginBottom: 6,
                        }}
                      >
                        About This Fish
                      </Text>

                      <Text
                        style={[
                          styles.resultDescription,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {result.note}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* AI Description when no database match */}
              {!matchedFish && (
                <View
                  style={[
                    styles.descriptionCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={colors.primary}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: 15,
                        fontWeight: "800",
                        marginBottom: 6,
                      }}
                    >
                      About This Fish
                    </Text>

                    <Text
                      style={[
                        styles.resultDescription,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      {result.note}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Scan Error */}
          {scanState === "error" && (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.resultTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Scan Failed
              </Text>

              <Text
                style={[
                  styles.resultNote,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Please try again. Make sure the camera is available.
              </Text>
            </View>
          )}
        </View>
        {/* Controls */}
        <ScanControls
          permissionGranted={permission?.granted ?? false}
          scanState={scanState}
          canScan={!user || remainingScans > 0}
          onReset={onReset}
          onScan={onScan}
          primaryColor={colors.primary}
          textPrimary={colors.textPrimary}
          surfaceColor={colors.surface}
          borderColor={colors.border}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0F14" },
  container: { flex: 1, padding: 16, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  title: { fontSize: 18, fontWeight: "800", color: "#fff" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  previewWrap: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
  },

  preview: {
    width: "100%",
    height: 430,
  },

  permissionBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  permissionTitle: { color: "#fff", fontSize: 14.5, fontWeight: "800" },
  permissionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 18,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  scannerFrame: {
    width: "86%",
    height: 320,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(0,0,0,0.10)",
  },

  scanLine: {
    position: "absolute",
    top: (430 - 320) / 2,
    width: "86%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 999,
  },

  cornerTL: {
    position: "absolute",
    left: "7%",
    top: (430 - 320) / 2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: "absolute",
    right: "7%",
    top: (430 - 320) / 2,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: "absolute",
    left: "7%",
    bottom: (430 - 320) / 2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: "absolute",
    right: "7%",
    bottom: (430 - 320) / 2,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 12,
  },

  panel: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 2,
  },

  resultBox: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },

  resultTitle: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "900",
  },

  confidence: { color: "#fff", fontSize: 13, fontWeight: "900", opacity: 0.9 },

  resultNote: {
    marginTop: 6,
    fontSize: 13,
  },

  badgeRow: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  badgeText: { color: "#fff", fontSize: 11.5, fontWeight: "800" },

  controls: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  primaryBtnTextDark: { color: "#0B0F14", fontSize: 13.5, fontWeight: "900" },

  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
  },

  secondaryBtnText: { color: "#fff", fontSize: 13.5, fontWeight: "900" },
  disabledBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  primaryBtnText: { color: "#fff", fontSize: 13.5, fontWeight: "900" },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  resultCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  aiChipText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },

  resultName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  confidenceSection: {
    gap: 8,
  },

  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  confidenceLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "700",
  },

  confidencePercent: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#4ADE80",
  },

  descriptionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 14,
  },

  resultDescription: {
    flex: 1,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    lineHeight: 20,
  },

  quickCareCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  quickCareHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  quickCareIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  quickCareHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  quickCareTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  quickCareSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },

  careGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  careItem: {
    width: "48%",
    minHeight: 105,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },

  careLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  careValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
  },

  careDetails: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },

  careDetailsTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  careDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  careDetailContent: {
    flex: 1,
    marginLeft: 12,
  },

  careDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 3,
  },

  careDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
