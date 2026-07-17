export const LightColors = {
  // Brand
  primary: "#00BCD4",
  primaryLight: "#00D4FF",

  // Backgrounds
  background: "#F4F7FA",
  card: "#FFFFFF",
  surface: "#F8FAFC",

  // Borders
  border: "#E6EEF2",
  divider: "#EEF2F7",

  // Text
  white: "#FFFFFF",
  textPrimary: "#003B57",
  textSecondary: "#607D8B",
  textMuted: "#90A4AE",

  // Status
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",

  // Overlay
  overlay: "rgba(0,0,0,0.45)",
} as const;

export const DarkColors = {
  // Brand
  primary: "#00BCD4",
  primaryLight: "#00D4FF",

  // Backgrounds
  background: "#08141F",
  card: "#102331",
  surface: "#173344",

  // Borders
  border: "#1E3A4C",
  divider: "#263C4D",

  // Text
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0BEC5",
  textMuted: "#90A4AE",

  // Status
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",

  // Overlay
  overlay: "rgba(0,0,0,0.45)",
} as const;

/**
 * Temporary compatibility export.
 * Existing screens that still import `Colors`
 * will continue using the original dark palette.
 * We'll migrate them one by one to `useAppColors()`.
 */
export const Colors = DarkColors;

export type AppColors = typeof LightColors;
