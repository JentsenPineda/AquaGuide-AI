import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScanState =
  | "idle"
  | "ready"
  | "capturing"
  | "processing"
  | "done"
  | "error";

interface ScanControlsProps {
  permissionGranted: boolean;
  scanState: ScanState;
  canScan: boolean;

  onReset: () => void;
  onScan: () => void;

  primaryColor: string;
  textPrimary: string;
  surfaceColor: string;
  borderColor: string;
}

export default function ScanControls({
  permissionGranted,
  scanState,
  canScan,
  onReset,
  onScan,
  primaryColor,
  textPrimary,
  surfaceColor,
  borderColor,
}: ScanControlsProps) {
  if (!permissionGranted) {
    return null;
  }

  /*
   * PROCESSING STATE
   * Shows a clear AI analysis indicator while the fish is being analyzed.
   */
  if (scanState === "processing") {
    return (
      <View style={styles.processingCard}>
        <Text style={styles.processingSparkle}>✨</Text>

        <Text
          style={[
            styles.processingTitle,
            {
              color: textPrimary,
            },
          ]}
        >
          Analyzing your fish...
        </Text>

        <Text
          style={[
            styles.processingSubtitle,
            {
              color: textPrimary,
            },
          ]}
        >
          Please wait
        </Text>
      </View>
    );
  }

  /*
   * DONE STATE
   * After a fish has been scanned:
   * - Scan Again is active
   * - Capture remains visible but disabled
   */
  if (scanState === "done") {
    return (
      <View style={styles.controls}>
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [
            styles.secondaryBtn,
            {
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            },
            pressed && styles.btnPressed,
          ]}
        >
          <Ionicons name="refresh" size={19} color={textPrimary} />

          <Text
            style={[
              styles.secondaryBtnText,
              {
                color: textPrimary,
              },
            ]}
          >
            Scan Again
          </Text>
        </Pressable>

        <Pressable
          disabled
          style={[
            styles.primaryBtn,
            {
              backgroundColor: primaryColor,
            },
            styles.disabledPressable,
          ]}
        >
          <Ionicons name="camera" size={19} color="#FFFFFF" />

          <Text style={styles.primaryBtnText}>Capture</Text>
        </Pressable>
      </View>
    );
  }

  /*
   * DEFAULT STATE
   * Before scanning:
   * - Clear button removed
   * - Only Capture remains
   */
  return (
    <View style={styles.singleControl}>
      <Pressable
        disabled={!canScan}
        onPress={onScan}
        style={({ pressed }) => [
          styles.captureBtn,
          {
            backgroundColor: primaryColor,
          },
          pressed && styles.btnPressed,
          !canScan && styles.disabledPressable,
        ]}
      >
        <Ionicons name="camera" size={20} color="#FFFFFF" />

        <Text style={styles.captureBtnText}>Capture</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  singleControl: {
    width: "100%",
    marginTop: 4,
    marginBottom: 8,
  },

  captureBtn: {
    width: "100%",
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
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

  captureBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "900",
  },

  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: "900",
  },

  /*
   * AI ANALYSIS INDICATOR
   */
  processingCard: {
    width: "100%",
    minHeight: 86,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(0,180,210,0.18)",
  },

  processingSparkle: {
    fontSize: 20,
    marginBottom: 2,
  },

  processingTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  processingSubtitle: {
    fontSize: 12.5,
    fontWeight: "600",
    opacity: 0.65,
    marginTop: 2,
  },

  disabledPressable: {
    opacity: 0.4,
  },

  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
