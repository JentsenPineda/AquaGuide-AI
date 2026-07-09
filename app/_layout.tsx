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
            headerTintColor: "#00BCD4",
          }}
        >
          {/* Authentication */}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />

          {/* Main Tabs */}
          <Stack.Screen name="(tabs)" />

          {/* Library */}
          <Stack.Screen
            name="library/common"
            options={{
              headerShown: true,
              title: "Common & Single-Tail",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Tank & Care */}
          <Stack.Screen
            name="tank-care"
            options={{
              headerShown: true,
              title: "Tank & Care",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Disease Guide */}
          <Stack.Screen
            name="disease-guide"
            options={{
              headerShown: true,
              title: "Disease Guide",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Breeding Guide */}
          <Stack.Screen
            name="breeding-guide"
            options={{
              headerShown: true,
              title: "Breeding Guide",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Aqua Plants */}
          <Stack.Screen
            name="aqua-plant"
            options={{
              headerShown: true,
              title: "Aqua Plants",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Plant Result */}
          <Stack.Screen
            name="plant-result"
            options={{
              headerShown: true,
              title: "Compatible Plants",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Equipment */}
          <Stack.Screen
            name="equipment/equipment"
            options={{
              headerShown: true,
              title: "Equipment",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Equipment Category */}
          <Stack.Screen
            name="equipment/equipment-category"
            options={{
              headerShown: true,
              title: "Equipment Categories",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Equipment Detail */}
          <Stack.Screen
            name="equipment/equipment-detail"
            options={{
              headerShown: true,
              title: "Equipment Details",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Equipment Guide */}
          <Stack.Screen
            name="equipment/equipment-guide"
            options={{
              headerShown: true,
              title: "Equipment Guide",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* New Fish Care */}
          <Stack.Screen
            name="new-fish-care/index"
            options={{
              headerShown: true,
              title: "New Fish Care",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />

          <Stack.Screen
            name="new-fish-care/preparation"
            options={{
              title: "Preparation",
            }}
          />

          <Stack.Screen
            name="new-fish-care/acclimation"
            options={{
              title: "Acclimation",
            }}
          />

          <Stack.Screen
            name="new-fish-care/inspection"
            options={{
              headerShown: true,
              title: "Preparation Checklist",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />

          <Stack.Screen
            name="new-fish-care/first24hours"
            options={{
              title: "First 24 Hours",
            }}
          />

          <Stack.Screen
            name="new-fish-care/sevenDays"
            options={{
              title: "First 7 Days",
            }}
          />

          <Stack.Screen
            name="new-fish-care/success"
            options={{
              title: "Success Tips",
            }}
          />
          {/* Compatibility Checker */}
          <Stack.Screen
            name="compatibility-checker"
            options={{
              headerShown: true,
              title: "Compatibility Checker",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          {/* Fish Details */}
          <Stack.Screen
            name="fish/[id]"
            options={{
              headerShown: true,
              title: "Fish Details",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
            }}
          />

          {/* Fish Variants */}
          <Stack.Screen
            name="variants/[species]"
            options={{
              headerShown: true,
              title: "Fish Variants",
              headerTintColor: "#00BCD4",
              headerBackButtonDisplayMode: "minimal",
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
