export const fishCompatibility = {
  goldfish: {
    compatible: ["goldfish"],
    incompatible: [
      "betta",
      "angelfish",
      "discus",
      "flowerhorn",
      "oscar",
      "arowana",
    ],
  },

  betta: {
    compatible: ["guppy", "platy", "molly"],
    incompatible: [
      "goldfish",
      "betta",
      "tigerbarb",
      "flowerhorn",
      "oscar",
      "arowana",
    ],
  },

  guppy: {
    compatible: ["platy", "molly", "danio", "gourami", "swordtail"],
    incompatible: ["oscar", "flowerhorn", "arowana"],
  },

  platy: {
    compatible: ["guppy", "molly", "danio", "swordtail"],
    incompatible: ["oscar", "flowerhorn", "arowana"],
  },

  danio: {
    compatible: ["guppy", "platy", "molly"],
    incompatible: ["flowerhorn", "oscar", "arowana"],
  },

  angelfish: {
    compatible: ["gourami", "molly"],
    incompatible: ["goldfish", "flowerhorn", "oscar"],
  },

  gourami: {
    compatible: ["angelfish", "molly", "platy"],
    incompatible: ["flowerhorn", "oscar"],
  },

  molly: {
    compatible: ["guppy", "platy", "gourami", "swordtail"],
    incompatible: ["oscar", "flowerhorn", "arowana"],
  },

  swordtail: {
    compatible: ["guppy", "molly", "platy", "danio"],
    incompatible: ["oscar", "flowerhorn", "arowana"],
  },

  tigerbarb: {
    compatible: ["danio", "molly"],
    incompatible: ["betta", "angelfish"],
  },

  discus: {
    compatible: ["angelfish"],
    incompatible: ["goldfish", "oscar", "flowerhorn"],
  },

  arowana: {
    compatible: ["arowana"],
    incompatible: ["guppy", "platy", "molly", "betta", "oscar"],
  },

  flowerhorn: {
    compatible: ["flowerhorn"],
    incompatible: ["all"],
  },

  oscar: {
    compatible: ["oscar"],
    incompatible: ["all"],
  },

  koi: {
    compatible: ["goldfish", "koi"],
    incompatible: ["betta", "discus", "flowerhorn"],
  },
};
