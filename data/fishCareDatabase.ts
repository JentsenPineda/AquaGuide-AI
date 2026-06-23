import { FishCareData } from "./fishCareTypes";

export const fishCareDatabase: Record<string, FishCareData> = {
  goldfish: {
    environment: "Aquarium",

    difficulty: "Beginner",

    minimumTankGallons: 20,

    gallonsPerFish: 20,

    feedingFrequency: "2 Times Daily",

    waterChange: "30% Weekly",

    filtration: "Canister Filter",

    idealTemperature: "18°C - 24°C",

    idealPH: "7.0 - 8.0",

    compatibility: "Peaceful community fish",

    maintenanceLevel: "Moderate",

    aiAdvice:
      "Goldfish produce significant waste. Strong filtration and regular water changes are essential.",
  },

  betta: {
    environment: "Aquarium",
    difficulty: "Beginner",

    minimumTankGallons: 5,

    gallonsPerFish: 5,

    feedingFrequency: "1-2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Gentle Sponge Filter",

    idealTemperature: "24°C - 30°C",

    idealPH: "6.5 - 7.5",

    compatibility: "Avoid multiple males",

    maintenanceLevel: "Easy",

    aiAdvice: "Keep water temperature stable and avoid strong currents.",
  },

  guppy: {
    environment: "Aquarium",
    difficulty: "Beginner",

    minimumTankGallons: 10,

    gallonsPerFish: 2,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Sponge Filter",

    idealTemperature: "22°C - 28°C",

    idealPH: "6.8 - 7.8",

    compatibility: "Excellent community fish",

    maintenanceLevel: "Easy",

    aiAdvice:
      "Guppies thrive in stable water conditions and should be kept in groups.",
  },

  platy: {
    environment: "Aquarium",

    difficulty: "Beginner",

    minimumTankGallons: 10,

    gallonsPerFish: 3,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Sponge Filter",

    idealTemperature: "20°C - 26°C",

    idealPH: "7.0 - 8.2",

    compatibility: "Peaceful community fish",

    maintenanceLevel: "Easy",

    aiAdvice:
      "Platies are hardy livebearers that thrive in planted community aquariums.",
  },

  danio: {
    environment: "Aquarium",

    difficulty: "Beginner",

    minimumTankGallons: 10,

    gallonsPerFish: 2,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Hang-on-Back Filter",

    idealTemperature: "18°C - 26°C",

    idealPH: "6.5 - 7.5",

    compatibility: "Keep in groups of 6 or more",

    maintenanceLevel: "Easy",

    aiAdvice:
      "Danios are active schooling fish that require open swimming space.",
  },

  angelfish: {
    environment: "Aquarium",

    difficulty: "Intermediate",

    minimumTankGallons: 30,

    gallonsPerFish: 15,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Canister Filter",

    idealTemperature: "24°C - 28°C",

    idealPH: "6.8 - 7.8",

    compatibility: "Semi-aggressive",

    maintenanceLevel: "Moderate",

    aiAdvice:
      "Provide a tall aquarium and stable water conditions for healthy growth.",
  },

  gourami: {
    environment: "Aquarium",

    difficulty: "Intermediate",

    minimumTankGallons: 20,

    gallonsPerFish: 10,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Gentle Filter",

    idealTemperature: "24°C - 28°C",

    idealPH: "6.0 - 7.5",

    compatibility: "Generally peaceful",

    maintenanceLevel: "Moderate",

    aiAdvice:
      "Provide floating plants and calm water to mimic natural habitats.",
  },

  molly: {
    environment: "Aquarium",

    difficulty: "Intermediate",

    minimumTankGallons: 20,

    gallonsPerFish: 5,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Sponge Filter",

    idealTemperature: "24°C - 28°C",

    idealPH: "7.5 - 8.5",

    compatibility: "Peaceful community fish",

    maintenanceLevel: "Easy",

    aiAdvice:
      "Mollies prefer alkaline water and benefit from stable conditions.",
  },

  swordtail: {
    environment: "Aquarium",

    difficulty: "Intermediate",

    minimumTankGallons: 20,

    gallonsPerFish: 5,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Hang-on-Back Filter",

    idealTemperature: "22°C - 28°C",

    idealPH: "7.0 - 8.4",

    compatibility: "Peaceful community fish",

    maintenanceLevel: "Easy",

    aiAdvice:
      "Maintain one male with multiple females to reduce breeding stress.",
  },

  tigerbarb: {
    environment: "Aquarium",

    difficulty: "Intermediate",

    minimumTankGallons: 20,

    gallonsPerFish: 5,

    feedingFrequency: "2 Times Daily",

    waterChange: "25% Weekly",

    filtration: "Canister Filter",

    idealTemperature: "22°C - 27°C",

    idealPH: "6.0 - 7.5",

    compatibility: "Keep in schools of 6 or more",

    maintenanceLevel: "Moderate",

    aiAdvice:
      "Large schools help reduce fin-nipping behavior toward tankmates.",
  },

  discus: {
    environment: "Aquarium",

    difficulty: "Expert",

    minimumTankGallons: 50,

    gallonsPerFish: 12,

    feedingFrequency: "2-3 Times Daily",

    waterChange: "30-50% Weekly",

    filtration: "High-Capacity Canister Filter",

    idealTemperature: "28°C - 31°C",

    idealPH: "6.0 - 7.0",

    compatibility: "Peaceful warm-water fish",

    maintenanceLevel: "Advanced",

    aiAdvice: "Discus require pristine water quality and stable temperatures.",
  },

  arowana: {
    environment: "Aquarium",

    difficulty: "Expert",

    minimumTankGallons: 180,

    gallonsPerFish: 180,

    feedingFrequency: "1-2 Times Daily",

    waterChange: "25-30% Weekly",

    filtration: "Heavy-Duty Filter",

    idealTemperature: "24°C - 30°C",

    idealPH: "6.0 - 7.5",

    compatibility: "Predatory fish",

    maintenanceLevel: "Advanced",

    aiAdvice: "Use a secure tank lid because Arowanas are powerful jumpers.",
  },

  flowerhorn: {
    environment: "Aquarium",

    difficulty: "Expert",

    minimumTankGallons: 75,

    gallonsPerFish: 75,

    feedingFrequency: "2 Times Daily",

    waterChange: "30% Weekly",

    filtration: "Canister Filter",

    idealTemperature: "26°C - 30°C",

    idealPH: "7.0 - 8.0",

    compatibility: "Usually solitary",

    maintenanceLevel: "Advanced",

    aiAdvice:
      "Maintain excellent water quality to support coloration and growth.",
  },

  oscar: {
    environment: "Aquarium",

    difficulty: "Expert",

    minimumTankGallons: 75,

    gallonsPerFish: 75,

    feedingFrequency: "2 Times Daily",

    waterChange: "30% Weekly",

    filtration: "Heavy-Duty Canister Filter",

    idealTemperature: "24°C - 28°C",

    idealPH: "6.5 - 7.5",

    compatibility: "Large fish only",

    maintenanceLevel: "Advanced",

    aiAdvice: "Provide spacious aquariums and avoid small tankmates.",
  },

  koi: {
    environment: "Pond",

    difficulty: "Expert",

    minimumTankGallons: 250,

    gallonsPerFish: 250,

    feedingFrequency: "2 Times Daily",

    waterChange: "10-20% Weekly",

    filtration: "Pond Filter + UV Sterilizer",

    idealTemperature: "15°C - 25°C",

    idealPH: "7.0 - 8.0",

    compatibility: "Peaceful pond fish",

    maintenanceLevel: "Advanced",

    aiAdvice:
      "Koi require strong filtration, aeration, and large outdoor ponds for healthy growth.",
  },
};
