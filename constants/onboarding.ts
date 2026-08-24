export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

export const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome to AquaGuide AI",
    description:
      "Your smart companion for ornamental fish care, aquarium management, and fishkeeping education.",
    image: require("../assets/images/onboarding/1.webp"),
  },

  {
    id: "2",
    title: "Identify Your Fish",
    description:
      "Use AI Fish Scan to instantly identify fish species and learn more about their variants.",
    image: require("../assets/images/onboarding/2.webp"),
  },

  {
    id: "3",
    title: "Learn & Care With Confidence",
    description:
      "Explore fish care guides, disease information, compatible plants, equipment, and everything your fish need.",
    image: require("../assets/images/onboarding/3.webp"),
  },

  {
    id: "4",
    title: "Stay Organized",
    description:
      "Create reminders, manage aquarium tasks, and keep a digital logbook of your fishkeeping activities.",
    image: require("../assets/images/onboarding/4.png"),
  },
];
