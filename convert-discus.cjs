const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "assets", "images");

const supportedExtensions = /\.(png|jpg|jpeg)$/i;

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (supportedExtensions.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function convert() {
  const files = getFiles(assetsDir);

  console.log(`Found ${files.length} images to convert.\n`);

  let totalOriginal = 0;
  let totalWebP = 0;
  let converted = 0;
  let failed = 0;

  for (const input of files) {
    try {
      const parsed = path.parse(input);

      const output = path.join(parsed.dir, `${parsed.name}.webp`);

      await sharp(input)
        .webp({
          quality: 82,
          effort: 6,
        })
        .toFile(output);

      const originalSize = fs.statSync(input).size;
      const newSize = fs.statSync(output).size;

      totalOriginal += originalSize;
      totalWebP += newSize;
      converted++;

      console.log(`${path.relative(assetsDir, input)}`);

      console.log(
        `  ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024 / 1024).toFixed(2)} MB`,
      );
    } catch (error) {
      failed++;

      console.error(`FAILED: ${path.relative(assetsDir, input)}`);

      console.error(error.message);
    }
  }

  console.log("\n==============================");
  console.log("CONVERSION COMPLETE");
  console.log("==============================");

  console.log(`Original images: ${converted}`);
  console.log(`Failed: ${failed}`);

  console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);

  console.log(`WebP size: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);

  console.log(
    `Saved: ${((totalOriginal - totalWebP) / 1024 / 1024).toFixed(2)} MB`,
  );

  console.log(
    `Reduction: ${((1 - totalWebP / totalOriginal) * 100).toFixed(1)}%`,
  );
}

convert().catch((error) => {
  console.error(error);
  process.exit(1);
});
