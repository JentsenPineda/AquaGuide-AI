const fs = require("fs");
const path = require("path");

const source = path.resolve("node_modules", "hermes-compiler", "hermesc");

const destination = path.resolve(
  "node_modules",
  "react-native",
  "sdks",
  "hermesc",
);

console.log("Hermes source:", source);
console.log("Hermes destination:", destination);

if (!fs.existsSync(source)) {
  console.error("❌ Hermes compiler package is missing.");
  process.exit(1);
}

if (fs.existsSync(destination)) {
  console.log("✅ React Native Hermes path already exists.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });

fs.symlinkSync(source, destination, "junction");

console.log("✅ Hermes path created successfully.");
