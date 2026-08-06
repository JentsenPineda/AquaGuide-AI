import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    async function check() {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");

      setSeen(value === "true");
      setLoading(false);
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

  if (!seen) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/welcome" />;
}
