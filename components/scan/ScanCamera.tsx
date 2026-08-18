import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import React from "react";
import {
    Animated,
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

interface ScanCameraProps {
  permissionGranted: boolean;
  capturedUri: string | null;
  cameraRef: React.RefObject<CameraView | null>;
  facing: "back" | "front";
  scanState: ScanState;

  scanLineTranslateY: Animated.AnimatedInterpolation<number>;
  pulseScale: Animated.AnimatedInterpolation<number>;
  pulseOpacity: Animated.AnimatedInterpolation<number>;

  primaryColor: string;
  textPrimary: string;
  textSecondary: string;
  cardColor: string;
  borderColor: string;

  onRequestPermission: () => void;
}

export default function ScanCamera({
  permissionGranted,
  capturedUri,
  cameraRef,
  facing,
  scanState,
  scanLineTranslateY,
  pulseScale,
  pulseOpacity,
  primaryColor,
  textPrimary,
  textSecondary,
  cardColor,
  borderColor,
  onRequestPermission,
}: ScanCameraProps) {
  return (
    <View
      style={[
        styles.previewWrap,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      {permissionGranted ? (
        capturedUri ? (
          <Image source={{ uri: capturedUri }} style={styles.preview} />
        ) : (
          <CameraView ref={cameraRef} style={styles.preview} facing={facing} />
        )
      ) : (
        <View style={[styles.preview, styles.permissionBox]}>
          <Ionicons name="lock-closed-outline" size={22} color={primaryColor} />

          <Text
            style={[
              styles.permissionTitle,
              {
                color: textPrimary,
              },
            ]}
          >
            Camera Access Needed
          </Text>

          <Text
            style={[
              styles.permissionText,
              {
                color: textSecondary,
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
                  color: textPrimary,
                },
              ]}
            >
              Grant Permission
            </Text>
          </Pressable>
        </View>
      )}

      {/* Scanner Overlay */}
      {permissionGranted && (
        <View pointerEvents="none" style={styles.overlay}>
          <Animated.View
            style={[
              styles.scannerFrame,
              {
                transform: [{ scale: pulseScale }],
                opacity: 1,
                borderColor: primaryColor,
              },
            ]}
          />

          {/* Corner accents */}
          <Animated.View
            style={[
              styles.cornerTL,
              {
                opacity: pulseOpacity,
                borderColor: primaryColor,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.cornerTR,
              {
                opacity: pulseOpacity,
                borderColor: primaryColor,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.cornerBL,
              {
                opacity: pulseOpacity,
                borderColor: primaryColor,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.cornerBR,
              {
                opacity: pulseOpacity,
                borderColor: primaryColor,
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
                  backgroundColor: primaryColor,
                },
              ]}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

  permissionTitle: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "800",
  },

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

  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
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
