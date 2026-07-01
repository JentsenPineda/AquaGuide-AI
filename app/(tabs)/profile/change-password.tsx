import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../../../config/firebase";

export default function ChangePasswordScreen() {
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      Alert.alert("Success", "Your password has been changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Unable to Change Password", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Change Password",
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="lock-closed" size={65} color="#00BCD4" />

            <Text style={styles.title}>Change Password</Text>

            <Text style={styles.subtitle}>
              Keep your AquaGuide AI account secure.
            </Text>
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#00BCD4",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
