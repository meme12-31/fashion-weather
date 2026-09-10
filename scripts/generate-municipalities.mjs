import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2];

if (!sourcePath) {
  console.error("Usage: node generate-municipalities.mjs <localgovjp.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(sourcePath, "utf8"));
const grouped = {};

for (const item of raw) {
  const pref = item.pref;
  if (!grouped[pref]) grouped[pref] = [];

  grouped[pref].push({
    name: item.city,
    lat: Number(item.lat),
    lon: Number(item.lng),
  });
}

for (const pref of Object.keys(grouped)) {
  grouped[pref].sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

const outPath = join(__dirname, "../src/lib/data/municipalities.json");
writeFileSync(outPath, `${JSON.stringify(grouped, null, 0)}\n`, "utf8");
console.log(`Wrote ${Object.keys(grouped).length} prefectures to ${outPath}`);
console.log(
  `Total municipalities: ${Object.values(grouped).reduce((n, arr) => n + arr.length, 0)}`,
);
