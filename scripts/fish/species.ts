import { band, bars, lineAlong, spots } from "./render.ts";
import type { Species } from "./render.ts";
import { f, midAt, topAt } from "./geometry.ts";

const yellowfin: Species = {
  id: "yellowfin-tuna",
  viewBox: [0, -40, 1000, 460],
  body: { x0: 200, x1: 975, cy: 200, depth: 225, ped: 20, p: 1.5, q: 0.95, upper: 0.5, snoutDrop: 6 },
  tail: { span: 165, len: 150, notch: 0.82, sweep: 0.9 },
  colors: { back: "#0c1a3a", back2: "#1d3f86", mid: "#7f9bc4", belly: "#d9e2ec", fin: "#f2c230", finTip: "#c99412", tail: "#16285a", iris: "#c9b98a" },
  fins: [
    { edge: "top", t0: 0.6, t1: 0.74, tip: [-80, -34], bow: 0.1, fill: "#1a2c5c" },
    { edge: "top", t0: 0.44, t1: 0.52, tip: [-150, -150], bow: 0.35, trail: 0.4 },
    { edge: "bot", t0: 0.42, t1: 0.5, tip: [-150, 150], bow: -0.35, trail: 0.4 },
    { edge: "bot", t0: 0.66, t1: 0.7, tip: [-36, 30], bow: 0, fill: "#a9b5c6" },
  ],
  finlets: { color: "#f5c938", top: [0.08, 0.38, 8], bot: [0.08, 0.38, 7] },
  pectoral: { t: 0.78, f: 0.45, len: 250, angle: 5, width: 30, color: "#24396e" },
  eye: { t: 0.925, f: 0.42, r: 15 },
  gill: 0.8,
  scales: 0.12,
  markings: (b) =>
    band(b, 0.4, 0.5, 0.06, 0.8, "#f4c430", 0.55) +
    band(b, 0.44, 0.47, 0.08, 0.78, "#ffe58a", 0.45) +
    bars(b, 0.2, 0.7, 14, 0.62, 0.82, "#ffffff", 0.18, 5),
};

const skipjack: Species = {
  id: "skipjack-tuna",
  viewBox: [0, -10, 1000, 420],
  body: { x0: 230, x1: 965, cy: 200, depth: 245, ped: 20, p: 1.3, q: 0.9, upper: 0.5, snoutDrop: 8 },
  tail: { span: 140, len: 130, notch: 0.8, sweep: 0.8 },
  colors: { back: "#141a44", back2: "#3a3f8f", mid: "#9aa6c9", belly: "#e3e8ef", fin: "#2c3470", finTip: "#5a6aa8", iris: "#bfb08a" },
  fins: [
    { edge: "top", t0: 0.56, t1: 0.75, tip: [-110, -70], bow: 0.15 },
    { edge: "top", t0: 0.44, t1: 0.5, tip: [-50, -46], bow: 0.2 },
    { edge: "bot", t0: 0.42, t1: 0.48, tip: [-46, 44], bow: -0.2 },
    { edge: "bot", t0: 0.66, t1: 0.7, tip: [-30, 26], bow: 0, fill: "#b6bfd2" },
  ],
  finlets: { color: "#3b4580", top: [0.08, 0.36, 7], bot: [0.08, 0.36, 6] },
  pectoral: { t: 0.77, f: 0.42, len: 120, angle: 12, width: 26 },
  eye: { t: 0.925, f: 0.42, r: 15 },
  gill: 0.79,
  scales: 0.1,
  markings: (b) =>
    lineAlong(b, 0.64, 0.08, 0.74, "#26305e", 7, 0.75) +
    lineAlong(b, 0.71, 0.1, 0.72, "#26305e", 6, 0.7) +
    lineAlong(b, 0.78, 0.12, 0.7, "#26305e", 6, 0.6) +
    lineAlong(b, 0.85, 0.16, 0.66, "#26305e", 5, 0.5) +
    band(b, 0, 0.3, 0.2, 0.78, "#6c4fb0", 0.25),
};

const swordfish: Species = {
  id: "swordfish",
  viewBox: [0, 30, 1000, 330],
  body: { x0: 200, x1: 700, cy: 200, depth: 150, ped: 18, p: 1.05, q: 0.55, upper: 0.52, snoutDrop: -4 },
  tail: { span: 140, len: 120, notch: 0.9, sweep: 1 },
  colors: { back: "#221a2e", back2: "#4b3b55", mid: "#8b7f95", belly: "#d8d2dc", fin: "#2e2338", finTip: "#5c4b66", iris: "#9aa4b5" },
  fins: [
    { edge: "top", t0: 0.72, t1: 0.86, tip: [-55, -130], bow: 0.45, trail: 0.6 },
    { edge: "bot", t0: 0.5, t1: 0.6, tip: [-45, 60], bow: -0.3 },
  ],
  pectoral: { t: 0.82, f: 0.75, len: 120, angle: -28, width: 22 },
  eye: { t: 0.9, f: 0.4, r: 16 },
  gill: 0.8,
  bill: { len: 300, thick: 9, color: "#3a2f45" },
  scales: 0,
  sheen: 0.45,
  markings: (b) => band(b, 0, 0.35, 0, 1, "#130f1c", 0.35),
};

const mahi: Species = {
  id: "mahi-mahi",
  viewBox: [0, 30, 1000, 360],
  body: { x0: 210, x1: 955, cy: 210, depth: 210, ped: 18, p: 0.8, q: 0.28, upper: 0.55, snoutDrop: 30 },
  tail: { span: 150, len: 140, notch: 0.85, sweep: 0.7 },
  colors: { back: "#0e4d4a", back2: "#1f8a6a", mid: "#b5c94a", belly: "#f3d75c", fin: "#13597a", finTip: "#3fa0c8", tail: "#1f8a6a", iris: "#c7b26a" },
  fins: [
    { edge: "top", t0: 0.04, t1: 0.96, ribbon: (u) => 14 + 40 * Math.sin(Math.PI * Math.pow(u, 0.6)) * (1 - u * 0.4) + (u > 0.92 ? -(u - 0.92) * 300 : 0), lean: 0.4 },
    { edge: "bot", t0: 0.05, t1: 0.48, ribbon: (u) => 12 + 36 * Math.sin(Math.PI * u), lean: 0.5 },
  ],
  pectoral: { t: 0.78, f: 0.6, len: 110, angle: -6, width: 22, color: "#2b8fb4" },
  eye: { t: 0.93, f: 0.62, r: 13 },
  gill: 0.8,
  scales: 0.08,
  markings: (b) =>
    band(b, 0.5, 1.05, 0, 1, "#f6d23d", 0.55) +
    spots(b, 7, 46, 0.1, 0.9, 0.15, 0.6, "#2d7fd1", 0.75, 3, 6),
};

const sailfish: Species = {
  id: "sailfish",
  viewBox: [0, -60, 1000, 440],
  body: { x0: 210, x1: 700, cy: 230, depth: 110, ped: 14, p: 1.0, q: 0.6, upper: 0.5, snoutDrop: -4 },
  tail: { span: 140, len: 120, notch: 0.92, sweep: 1 },
  colors: { back: "#0b1f4f", back2: "#1e4aa0", mid: "#8fb0d6", belly: "#e7eef6", fin: "#173d93", finTip: "#2c6ad1", iris: "#b9c3d1" },
  fins: [
    {
      edge: "top",
      t0: 0.38,
      t1: 0.88,
      ribbon: (u) => 20 + 230 * Math.pow(Math.sin(Math.PI * Math.pow(u, 1.6)), 0.7) * (0.55 + u * 0.5) * (u > 0.93 ? (1 - u) / 0.07 : 1),
      lean: 0.15,
      fill: "url(#sailfish-sail)",
      opacity: 0.96,
    },
    { edge: "bot", t0: 0.38, t1: 0.5, tip: [-40, 70], bow: -0.2 },
  ],
  pectoral: { t: 0.83, f: 0.7, len: 110, angle: -18, width: 14 },
  eye: { t: 0.92, f: 0.4, r: 12 },
  gill: 0.82,
  bill: { len: 220, thick: 6, lower: 70 },
  scales: 0,
  markings: (b) =>
    bars(b, 0.12, 0.8, 16, 0.12, 0.62, "#9fd0ff", 0.55, 4) +
    `<defs><linearGradient id="sailfish-sail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a71e0"/><stop offset="1" stop-color="#0d2a6e"/></linearGradient></defs>`,
  head: (b) => {
    // sail spots over the dorsal fin
    let out = "";
    for (let i = 0; i < 26; i++) {
      const t = 0.56 + (i % 13) * 0.024;
      const p = topAt(b, t);
      const h = 40 + Math.floor(i / 13) * 70 + (i % 3) * 14 + (t - 0.56) * 300;
      out += `<circle cx="${f(p[0] - h * 0.15)}" cy="${f(p[1] - h)}" r="4.2" fill="#0a1d4e" fill-opacity=".7"/>`;
    }
    return out;
  },
};

const redSnapper: Species = {
  id: "red-snapper",
  viewBox: [0, 20, 1000, 420],
  body: { x0: 250, x1: 925, cy: 230, depth: 300, ped: 50, p: 0.95, q: 0.5, upper: 0.55, snoutDrop: 30 },
  tail: { span: 120, len: 140, notch: 0.4, sweep: 0.3, shape: "truncate" },
  colors: { back: "#9d1f24", back2: "#d8423a", mid: "#f07a68", belly: "#fbd8cf", fin: "#e0453b", finTip: "#ff8f7a", tail: "#c8352f", iris: "#d64a33", rim: "#7c1518" },
  fins: [
    { edge: "top", t0: 0.18, t1: 0.66, ribbon: (u) => 22 + 34 * Math.sin(Math.PI * Math.pow(u, 0.7)) + (u > 0.5 ? 10 * Math.sin(u * 40) : 0), lean: 0.3 },
    { edge: "bot", t0: 0.12, t1: 0.32, tip: [-40, 64], bow: -0.2 },
    { edge: "bot", t0: 0.6, t1: 0.64, tip: [-30, 60], bow: 0 },
  ],
  pectoral: { t: 0.68, f: 0.55, len: 150, angle: 14, width: 24, color: "#f28a74" },
  eye: { t: 0.86, f: 0.28, r: 17 },
  gill: 0.73,
  scales: 0.3,
  markings: (b) => band(b, 0.55, 1.05, 0.05, 1, "#ffffff", 0.35),
};

const mackerel: Species = {
  id: "indian-mackerel",
  viewBox: [0, 50, 1000, 300],
  body: { x0: 220, x1: 950, cy: 200, depth: 170, ped: 14, p: 1.2, q: 0.55, upper: 0.5, snoutDrop: 4 },
  tail: { span: 105, len: 120, notch: 0.85, sweep: 0.6 },
  colors: { back: "#103a4c", back2: "#2b6f84", mid: "#a7c3c9", belly: "#eef0ea", fin: "#c8a23a", finTip: "#e3c35f", tail: "#c8a23a", iris: "#cdbf8c" },
  fins: [
    { edge: "top", t0: 0.55, t1: 0.72, tip: [-70, -44], bow: 0.1, fill: "#335a68" },
    { edge: "top", t0: 0.36, t1: 0.46, tip: [-40, -34], bow: 0.1 },
    { edge: "bot", t0: 0.34, t1: 0.44, tip: [-36, 30], bow: -0.1 },
  ],
  finlets: { color: "#d4b24a", top: [0.06, 0.32, 5], bot: [0.06, 0.32, 5] },
  pectoral: { t: 0.78, f: 0.45, len: 80, angle: 10, width: 18 },
  eye: { t: 0.92, f: 0.42, r: 14 },
  gill: 0.8,
  scales: 0.12,
  markings: (b) =>
    lineAlong(b, 0.3, 0.06, 0.78, "#0c2a38", 4, 0.5) +
    spots(b, 3, 16, 0.4, 0.8, 0.12, 0.22, "#0a2230", 0.6, 3, 5) +
    band(b, 0.36, 0.42, 0.05, 0.85, "#e8c75a", 0.5),
};

const sardine: Species = {
  id: "sardine",
  viewBox: [0, 70, 1000, 260],
  body: { x0: 200, x1: 960, cy: 200, depth: 140, ped: 16, p: 1.15, q: 0.6, upper: 0.48, snoutDrop: 4 },
  tail: { span: 90, len: 120, notch: 0.85, sweep: 0.5 },
  colors: { back: "#0f3d5a", back2: "#1f7a96", mid: "#b9d6dd", belly: "#f4f7f8", fin: "#93a9b5", finTip: "#d6e1e6", tail: "#3b6f86", iris: "#d4c7a0" },
  fins: [
    { edge: "top", t0: 0.48, t1: 0.6, tip: [-40, -44], bow: 0.1 },
    { edge: "bot", t0: 0.18, t1: 0.3, tip: [-30, 24], bow: -0.1 },
    { edge: "bot", t0: 0.46, t1: 0.5, tip: [-24, 22], bow: 0 },
  ],
  pectoral: { t: 0.78, f: 0.7, len: 70, angle: -8, width: 14 },
  eye: { t: 0.92, f: 0.44, r: 13 },
  gill: 0.8,
  scales: 0.2,
  markings: (b) =>
    band(b, 0.32, 0.4, 0.04, 0.82, "#e7c565", 0.55) +
    band(b, 0.22, 0.3, 0.04, 0.82, "#46c1d6", 0.45) +
    spots(b, 11, 1, 0.74, 0.74, 0.22, 0.22, "#0a2a3c", 0.7, 6, 6),
};

const ribbonfish: Species = {
  id: "ribbonfish",
  viewBox: [0, 110, 1000, 190],
  body: { x0: 40, x1: 970, cy: 200, depth: 96, ped: 1, p: 0.6, q: 0.45, upper: 0.5, snoutDrop: 2 },
  tail: { span: 1, len: 40, notch: 0, sweep: 0, shape: "point" },
  colors: { back: "#6e7f93", back2: "#a9b8c8", mid: "#dfe7ef", belly: "#f6f9fb", fin: "#c8d3dd", finTip: "#eef3f7", iris: "#e5d46a", rim: "#56657a" },
  fins: [{ edge: "top", t0: 0.05, t1: 0.9, ribbon: (u) => 6 + 9 * Math.sin(Math.PI * u), lean: 0.5, opacity: 0.85 }],
  pectoral: { t: 0.86, f: 0.62, len: 30, angle: 10, width: 10 },
  eye: { t: 0.95, f: 0.36, r: 13 },
  gill: 0.86,
  scales: 0,
  sheen: 0.8,
  stretch: 3,
  markings: (b) => band(b, 0.1, 0.4, 0, 1, "#ffffff", 0.35),
  head: (b) => {
    // jaw and fangs
    const p = midAt(b, 0.985, 0.6);
    return `<path d="M${f(p[0] - 40)},${f(p[1])} L${f(p[0] + 10)},${f(p[1] - 2)}" stroke="#56657a" stroke-width="2"/><path d="M${f(p[0] - 10)},${f(p[1] - 2)} l3,6 l3,-6 M${f(p[0] - 22)},${f(p[1] - 1)} l2,5 l2,-5" stroke="#fff" stroke-width="1.2" fill="none"/>`;
  },
};

const grouper: Species = {
  id: "grouper",
  viewBox: [0, 30, 1000, 380],
  body: { x0: 220, x1: 940, cy: 220, depth: 250, ped: 60, p: 0.75, q: 0.45, upper: 0.52, snoutDrop: 22 },
  tail: { span: 110, len: 120, notch: 0, sweep: 0, shape: "round" },
  colors: { back: "#4a3523", back2: "#7a5a3a", mid: "#b5926a", belly: "#e8d8bf", fin: "#5d4430", finTip: "#9a7a55", iris: "#d0a050", rim: "#3a2818" },
  fins: [
    { edge: "top", t0: 0.15, t1: 0.7, ribbon: (u) => 24 + 22 * Math.sin(Math.PI * u) + (u > 0.45 ? 6 * Math.sin(u * 50) : 0), lean: 0.3 },
    { edge: "bot", t0: 0.12, t1: 0.3, tip: [-40, 56], bow: -0.2 },
  ],
  pectoral: { t: 0.7, f: 0.55, len: 110, angle: 4, width: 50 },
  eye: { t: 0.88, f: 0.3, r: 14 },
  gill: 0.74,
  scales: 0.25,
  markings: (b) => spots(b, 5, 90, 0, 1, 0.05, 0.95, "#2a1b10", 0.45, 4, 10),
};

const emperor: Species = {
  id: "emperor",
  viewBox: [0, 30, 1000, 380],
  body: { x0: 240, x1: 930, cy: 225, depth: 270, ped: 40, p: 0.95, q: 0.55, upper: 0.55, snoutDrop: 36 },
  tail: { span: 130, len: 140, notch: 0.6, sweep: 0.4 },
  colors: { back: "#5b6a52", back2: "#8f9c7e", mid: "#c8cdb8", belly: "#f1efe6", fin: "#c04a3b", finTip: "#e98a70", tail: "#a8553f", iris: "#c9a35a", rim: "#3e4836" },
  fins: [
    { edge: "top", t0: 0.18, t1: 0.66, ribbon: (u) => 20 + 30 * Math.sin(Math.PI * Math.pow(u, 0.7)), lean: 0.3 },
    { edge: "bot", t0: 0.12, t1: 0.3, tip: [-36, 52], bow: -0.2 },
  ],
  pectoral: { t: 0.68, f: 0.55, len: 140, angle: 12, width: 22, color: "#e07a5f" },
  eye: { t: 0.84, f: 0.28, r: 16 },
  gill: 0.72,
  scales: 0.3,
  markings: (b) => bars(b, 0.2, 0.7, 6, 0.1, 0.6, "#3e4836", 0.25, 10),
};

const threadfin: Species = {
  id: "threadfin-bream",
  viewBox: [0, 20, 1000, 360],
  body: { x0: 230, x1: 940, cy: 210, depth: 210, ped: 26, p: 1.0, q: 0.55, upper: 0.52, snoutDrop: 18 },
  tail: { span: 110, len: 140, notch: 0.75, sweep: 0.5, skew: 0.9 },
  colors: { back: "#c4566a", back2: "#e7889a", mid: "#f6c2c8", belly: "#fbeff0", fin: "#f0a3b0", finTip: "#ffd46a", tail: "#e98fa0", iris: "#d9b15b", rim: "#9b3a4c" },
  fins: [
    { edge: "top", t0: 0.2, t1: 0.66, ribbon: (u) => 16 + 18 * Math.sin(Math.PI * u), lean: 0.3, fill: "#f7c66a" },
    { edge: "bot", t0: 0.14, t1: 0.34, tip: [-30, 34], bow: -0.1 },
  ],
  pectoral: { t: 0.72, f: 0.6, len: 140, angle: 8, width: 18 },
  eye: { t: 0.87, f: 0.33, r: 17 },
  gill: 0.75,
  scales: 0.22,
  markings: (b) =>
    lineAlong(b, 0.45, 0.06, 0.8, "#f2c84b", 6, 0.8) +
    lineAlong(b, 0.6, 0.06, 0.78, "#f2c84b", 5, 0.7) +
    lineAlong(b, 0.74, 0.08, 0.74, "#f2c84b", 4, 0.6),
};

const marlin: Species = {
  ...sailfish,
  id: "marlin",
  viewBox: [0, 0, 1000, 400],
  body: { x0: 210, x1: 720, cy: 220, depth: 150, ped: 16, p: 1.05, q: 0.6, upper: 0.52, snoutDrop: -4 },
  colors: { back: "#0b1c3f", back2: "#1f3f86", mid: "#9fb6d4", belly: "#eef3f8", fin: "#13306e", finTip: "#2d5bb4", iris: "#b9c3d1" },
  fins: [
    { edge: "top", t0: 0.7, t1: 0.86, tip: [-30, -120], bow: 0.4, trail: 0.5 },
    { edge: "top", t0: 0.5, t1: 0.72, ribbon: (u) => 14 * (1 - u) + 6, lean: 0.2 },
    { edge: "bot", t0: 0.46, t1: 0.56, tip: [-40, 60], bow: -0.2 },
  ],
  bill: { len: 200, thick: 7, lower: 70 },
  markings: (b) => bars(b, 0.12, 0.78, 14, 0.12, 0.66, "#8fc4ff", 0.5, 4),
  head: undefined,
};

const leatherjacket: Species = {
  id: "leatherjacket",
  viewBox: [0, 40, 1000, 340],
  body: { x0: 240, x1: 935, cy: 210, depth: 220, ped: 34, p: 0.9, q: 0.7, upper: 0.5, snoutDrop: -10 },
  tail: { span: 95, len: 120, notch: 0, sweep: 0, shape: "round" },
  colors: { back: "#4f5b66", back2: "#7c8893", mid: "#b7bec4", belly: "#e4e6e2", fin: "#a68a52", finTip: "#d8bd7d", tail: "#6a6250", iris: "#d0b06a", rim: "#3a434c" },
  fins: [
    { edge: "top", t0: 0.1, t1: 0.5, ribbon: (u) => 8 + 18 * Math.sin(Math.PI * u), lean: 0.3 },
    { edge: "bot", t0: 0.1, t1: 0.5, ribbon: (u) => 8 + 18 * Math.sin(Math.PI * u), lean: 0.3 },
  ],
  pectoral: { t: 0.74, f: 0.48, len: 40, angle: 0, width: 14 },
  eye: { t: 0.84, f: 0.3, r: 13 },
  gill: 0.76,
  scales: 0,
  markings: (b) => spots(b, 9, 40, 0.1, 0.8, 0.1, 0.8, "#2f3942", 0.25, 3, 8),
  head: (b) => {
    const p = topAt(b, 0.82);
    return `<path d="M${f(p[0] + 4)},${f(p[1] + 4)} L${f(p[0] - 22)},${f(p[1] - 52)} L${f(p[0] - 10)},${f(p[1] + 6)} Z" fill="#3a434c"/>`;
  },
};

export const SPECIES: Species[] = [yellowfin, skipjack, swordfish, mahi, sailfish, marlin, redSnapper, mackerel, sardine, ribbonfish, grouper, emperor, threadfin, leatherjacket];
