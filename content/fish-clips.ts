// Scroll-scrubbed clips for the home parade (public/fish-video/<slug>.mp4).
// Each clip was generated with Veo 3.1 in Google Flow, starting from a real
// Wikimedia Commons photograph of the species (see scripts/fish-video/README.md).
//
// Product rule from the customer: tuna is sold frozen AND as pre-cooked loins,
// so the tuna clips split the fish (pre-cooked loins left, frozen right).
// Every other species is frozen only.

export type Process = "frozen" | "both";

export interface FishClip {
  process: Process;
  /** forms shown in the parade instead of the frozen forms */
  forms?: string[];
  note?: string;
  /** how the species is packed, shown under the forms */
  pack: string;
  /** product photos (public/img names) that animate in beside the species */
  products?: { label: string; img: string }[];
  /** the clip goes on to cut the frozen fish into its products (scripts/fish-video/cut/);
   *  one label per section, with its centre as a % of the frame width */
  cuts?: { label: string; x: number }[];
  /** source photo the clip was generated from (kept for our records, not shown) */
  photo: { by: string; license: string; href: string };
}

const ifremer = (by: string, href: string) => ({ by: `${by} / Ifremer`, license: "CC BY 4.0", href });

export const fishClips: Record<string, FishClip> = {
  "yellowfin-tuna": {
    pack: "Whole fish frozen and packed to agreed sizes and grades; pre-cooked loins vacuum packed and kept frozen to shipment.",
    process: "both",
    forms: ["Whole round", "GG", "HLG", "Raw loins", "Pre-cooked loins", "Cubes", "Steaks"],
    products: [
      { label: "Pre-cooked loins", img: "loins-bag" },
      { label: "Raw loins", img: "frozen-loins" },
    ],
    note: "Supplied frozen, or cooked and cleaned into boneless pre-cooked loins.",
    photo: ifremer("Hugues Evano", "https://commons.wikimedia.org/wiki/File:Thon_albacore_(Thunnus_albacares)_(Ifremer_00764-87616).jpg"),
  },
  "skipjack-tuna": {
    pack: "Whole round frozen for canneries and processors; pre-cooked loins vacuum packed, frozen and packed to your specification.",
    process: "both",
    forms: ["Whole round", "HLG", "Raw loins", "Pre-cooked loins", "Pre-cooked flakes"],
    products: [
      { label: "Pre-cooked loins", img: "loins-bag" },
      { label: "Pre-cooked flakes", img: "flakes-bag" },
    ],
    note: "The pre-cooking staple: frozen whole, or cleaned into boneless pre-cooked loins.",
    photo: {
      by: "Jeffrey Williams / Smithsonian NMNH",
      license: "Public domain",
      href: "https://commons.wikimedia.org/wiki/File:Katsuwonus_pelamis_(USNM-443178).jpg",
    },
  },
  swordfish: {
    pack: "Frozen whole round or dressed (HGT), with loins cut to order and packed to agreed sizes and grades.",
    forms: ["Whole round", "HGT", "Raw loins", "Cubes", "Steaks"],
    process: "frozen",
    cuts: [{ label: "Cubes", x: 33 }, { label: "Steaks", x: 47 }, { label: "Frozen", x: 64 }],
    photo: ifremer("Hugues Evano", "https://commons.wikimedia.org/wiki/File:Espadon_(Xiphias_gladius)_(Ifremer_00764-87622).jpg"),
  },
  "mahi-mahi": {
    pack: "Frozen whole, gilled and gutted, or as fillets, graded by size and packed to your specification.",
    forms: ["Whole round", "G&G", "Skin-on fillet", "Skinless fillet", "Cubes"],
    process: "frozen",
    cuts: [{ label: "Cubes", x: 34 }, { label: "Fillet", x: 59 }, { label: "Frozen", x: 81 }],
    photo: ifremer("Hugues Evano", "https://commons.wikimedia.org/wiki/File:Coryph%C3%A8ne_commune_(Coryphaena_hippurus)_(Ifremer_00763-87546).jpg"),
  },
  sailfish: {
    pack: "Frozen whole or headed and gutted, or cut into skinless, boneless cubes and portions.",
    forms: ["Whole round", "H&G", "Cubes", "Portions"],
    products: [
      { label: "Cubes 35/45 g", img: "sailfish-cubes" },
      { label: "Portions 120/160 g", img: "sailfish-portions" },
    ],
    process: "frozen",
    cuts: [{ label: "Cubes", x: 37 }, { label: "Frozen", x: 62 }],
    photo: ifremer("Fanchon Varenne", "https://commons.wikimedia.org/wiki/File:Voilier_de_l%27Indo-Pacifique_(Istiophorus_platypterus)_(Ifremer_00761-87277).jpg"),
  },
  "red-snapper": {
    pack: "Frozen whole round, or as skin-on and skinless fillets and cubes, packed to your specification.",
    forms: ["Whole round", "Skin-on fillet", "Skinless fillet", "Cubes"],
    products: [{ label: "Skin-on fillets", img: "red-snapper-fillet-skin-on" }],
    process: "frozen",
    cuts: [{ label: "Cubes", x: 45 }, { label: "Frozen", x: 70 }],
    photo: { by: "Filo gèn'", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Lutjanus_on_white_background.jpg" },
  },
  ribbonfish: {
    pack: "Frozen whole or dressed (HGT), graded by size and packed for East Asian and other markets.",
    process: "frozen",
    photo: { by: "Hariprasad Shetty", license: "CC0", href: "https://commons.wikimedia.org/wiki/File:Trichiurus_lepturus_mangaluru.jpg" },
  },
};
