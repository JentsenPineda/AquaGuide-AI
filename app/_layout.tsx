import "react-native-reanimated";

import RootNavigation from "./RootNavigation";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();

  const isDark = colorScheme === "dark";

  const paperTheme = isDark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,

          primary: "#00BCD4",
          secondary: "#00BCD4",

          background: "#0F172A",
          surface: "#1E293B",

          onBackground: "#F8FAFC",
          onSurface: "#F8FAFC",

          outline: "#475569",
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,

          primary: "#00BCD4",
          secondary: "#00BCD4",

          background: "#F4F7FA",
          surface: "#FFFFFF",

          onBackground: "#0F172A",
          onSurface: "#0F172A",

          outline: "#CBD5E1",
        },
      };

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppThemeProvider>
          <AuthProvider>
            <RootNavigation />
          </AuthProvider>
        </AppThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
