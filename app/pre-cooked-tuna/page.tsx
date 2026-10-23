import type { Metadata } from "next";
import { Faq, PageHero, Split } from "@/components/Page";
import { ContactBand } from "@/components/Sections";
import { Photo } from "@/components/Media";
import { precooked } from "@/content/products";
import { JsonLd, breadcrumbs, productList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pre-Cooked Tuna Loins & Flakes Exporter: Skipjack and Yellowfin",
  description:
    "Pre-cooked skipjack and yellowfin tuna loins and flakes, vacuum packed and frozen, exported from India for tuna canneries, pouch and ready-meal producers and food-service distributors.",
  alternates: { canonical: "/pre-cooked-tuna/" },
};

const steps = [
  { img: "cooking", title: "Steam pre-cooking", body: "Whole tuna is thawed, cooked and cooled under controlled conditions." },
  { img: "cleaning", title: "Hand cleaning", body: "Skin, bones and dark meat are removed by hand to leave clean light-meat loins." },
  { img: "loins", title: "Loins & flakes", body: "Loins are graded; flakes from cleaning are collected and packed separately." },
  { img: "sealing", title: "Vacuum packing", body: "Product is vacuum sealed in bags to the agreed weight and labelled." },
  { img: "freezing", title: "Freezing", body: "Packs are frozen and held in frozen storage until loading." },
];

const faqs = [
  {
    q: "What pre-cooked tuna products do you supply?",
    a: "Pre-cooked skipjack tuna loins, skipjack tuna flakes, yellowfin tuna loins and yellowfin tuna flakes, all vacuum packed and frozen.",
  },
  {
    q: "Who buys pre-cooked tuna loins?",
    a: "Tuna canneries, pouch and ready-meal manufacturers, salad and sandwich producers and food-service distributors use pre-cooked loins to skip in-house cooking and cleaning.",
  },
  {
    q: "Can bag weights and packing be customised?",
    a: "Yes. Pack sizes, carton configuration and labelling follow the buyer's specification, subject to processing capability. Tell us your requirement and a director will confirm.",
  },
  {
    q: "What is the difference between loins and flakes?",
    a: "Loins are the whole cleaned muscle sections of the cooked tuna. Flakes are the smaller pieces collected during cleaning, suited to products where shape does not matter.",
  },
];

export default function PrecookedPage() {
  const all = precooked.flatMap((l) => l.items);
  return (
    <>
      <PageHero
        crumb="Pre-cooked tuna"
        title={
          <>
            Pre-cooked tuna loins <span className="accent">&amp; flakes.</span>
          </>
        }
        lede="Skipjack and yellowfin, steam-cooked, hand-cleaned, vacuum packed and frozen: ready for your cannery, pouch or ready-meal line the day it arrives."
        fish={["skipjack-tuna", "yellowfin-tuna"]}
      />

      <section className="section" aria-labelledby="pc-h">
        <div className="wrap">
          <Split
            title={
              <span id="pc-h">
                Four products, <span className="ink-accent">one clean process.</span>
              </span>
            }
            aside={<Photo name="loins-bag" alt="Vacuum-packed pre-cooked tuna loins" sizes="(max-width: 900px) 100vw, 50vw" caption="Illustrative image" />}
          >
            <p className="lede">
              Pre-cooked loins save buyers the cooking, cleaning and waste handling, and arrive frozen in vacuum-sealed packs for
              consistent yield on your line.
            </p>
            <div className="pc-lines">
              {precooked.map((l) => (
                <div key={l.name} className="pc-line">
                  <h3>{l.name}</h3>
                  <ul>
                    {l.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Split>
        </div>
      </section>

      <section className="section process dark" aria-labelledby="proc-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="proc-h" className="h-lg">
              How pre-cooked tuna <span className="accent">is made.</span>
            </h2>
            <p className="lede">Processing is carried out with our processing partners and coordinated against your specification.</p>
          </div>
        </div>
        <ol className="process__track">
          {steps.map((s, i) => (
            <li key={s.title} className="process__step" data-reveal={i}>
              <Photo name={s.img} alt={s.title} sizes="(max-width: 700px) 80vw, 30vw" />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="wrap process__note">Photographs are illustrative.</p>
      </section>

      <section className="section section--tight uses" aria-labelledby="uses-h">
        <div className="wrap uses__inner">
          <h2 id="uses-h" className="h-md" data-reveal>
            Made for
          </h2>
          <ul className="uses__list">
            {["Tuna canneries", "Pouch & ready-meal producers", "Salad & sandwich makers", "Food-service distributors"].map((u, i) => (
              <li key={u} data-reveal={i}>
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={faqs} />
      <ContactBand id="enquire" title="Quote for pre-cooked tuna." />
      <JsonLd data={breadcrumbs([{ name: "Pre-cooked tuna", path: "/pre-cooked-tuna/" }])} />
      <JsonLd data={productList("Pre-cooked tuna", "/pre-cooked-tuna/", all.map((n) => ({ name: n, description: `${n}, exported from India by Sea Best Exim.` })))} />
    </>
  );
}
