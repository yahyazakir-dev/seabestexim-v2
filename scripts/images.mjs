// Builds responsive WebP variants of the source photos into public/img.
// Run: npm run images
import sharp from "sharp";
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";

const SRC = "scripts/src-photos";
const OUT = "public/img";
const WIDTHS = [640, 1080, 1600];
mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const file of readdirSync(SRC)) {
  const { name } = parse(file);
  const img = sharp(join(SRC, file));
  const meta = await img.metadata();
  const widths = WIDTHS.filter((w) => w < meta.width).concat(Math.min(meta.width, 1600));
  const uniq = [...new Set(widths)];
  for (const w of uniq) {
    await sharp(join(SRC, file))
      .resize({ width: w })
      .modulate({ saturation: 1.06 })
      .webp({ quality: 74, effort: 5 })
      .toFile(join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { w: meta.width, h: meta.height, widths: uniq };
}
writeFileSync("lib/images.json", JSON.stringify(manifest, null, 2));
console.log(`processed ${Object.keys(manifest).length} images`);
