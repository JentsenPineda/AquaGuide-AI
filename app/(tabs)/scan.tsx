import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
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

const FAKE_RESULTS = [
  {
    label: "Oranda Goldfish",
    confidence: 0.91,
    note: "Rounded body, prominent wen growth.",
  },
  {
    label: "Ryukin Goldfish",
    confidence: 0.88,
    note: "High back, deep body shape.",
  },
  {
    label: "Fantail Goldfish",
    confidence: 0.86,
    note: "Double tail, egg-shaped body.",
  },
  {
    label: "Common Goldfish",
    confidence: 0.83,
    note: "Single tail, slim body profile.",
  },
];

export default function ScanScreen() {
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
        return "Align the goldfish inside the frame";
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
  useEffect(() => {
    if (scanState === "ready" || scanState === "processing") {
      startScanAnimations();
    } else {
      stopScanAnimations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState]);

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
    const duration = 2400; // ms

    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);

      if (p >= 100) {
        clearInterval(t);
        const picked =
          FAKE_RESULTS[Math.floor(Math.random() * FAKE_RESULTS.length)];
        setResult(picked);
        setScanState("done");
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

  const onScan = async () => {
    try {
      if (!cameraRef.current) return;

      setScanState("capturing");
      setResult(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });

      setCapturedUri(photo?.uri ?? null);
      setScanState("processing");
    } catch (e) {
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

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <AppHeader
          title="AI Fish Scan"
          subtitle="Scan and identify ornamental fish"
          variant="dark"
        />

        {/* Camera / Preview */}
        <View style={styles.previewWrap}>
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
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.permissionTitle}>Camera Access Needed</Text>
              <Text style={styles.permissionText}>
                Allow camera permission to scan and identify goldfish.
              </Text>
              <Pressable
                onPress={onRequestPermission}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.primaryBtnText}>Grant Permission</Text>
              </Pressable>
            </View>
          )}

          {/* Scanner Overlay */}
          {permission?.granted && (
            <View pointerEvents="none" style={styles.overlay}>
              <Animated.View
                style={[
                  styles.scannerFrame,
                  { transform: [{ scale: pulseScale }], opacity: 1 },
                ]}
              />

              {/* Corner accents */}
              <Animated.View
                style={[styles.cornerTL, { opacity: pulseOpacity }]}
              />
              <Animated.View
                style={[styles.cornerTR, { opacity: pulseOpacity }]}
              />
              <Animated.View
                style={[styles.cornerBL, { opacity: pulseOpacity }]}
              />
              <Animated.View
                style={[styles.cornerBR, { opacity: pulseOpacity }]}
              />

              {/* Scan line */}
              {(scanState === "ready" || scanState === "processing") && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLineTranslateY }],
                      opacity: 0.9,
                    },
                  ]}
                />
              )}
            </View>
          )}
        </View>

        {/* Status + Result */}
        <View style={styles.panel}>
          <View style={styles.statusRow}>
            {scanState === "processing" ? (
              <ActivityIndicator />
            ) : (
              <Ionicons
                name="sparkles-outline"
                size={18}
                color="rgba(255,255,255,0.85)"
              />
            )}
            <Text style={styles.statusText}>{statusText}</Text>
          </View>

          {scanState === "done" && result && (
            <View style={styles.resultBox}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.resultTitle}>{result.label}</Text>
                <Text style={styles.confidence}>
                  {Math.round(result.confidence * 100)}%
                </Text>
              </View>
              <Text style={styles.resultNote}>{result.note}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.badgeText}>Prototype Result</Text>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="cloud-outline" size={14} color="#fff" />
                  <Text style={styles.badgeText}>API Coming Soon</Text>
                </View>
              </View>
            </View>
          )}

          {scanState === "error" && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Scan Failed</Text>
              <Text style={styles.resultNote}>
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
                <Text style={styles.primaryBtnText}>Processing…</Text>
              </View>
            ) : scanState === "done" ? (
              <>
                <Pressable
                  onPress={onReset}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="refresh" size={18} color="#fff" />
                  <Text style={styles.secondaryBtnText}>Scan Again</Text>
                </Pressable>
                <Pressable
                  onPress={onScan}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="camera" size={18} color="#0B0F14" />
                  <Text style={styles.primaryBtnTextDark}>Capture</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={onReset}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                  <Text style={styles.secondaryBtnText}>Clear</Text>
                </Pressable>
                <Pressable
                  onPress={onScan}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="camera" size={18} color="#0B0F14" />
                  <Text style={styles.primaryBtnTextDark}>Scan</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const ACCENT = "rgba(255, 255, 255, 0.92)";

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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
    borderColor: ACCENT,
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
    borderColor: ACCENT,
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
    borderColor: ACCENT,
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
    borderColor: ACCENT,
    borderBottomRightRadius: 12,
  },

  panel: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 10,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12.8,
    fontWeight: "700",
  },

  resultBox: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
});
