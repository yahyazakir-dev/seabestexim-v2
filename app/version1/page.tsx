import type { Metadata } from "next";
import { Parade } from "@/components/Parade";
import { ColdChain, ContactBand, Leadership, ProductLines, Reasons } from "@/components/Sections";

// Test copy of the homepage for comparing iPhone behaviours: here each fish's video plays end to end on iOS
// (the homepage crossfades stills). Kept out of search results and the sitemap.
export const metadata: Metadata = {
  title: { absolute: "Sea Best Exim | Frozen Seafood & Pre-Cooked Tuna Exporter, India" },
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

export default function HomeVersion1() {
  return (
    <>
      <Parade iosMode="play" />
      <ProductLines />
      <ColdChain />
      <Reasons />
      <Leadership />
      <ContactBand />
    </>
  );
}
