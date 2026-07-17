import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeMode = "system" | "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  colorScheme: "light",
  setMode: async () => {},
});

const STORAGE_KEY = "@aquaguide_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? "light",
  );

  useEffect(() => {
    loadTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme ?? "light");
    });

    return () => subscription.remove();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved === "system" || saved === "light" || saved === "dark") {
        setModeState(saved);
      }
    } catch {}
  };

  const setMode = async (value: ThemeMode) => {
    setModeState(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  const colorScheme = mode === "system" ? systemTheme : mode;

  const value = useMemo(
    () => ({
      mode,
      colorScheme,
      setMode,
    }),
    [mode, colorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
