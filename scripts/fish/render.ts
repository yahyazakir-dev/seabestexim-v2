import { bodyOutline, botAt, centre, f, fin, midAt, profile, ribbonFin, smooth, tail, topAt, xAt } from "./geometry.ts";
import type { BodySpec, Pt, TailSpec } from "./geometry.ts";

export interface FinSpec {
  edge: "top" | "bot";
  t0: number;
  t1: number;
  tip?: Pt;
  bow?: number;
  trail?: number;
  ribbon?: (u: number) => number;
  lean?: number;
  fill?: string; // fin colour override
  front?: boolean; // draw over the body
  opacity?: number;
}

export interface Species {
  id: string;
  viewBox: [number, number, number, number];
  body: BodySpec;
  tail: TailSpec;
  colors: {
    back: string;
    back2: string;
    mid: string;
    belly: string;
    fin: string;
    finTip: string;
    tail?: string;
    iris: string;
    rim?: string;
  };
  fins: FinSpec[];
  finlets?: { color: string; top?: [number, number, number]; bot?: [number, number, number] };
  pectoral: { t: number; f: number; len: number; angle: number; width: number; color?: string };
  eye: { t: number; f: number; r: number };
  gill: number;
  bill?: { len: number; thick: number; lower?: number; color?: string };
  scales?: number; // opacity of the scale texture
  sheen?: number;
  markings?: (b: BodySpec) => string; // raw SVG clipped to the body
  head?: (b: BodySpec) => string; // raw SVG drawn on the head (unclipped)
  stretch?: number; // tail sway amplitude in degrees
}

const hatch = (id: string, color: string, op: number, angle = 0, gap = 7) =>
  `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${color}" stroke-width="1.1" stroke-opacity="${op}"/></pattern>`;

export function render(s: Species): string {
  const b = s.body;
  const { path: body } = bodyOutline(b);
  const yTop = centre(b, 0.55) - profile(b, 0.55) * b.upper;
  const yBot = centre(b, 0.55) + profile(b, 0.55) * (1 - b.upper);
  const t = tail(b, s.tail);
  const c = s.colors;
  const id = s.id;
  const [vx, vy, vw, vh] = s.viewBox;

  const finPaths = s.fins.map((fs) =>
    fs.ribbon
      ? ribbonFin(b, fs.edge, fs.t0, fs.t1, fs.ribbon, fs.lean ?? 0)
      : fin(b, fs.edge, fs.t0, fs.t1, fs.tip ?? [0, 0], fs.bow ?? 0.25, fs.trail ?? 0.15),
  );

  // finlets: small triangles along the rear back and belly
  let finlets = "";
  if (s.finlets) {
    const mk = (edge: "top" | "bot", [a, z, n]: [number, number, number]) => {
      let out = "";
      for (let i = 0; i < n; i++) {
        const tt = a + ((z - a) * i) / Math.max(1, n - 1);
        const p = edge === "top" ? topAt(b, tt) : botAt(b, tt);
        const sz = 9 + (tt - a) * 30;
        const dir = edge === "top" ? -1 : 1;
        out += `<path d="M${f(p[0] + sz * 0.55)},${f(p[1] - dir * 2)} L${f(p[0] - sz * 0.9)},${f(p[1] + dir * sz * 0.95)} L${f(p[0] - sz * 0.45)},${f(p[1] - dir * 2)} Z"/>`;
      }
      return out;
    };
    finlets = `<g fill="${s.finlets.color}" stroke="${c.back}" stroke-opacity=".35" stroke-width=".8">${s.finlets.top ? mk("top", s.finlets.top) : ""}${s.finlets.bot ? mk("bot", s.finlets.bot) : ""}</g>`;
  }

  // pectoral fin: a blade from the gill backward
  const pr = midAt(b, s.pectoral.t, s.pectoral.f);
  const ang = (s.pectoral.angle * Math.PI) / 180;
  const tipP: Pt = [pr[0] - Math.cos(ang) * s.pectoral.len, pr[1] - Math.sin(ang) * s.pectoral.len];
  const w = s.pectoral.width;
  const pect = `M${f(pr[0])},${f(pr[1] - w * 0.5)} C${f(pr[0] - s.pectoral.len * 0.3)},${f(pr[1] - w * 0.9 - Math.sin(ang) * s.pectoral.len * 0.3)} ${f(tipP[0] + s.pectoral.len * 0.15)},${f(tipP[1] - w * 0.2)} ${f(tipP[0])},${f(tipP[1])} C${f(tipP[0] + s.pectoral.len * 0.35)},${f(tipP[1] + w * 0.5)} ${f(pr[0] - s.pectoral.len * 0.25)},${f(pr[1] + w * 0.6)} ${f(pr[0])},${f(pr[1] + w * 0.5)} Z`;

  // eye
  const e = midAt(b, s.eye.t, s.eye.f);
  const r = s.eye.r;

  // gill cover: a soft C-curve opening toward the tail
  const gT = topAt(b, s.gill);
  const gB = botAt(b, s.gill);
  const gh = gB[1] - gT[1];
  const gx = gT[0];
  const gill = `M${f(gx + gh * 0.08)},${f(gT[1] + gh * 0.16)} C${f(gx - gh * 0.16)},${f(gT[1] + gh * 0.4)} ${f(gx - gh * 0.14)},${f(gT[1] + gh * 0.7)} ${f(gx + gh * 0.12)},${f(gT[1] + gh * 0.9)}`;
  const gill2 = `M${f(gx + gh * 0.2)},${f(gT[1] + gh * 0.22)} C${f(gx + gh * 0.02)},${f(gT[1] + gh * 0.45)} ${f(gx + gh * 0.04)},${f(gT[1] + gh * 0.68)} ${f(gx + gh * 0.22)},${f(gT[1] + gh * 0.84)}`;

  // mouth line
  const sn: Pt = [b.x1, centre(b, 1)];
  const mouth = `M${f(sn[0] - 2)},${f(sn[1] + 2)} Q${f(sn[0] - (b.x1 - b.x0) * 0.035)},${f(sn[1] + 6)} ${f(sn[0] - (b.x1 - b.x0) * 0.065)},${f(sn[1] + 4)}`;

  // bill (swordfish, sailfish, marlin)
  let bill = "";
  if (s.bill) {
    const bt = s.bill.thick;
    const bl = s.bill.len;
    const bx = b.x1 - 30;
    const by = centre(b, 1) - 4;
    bill = `<path d="M${f(bx)},${f(by - bt)} C${f(bx + bl * 0.4)},${f(by - bt * 0.75)} ${f(bx + bl * 0.85)},${f(by - bt * 0.25)} ${f(bx + bl)},${f(by + 1)} C${f(bx + bl * 0.85)},${f(by + bt * 0.35)} ${f(bx + bl * 0.4)},${f(by + bt * 0.75)} ${f(bx)},${f(by + bt * 1.2)} Z" fill="url(#${id}-bill)"/>`;
    if (s.bill.lower) {
      bill += `<path d="M${f(bx)},${f(by + bt * 0.9)} Q${f(bx + s.bill.lower * 0.6)},${f(by + bt * 1.3)} ${f(bx + s.bill.lower)},${f(by + bt * 0.9)} L${f(bx)},${f(by + bt * 2.2)} Z" fill="${c.back}" opacity=".85"/>`;
    }
  }

  const sway = s.stretch ?? 7;
  const sheen = s.sheen ?? 0.55;
  const scales = s.scales ?? 0.16;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-hidden="true">
<style>
.tail{transform-origin:${f(t.pivot[0])}px ${f(t.pivot[1])}px;animation:sway 1.5s ease-in-out infinite alternate}
.fin2{transform-origin:${f(pr[0])}px ${f(pr[1])}px;animation:flap 1.5s ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(${-sway}deg) skewY(2deg)}to{transform:rotate(${sway}deg) skewY(-2deg)}}
@keyframes flap{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}
@media (prefers-reduced-motion:reduce){.tail,.fin2{animation:none}}
</style>
<defs>
<linearGradient id="${id}-body" gradientUnits="userSpaceOnUse" x1="0" y1="${f(yTop)}" x2="0" y2="${f(yBot)}">
<stop offset="0" stop-color="${c.back}"/><stop offset=".3" stop-color="${c.back2}"/><stop offset=".52" stop-color="${c.mid}"/><stop offset=".74" stop-color="${c.belly}"/><stop offset=".92" stop-color="${c.belly}"/><stop offset="1" stop-color="${c.mid}"/>
</linearGradient>
<radialGradient id="${id}-sheen" gradientUnits="userSpaceOnUse" cx="${f(xAt(b, 0.62))}" cy="${f(yTop + (yBot - yTop) * 0.42)}" r="${f((b.x1 - b.x0) * 0.42)}" gradientTransform="translate(${f(xAt(b, 0.62))} ${f(yTop + (yBot - yTop) * 0.42)}) scale(1 .3) translate(${f(-xAt(b, 0.62))} ${f(-(yTop + (yBot - yTop) * 0.42))})">
<stop offset="0" stop-color="#fff" stop-opacity="${sheen}"/><stop offset=".55" stop-color="#fff" stop-opacity="${sheen * 0.25}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
<linearGradient id="${id}-shade" gradientUnits="userSpaceOnUse" x1="${f(b.x0)}" y1="0" x2="${f(b.x1)}" y2="0">
<stop offset="0" stop-color="${c.back}" stop-opacity=".55"/><stop offset=".28" stop-color="${c.back}" stop-opacity="0"/><stop offset=".86" stop-color="${c.back}" stop-opacity="0"/><stop offset="1" stop-color="${c.back}" stop-opacity=".3"/>
</linearGradient>
<linearGradient id="${id}-fin" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c.fin}"/><stop offset="1" stop-color="${c.finTip}"/>
</linearGradient>
<linearGradient id="${id}-tail" gradientUnits="userSpaceOnUse" x1="${f(b.x0)}" y1="0" x2="${f(b.x0 - s.tail.len)}" y2="0">
<stop offset="0" stop-color="${c.tail ?? c.back}"/><stop offset="1" stop-color="${c.finTip}"/>
</linearGradient>
<linearGradient id="${id}-bill" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${s.bill?.color ?? c.back}"/><stop offset="1" stop-color="${c.back2}"/>
</linearGradient>
<radialGradient id="${id}-iris" cx=".4" cy=".35" r=".7">
<stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${c.iris}"/><stop offset="1" stop-color="#1a1a1a"/>
</radialGradient>
<pattern id="${id}-scale" width="14" height="10" patternUnits="userSpaceOnUse">
<path d="M0,10 Q7,2 14,10" fill="none" stroke="#fff" stroke-width=".9" stroke-opacity="${scales}"/>
<path d="M-7,5 Q0,-3 7,5 M7,5 Q14,-3 21,5" fill="none" stroke="#000" stroke-width=".7" stroke-opacity="${scales * 0.5}"/>
</pattern>
${hatch(`${id}-rays`, "#000", 0.16, -20, 6)}
<clipPath id="${id}-clip"><path d="${body}"/></clipPath>
</defs>
<g class="tail"><path d="${t.path}" fill="url(#${id}-tail)"/><path d="${t.path}" fill="url(#${id}-rays)"/></g>
${s.fins
  .map((fs, i) => (fs.front ? "" : `<path d="${finPaths[i]}" fill="${fs.fill ?? `url(#${id}-fin)`}" opacity="${fs.opacity ?? 1}"/><path d="${finPaths[i]}" fill="url(#${id}-rays)" stroke="${c.back}" stroke-opacity=".25" stroke-width="1"/>`))
  .join("")}
${finlets}
${bill}
<path d="${body}" fill="url(#${id}-body)"/>
<g clip-path="url(#${id}-clip)">
${s.markings ? s.markings(b) : ""}
<path d="${body}" fill="url(#${id}-scale)"/>
<path d="${body}" fill="url(#${id}-shade)"/>
<path d="${body}" fill="url(#${id}-sheen)"/>
<path d="${smooth(Array.from({ length: 30 }, (_, i) => midAt(b, 0.04 + i * 0.026, 0.42 - Math.sin(i / 9) * 0.04)))}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.2"/>
<path d="${gill}" fill="none" stroke="${c.rim ?? c.back}" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>
<path d="${gill2}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
</g>
<path d="${body}" fill="none" stroke="${c.rim ?? c.back}" stroke-opacity=".5" stroke-width="1.4"/>
${s.fins
  .map((fs, i) => (fs.front ? `<path d="${finPaths[i]}" fill="${fs.fill ?? `url(#${id}-fin)`}" opacity="${fs.opacity ?? 1}"/>` : ""))
  .join("")}
${s.head ? s.head(b) : ""}
<path d="${mouth}" fill="none" stroke="${c.rim ?? c.back}" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
<g class="fin2"><path d="${pect}" fill="${s.pectoral.color ?? `url(#${id}-fin)`}" opacity=".92"/><path d="${pect}" fill="url(#${id}-rays)"/></g>
<circle cx="${f(e[0])}" cy="${f(e[1])}" r="${f(r * 1.28)}" fill="${c.back}" fill-opacity=".22"/>
<circle cx="${f(e[0])}" cy="${f(e[1])}" r="${f(r)}" fill="url(#${id}-iris)"/>
<circle cx="${f(e[0] + r * 0.08)}" cy="${f(e[1] + r * 0.04)}" r="${f(r * 0.55)}" fill="#0b0d12"/>
<circle cx="${f(e[0] - r * 0.25)}" cy="${f(e[1] - r * 0.3)}" r="${f(r * 0.2)}" fill="#fff" fill-opacity=".95"/>
<circle cx="${f(e[0] + r * 0.3)}" cy="${f(e[1] + r * 0.28)}" r="${f(r * 0.08)}" fill="#fff" fill-opacity=".6"/>
</svg>`;
}

// helpers for markings
export const band = (b: BodySpec, f0: number, f1: number, t0: number, t1: number, color: string, op = 1, blur = "") => {
  const n = 24;
  const up: Pt[] = [];
  const lo: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    up.push(midAt(b, t, f0));
    lo.push(midAt(b, t, f1));
  }
  return `<path d="${smooth([...up, ...lo.reverse()], true)}" fill="${color}" fill-opacity="${op}" ${blur}/>`;
};

export const lineAlong = (b: BodySpec, fr: number, t0: number, t1: number, color: string, width: number, op = 1) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) pts.push(midAt(b, t0 + ((t1 - t0) * i) / 20, fr));
  return `<path d="${smooth(pts)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-opacity="${op}" stroke-linecap="round"/>`;
};

export const bars = (b: BodySpec, t0: number, t1: number, n: number, f0: number, f1: number, color: string, op: number, width: number) => {
  let out = "";
  for (let i = 0; i < n; i++) {
    const t = t0 + ((t1 - t0) * i) / Math.max(1, n - 1);
    const a = midAt(b, t, f0);
    const z = midAt(b, t - 0.01, f1);
    out += `<path d="M${f(a[0])},${f(a[1])} Q${f(a[0] - 6)},${f((a[1] + z[1]) / 2)} ${f(z[0])},${f(z[1])}" stroke="${color}" stroke-opacity="${op}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
  }
  return out;
};

export const spots = (b: BodySpec, seed: number, n: number, t0: number, t1: number, f0: number, f1: number, color: string, op: number, r0: number, r1: number) => {
  let x = seed;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  let out = "";
  for (let i = 0; i < n; i++) {
    const p = midAt(b, t0 + (t1 - t0) * rnd(), f0 + (f1 - f0) * rnd());
    out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r0 + (r1 - r0) * rnd())}" fill="${color}" fill-opacity="${op}"/>`;
  }
  return out;
};
