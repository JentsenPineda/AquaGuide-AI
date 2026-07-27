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
    image: require("../assets/images/onboarding/welcome.png"),
  },

  {
    id: "2",
    title: "Learn Fish Care",
    description:
      "Browse ornamental fish species, diseases, breeding guides, aquatic plants, aquarium equipment, and complete care recommendations.",
    image: require("../assets/images/onboarding/library1.jpg"),
  },

  {
    id: "3",
    title: "Stay Organized",
    description:
      "Create reminders and maintain a digital logbook to monitor your aquarium and fish health.",
    image: require("../assets/images/onboarding/reminder.jpg"),
  },

  {
    id: "4",
    title: "Let's Get Started",
    description:
      "Everything you need for successful ornamental fishkeeping is now in one place.",
    image: require("../assets/images/onboarding/get-started.jpg"),
  },
];
