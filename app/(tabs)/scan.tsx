import AppHeader from "@/components/layout/AppHeader";
import { askVisionAI } from "@/services/aiService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const [result, setResult] = useState<{
    label: string;
    confidence: number;
    note: string;
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
    try {
      if (!cameraRef.current) return;

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
        `You are an ornamental fish identification expert.

Identify the fish in this image.

Reply ONLY in this JSON format:

{
  "label": "Fish Name",
  "confidence": 0.95,
  "note": "Short description"
}

Do not include markdown.
Do not include explanations.
Return valid JSON only.`,
      );

      const [response] = await Promise.all([aiTask, waitForProgress()]);

      if (!response.success) {
        throw new Error(response.error ?? "AI request failed.");
      }

      const aiResult = JSON.parse(response.message);

      setResult({
        label: aiResult.label,
        confidence: aiResult.confidence,
        note: aiResult.note,
      });

      setScanState("done");
    } catch (error) {
      console.error(error);
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
  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
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
        <AppHeader
          title="AI Fish Scan"
          subtitle="Scan and identify ornamental fish"
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
                Allow camera permission to scan and identify goldfish.
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
                  <Ionicons name="sparkles-outline" size={14} color="#fff" />
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

              <View
                style={[
                  styles.descriptionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primary}
                />
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
        {permission?.granted && (
          <View style={styles.controls}>
            {scanState === "processing" ? (
              <View style={styles.disabledBtn}>
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  Processing…
                </Text>
              </View>
            ) : scanState === "done" ? (
              <>
                <Pressable
                  onPress={onReset}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color={colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    Scan Again
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onScan}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    {
                      backgroundColor: colors.primary,
                    },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Capture</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={onReset}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="close" size={18} color={colors.textPrimary} />
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    Clear
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onScan}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    {
                      backgroundColor: colors.primary,
                    },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Scan</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
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
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
  },

  preview: {
    width: "100%",
    height: 360,
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
    width: "82%",
    height: 260,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(0,0,0,0.10)",
  },

  scanLine: {
    position: "absolute",
    top: (360 - 260) / 2,
    width: "82%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 999,
  },

  cornerTL: {
    position: "absolute",
    left: "9%",
    top: (360 - 260) / 2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: "absolute",
    right: "9%",
    top: (360 - 260) / 2,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: "absolute",
    left: "9%",
    bottom: (360 - 260) / 2,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: "absolute",
    right: "9%",
    bottom: (360 - 260) / 2,
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

  resultTitle: { color: "#fff", fontSize: 14.5, fontWeight: "900" },
  confidence: { color: "#fff", fontSize: 13, fontWeight: "900", opacity: 0.9 },
  resultNote: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12.5,
    lineHeight: 18,
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
    gap: 10,
    marginTop: 2,
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnTextDark: { color: "#0B0F14", fontSize: 13.5, fontWeight: "900" },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
});
