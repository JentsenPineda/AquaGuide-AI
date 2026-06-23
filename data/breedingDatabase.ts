import { BreedingData } from "./breedingTypes";

export const breedingDatabase: Record<string, BreedingData> = {
  guppy: {
    name: "Guppy",

    steps: [
      {
        title: "Select Breeding Stock",
        description:
          "Choose healthy, colorful adult guppies at least 3 months old.",
      },

      {
        title: "Create Breeding Group",
        description: "Use one male for every 2-3 females to reduce stress.",
      },

      {
        title: "Condition the Fish",
        description:
          "Feed high-protein foods such as baby brine shrimp and quality pellets.",
      },

      {
        title: "Provide Plants",
        description: "Add floating plants and dense cover where fry can hide.",
      },

      {
        title: "Monitor Pregnancy",
        description: "Females develop a dark gravid spot and enlarged abdomen.",
      },

      {
        title: "Wait for Birth",
        description: "Gestation lasts approximately 21-30 days.",
      },

      {
        title: "Protect Fry",
        description:
          "Move fry or provide hiding places because adults may eat them.",
      },

      {
        title: "Feed Fry",
        description:
          "Feed baby brine shrimp and powdered fry food multiple times daily.",
      },
    ],

    mistakes: [
      "Too many males",
      "No hiding places",
      "Poor water quality",
      "Overcrowding",
    ],

    fryCare: [
      "Feed 3-5 times daily",
      "Perform weekly water changes",
      "Separate larger fry if needed",
    ],

    tip: "Guppies are among the easiest ornamental fish to breed.",
  },

  goldfish: {
    name: "Goldfish",

    steps: [
      {
        title: "Condition Breeders",
        description: "Feed protein-rich foods for 2-3 weeks before breeding.",
      },

      {
        title: "Simulate Spring",
        description:
          "Gradually raise temperature to trigger spawning behavior.",
      },

      {
        title: "Provide Spawning Mops",
        description: "Use artificial spawning mops or live plants.",
      },

      {
        title: "Observe Spawning Chase",
        description: "Males chase females and fertilize eggs during spawning.",
      },

      {
        title: "Remove Adults",
        description: "Adults will eat eggs if left in the tank.",
      },

      {
        title: "Incubate Eggs",
        description: "Eggs hatch within 4-7 days depending on temperature.",
      },

      {
        title: "Feed Fry",
        description:
          "Start with infusoria then transition to baby brine shrimp.",
      },
    ],

    mistakes: [
      "Leaving parents with eggs",
      "Poor water quality",
      "Insufficient conditioning",
    ],

    fryCare: [
      "Feed small foods frequently",
      "Perform regular water changes",
      "Sort fry as they grow",
    ],

    tip: "Goldfish can produce hundreds or even thousands of eggs.",
  },
  betta: {
    name: "Betta Fish",

    steps: [
      {
        title: "Choose a Healthy Pair",
        description:
          "Select a male and female betta aged 4-8 months. Condition them separately for 1-2 weeks using bloodworms, daphnia, and baby brine shrimp.",
      },

      {
        title: "Prepare the Breeding Tank",
        description:
          "Use a 10-gallon tank with 5-6 inches of water, gentle heating at 27-29°C, and floating plants or half a styrofoam cup.",
      },

      {
        title: "Introduce the Female",
        description:
          "Place the female inside a breeding box or transparent cup within the tank for 24-48 hours.",
      },

      {
        title: "Observe Bubble Nest Building",
        description:
          "The male should begin constructing a bubble nest at the surface.",
      },

      {
        title: "Release the Female",
        description:
          "Release the female only when she shows vertical breeding bars and the male has completed a nest.",
      },

      {
        title: "Allow Spawning",
        description:
          "The male wraps around the female and fertilizes the eggs. Eggs are placed into the bubble nest.",
      },

      {
        title: "Remove the Female",
        description:
          "After spawning, remove the female immediately to prevent injury.",
      },

      {
        title: "Wait for Hatching",
        description:
          "Eggs hatch within 24-36 hours while the male guards the nest.",
      },

      {
        title: "Remove the Male",
        description: "Remove the male once fry become free-swimming.",
      },

      {
        title: "Feed the Fry",
        description:
          "Start with infusoria then move to baby brine shrimp after several days.",
      },
    ],

    mistakes: [
      "Breeding immature fish",
      "Strong water flow",
      "Removing the male too early",
      "Overfeeding fry",
    ],

    fryCare: [
      "Feed infusoria for first week",
      "Provide baby brine shrimp daily",
      "Keep water shallow",
      "Perform small water changes",
    ],

    tip: "The male performs all egg care until fry become free-swimming.",
  },

  platy: {
    name: "Platy",

    steps: [
      {
        title: "Choose Healthy Adults",
        description: "Select active males and females with bright coloration.",
      },

      {
        title: "Set Proper Ratio",
        description: "Use one male for every 2-3 females.",
      },

      {
        title: "Condition Fish",
        description: "Feed protein-rich foods for 1 week before breeding.",
      },

      {
        title: "Add Dense Plants",
        description: "Provide hiding spots for newborn fry.",
      },

      {
        title: "Monitor Female",
        description: "Look for a dark gravid spot and swollen belly.",
      },

      {
        title: "Wait for Birth",
        description: "Pregnancy lasts around 24-30 days.",
      },

      {
        title: "Protect Fry",
        description: "Separate fry or provide plenty of cover.",
      },
    ],

    mistakes: ["Keeping too many males", "No hiding places", "Poor diet"],

    fryCare: [
      "Feed powdered food",
      "Feed baby brine shrimp",
      "Maintain clean water",
    ],

    tip: "Platies breed naturally in community aquariums.",
  },

  danio: {
    name: "Zebra Danio",

    steps: [
      {
        title: "Prepare Breeding Pair",
        description: "Condition males and females separately for one week.",
      },

      {
        title: "Set Up Breeding Tank",
        description: "Use a bare-bottom tank with marbles or spawning mesh.",
      },

      {
        title: "Introduce Pair",
        description: "Place breeders in the tank during evening hours.",
      },

      {
        title: "Allow Morning Spawning",
        description: "Spawning usually occurs shortly after sunrise.",
      },

      {
        title: "Remove Adults",
        description: "Remove adults immediately after spawning.",
      },

      {
        title: "Wait for Hatching",
        description: "Eggs hatch in about 48-72 hours.",
      },

      {
        title: "Feed Fry",
        description:
          "Start with infusoria then transition to baby brine shrimp.",
      },
    ],

    mistakes: [
      "Leaving parents with eggs",
      "Strong filtration",
      "Poor water quality",
    ],

    fryCare: [
      "Feed infusoria",
      "Keep water clean",
      "Perform gentle water changes",
    ],

    tip: "Danios are prolific egg scatterers.",
  },
  angelfish: {
    name: "Angelfish",

    steps: [
      {
        title: "Select a Mature Pair",
        description:
          "Choose a proven pair or allow a group of juvenile angelfish to form natural pairs. Fish should be at least 8-12 months old.",
      },

      {
        title: "Condition the Pair",
        description:
          "Feed bloodworms, blackworms, and high-quality pellets for 2 weeks before breeding.",
      },

      {
        title: "Prepare the Breeding Tank",
        description:
          "Use a 30-gallon tall aquarium with temperatures between 27°C and 29°C.",
      },

      {
        title: "Provide a Spawning Surface",
        description:
          "Place a spawning cone, slate, PVC pipe, or broad leaf plant for egg laying.",
      },

      {
        title: "Observe Courtship",
        description:
          "The pair will clean the spawning surface and remain together.",
      },

      {
        title: "Egg Laying",
        description:
          "The female lays rows of eggs while the male follows behind fertilizing them.",
      },

      {
        title: "Protect the Eggs",
        description:
          "Parents usually fan and guard the eggs. Remove aggressive tank mates.",
      },

      {
        title: "Wait for Hatching",
        description: "Eggs hatch within 48-72 hours depending on temperature.",
      },

      {
        title: "Feed Free-Swimming Fry",
        description:
          "Begin feeding newly hatched baby brine shrimp once fry become free swimming.",
      },
    ],

    mistakes: [
      "Moving the breeding pair too often",
      "Poor water quality",
      "Strong water currents",
      "Disturbing the eggs",
    ],

    fryCare: [
      "Feed baby brine shrimp 3-4 times daily",
      "Maintain pristine water",
      "Perform small daily water changes",
    ],

    tip: "Many first-time angelfish parents eat their eggs. This is normal.",
  },

  gourami: {
    name: "Gourami",

    steps: [
      {
        title: "Choose a Healthy Pair",
        description:
          "Select mature male and female gouramis showing strong coloration and activity.",
      },

      {
        title: "Condition the Pair",
        description: "Feed live foods and protein-rich diets for 1-2 weeks.",
      },

      {
        title: "Prepare a Breeding Tank",
        description:
          "Use shallow water around 6-8 inches deep and maintain temperatures of 27°C-29°C.",
      },

      {
        title: "Provide Floating Plants",
        description: "Floating plants help support bubble nest construction.",
      },

      {
        title: "Allow Bubble Nest Construction",
        description:
          "The male builds a large bubble nest at the water surface.",
      },

      {
        title: "Introduce the Female",
        description: "Release the female once the bubble nest is complete.",
      },

      {
        title: "Spawning",
        description:
          "The male embraces the female beneath the bubble nest and fertilizes the eggs.",
      },

      {
        title: "Remove the Female",
        description: "Remove the female immediately after spawning.",
      },

      {
        title: "Remove the Male",
        description: "Remove the male when fry become free swimming.",
      },
    ],

    mistakes: [
      "Strong filtration",
      "Breeding in deep water",
      "Removing the male too early",
    ],

    fryCare: [
      "Feed infusoria first",
      "Transition to baby brine shrimp",
      "Maintain stable temperatures",
    ],

    tip: "Most gourami species are bubble nest builders similar to bettas.",
  },

  molly: {
    name: "Molly",

    steps: [
      {
        title: "Select Healthy Adults",
        description:
          "Choose active adults with bright coloration and no signs of disease.",
      },

      {
        title: "Use Proper Ratio",
        description: "Keep one male for every 2-3 females.",
      },

      {
        title: "Condition the Fish",
        description:
          "Feed protein-rich foods such as brine shrimp and quality flakes.",
      },

      {
        title: "Provide Plant Cover",
        description: "Dense plants provide shelter for newborn fry.",
      },

      {
        title: "Monitor Pregnancy",
        description:
          "Females become noticeably larger and develop a gravid spot.",
      },

      {
        title: "Wait for Birth",
        description: "Pregnancy lasts approximately 28-35 days.",
      },

      {
        title: "Protect the Fry",
        description:
          "Move fry or provide hiding places because adults may eat them.",
      },

      {
        title: "Feed the Fry",
        description:
          "Feed powdered foods and baby brine shrimp multiple times daily.",
      },
    ],

    mistakes: ["Overcrowding", "No hiding spots", "Poor water quality"],

    fryCare: [
      "Feed frequently",
      "Perform weekly water changes",
      "Provide warm stable water",
    ],

    tip: "Mollies can store sperm and produce multiple broods from one mating.",
  },

  swordtail: {
    name: "Swordtail",

    steps: [
      {
        title: "Choose Healthy Breeders",
        description:
          "Select mature adults showing good body shape and coloration.",
      },

      {
        title: "Maintain Proper Ratio",
        description: "Keep one male with multiple females.",
      },

      {
        title: "Condition the Fish",
        description: "Feed live foods and quality pellets.",
      },

      {
        title: "Prepare Fry Shelter",
        description: "Use floating plants and dense vegetation.",
      },

      {
        title: "Monitor Pregnancy",
        description: "Females develop a large abdomen and dark gravid spot.",
      },

      {
        title: "Wait for Birth",
        description: "Gestation typically lasts around 28 days.",
      },

      {
        title: "Protect Fry",
        description: "Adults may eat fry, so provide plenty of hiding places.",
      },

      {
        title: "Feed Fry",
        description: "Offer powdered foods and baby brine shrimp.",
      },
    ],

    mistakes: [
      "Too many males",
      "Poor water quality",
      "Insufficient hiding places",
    ],

    fryCare: [
      "Feed 3-5 times daily",
      "Maintain stable water parameters",
      "Separate larger fry if necessary",
    ],

    tip: "Swordtails are one of the easiest livebearers to breed.",
  },

  tigerbarb: {
    name: "Tiger Barb",

    steps: [
      {
        title: "Select a Breeding Pair",
        description: "Choose healthy mature fish with strong coloration.",
      },

      {
        title: "Condition the Pair",
        description: "Feed live foods for 1-2 weeks before breeding.",
      },

      {
        title: "Prepare Breeding Tank",
        description:
          "Use a separate tank with marbles or spawning mesh covering the bottom.",
      },

      {
        title: "Introduce Breeders",
        description: "Place breeders into the tank in the evening.",
      },

      {
        title: "Allow Spawning",
        description: "Spawning usually occurs early the following morning.",
      },

      {
        title: "Remove Adults",
        description: "Adults will quickly eat eggs if left inside.",
      },

      {
        title: "Incubate Eggs",
        description: "Eggs generally hatch within 24-36 hours.",
      },

      {
        title: "Feed Fry",
        description: "Start with infusoria then move to baby brine shrimp.",
      },
    ],

    mistakes: [
      "Leaving adults with eggs",
      "Strong filtration",
      "Poor egg protection",
    ],

    fryCare: [
      "Feed infusoria initially",
      "Maintain excellent water quality",
      "Perform gentle water changes",
    ],

    tip: "Tiger Barbs are prolific breeders but notorious egg eaters.",
  },

  discus: {
    name: "Discus",

    steps: [
      {
        title: "Select a Proven Pair",
        description:
          "Purchase a bonded pair or raise a group of juveniles and allow them to pair naturally. Discus are difficult to sex visually.",
      },

      {
        title: "Condition the Pair",
        description:
          "Feed beef heart, bloodworms, blackworms, and premium discus pellets for several weeks.",
      },

      {
        title: "Prepare a Dedicated Breeding Tank",
        description:
          "Use a bare-bottom aquarium of at least 50 gallons with a sponge filter and temperature between 29°C and 31°C.",
      },

      {
        title: "Provide a Spawning Cone",
        description:
          "Place a breeding cone or vertical surface where eggs can be deposited.",
      },

      {
        title: "Observe Courtship",
        description:
          "The pair will clean the spawning site and remain close together.",
      },

      {
        title: "Egg Laying",
        description:
          "The female deposits eggs while the male follows to fertilize them.",
      },

      {
        title: "Protect the Eggs",
        description:
          "Maintain excellent water quality and avoid disturbing the breeding pair.",
      },

      {
        title: "Allow Fry Attachment",
        description:
          "After hatching, fry will attach themselves to the parents and feed on their body slime.",
      },

      {
        title: "Grow the Fry",
        description:
          "Continue feeding the parents heavily while introducing baby brine shrimp to fry.",
      },
    ],

    mistakes: [
      "Using poor water quality",
      "Breeding immature fish",
      "Frequent tank disturbances",
      "Low temperature",
    ],

    fryCare: [
      "Allow feeding from parent slime coat",
      "Introduce baby brine shrimp",
      "Perform daily water changes",
      "Maintain stable temperature",
    ],

    tip: "Discus breeding is considered one of the most advanced freshwater breeding projects.",
  },

  arowana: {
    name: "Arowana",

    steps: [
      {
        title: "Prepare a Large Pond",
        description:
          "Breeding Arowanas requires very large ponds because adults can exceed several feet in length.",
      },

      {
        title: "Raise a Group",
        description:
          "Keep multiple juveniles together and allow natural pairs to form.",
      },

      {
        title: "Condition the Pair",
        description:
          "Feed insects, shrimp, fish, and other protein-rich foods.",
      },

      {
        title: "Allow Courtship",
        description:
          "The pair will separate themselves from the group during breeding season.",
      },

      {
        title: "Spawning",
        description: "Eggs are fertilized and collected by the male.",
      },

      {
        title: "Mouthbrooding",
        description:
          "The male incubates eggs inside his mouth for several weeks.",
      },

      {
        title: "Release Fry",
        description:
          "The male releases fully developed fry when they are ready.",
      },

      {
        title: "Grow the Fry",
        description: "Feed baby fish, insects, and high-protein foods.",
      },
    ],

    mistakes: [
      "Insufficient pond size",
      "Poor nutrition",
      "Removing the male too early",
    ],

    fryCare: [
      "Feed protein-rich foods",
      "Provide spacious grow-out tanks",
      "Maintain excellent water quality",
    ],

    tip: "Successful home breeding of Arowanas is extremely rare.",
  },

  flowerhorn: {
    name: "Flowerhorn",

    steps: [
      {
        title: "Select Compatible Pair",
        description:
          "Choose healthy adults and initially separate them using a divider.",
      },

      {
        title: "Condition the Fish",
        description: "Feed high-protein pellets, shrimp, and worms.",
      },

      {
        title: "Prepare Breeding Tank",
        description:
          "Use a tank of at least 75 gallons with strong filtration.",
      },

      {
        title: "Allow Pair Bonding",
        description:
          "Observe behavior through the divider before allowing contact.",
      },

      {
        title: "Provide Spawning Surface",
        description: "Place flat stones or ceramic tiles in the aquarium.",
      },

      {
        title: "Spawning",
        description: "The female lays eggs while the male fertilizes them.",
      },

      {
        title: "Protect the Eggs",
        description: "Monitor aggression and separate fish if necessary.",
      },

      {
        title: "Wait for Hatching",
        description: "Eggs typically hatch within 2-3 days.",
      },

      {
        title: "Feed Fry",
        description: "Feed baby brine shrimp and powdered fry foods.",
      },
    ],

    mistakes: [
      "Pairing aggressive fish",
      "No divider during introduction",
      "Poor filtration",
    ],

    fryCare: [
      "Feed multiple times daily",
      "Perform regular water changes",
      "Separate larger fry",
    ],

    tip: "Flowerhorn breeding often requires close supervision due to aggression.",
  },

  oscar: {
    name: "Oscar",

    steps: [
      {
        title: "Allow Natural Pairing",
        description:
          "Raise several juveniles and allow a compatible pair to form naturally.",
      },

      {
        title: "Condition the Pair",
        description:
          "Feed worms, shrimp, pellets, and other high-quality foods.",
      },

      {
        title: "Prepare a Large Aquarium",
        description: "Use at least a 75-gallon tank with powerful filtration.",
      },

      {
        title: "Provide Flat Spawning Surface",
        description: "Place large rocks or slate for egg deposition.",
      },

      {
        title: "Observe Courtship",
        description: "The pair cleans the spawning site before laying eggs.",
      },

      {
        title: "Egg Laying",
        description: "Hundreds to thousands of eggs may be deposited.",
      },

      {
        title: "Parental Care",
        description: "Parents guard eggs and fan them constantly.",
      },

      {
        title: "Wait for Hatching",
        description: "Eggs hatch after approximately 3 days.",
      },

      {
        title: "Feed Fry",
        description:
          "Feed baby brine shrimp and gradually introduce larger foods.",
      },
    ],

    mistakes: [
      "Poor water quality",
      "Breeding immature fish",
      "Small tank size",
    ],

    fryCare: ["Frequent feeding", "Strong filtration", "Regular water changes"],

    tip: "Oscar parents are excellent guardians of eggs and fry.",
  },

  koi: {
    name: "Koi",

    steps: [
      {
        title: "Prepare Breeding Pond",
        description:
          "Use a spacious outdoor pond with excellent filtration and spawning brushes.",
      },

      {
        title: "Select Breeders",
        description: "Choose healthy mature females and at least two males.",
      },

      {
        title: "Condition the Fish",
        description:
          "Feed high-quality foods rich in protein for several weeks.",
      },

      {
        title: "Wait for Spawning Season",
        description:
          "Koi usually spawn during spring when water temperatures rise.",
      },

      {
        title: "Observe Spawning",
        description:
          "Males chase females aggressively while eggs are scattered onto spawning media.",
      },

      {
        title: "Remove Adults",
        description:
          "Remove breeders immediately because they will consume eggs.",
      },

      {
        title: "Incubate Eggs",
        description:
          "Eggs hatch within 3-7 days depending on water temperature.",
      },

      {
        title: "Feed Fry",
        description:
          "Start with infusoria before transitioning to baby brine shrimp.",
      },

      {
        title: "Cull and Sort Fry",
        description:
          "As fry grow, sort them according to quality, size, and coloration.",
      },
    ],

    mistakes: [
      "Leaving adults with eggs",
      "Overcrowding fry",
      "Poor pond filtration",
    ],

    fryCare: [
      "Feed several times daily",
      "Perform regular water maintenance",
      "Sort fry as they develop",
    ],

    tip: "A single female koi can produce hundreds of thousands of eggs.",
  },
};
