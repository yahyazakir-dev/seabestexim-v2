import type { Metadata } from "next";
import { Parade } from "@/components/Parade";
import { ColdChain, ContactBand, Leadership, ProductLines, Reasons } from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Sea Best Exim | Frozen Seafood & Pre-Cooked Tuna Exporter, India" },
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Parade />
      <ProductLines />
      <ColdChain />
      <Reasons />
      <Leadership />
      <ContactBand />
    </>
  );
}
