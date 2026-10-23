// Parametric fish anatomy. Every fish faces right (swims left to right) in a
// 1000-unit-wide box; the body runs from the caudal peduncle (t = 0) to the
// snout (t = 1).

export type Pt = [number, number];

export interface BodySpec {
  x0: number; // peduncle x
  x1: number; // snout x
  cy: number; // centre line y at the deepest point
  depth: number; // maximum body depth
  ped: number; // depth at the peduncle
  p: number; // taper toward the tail (higher = longer, thinner rear)
  q: number; // taper toward the snout (lower = blunter head)
  upper: number; // share of depth above the centre line (0.5 = symmetric)
  snoutDrop: number; // snout sits this far below the centre line
  peak?: number; // t of maximum depth (0..1), default derived from p/q
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function profile(b: BodySpec, t: number): number {
  // Beta-like hump, normalised so the peak equals 1.
  const tt = clamp(t, 0, 1);
  const raw = Math.pow(tt, b.p) * Math.pow(1 - tt, b.q);
  const tp = b.p / (b.p + b.q);
  const max = Math.pow(tp, b.p) * Math.pow(1 - tp, b.q);
  const h = raw / max;
  // keep the peduncle from collapsing to a point
  const pedBlend = Math.pow(1 - tt, 6);
  return b.ped * pedBlend + (b.depth - b.ped * pedBlend) * h * (tt < 0.98 ? 1 : 1);
}

export function centre(b: BodySpec, t: number): number {
  // centre line bends down toward the snout so the mouth sits low
  return b.cy + b.snoutDrop * Math.pow(clamp(t, 0, 1), 3);
}

export const xAt = (b: BodySpec, t: number) => b.x0 + (b.x1 - b.x0) * t;

export function topAt(b: BodySpec, t: number): Pt {
  return [xAt(b, t), centre(b, t) - profile(b, t) * b.upper];
}
export function botAt(b: BodySpec, t: number): Pt {
  return [xAt(b, t), centre(b, t) + profile(b, t) * (1 - b.upper)];
}
export function midAt(b: BodySpec, t: number, f = 0.5): Pt {
  const [x, y0] = topAt(b, t);
  const [, y1] = botAt(b, t);
  return [x, y0 + (y1 - y0) * f];
}

// Catmull-Rom to cubic Bezier through the points.
export function smooth(pts: Pt[], closed = false, k = 1): string {
  if (pts.length < 2) return "";
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < P.length - 2; i++) {
    const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? d + " Z" : d;
}

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

export function bodyOutline(b: BodySpec, n = 48): { top: Pt[]; bot: Pt[]; path: string } {
  const top: Pt[] = [];
  const bot: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    top.push(topAt(b, t));
    bot.push(botAt(b, t));
  }
  // snout point, slightly rounded
  const snout: Pt = [b.x1, centre(b, 1)];
  const outline = [...top.slice(0, -1), snout, ...bot.slice(0, -1).reverse()];
  return { top, bot, path: smooth(outline, true) };
}

// A fin rooted on the body edge between t0 and t1, with its tip at an
// offset from the root midpoint. bow bends the leading and trailing edges.
export function fin(
  b: BodySpec,
  edge: "top" | "bot",
  t0: number,
  t1: number,
  tip: Pt,
  bow = 0.25,
  trail = 0.15,
  inset = 4,
): string {
  const at = edge === "top" ? topAt : botAt;
  const s = edge === "top" ? 1 : -1;
  const a = at(b, t0); // rear root
  const c = at(b, t1); // front root
  a[1] += inset * s;
  c[1] += inset * s;
  const T: Pt = [c[0] + tip[0], c[1] + tip[1]];
  // leading edge from front root to tip bows outward; trailing edge is concave
  const lead: Pt = [c[0] + (T[0] - c[0]) * 0.35 + bow * (T[1] - c[1]) * -0.6, c[1] + (T[1] - c[1]) * 0.55 + bow * (T[0] - c[0]) * 0.25];
  const tr: Pt = [a[0] + (T[0] - a[0]) * 0.6 + trail * 60, a[1] + (T[1] - a[1]) * 0.35];
  return `M${f(c[0])},${f(c[1])} Q${f(lead[0])},${f(lead[1])} ${f(T[0])},${f(T[1])} Q${f(tr[0])},${f(tr[1])} ${f(a[0])},${f(a[1])} Z`;
}

// Long continuous fin (mahi dorsal, ribbonfish fringe, sailfish sail):
// root follows the body edge, the free edge follows a height function.
export function ribbonFin(
  b: BodySpec,
  edge: "top" | "bot",
  t0: number,
  t1: number,
  height: (u: number) => number,
  lean = 0,
  n = 28,
): string {
  const at = edge === "top" ? topAt : botAt;
  const s = edge === "top" ? -1 : 1;
  const root: Pt[] = [];
  const free: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const t = t0 + (t1 - t0) * u;
    const p = at(b, t);
    root.push([p[0], p[1] - s * 3]);
    const h = height(u);
    free.push([p[0] - lean * h, p[1] + s * h]);
  }
  return smooth([...root, ...free.reverse()], true, 0.9);
}

export interface TailSpec {
  span: number; // half height of the lobes
  len: number; // how far the lobes reach back
  notch: number; // depth of the fork (0 = straight, 1 = deep)
  sweep: number; // how much the lobes curve backward (lunate)
  shape?: "fork" | "round" | "truncate" | "point";
  skew?: number; // positive = longer upper lobe
}

export function tail(b: BodySpec, s: TailSpec): { path: string; pivot: Pt } {
  const top = topAt(b, 0.012);
  const bot = botAt(b, 0.012);
  const px = b.x0 + 6;
  const cy = (top[1] + bot[1]) / 2;
  const skew = s.skew ?? 0;
  const shape = s.shape ?? "fork";
  const U: Pt = [px - s.len * (1 + skew * 0.3), cy - s.span * (1 + skew * 0.25)];
  const L: Pt = [px - s.len * (1 - skew * 0.3), cy + s.span * (1 - skew * 0.25)];
  const N: Pt = [px - s.len * (1 - s.notch) * 0.95, cy];
  let d: string;
  if (shape === "round") {
    d = `M${f(px)},${f(top[1] + 2)} C${f(px - s.len * 0.5)},${f(cy - s.span * 1.05)} ${f(px - s.len * 1.08)},${f(cy - s.span * 0.75)} ${f(px - s.len)},${f(cy)} C${f(px - s.len * 1.08)},${f(cy + s.span * 0.75)} ${f(px - s.len * 0.5)},${f(cy + s.span * 1.05)} ${f(px)},${f(bot[1] - 2)} Z`;
  } else if (shape === "truncate") {
    d = `M${f(px)},${f(top[1] + 2)} C${f(px - s.len * 0.45)},${f(cy - s.span * 0.7)} ${f(U[0])},${f(U[1] + 8)} ${f(U[0])},${f(U[1])} C${f(N[0] - 6)},${f(cy - s.span * 0.4)} ${f(N[0] - 6)},${f(cy + s.span * 0.4)} ${f(L[0])},${f(L[1])} C${f(L[0])},${f(L[1] - 8)} ${f(px - s.len * 0.45)},${f(cy + s.span * 0.7)} ${f(px)},${f(bot[1] - 2)} Z`;
  } else if (shape === "point") {
    d = `M${f(px)},${f(top[1] + 1)} Q${f(px - s.len * 0.6)},${f(cy - s.span * 0.2)} ${f(px - s.len)},${f(cy)} Q${f(px - s.len * 0.6)},${f(cy + s.span * 0.2)} ${f(px)},${f(bot[1] - 1)} Z`;
  } else {
    const sw = s.sweep;
    // outer edges sweep out to the lobe tips; inner edges return well inside
    // them so each lobe keeps real width before meeting at the fork
    d =
      `M${f(px)},${f(top[1] + 2)}` +
      ` C${f(px - s.len * 0.28)},${f(cy - s.span * 0.4)} ${f(U[0] + s.len * (0.12 + sw * 0.1))},${f(U[1] + s.span * 0.06)} ${f(U[0])},${f(U[1])}` +
      ` C${f(U[0] + s.len * (0.42 + sw * 0.1))},${f(U[1] + s.span * 0.5)} ${f(N[0] - s.len * 0.08)},${f(cy - s.span * 0.2)} ${f(N[0])},${f(N[1])}` +
      ` C${f(N[0] - s.len * 0.08)},${f(cy + s.span * 0.2)} ${f(L[0] + s.len * (0.42 + sw * 0.1))},${f(L[1] - s.span * 0.5)} ${f(L[0])},${f(L[1])}` +
      ` C${f(L[0] + s.len * (0.12 + sw * 0.1))},${f(L[1] - s.span * 0.06)} ${f(px - s.len * 0.28)},${f(cy + s.span * 0.4)} ${f(px)},${f(bot[1] - 2)} Z`;
  }
  return { path: d, pivot: [px + 4, cy] };
}
