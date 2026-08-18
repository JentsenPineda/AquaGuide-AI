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

  return (
    <View style={styles.controls}>
      {scanState === "processing" ? (
        <View style={styles.disabledBtn}>
          <Text
            style={[
              styles.primaryBtnText,
              {
                color: textPrimary,
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
                backgroundColor: surfaceColor,
                borderColor: borderColor,
              },
              pressed && styles.btnPressed,
            ]}
          >
            <Ionicons name="refresh" size={18} color={textPrimary} />

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
            disabled={!canScan}
            onPress={onScan}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: primaryColor,
              },
              pressed && styles.btnPressed,
              !canScan && styles.disabledPressable,
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
                backgroundColor: surfaceColor,
                borderColor: borderColor,
              },
              pressed && styles.btnPressed,
            ]}
          >
            <Ionicons name="close" size={18} color={textPrimary} />

            <Text
              style={[
                styles.secondaryBtnText,
                {
                  color: textPrimary,
                },
              ]}
            >
              Clear
            </Text>
          </Pressable>

          <Pressable
            disabled={!canScan}
            onPress={onScan}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: primaryColor,
              },
              pressed && styles.btnPressed,
              !canScan && styles.disabledPressable,
            ]}
          >
            <Ionicons name="camera" size={18} color="#FFFFFF" />

            <Text style={styles.primaryBtnText}>Scan</Text>
          </Pressable>
        </>
      )}
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

  secondaryBtnText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "900",
  },

  disabledBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  disabledPressable: {
    opacity: 0.45,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "900",
  },

  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
