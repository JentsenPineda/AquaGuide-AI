import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { AuthProvider } from "../contexts/AuthContext";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Authentication */}
          <Stack.Screen name="auth/login" />

          <Stack.Screen name="auth/register" />

          <Stack.Screen name="auth/forgot-password" />

          <Stack.Screen name="auth/verify-email" />

          {/* Main Tabs */}

          <Stack.Screen name="(tabs)" />

          {/* Library */}

          <Stack.Screen
            name="library/common"
            options={{
              headerShown: true,
              title: "Common & Single-Tail",
            }}
          />

          {/* Modal */}

          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
