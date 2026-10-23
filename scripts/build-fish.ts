// Writes public/fish/<species>.svg from the parametric specs.
// Run: node --experimental-strip-types scripts/build-fish.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { SPECIES } from "./fish/species.ts";
import { render } from "./fish/render.ts";

const out = new URL("../public/fish/", import.meta.url);
mkdirSync(out, { recursive: true });
for (const s of SPECIES) writeFileSync(new URL(`${s.id}.svg`, out), render(s));

if (process.argv.includes("--preview")) {
  const cards = SPECIES.map((s) => `<figure><img src="../public/fish/${s.id}.svg"><figcaption>${s.id}</figcaption></figure>`).join("");
  writeFileSync(
    new URL("../.impeccable/fish-preview.html", import.meta.url),
    `<!doctype html><body style="margin:0;background:#04163a;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px;font:12px sans-serif;color:#9cf">${cards}<style>figure{margin:0;background:radial-gradient(#0a2c66,#04163a);padding:8px}img{width:100%;display:block}</style></body>`,
  );
}
console.log(`wrote ${SPECIES.length} fish`);
