import type { Metadata } from "next";
import { Faq, PageHero, SpeciesCard, Split } from "@/components/Page";
import { ContactBand } from "@/components/Sections";
import { Photo } from "@/components/Media";
import { FORM_GLOSSARY, frozenAlso, frozenMain, valueAdded } from "@/content/products";
import { JsonLd, breadcrumbs, productList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frozen Seafood Exporter India: Tuna, Swordfish, Mahi-Mahi & More",
  description:
    "Frozen yellowfin and skipjack tuna, swordfish, mahi-mahi, marlin, sailfish, Indian mackerel, sardine, ribbonfish, leatherjacket and reef fish from India. Whole round, GG, HLG, HGT, loins, fillets, cubes and steaks.",
  alternates: { canonical: "/frozen-seafood/" },
};

const faqs = [
  {
    q: "Which frozen fish does Sea Best Exim export?",
    a: "Yellowfin tuna, skipjack tuna, swordfish, mahi-mahi, marlin, sailfish, Indian mackerel, sardine, ribbonfish and leatherjacket, plus grouper, red snapper, emperor fish and Japanese threadfin bream.",
  },
  {
    q: "What product forms are available?",
    a: "Depending on species: whole round, gilled and gutted (GG / G&G), headless and gutted (HLG), headed and gutted (H&G), headed, gutted and tail off (HGT), raw loins, fillets, skinless, and skinless boneless cubes and steaks.",
  },
  {
    q: "Can you pack to our own size, grade and carton specification?",
    a: "Yes. We accommodate buyer-specific sizes, grades, cuts, processing methods and packaging, subject to product availability and processing capability. Share your specification and a director will confirm what can be supplied.",
  },
  {
    q: "How is product quality protected in transit?",
    a: "We coordinate frozen storage, handling, packing and reefer shipment with our partners to preserve product integrity, and keep buyers updated on production and shipment timelines.",
  },
];

export default function FrozenPage() {
  return (
    <>
      <PageHero
        crumb="Frozen seafood"
        title={
          <>
            Frozen seafood, <span className="accent">cut to your spec.</span>
          </>
        }
        lede="Tuna, billfish, mahi-mahi and coastal species from India, frozen whole, dressed, loined or filleted, and packed to the size, grade and carton your market needs."
        fish={["yellowfin-tuna", "swordfish", "mahi-mahi"]}
      />

      <section className="section" aria-labelledby="range-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="range-h" className="h-lg">
              Our main frozen range
            </h2>
            <p className="lede">Ten species supplied year-round through our sourcing network, each in the forms buyers ask for most.</p>
          </div>
          <div className="sp-grid">
            {frozenMain.map((s, i) => (
              <SpeciesCard key={s.slug} s={s} i={i} />
            ))}
          </div>

          <h3 className="h-sm sub-h" data-reveal>
            Also available
          </h3>
          <div className="sp-grid sp-grid--small">
            {frozenAlso.map((s, i) => (
              <SpeciesCard key={s.slug} s={s} i={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section va dark" id="value-added" aria-labelledby="va-h">
        <div className="wrap">
          <Split
            title={
              <>
                Value-added <span className="accent">cubes &amp; steaks.</span>
              </>
            }
            aside={<Photo name="frozen-loins" alt="Frozen raw tuna loins, vacuum packed for export" sizes="(max-width: 900px) 100vw, 50vw" caption="Illustrative image" />}
          >
            <p className="lede">
              Skinless, boneless portions cut from premium species and frozen ready for food service, retail and further processing.
            </p>
            <table className="spec">
              <caption className="sr-only">Value-added frozen products</caption>
              <thead>
                <tr>
                  <th scope="col">Species</th>
                  <th scope="col">Cubes</th>
                  <th scope="col">Steaks</th>
                  <th scope="col">Fillet</th>
                </tr>
              </thead>
              <tbody>
                {valueAdded.map((v) => (
                  <tr key={v.species}>
                    <th scope="row">{v.species}</th>
                    {["Cubes", "Steaks", "Fillet"].map((c) => (
                      <td key={c}>{v.cuts.includes(c) ? <span className="yes">Available</span> : <span className="no">–</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Split>
        </div>
      </section>

      <section className="section section--tight glossary" aria-labelledby="gl-h">
        <div className="wrap">
          <h2 id="gl-h" className="h-md" data-reveal>
            Product forms, explained
          </h2>
          <dl className="gl">
            {Object.entries(FORM_GLOSSARY)
              .filter(([k]) => k !== "G&G")
              .map(([k, v], i) => (
                <div key={k} data-reveal={i % 4}>
                  <dt>{k === "GG" ? "GG / G&G" : k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      <Faq items={faqs} />
      <ContactBand id="enquire" title="Quote for frozen seafood." />
      <JsonLd data={breadcrumbs([{ name: "Frozen seafood", path: "/frozen-seafood/" }])} />
      <JsonLd
        data={productList(
          "Frozen seafood",
          "/frozen-seafood/",
          [...frozenMain, ...frozenAlso].map((s) => ({ name: `Frozen ${s.name} (${s.latin})`, description: `${s.note} Forms: ${s.forms.join(", ")}.` })),
        )}
      />
    </>
  );
}
