// Product range from the customer's Product_lists.docx.

export interface Species {
  slug: string; // also the fish illustration file in /public/fish
  name: string;
  latin: string;
  forms: string[];
  note: string;
}

export const FORM_GLOSSARY: Record<string, string> = {
  "Whole round": "The whole fish, ungutted, frozen as caught.",
  "GG": "Gilled and gutted.",
  "G&G": "Gilled and gutted.",
  "HLG": "Headless and gutted.",
  "H&G": "Headed and gutted.",
  "HGT": "Headed, gutted, tail off.",
  "Raw loins": "Boneless raw loins cut from the whole fish.",
  "Fillet": "Boneless side fillets.",
  "Skin-on fillet": "Boneless side fillets with the skin left on.",
  "Skinless fillet": "Boneless side fillets with the skin removed.",
  "Cubes": "Skinless, boneless cubes cut from clean loins.",
  "Steaks": "Cross-cut portions from the loin.",
  "Portions": "Skinless, boneless portions cut to a weight band.",
  "Skinless": "Skin removed.",
};

export const frozenMain: Species[] = [
  {
    slug: "yellowfin-tuna",
    name: "Yellowfin Tuna",
    latin: "Thunnus albacares",
    forms: ["Whole round", "GG", "HLG", "Raw loins"],
    note: "Firm, deep-red meat for loins, steaks and processing.",
  },
  {
    slug: "skipjack-tuna",
    name: "Skipjack Tuna",
    latin: "Katsuwonus pelamis",
    forms: ["Whole round", "HLG", "Raw loins"],
    note: "The cannery and pre-cooking staple, landed year-round.",
  },
  {
    slug: "swordfish",
    name: "Swordfish",
    latin: "Xiphias gladius",
    forms: ["Whole round", "HGT", "Raw loins"],
    note: "Dense, meaty flesh prized for steaks and cubes.",
  },
  {
    slug: "mahi-mahi",
    name: "Mahi-Mahi",
    latin: "Coryphaena hippurus",
    forms: ["Whole round", "G&G", "Skin-on fillet", "Skinless fillet"],
    note: "Mild, sweet white fillets for food service and retail.",
  },
  {
    slug: "marlin",
    name: "Marlin",
    latin: "Istiompax indica, Makaira nigricans",
    forms: ["Whole round", "HGT"],
    note: "Large billfish with firm meat for steaks and cubes.",
  },
  {
    slug: "sailfish",
    name: "Sailfish",
    latin: "Istiophorus platypterus",
    forms: ["Whole round", "H&G", "Cubes", "Portions"],
    note: "Indian Ocean billfish, supplied whole or dressed.",
  },
  {
    slug: "indian-mackerel",
    name: "Indian Mackerel",
    latin: "Rastrelliger kanagurta",
    forms: ["Whole round"],
    note: "Rich, oily pelagic fish, block or IQF frozen.",
  },
  {
    slug: "sardine",
    name: "Sardine",
    latin: "Sardinella longiceps",
    forms: ["Whole round"],
    note: "Indian oil sardine for canning, bait and retail.",
  },
  {
    slug: "ribbonfish",
    name: "Ribbonfish",
    latin: "Trichiurus lepturus",
    forms: ["Whole round", "HGT"],
    note: "Silver hairtail, a favourite in East Asian markets.",
  },
  {
    slug: "leatherjacket",
    name: "Leatherjacket",
    latin: "Aluterus monoceros",
    forms: ["Whole round", "HGT", "Skinless"],
    note: "Firm white flesh, supplied whole, dressed or skinned.",
  },
];

export const frozenAlso: Species[] = [
  { slug: "grouper", name: "Grouper", latin: "Epinephelus spp.", forms: ["Whole round"], note: "Reef fish with firm, flaky white meat." },
  { slug: "red-snapper", name: "Red Snapper", latin: "Lutjanus spp.", forms: ["Whole round", "Skin-on fillet", "Skinless fillet"], note: "Bright red skin and sweet white flesh." },
  { slug: "emperor", name: "Emperor Fish", latin: "Lethrinus spp.", forms: ["Whole round"], note: "Lean, mild reef fish for whole-fish markets." },
  { slug: "threadfin-bream", name: "Japanese Threadfin Bream", latin: "Nemipterus japonicus", forms: ["Whole round"], note: "Small pink bream, a surimi and retail favourite." },
];

export interface Line {
  name: string;
  items: string[];
}

export const precooked: Line[] = [
  { name: "Skipjack Tuna", items: ["Pre-cooked skipjack tuna loins, vacuum packed, frozen", "Pre-cooked skipjack tuna flakes, vacuum packed, frozen"] },
  { name: "Yellowfin Tuna", items: ["Pre-cooked yellowfin tuna loins, vacuum packed, frozen", "Pre-cooked yellowfin tuna flakes, vacuum packed, frozen"] },
];

// Raw materials for pet food, per the customer: frozen and cooked tuna meat, frozen belly meat and other by-products.
export const petfood: { name: string; raw: string[]; cooked: string[] }[] = [
  {
    name: "Skipjack Tuna",
    raw: ["Frozen tuna meat", "Frozen belly meat", "Other by-products"],
    cooked: ["Cooked tuna meat, vacuum packed"],
  },
  {
    name: "Yellowfin Tuna",
    raw: ["Frozen tuna meat", "Frozen belly meat", "Other by-products"],
    cooked: ["Cooked tuna meat, vacuum packed"],
  },
];

export const valueAdded: { species: string; cuts: string[] }[] = [
  { species: "Yellowfin Tuna", cuts: ["Cubes", "Steaks"] },
  { species: "Swordfish", cuts: ["Cubes", "Steaks"] },
  { species: "Marlin", cuts: ["Cubes", "Steaks"] },
  { species: "Mahi-Mahi", cuts: ["Cubes", "Skin-on fillet", "Skinless fillet"] },
  { species: "Sailfish", cuts: ["Cubes", "Portions"] },
  { species: "Red Snapper", cuts: ["Cubes", "Skin-on fillet", "Skinless fillet"] },
];

// Order of the species in the homepage swim sequence.
export const parade = ["yellowfin-tuna", "skipjack-tuna", "swordfish", "mahi-mahi", "sailfish", "red-snapper", "ribbonfish"];

export const allSpecies = [...frozenMain, ...frozenAlso];
export const speciesBySlug = (slug: string) => allSpecies.find((s) => s.slug === slug)!;
