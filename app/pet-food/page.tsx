import type { Metadata } from "next";
import { Faq, PageHero, Split } from "@/components/Page";
import { ContactBand } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Media";
import { petfood } from "@/content/products";
import { JsonLd, breadcrumbs, productList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Raw Materials for Pet Food: Frozen & Cooked Tuna Meat, Belly Meat",
  description:
    "Raw materials for pet food from skipjack and yellowfin tuna: frozen and cooked tuna meat, frozen belly meat and other tuna by-products, packed for pet-food manufacturers. Exported from India.",
  alternates: { canonical: "/pet-food/" },
};

const cuts = [
  { name: "Tuna meat", body: "The dark, protein-rich muscle (black meat) removed when tuna loins are cleaned. Supplied frozen, or cooked and vacuum packed." },
  { name: "Belly meat", body: "Trimmed belly flaps, naturally rich in fat and flavour, frozen in blocks or bags." },
  { name: "Other by-products", body: "Further tuna by-products from loining and processing, supplied to your specification." },
];

const faqs = [
  {
    q: "What raw materials for pet food do you supply?",
    a: "From both skipjack and yellowfin tuna: frozen tuna meat, cooked tuna meat (vacuum packed), frozen belly meat and other tuna by-products.",
  },
  {
    q: "Do you supply frozen or cooked tuna meat?",
    a: "Both. Tuna meat is available frozen, or cooked and vacuum packed. Belly meat and other by-products are supplied frozen.",
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
        crumb="Pet food raw materials"
        title={
          <>
            Raw materials <span className="accent">for pet food.</span>
          </>
        }
        lede="Skipjack and yellowfin tuna for wet and dry pet-food production: frozen and cooked tuna meat, frozen belly meat and other by-products."
        fish={["skipjack-tuna", "yellowfin-tuna"]}
      />

      <section className="section" aria-labelledby="pf-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="pf-h" className="h-lg">
              Frozen <span className="ink-accent">or cooked.</span>
            </h2>
            <p className="lede">Every raw material is available from both skipjack and yellowfin tuna.</p>
          </div>
          <div className="pf-photos" data-reveal>
            <Photo name="black-meat" alt="Frozen tuna meat packed in a block for pet food" sizes="(max-width: 760px) 100vw, 50vw" caption="Frozen tuna meat" />
            <Photo name="belly-meat" alt="Frozen tuna belly meat for pet food" sizes="(max-width: 760px) 100vw, 50vw" caption="Frozen belly meat" />
          </div>
          <div className="pf-grid">
            {petfood.map((p, i) => (
              <article key={p.name} className="pf" data-reveal={i}>
                <h3 className="h-sm">{p.name}</h3>
                <div className="pf__cols">
                  <div>
                    <p className="pf__state">
                      <Icon name="snow" /> Frozen
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
                What goes <span className="accent">into the pack.</span>
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
      <ContactBand id="enquire" title="Quote for pet-food raw materials." />
      <JsonLd data={breadcrumbs([{ name: "Raw materials for pet food", path: "/pet-food/" }])} />
      <JsonLd data={productList("Raw materials for pet food", "/pet-food/", all.map((n) => ({ name: n, description: `${n}, raw material for pet food.` })))} />
    </>
  );
}
