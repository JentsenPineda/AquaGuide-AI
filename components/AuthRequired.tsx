import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function AuthRequired({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    Alert.alert("Sign In Required", "Please sign in to use this feature.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Login",
        onPress: () => router.push("/auth/login"),
      },
    ]);

    return null;
  }

  return <>{children}</>;
}
