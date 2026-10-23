// Renders favicons and the Open Graph image from the logo and fish SVGs.
// Run: node scripts/brand-assets.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";

const icon = readFileSync("public/brand/logo-icon.svg");
await sharp(icon, { density: 300 }).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile("public/favicon-32.png");
await sharp(icon, { density: 300 })
  .resize(150, 150, { fit: "contain", background: "#ffffff" })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#ffffff" })
  .png()
  .toFile("public/apple-touch-icon.png");

const W = 1200, H = 630;
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
<radialGradient id="a" cx=".75" cy=".1" r=".9"><stop offset="0" stop-color="#1f7ae0" stop-opacity=".55"/><stop offset="1" stop-color="#1f7ae0" stop-opacity="0"/></radialGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03265a"/><stop offset="1" stop-color="#010f2b"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#b)"/><rect width="100%" height="100%" fill="url(#a)"/>
<text x="64" y="470" font-family="sans-serif" font-weight="700" font-size="54" fill="#ffffff">Frozen &amp; pre-cooked seafood</text>
<text x="64" y="535" font-family="sans-serif" font-weight="700" font-size="54" fill="#04c9c1">exported from India</text></svg>`);
const logo = await sharp(readFileSync("public/brand/logo-full-light.svg"), { density: 200 }).resize({ width: 300 }).png().toBuffer();
const fish = await sharp(readFileSync("public/fish/yellowfin-tuna.svg"), { density: 150 }).resize({ width: 720 }).png().toBuffer();
await sharp(bg)
  .composite([
    { input: fish, left: 470, top: 20 },
    { input: logo, left: 56, top: 50 },
  ])
  .jpeg({ quality: 84 })
  .toFile("public/og.jpg");
console.log("brand assets written");
