import { useTheme } from "@/contexts/ThemeContext";
import { DarkColors, LightColors } from "./colors";

type Variant = "light" | "dark";

export function useAppColors(variant?: Variant) {
  const { colorScheme } = useTheme();

  if (variant === "light") {
    return LightColors;
  }

  if (variant === "dark") {
    return DarkColors;
  }

  return colorScheme === "dark" ? DarkColors : LightColors;
}
