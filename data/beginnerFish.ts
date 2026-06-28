import { Fish } from "./fishTypes";
export const beginnerFish: Fish[] = [
  {
    id: "goldfish",
    commonName: "Goldfish",
    scientificName: "Carassius auratus",
    category: "Beginner",

    lifespan: "10–15 years",
    size: "8–12 in",

    temperature: "18°C - 24°C",
    pH: "7.0 - 8.4",

    tankSize: "20 Gallons",

    temperament: "Peaceful",
    diet: "Omnivore",

    description: "...",

    pondCompatible: true,

    image: require("../assets/images/common-goldfish/Chocolate-Comet-Goldfish.png"),
  },

  {
    id: "betta",
    commonName: "Betta Fish",
    pondCompatible: false,
    scientificName: "Betta splendens",

    category: "Beginner",

    lifespan: "2-5 Years",
    size: "2-3 Inches",

    temperature: "24°C - 30°C",
    pH: "6.5 - 7.5",

    tankSize: "5 Gallons",

    temperament: "Aggressive",

    diet: "Carnivore",

    description:
      "Betta fish are colorful freshwater fish known for their flowing fins.",

    image: require("../assets/images/betta/halfmoon.png"),
  },

  {
    id: "guppy",
    commonName: "Guppy",
    pondCompatible: true,
    scientificName: "Poecilia reticulata",

    category: "Beginner",

    lifespan: "2-3 Years",
    size: "1-2 Inches",

    temperature: "22°C - 28°C",
    pH: "6.8 - 7.8",

    tankSize: "10 Gallons",

    temperament: "Peaceful",

    diet: "Omnivore",

    description: "Guppies are small colorful fish that reproduce easily.",

    image: require("../assets/images/guppy/mosaic.png"),
  },

  {
    id: "platy",
    commonName: "Platy",
    pondCompatible: false,
    scientificName: "Xiphophorus maculatus",

    category: "Beginner",

    lifespan: "3-5 Years",
    size: "2-3 Inches",

    temperature: "20°C - 26°C",
    pH: "7.0 - 8.2",

    tankSize: "10 Gallons",

    temperament: "Peaceful",

    diet: "Omnivore",

    description:
      "Platies are hardy livebearers available in many attractive colors and patterns.",

    image: require("../assets/images/platy/hi-fin.png"),
  },

  {
    id: "danio",
    commonName: "Zebra Danio",
    pondCompatible: false,
    scientificName: "Danio rerio",

    category: "Beginner",

    lifespan: "3-5 Years",
    size: "2 Inches",

    temperature: "18°C - 26°C",
    pH: "6.5 - 7.5",

    tankSize: "10 Gallons",

    temperament: "Peaceful",

    diet: "Omnivore",

    description:
      "Zebra Danios are active schooling fish suitable for beginner aquarists.",

    image: require("../assets/images/danio/longfin_zebra.png"),
  },
];
