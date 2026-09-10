const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();

const source = path.join(
  projectRoot,
  "node_modules",
  "hermes-compiler",
  "hermesc",
);

const destination = path.join(
  projectRoot,
  "node_modules",
  "react-native",
  "sdks",
  "hermesc",
);

console.log("Hermes source:", source);
console.log("Hermes destination:", destination);

if (!fs.existsSync(source)) {
  console.error("Hermes compiler package is missing.");
  process.exit(1);
}

if (fs.existsSync(destination)) {
  console.log("React Native Hermes path already exists.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });

if (process.platform === "win32") {
  fs.symlinkSync(source, destination, "junction");
  console.log("Hermes Windows junction created successfully.");
} else {
  fs.symlinkSync(source, destination, "dir");
  console.log("Hermes Linux/macOS symlink created successfully.");
}
