import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");

        setSeen(value === "true");
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
        setSeen(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // FIRST-TIME USER
  if (!seen) {
    return <Redirect href="/onboarding" />;
  }

  // RETURNING USER
  // Always show the launch animation first.
  return <Redirect href="/launch-animation" />;
}
