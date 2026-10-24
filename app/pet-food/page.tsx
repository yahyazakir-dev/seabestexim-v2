import type { Metadata } from "next";
import { Faq, PageHero, Split } from "@/components/Page";
import { ContactBand } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Media";
import { petfood } from "@/content/products";
import { JsonLd, breadcrumbs, productList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pet Food Tuna Supplier: Black Meat, Belly, Shaved & Spoon Meat",
  description:
    "Frozen raw and cooked skipjack and yellowfin tuna for pet-food manufacturers: black meat, belly meat, shaved meat and spoon meat, plus cooked black meat vacuum packed. Exported from India.",
  alternates: { canonical: "/pet-food/" },
};

const cuts = [
  { name: "Black meat", body: "The dark, blood-rich muscle along the lateral line, removed when loins are cleaned. High in protein and iron." },
  { name: "Belly meat", body: "Trimmed belly flaps, naturally rich in fat and flavour." },
  { name: "Shaved meat", body: "Fine shavings recovered from loin trimming, suited to pâtés and wet food." },
  { name: "Spoon meat", body: "Meat scraped from the backbone and frame after loining." },
];

const faqs = [
  {
    q: "What tuna raw materials do you supply for pet food?",
    a: "From both skipjack and yellowfin tuna: frozen black meat, frozen belly meat, frozen shaved meat and frozen spoon meat, plus cooked black meat, vacuum packed.",
  },
  {
    q: "Do you supply raw or cooked pet-food tuna?",
    a: "Both. Black meat, belly, shaved and spoon meat are supplied frozen raw. Black meat is also available cooked and vacuum packed.",
  },
  {
    q: "Can packing be adapted to our plant?",
    a: "Yes. Block sizes, bag weights and carton packing can be arranged to your requirements, subject to processing capability.",
  },
];

export default function PetFoodPage() {
  const all = petfood.flatMap((p) => [...p.raw, ...p.cooked].map((i) => `${i}: ${p.name}`));
  return (
    <>
      <PageHero
        crumb="Pet food"
        title={
          <>
            Tuna for pet food, <span className="accent">raw or cooked.</span>
          </>
        }
        lede="Skipjack and yellowfin tuna cuts for wet and dry pet-food production: black meat, belly, shaved and spoon meat, frozen raw or cooked and vacuum packed."
        fish={["skipjack-tuna", "yellowfin-tuna"]}
      />

      <section className="section" aria-labelledby="pf-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="pf-h" className="h-lg">
              Two species, <span className="ink-accent">two states.</span>
            </h2>
            <p className="lede">Every cut is available from both skipjack and yellowfin tuna.</p>
          </div>
          <div className="pf-grid">
            {petfood.map((p, i) => (
              <article key={p.name} className="pf" data-reveal={i}>
                <h3 className="h-sm">{p.name}</h3>
                <div className="pf__cols">
                  <div>
                    <p className="pf__state">
                      <Icon name="snow" /> Frozen raw
                    </p>
                    <ul>
                      {p.raw.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="pf__state pf__state--cooked">
                      <Icon name="flame" /> Cooked
                    </p>
                    <ul>
                      {p.cooked.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cuts dark" aria-labelledby="cuts-h">
        <div className="wrap">
          <Split
            flip
            title={
              <span id="cuts-h">
                Know your <span className="accent">cuts.</span>
              </span>
            }
            aside={<Photo name="loins-trimming" alt="Tuna loins being trimmed by hand" sizes="(max-width: 900px) 100vw, 50vw" />}
          >
            <dl className="cuts__list">
              {cuts.map((c) => (
                <div key={c.name}>
                  <dt>{c.name}</dt>
                  <dd>{c.body}</dd>
                </div>
              ))}
            </dl>
          </Split>
        </div>
      </section>

      <Faq items={faqs} />
      <ContactBand id="enquire" title="Quote for pet-food tuna." />
      <JsonLd data={breadcrumbs([{ name: "Pet food", path: "/pet-food/" }])} />
      <JsonLd data={productList("Pet-food tuna", "/pet-food/", all.map((n) => ({ name: n, description: `${n} for pet-food manufacturing.` })))} />
    </>
  );
}
