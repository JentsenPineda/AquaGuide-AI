export const equipmentCategories = [
  {
    id: "filters",
    title: "Filters",
    icon: "🧽",
    description:
      "Removes waste, excess food, and harmful substances from aquarium water.",
  },

  {
    id: "airpumps",
    title: "Air Pumps",
    icon: "💨",
    description:
      "Supplies oxygen and improves water circulation inside the aquarium.",
  },

  {
    id: "heaters",
    title: "Heaters",
    icon: "🌡️",
    description:
      "Maintains stable water temperature for tropical fish species.",
  },

  {
    id: "temperature-monitoring",
    title: "Temperature Monitoring",
    icon: "📊",
    description:
      "Monitors aquarium temperature and helps maintain safe conditions.",
  },
];

export const equipmentData = {
  filters: [
    {
      id: "sponge-filter",
      name: "Sponge Filter",
      image: require("../assets/images/equipments/filters/sponge.png"),

      description:
        "A biological filter powered by an air pump. Excellent for breeding tanks and fry tanks.",

      uses: [
        "Biological filtration",
        "Breeding tanks",
        "Shrimp tanks",
        "Fry tanks",
      ],
    },

    {
      id: "hob-filter",
      name: "Hang-On-Back Filter",
      image: require("../assets/images/equipments/filters/hang-on-back.png"),

      description:
        "External filter mounted on the aquarium rim. Easy maintenance and beginner friendly.",

      uses: [
        "Mechanical filtration",
        "Biological filtration",
        "Community tanks",
      ],
    },

    {
      id: "internal-filter",
      name: "Internal Filter",
      image: require("../assets/images/equipments/filters/internal.png"),

      description: "Compact filter installed inside the aquarium.",

      uses: [
        "Small aquariums",
        "Mechanical filtration",
        "Biological filtration",
      ],
    },

    {
      id: "canister-filter",
      name: "Canister Filter",
      image: require("../assets/images/equipments/filters/canister.png"),

      description:
        "High-performance external filter suitable for medium to large aquariums.",

      uses: ["Large aquariums", "Heavy bioload fish", "Crystal clear water"],
    },

    {
      id: "sump-filter",
      name: "Sump Filter",
      image: require("../assets/images/equipments/filters/sump.png"),

      description:
        "Advanced filtration system used in large aquariums and ponds.",

      uses: ["Large aquariums", "Koi ponds", "Advanced filtration"],
    },
  ],

  airpumps: [
    {
      id: "single-pump",
      name: "Single Outlet Air Pump",
      image: require("../assets/images/equipments/airpumps/single-pump.png"),

      description: "Provides oxygen to small aquariums through an air stone.",

      uses: ["Oxygenation", "Water circulation", "Small tanks"],
    },

    {
      id: "dual-pump",
      name: "Dual Outlet Air Pump",
      image: require("../assets/images/equipments/airpumps/dual-pump.png"),

      description: "Powers multiple air stones or sponge filters.",

      uses: ["Multiple tanks", "Breeding racks", "Fish rooms"],
    },

    {
      id: "air-stone",
      name: "Air Stone",
      image: require("../assets/images/equipments/airpumps/air-stone.png"),

      description: "Creates fine bubbles for oxygen distribution.",

      uses: ["Increase oxygen", "Improve circulation"],
    },

    {
      id: "air-curtain",
      name: "Air Curtain",
      image: require("../assets/images/equipments/airpumps/air-curtain.png"),

      description: "Produces decorative bubble walls while adding oxygen.",

      uses: ["Aquascaping", "Oxygenation"],
    },
  ],

  heaters: [
    {
      id: "adjustable-heater",
      name: "Adjustable Heater",
      image: require("../assets/images/equipments/heaters/adjustable.png"),

      description: "Allows precise temperature adjustment for tropical fish.",

      uses: ["Betta", "Discus", "Angelfish"],
    },

    {
      id: "preset-heater",
      name: "Preset Heater",
      image: require("../assets/images/equipments/heaters/preset.png"),

      description: "Maintains a fixed temperature automatically.",

      uses: ["Beginner aquariums", "Small tanks"],
    },

    {
      id: "submersible-heater",
      name: "Submersible Heater",
      image: require("../assets/images/equipments/heaters/submersible.png"),

      description: "Fully submerged heater with efficient heat distribution.",

      uses: ["Tropical fish tanks"],
    },
  ],

  "temperature-monitoring": [
    {
      id: "digital-thermometer",
      name: "Digital Thermometer",
      image: require("../assets/images/equipments/temperature-monitoring/digital.png"),

      description: "Displays aquarium temperature digitally.",

      uses: ["Daily monitoring", "Accurate readings"],
    },

    {
      id: "glass-thermometer",
      name: "Glass Thermometer",
      image: require("../assets/images/equipments/temperature-monitoring/glass.png"),

      description: "Traditional aquarium thermometer.",

      uses: ["Basic temperature monitoring"],
    },

    {
      id: "lcd-thermometer",
      name: "LCD Thermometer",
      image: require("../assets/images/equipments/temperature-monitoring/lcd.png"),

      description: "Stick-on thermometer placed outside the tank.",

      uses: ["Quick temperature checks"],
    },
  ],
};
