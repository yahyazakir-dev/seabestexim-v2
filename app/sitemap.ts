import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/pre-cooked-tuna/", priority: 0.9 },
    { path: "/frozen-seafood/", priority: 0.9 },
    { path: "/pet-food/", priority: 0.8 },
    { path: "/about/", priority: 0.7 },
  ];
  return pages.map((p) => ({ url: `${site.url}${p.path}`, lastModified: new Date(), changeFrequency: "monthly", priority: p.priority }));
}
