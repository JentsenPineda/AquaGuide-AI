type PlantData = {
  name: string;
  image: any;
  images?: any[];
  difficulty: string;
  lighting: string;
  growthRate: string;
  co2: string;
  placement: string;
};
export const plantDatabase: Record<string, PlantData> = {
  anubias: {
    name: "Anubias",

    image: require("../assets/images/aquatic-plants/anubias.png"),

    images: [require("../assets/images/aquatic-plants/anubias.png")],

    difficulty: "Beginner",
    lighting: "Low to Medium",
    growthRate: "Slow",
    co2: "Not Required",
    placement: "Midground",
  },

  anubias_nana: {
    name: "Anubias Nana",
    image: require("../assets/images/aquatic-plants/anubias_nana.png"),
    difficulty: "Beginner",
    lighting: "Low to Medium",
    growthRate: "Slow",
    co2: "Not Required",
    placement: "Foreground",
  },

  java_fern: {
    name: "Java Fern",
    image: require("../assets/images/aquatic-plants/java_fern.png"),
    difficulty: "Beginner",
    lighting: "Low",
    growthRate: "Slow",
    co2: "Not Required",
    placement: "Midground",
  },

  java_moss: {
    name: "Java Moss",
    image: require("../assets/images/aquatic-plants/java_moss.png"),
    difficulty: "Beginner",
    lighting: "Low",
    growthRate: "Medium",
    co2: "Not Required",
    placement: "Foreground",
  },

  marimo_moss_ball: {
    name: "Moss Ball",
    image: require("../assets/images/aquatic-plants/marimo_moss_ball.png"),
    difficulty: "Beginner",
    lighting: "Low",
    growthRate: "Medium",
    co2: "Not Required",
    placement: "Foreground",
  },

  hornwort: {
    name: "Hornwort",
    image: require("../assets/images/aquatic-plants/hornwort.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Background",
  },

  vallisneria: {
    name: "Vallisneria",
    image: require("../assets/images/aquatic-plants/vallisneria.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  jungle_vallisneria: {
    name: "Jungle Vallisneria",
    image: require("../assets/images/aquatic-plants/jungle_vallisneria.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  amazon_sword: {
    name: "Amazon Sword",
    image: require("../assets/images/aquatic-plants/amazon_sword.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Medium",
    co2: "Optional",
    placement: "Background",
  },

  water_sprite: {
    name: "Water Sprite",
    image: require("../assets/images/aquatic-plants/water_sprite.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  water_wisteria: {
    name: "Water Wisteria",
    image: require("../assets/images/aquatic-plants/water_wisteria.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  bacopa_caroliniana: {
    name: "Bacopa Caroliniana",
    image: require("../assets/images/aquatic-plants/bacopa_caroliniana.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Medium",
    co2: "Optional",
    placement: "Midground",
  },

  ludwigia_repens: {
    name: "Ludwigia Repens",
    image: require("../assets/images/aquatic-plants/ludwigia_repens.png"),
    difficulty: "Intermediate",
    lighting: "Medium to High",
    growthRate: "Medium",
    co2: "Recommended",
    placement: "Background",
  },

  cryptocoryne: {
    name: "Cryptocoryne",
    image: require("../assets/images/aquatic-plants/cryptocoryne.png"),
    difficulty: "Beginner",
    lighting: "Low to Medium",
    growthRate: "Slow",
    co2: "Not Required",
    placement: "Midground",
  },

  cryptocoryne_wendtii: {
    name: "Cryptocoryne Wendtii",
    image: require("../assets/images/aquatic-plants/cryptocoryne_wendtii.png"),
    difficulty: "Beginner",
    lighting: "Low to Medium",
    growthRate: "Slow",
    co2: "Not Required",
    placement: "Midground",
  },

  rotala_rotundifolia: {
    name: "Rotala Rotundifolia",
    image: require("../assets/images/aquatic-plants/rotala_rotundifolia.png"),
    difficulty: "Intermediate",
    lighting: "High",
    growthRate: "Fast",
    co2: "Recommended",
    placement: "Background",
  },

  hygrophila_corymbosa: {
    name: "Hygrophila Corymbosa",
    image: require("../assets/images/aquatic-plants/hygrophila_corymbosa.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  anacharis: {
    name: "Anacharis",
    image: require("../assets/images/aquatic-plants/anacharis.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Background",
  },

  guppy_grass: {
    name: "Guppy Grass",
    image: require("../assets/images/aquatic-plants/guppy_grass.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  red_root_floater: {
    name: "Red Root Floater",
    image: require("../assets/images/aquatic-plants/red_root_floater.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  bucephalandra: {
    name: "Bucephalandra",
    image: require("../assets/images/aquatic-plants/bucephalandra.png"),
    difficulty: "Intermediate",
    lighting: "Low",
    growthRate: "Slow",
    co2: "Optional",
    placement: "Foreground",
  },

  amazon_frogbit: {
    name: "Amazon Frogbit",
    image: require("../assets/images/aquatic-plants/amazon_frogbit.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  water_iris: {
    name: "Water Iris",
    image: require("../assets/images/aquatic-plants/water_iris.png"),
    difficulty: "Intermediate",
    lighting: "Medium",
    growthRate: "Medium",
    co2: "Optional",
    placement: "Background",
  },

  pickerel_rush: {
    name: "Pickerel Rush",
    image: require("../assets/images/aquatic-plants/pickerel_rush.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Medium",
    co2: "Not Required",
    placement: "Background",
  },

  sweet_flag: {
    name: "Sweet Flag",
    image: require("../assets/images/aquatic-plants/sweet_flag.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Medium",
    co2: "Not Required",
    placement: "Background",
  },

  horsetail_reed: {
    name: "Horsetail Reed",
    image: require("../assets/images/aquatic-plants/horsetail_reed.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Background",
  },

  water_lettuce: {
    name: "Water Lettuce",
    image: require("../assets/images/aquatic-plants/water_lettuce.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  water_hyacinth: {
    name: "Water Hyacinth",
    image: require("../assets/images/aquatic-plants/water_hyacinth.png"),
    difficulty: "Beginner",
    lighting: "High",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  frogbit: {
    name: "Frogbit",
    image: require("../assets/images/aquatic-plants/frogbit.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  duckweed: {
    name: "Duckweed",
    image: require("../assets/images/aquatic-plants/duckweed.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },

  water_lily: {
    name: "Water Lily",
    image: require("../assets/images/aquatic-plants/water_lily.png"),
    difficulty: "Beginner",
    lighting: "Medium to High",
    growthRate: "Medium",
    co2: "Not Required",
    placement: "Background",
  },

  lotus: {
    name: "Lotus",
    image: require("../assets/images/aquatic-plants/lotus.png"),
    difficulty: "Intermediate",
    lighting: "High",
    growthRate: "Medium",
    co2: "Optional",
    placement: "Background",
  },

  cabomba: {
    name: "Cabomba",
    image: require("../assets/images/aquatic-plants/cabomba.png"),
    difficulty: "Intermediate",
    lighting: "Medium to High",
    growthRate: "Fast",
    co2: "Recommended",
    placement: "Background",
  },

  crinum_calamistratum: {
    name: "Crinum Calamistratum",
    image: require("../assets/images/aquatic-plants/crinum_calamistratum.png"),
    difficulty: "Intermediate",
    lighting: "Low to Medium",
    growthRate: "Slow",
    co2: "Optional",
    placement: "Background",
  },

  giant_hygrophila: {
    name: "Giant Hygrophila",
    image: require("../assets/images/aquatic-plants/giant_hygrophila.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Optional",
    placement: "Background",
  },

  salvinia: {
    name: "Salvinia",
    image: require("../assets/images/aquatic-plants/salvinia.png"),
    difficulty: "Beginner",
    lighting: "Medium",
    growthRate: "Fast",
    co2: "Not Required",
    placement: "Floating",
  },
};
