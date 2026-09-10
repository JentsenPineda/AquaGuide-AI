import AppBackground from "@/components/layout/AppBackground";
import AppHeader from "@/components/layout/AppHeader";
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
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const router = useRouter();
  const colors = useAppColors();
  const cameraRef = useRef<CameraView>(null);
  const scanInProgressRef = useRef(false);
  const { user } = useAuth();
  const {
    remainingScans,
    reserveScan,
    releaseScan,
    loading: scanLimitLoading,
  } = useDailyScanLimit();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [cameraReady, setCameraReady] = useState(false);

  // Explicit consent before sending a user-selected image to the external AI service.
  const [aiConsentGranted, setAiConsentGranted] = useState(false);

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [selectedUploadUri, setSelectedUploadUri] = useState<string | null>(
    null,
  );
  const [selectedUploadBase64, setSelectedUploadBase64] = useState<
    string | null
  >(null);

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

  // Dedicated AI analysis animations
  const analysisRotation = useRef(new Animated.Value(0)).current;
  const analysisPulse = useRef(new Animated.Value(0)).current;
  const analysisGlow = useRef(new Animated.Value(0)).current;

  const scannerHeight = 260;

  const statusText = useMemo(() => {
    switch (scanState) {
      case "idle":
        return "Camera permission required";
      case "ready":
        return cameraReady
          ? "Align the ornamental fish inside the frame"
          : "Preparing camera…";
      case "capturing":
        return "Capturing image…";
      case "processing":
        return "Analyzing your fish…";
      case "done":
        return "Scan complete";
      case "error":
        return "Something went wrong. Try again.";
      default:
        return "";
    }
  }, [scanState, cameraReady]);

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

  const startAnalysisAnimation = () => {
    analysisRotation.setValue(0);
    analysisPulse.setValue(0);
    analysisGlow.setValue(0);

    Animated.loop(
      Animated.timing(analysisRotation, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(analysisPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(analysisPulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(analysisGlow, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(analysisGlow, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopAnalysisAnimation = () => {
    analysisRotation.stopAnimation();
    analysisPulse.stopAnimation();
    analysisGlow.stopAnimation();
  };

  useEffect(() => {
    if (scanState === "processing") {
      startAnalysisAnimation();
    } else {
      stopAnalysisAnimation();
    }

    return () => stopAnalysisAnimation();
  }, [scanState]);

  useEffect(() => {
    console.log("SCAN: cameraReady state changed:", cameraReady);
  }, [cameraReady]);
  // Permission flow
  useEffect(() => {
    if (!permission) return;

    console.log("SCAN: cameraReady set FALSE by permission effect");
    setCameraReady(false);
    if (permission.granted) {
      setScanState("ready");
    } else {
      setScanState("idle");
    }
  }, [permission?.granted]);

  useEffect(() => {
    if (!permission?.granted || capturedUri || scanState === "processing") {
      stopScanAnimations();
      return;
    }

    if (cameraReady && scanState === "ready") {
      startScanAnimations();
    } else {
      stopScanAnimations();
    }

    return () => stopScanAnimations();
  }, [cameraReady, permission?.granted, capturedUri, scanState]);

  const onRequestPermission = async () => {
    const res = await requestPermission();
    if (res.granted) {
      console.log("SCAN: cameraReady set FALSE by permission request");
      setCameraReady(false);
      setScanState("ready");
    }
  };

  const requestAIConsent = async (): Promise<boolean> => {
    if (aiConsentGranted) return true;

    return new Promise((resolve) => {
      Alert.alert(
        "AI Fish Identification",
        "To identify your fish, AquaGuide AI will send the selected fish photo to NaraRouter, an external AI service using the GPT-5.6 Terra model. The photo will be used to analyze your fish and provide identification and care information.",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Accept & Enable AI Features",
            onPress: () => {
              setAiConsentGranted(true);
              resolve(true);
            },
          },
        ],
        { cancelable: false },
      );
    });
  };

  const onFlip = () =>
    setFacing((prev) => (prev === "back" ? "front" : "back"));

  const onReset = () => {
    setCapturedUri(null);
    setSelectedUploadUri(null);
    setSelectedUploadBase64(null);
    setResult(null);

    if (permission?.granted) {
      setScanState("ready");
    } else {
      setScanState("idle");
    }
  };

  const prepareImageForAI = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: 1024,
          },
        },
      ],
      {
        compress: 0.65,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!result.base64 || !result.uri) {
      throw new Error("Failed to prepare image for AI analysis.");
    }

    console.log("SCAN: processed image:", {
      width: result.width,
      height: result.height,
      base64Length: result.base64.length,
      approximateMB: ((result.base64.length * 3) / 4 / 1024 / 1024).toFixed(2),
    });

    return {
      uri: result.uri,
      base64: result.base64,
    };
  };

  const onUploadImage = async () => {
    if (scanInProgressRef.current) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Gallery Permission Required",
        "Please allow photo access so you can select a fish image from your gallery.",
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      base64: false,
    });

    if (pickerResult.canceled) return;

    const asset = pickerResult.assets?.[0];

    if (!asset?.uri) {
      Alert.alert(
        "Image Error",
        "The selected image could not be prepared for analysis. Please choose another photo.",
      );
      return;
    }

    try {
      const processedImage = await prepareImageForAI(asset.uri);

      // Do not reserve or consume a scan yet.
      // The scan is reserved only after the user confirms
      // the image with Analyze Fish.
      setSelectedUploadUri(processedImage.uri);
      setSelectedUploadBase64(processedImage.base64);
      setCapturedUri(processedImage.uri);
      setResult(null);
      setScanState("ready");
    } catch (error) {
      console.error("SCAN: image preparation failed:", error);

      Alert.alert(
        "Image Error",
        "The selected image could not be prepared for analysis. Please choose another photo.",
      );
    }
  };

  const analyzeImage = async (base64: string, uri: string) => {
    if (scanInProgressRef.current) return;

    scanInProgressRef.current = true;
    let scanReserved = false;

    try {
      if (!user) {
        Alert.alert(
          "Login Required",
          "Please sign in to use AI Fish Identification.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Login",
              onPress: () => router.push("/auth/login?redirect=scan"),
            },
          ],
        );
        return;
      }

      const consentGranted = await requestAIConsent();

      if (!consentGranted) {
        return;
      }

      const scanReservation = await reserveScan();

      if (!scanReservation.allowed) {
        return;
      }

      scanReserved = true;
      setCapturedUri(uri);
      setSelectedUploadUri(null);
      setSelectedUploadBase64(null);
      setResult(null);
      setScanState("processing");

      console.log("SCAN: AI request starting");

      const response = await askVisionAI(
        base64,
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

      console.log("SCAN: AI response returned", {
        success: response.success,
        hasMessage: Boolean(response.message),
        error: response.error,
      });

      if (!response.success) {
        throw new Error(
          response.error || "The AI service could not identify the fish.",
        );
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
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const firstBrace = cleanedResponse.indexOf("{");
        const lastBrace = cleanedResponse.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanedResponse = cleanedResponse.slice(firstBrace, lastBrace + 1);
        }

        aiResult = JSON.parse(cleanedResponse);

        if (
          !aiResult ||
          typeof aiResult.species !== "string" ||
          typeof aiResult.confidence !== "number"
        ) {
          throw new Error("Invalid fish identification response.");
        }

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
    } finally {
      scanInProgressRef.current = false;
      console.log("SCAN: scan lock released");
    }
  };

  const onAnalyzeUpload = async () => {
    if (!selectedUploadBase64 || !selectedUploadUri) return;
    await analyzeImage(selectedUploadBase64, selectedUploadUri);
  };

  const onScan = async () => {
    if (scanInProgressRef.current) return;

    if (!user) {
      Alert.alert(
        "Login Required",
        "Please sign in to use AI Fish Identification.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Login",
            onPress: () => router.push("/auth/login?redirect=scan"),
          },
        ],
      );
      return;
    }

    if (!cameraReady || !cameraRef.current) {
      Alert.alert(
        "Camera Not Ready",
        "Please wait a moment for the camera to initialize, then try again.",
      );
      return;
    }

    scanInProgressRef.current = true;
    let scanReserved = false;

    try {
      const scanReservation = await reserveScan();

      if (!scanReservation.allowed) return;
      scanReserved = true;

      setScanState("capturing");
      setResult(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture image.");
      }

      const processedImage = await prepareImageForAI(photo.uri);

      // The reservation was already made for this camera capture, so analyze
      // directly without reserving a second scan.
      const consentGranted = await requestAIConsent();

      if (!consentGranted) {
        if (scanReserved) {
          await releaseScan();
          scanReserved = false;
        }
        setScanState("ready");
        return;
      }

      setCapturedUri(processedImage.uri);
      setScanState("processing");

      const response = await askVisionAI(
        processedImage.base64,
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

      if (!response.success) {
        throw new Error(
          response.error || "The AI service could not identify the fish.",
        );
      }

      let cleanedResponse = response.message.trim();
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const firstBrace = cleanedResponse.indexOf("{");
      const lastBrace = cleanedResponse.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedResponse = cleanedResponse.slice(firstBrace, lastBrace + 1);
      }

      const aiResult = JSON.parse(cleanedResponse);
      if (
        !aiResult ||
        typeof aiResult.species !== "string" ||
        typeof aiResult.confidence !== "number"
      ) {
        throw new Error("Invalid fish identification response.");
      }

      const normalizedVariant =
        typeof aiResult.variant === "string" && aiResult.variant.trim()
          ? aiResult.variant.trim()
          : null;
      const normalizedScientificName =
        typeof aiResult.scientificName === "string" &&
        aiResult.scientificName.trim()
          ? aiResult.scientificName.trim()
          : null;
      const normalizedIntroduction =
        typeof aiResult.introduction === "string" &&
        aiResult.introduction.trim()
          ? aiResult.introduction.trim()
          : "The fish could not be confidently identified from this image.";
      const confidenceValue = Math.max(0, Math.min(1, aiResult.confidence));

      setResult({
        label: aiResult.species,
        confidence: confidenceValue,
        note: normalizedIntroduction,
        variant: normalizedVariant,
        scientificName: normalizedScientificName,
      });

      await addScan(user.uid, {
        label: aiResult.species,
        confidence: confidenceValue,
        note: normalizedIntroduction,
      });

      setScanState("done");
    } catch (error) {
      console.error(error);
      if (scanReserved) await releaseScan();
      setScanState("error");
    } finally {
      scanInProgressRef.current = false;
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

  const analysisRotate = analysisRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const analysisPulseScale = analysisPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });

  const analysisGlowOpacity = analysisGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
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
    <AppBackground>
      <AppHeader title="Ornamental Fish Identifier" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Scan Limit */}
        <ScanLimitBanner
          remainingScans={remainingScans}
          limit={5}
          loading={scanLimitLoading}
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
                onCameraReady={() => {
                  console.log("SCAN: CameraView onCameraReady fired");

                  setCameraReady(true);
                  setScanState("ready");

                  console.log("SCAN: Camera ready state requested");
                }}
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
                AquaGuide AI uses your camera to capture photos of ornamental
                fish for AI-powered fish identification and care
                recommendations.
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
                  Continue
                </Text>
              </Pressable>
            </View>
          )}

          {/* Camera status */}
          {permission?.granted && !capturedUri && (
            <View
              pointerEvents="none"
              style={[
                styles.cameraStatus,
                {
                  backgroundColor: cameraReady
                    ? "rgba(10, 18, 24, 0.72)"
                    : "rgba(10, 18, 24, 0.82)",
                  borderColor: cameraReady
                    ? colors.primary + "66"
                    : "rgba(255,255,255,0.12)",
                },
              ]}
            >
              <View
                style={[
                  styles.cameraStatusDot,
                  {
                    backgroundColor: cameraReady ? "#4ADE80" : "#FACC15",
                  },
                ]}
              />
              <Text style={styles.cameraStatusText}>
                {cameraReady ? "Camera ready" : "Starting camera…"}
              </Text>
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

          {/* Centered camera shutter */}
          {permission?.granted &&
            !capturedUri &&
            !selectedUploadUri &&
            scanState === "ready" && (
              <Pressable
                onPress={onScan}
                disabled={
                  !cameraReady || (Boolean(user) && remainingScans <= 0)
                }
                style={({ pressed }) => [
                  styles.captureShutterOverlay,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.card,
                  },
                  (!cameraReady || (Boolean(user) && remainingScans <= 0)) &&
                    styles.captureShutterDisabled,
                  pressed && styles.shutterPressed,
                ]}
              >
                <View
                  style={[
                    styles.captureShutterInner,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name="camera"
                    size={27}
                    color={colors.textPrimary}
                  />
                </View>
              </Pressable>
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
        {/* Scan Controls */}
        <View style={styles.scanControlsArea}>
          {selectedUploadUri && scanState === "ready" ? (
            <View
              style={[
                styles.uploadConfirmationCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.uploadConfirmationHeader}>
                <Ionicons
                  name="image-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text
                  style={[
                    styles.uploadConfirmationTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Confirm this image
                </Text>
              </View>
              <Text
                style={[
                  styles.uploadConfirmationText,
                  { color: colors.textSecondary },
                ]}
              >
                Review your photo before using an AI scan.
              </Text>
              <View style={styles.confirmationActions}>
                <Pressable
                  onPress={onUploadImage}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons
                    name="images-outline"
                    size={18}
                    color={colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Change Photo
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onAnalyzeUpload}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: colors.primary },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={18}
                    color={colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.primaryBtnText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Analyze Fish
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {scanState === "processing" && (
                <View
                  style={[
                    styles.analysisCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.analysisVisual,
                      {
                        borderColor: colors.primary + "55",
                        backgroundColor: colors.primary + "0D",
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.analysisRing,
                        {
                          borderColor: colors.primary + "70",
                          transform: [{ rotate: analysisRotate }],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.analysisRingDot,
                          {
                            backgroundColor: colors.primary,
                          },
                        ]}
                      />
                    </Animated.View>

                    <Animated.View
                      style={[
                        styles.analysisGlow,
                        {
                          backgroundColor: colors.primary,
                          opacity: analysisGlowOpacity,
                          transform: [{ scale: analysisPulseScale }],
                        },
                      ]}
                    />

                    <Animated.View
                      style={[
                        styles.analysisCenter,
                        {
                          backgroundColor: colors.primary,
                          transform: [{ scale: analysisPulseScale }],
                        },
                      ]}
                    >
                      <Ionicons
                        name="sparkles"
                        size={25}
                        color={colors.textPrimary}
                      />
                    </Animated.View>
                  </View>

                  <Text
                    style={[
                      styles.analysisTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Analyzing your fish...
                  </Text>
                  <Text
                    style={[
                      styles.analysisSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Please wait
                  </Text>
                </View>
              )}

              {(scanState === "ready" ||
                scanState === "capturing" ||
                scanState === "error") &&
                !capturedUri && (
                  <>
                    <Pressable
                      onPress={onUploadImage}
                      disabled={scanState === "capturing"}
                      style={({ pressed }) => [
                        styles.uploadImageButton,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.primary + "55",
                        },
                        scanState === "capturing" && styles.disabledBtn,
                        pressed &&
                          scanState !== "capturing" &&
                          styles.btnPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.uploadImageIcon,
                          {
                            backgroundColor: colors.primary + "18",
                          },
                        ]}
                      >
                        <Ionicons
                          name="images-outline"
                          size={21}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.uploadImageContent}>
                        <Text
                          style={[
                            styles.uploadImageTitle,
                            { color: colors.textPrimary },
                          ]}
                        >
                          Upload Image
                        </Text>

                        <Text
                          style={[
                            styles.uploadImageSubtitle,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Choose a fish photo from your gallery
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                  </>
                )}

              {(scanState === "done" ||
                (capturedUri &&
                  scanState !== "processing" &&
                  scanState !== "ready" &&
                  scanState !== "error")) && (
                <View style={styles.afterScanActions}>
                  <Pressable
                    onPress={onReset}
                    style={({ pressed }) => [
                      styles.secondaryBtn,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      },
                      pressed && styles.btnPressed,
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={18}
                      color={colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.secondaryBtnText,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Scan Again
                    </Text>
                  </Pressable>
                  <View
                    style={[
                      styles.disabledCapture,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      },
                    ]}
                  >
                    <View style={styles.disabledCaptureDot}>
                      <Ionicons
                        name="camera"
                        size={17}
                        color={colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.disabledCaptureText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Capture
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10, gap: 14 },

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
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  preview: {
    width: "100%",
    height: 430,
    backgroundColor: "#071116",
  },

  cameraStatus: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 10,
  },

  cameraStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  cameraStatusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.2,
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
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },

  scannerFrame: {
    width: "86%",
    height: 320,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(0,0,0,0.08)",
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
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 2,
    minHeight: 28,
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

  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

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

  scanControlsArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
    gap: 12,
  },
  uploadImageButton: {
    width: "100%",
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  uploadImageIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadImageContent: {
    flex: 1,
    gap: 3,
  },

  uploadImageTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  uploadImageSubtitle: {
    fontSize: 11.5,
    fontWeight: "600",
    lineHeight: 16,
  },
  captureShutterOverlay: {
    position: "absolute",
    bottom: 4,
    alignSelf: "center",
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 20,
  },

  captureShutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  captureShutterDisabled: {
    opacity: 0.38,
  },
  shutterPressed: {
    transform: [{ scale: 0.95 }],
  },
  analysisCard: {
    width: "100%",
    minHeight: 190,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    overflow: "hidden",
  },
  analysisVisual: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 14,
  },
  analysisRing: {
    position: "absolute",
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  analysisRingDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    top: -3,
    left: 36,
  },
  analysisGlow: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  analysisCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.1,
  },
  analysisSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  uploadConfirmationCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  uploadConfirmationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadConfirmationTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  uploadConfirmationText: {
    fontSize: 12,
    lineHeight: 18,
  },
  confirmationActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  afterScanActions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  disabledCapture: {
    flex: 1,
    minHeight: 52,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    opacity: 0.7,
  },
  disabledCaptureDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  disabledCaptureText: {
    fontSize: 13.5,
    fontWeight: "900",
  },

  resultCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 16,
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
