export interface BreedingStep {
  title: string;
  description: string;
}

export interface BreedingData {
  name: string;

  steps: BreedingStep[];

  mistakes: string[];

  fryCare: string[];

  tip: string;
}
