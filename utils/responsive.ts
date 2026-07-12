import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Base design size (Samsung S23 / modern Android)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const widthScale = width / BASE_WIDTH;
const heightScale = height / BASE_HEIGHT;

const moderateScale = (size: number, factor = 0.5) =>
  size + (Math.min(widthScale, heightScale) * size - size) * factor;

/**
 * Responsive spacing
 */
export const RS = (size: number) => Math.round(moderateScale(size));

/**
 * Responsive font size
 */
export const RF = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

/**
 * Screen information
 */
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

/**
 * Device helpers
 */
export const isTablet = width >= 768;
export const isSmallPhone = width < 360;
export const isLargePhone = width >= 430;
