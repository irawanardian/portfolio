import fs from "node:fs/promises";
import path from "node:path";
import {
  optimizeImage,
  getVariantPaths,
  isOriginalImage,
} from "../src/services/imageOptimizer.js";

const directory = path.resolve(
  "public/uploads/projects"
);

const entries = await fs.readdir(directory);

let created = 0;
let skipped = 0;
let failed = 0;

for (const filename of entries) {
  if (!isOriginalImage(filename)) continue;

  const original = path.join(directory, filename);
  const stat = await fs.stat(original);

  if (!stat.isFile()) continue;

  const variants = getVariantPaths(original);

  const thumbnailExists = await fs
    .access(variants.thumbnail)
    .then(() => true)
    .catch(() => false);

  const previewExists = await fs
    .access(variants.preview)
    .then(() => true)
    .catch(() => false);

  if (thumbnailExists && previewExists) {
    skipped++;
    continue;
  }

  try {
    await optimizeImage(original);
    created++;
    console.log("OK:", filename);
  } catch (error) {
    failed++;
    console.error("FAILED:", filename, error.message);
  }
}

console.log("\n===== RESULTS =====");
console.log("Generated:", created);
console.log("Skipped:", skipped);
console.log("Failed:", failed);

if (failed > 0) {
  process.exitCode = 1;
}
