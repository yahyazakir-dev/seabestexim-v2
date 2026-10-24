import images from "@/lib/images.json";
import fishRatios from "@/lib/fish-photos.json";

type Manifest = Record<string, { w: number; h: number; widths: number[] }>;
const M = images as Manifest;

// Responsive WebP photo from the generated variants in /public/img.
export function Photo({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  caption,
}: {
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  caption?: string;
}) {
  const m = M[name];
  if (!m) throw new Error(`Unknown image ${name}`);
  const largest = m.widths[m.widths.length - 1];
  return (
    <figure className={`photo ${className ?? ""}`}>
      <img
        src={`/img/${name}-${largest}.webp`}
        srcSet={m.widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(", ")}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// Real photograph of the species, cut out on transparent (public/fish-photo, see scripts/fish-video).
export function Fish({ slug, className, alt = "", eager = false, sizes = "(max-width: 700px) 90vw, 33vw" }: { slug: string; className?: string; alt?: string; eager?: boolean; sizes?: string }) {
  const ratio = (fishRatios as Record<string, number>)[slug] ?? 3;
  return (
    <img
      className={className}
      src={`/fish-photo/${slug}-1200.webp`}
      srcSet={`/fish-photo/${slug}-640.webp 640w, /fish-photo/${slug}-1200.webp 1200w`}
      sizes={sizes}
      width={1200}
      height={Math.round(1200 / ratio)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

// Bathymetric contour lines: the sea-chart texture used on dark grounds.
export function Contours({ seed = 1, className = "contours" }: { seed?: number; className?: string }) {
  const lines: string[] = [];
  for (let i = 0; i < 14; i++) {
    const y = 40 + i * 52;
    const a = 26 + ((i * 7 + seed * 13) % 30);
    const p = (i * 0.7 + seed) % 6.28;
    let d = `M-20 ${y}`;
    for (let x = 0; x <= 1460; x += 60) {
      const yy = y + Math.sin(x / 210 + p) * a + Math.sin(x / 90 + p * 2) * (a / 4);
      d += ` L${x} ${yy.toFixed(1)}`;
    }
    lines.push(d);
  }
  return (
    <svg className={className} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.4 : 0.8} strokeLinejoin="round" />
      ))}
    </svg>
  );
}
