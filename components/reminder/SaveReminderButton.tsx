import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  accentColor: string;
  loading?: boolean;
  onPress: () => void;
};

export default function SaveReminderButton({
  accentColor,
  loading = false,
  onPress,
}: Props) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: accentColor,
          opacity: loading ? 0.7 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />

          <Text style={styles.text}>Save Reminder</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  text: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
