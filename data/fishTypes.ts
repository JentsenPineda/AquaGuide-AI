export interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  category: "Beginner" | "Intermediate" | "Expert";

  lifespan: string;
  size: string;

  temperature: string;
  ph: string;

  tankSize: string;

  temperament: string;
  diet: string;

  description: string;
  pondCompatible: boolean;
  image?: string;
}
