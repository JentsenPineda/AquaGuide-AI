export interface FishCareData {
  environment: "Aquarium" | "Pond";

  difficulty: "Beginner" | "Intermediate" | "Expert";

  minimumTankGallons?: number;

  gallonsPerFish: number;

  feedingFrequency: string;

  waterChange: string;

  filtration: string;

  idealTemperature?: string;

  idealPH?: string;

  compatibility: string;

  maintenanceLevel?: "Easy" | "Moderate" | "Advanced";

  aiAdvice?: string;
}
