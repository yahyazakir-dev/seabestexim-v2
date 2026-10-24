// Single source for contact and company particulars used across the site.
export const site = {
  name: "Sea Best Exim",
  legalName: "Sea Best Exim Private Limited",
  url: "https://seabestexim.com",
  phone: "+91 90379 90827",
  phoneHref: "tel:+919037990827",
  whatsappHref: "https://wa.me/919037990827",
  email: "info@seabestexim.com",
  // PLACEHOLDER: street address not yet confirmed by the customer.
  address: {
    locality: "Kochi",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    line: "Kochi, Kerala, India",
  },
  mapQuery: "Kochi, Kerala, India",
  hours: "Mon–Sat, 09:00–18:30 IST",
  description:
    "Sea Best Exim is an Indian exporter of frozen seafood and pre-cooked tuna: yellowfin and skipjack loins and flakes, frozen whole fish, pet-food tuna and value-added cubes and steaks, supplied to importers and processors worldwide.",
};

export const nav = [
  { href: "/frozen-seafood/", label: "Frozen" },
  { href: "/pre-cooked-tuna/", label: "Pre-Cooked" },
  { href: "/pet-food/", label: "Pet Food" },
  { href: "/about/", label: "About" },
];
