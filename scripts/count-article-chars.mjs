import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bodiesDir = path.join(__dirname, "../src/lib/data/articles/bodies");

for (const file of fs.readdirSync(bodiesDir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  const content = fs.readFileSync(path.join(bodiesDir, file), "utf8");
  const texts = [
    ...content.matchAll(/text:\s*"([^"]+)"/g),
    ...content.matchAll(/title:\s*"([^"]+)"/g),
    ...content.matchAll(/items:\s*\[([\s\S]*?)\]/g).flatMap((m) =>
      [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    ),
    ...content.matchAll(/rows:\s*\[([\s\S]*?)\]\s*,?\s*\}/g).flatMap((m) =>
      [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    ),
  ];
  const joined = texts.join("");
  console.log(file.replace(".ts", ""), joined.length);
}
