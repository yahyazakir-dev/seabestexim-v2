import type { Metadata } from "next";
import { Faq, PageHero, SpeciesCard, Split } from "@/components/Page";
import { ContactBand } from "@/components/Sections";
import { Photo } from "@/components/Media";
import { allSpecies, valueAdded } from "@/content/products";
import { JsonLd, breadcrumbs, productList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frozen Fish Cubes, Steaks, Portions & Fillets: Tuna, Sailfish, Snapper",
  description:
    "Frozen skinless, boneless cubes, steaks and portions of yellowfin tuna, swordfish, marlin and sailfish, and skin-on or skinless fillets of mahi-mahi and red snapper, packed to your specification. Exported from India.",
  alternates: { canonical: "/cubes-steaks/" },
};

const cuts = [
  { name: "Cubes", photo: "sailfish-cubes", caption: "Sailfish cubes, 35/45 g", body: "Skinless, boneless cubes cut from clean loins and graded by piece weight, for food service, poke and ready meals." },
  { name: "Steaks & portions", photo: "sailfish-portions", caption: "Sailfish portions, 120/160 g", body: "Skinless, boneless portions and cross-cut steaks, cut to the weight band you ask for, for retail and food service." },
  { name: "Fillets, skin-on & skinless", photo: "red-snapper-fillet-skin-on", caption: "Red snapper skin-on fillets", body: "Boneless side fillets of red snapper and mahi-mahi, supplied skin-on or skinless, trimmed and frozen for retail and catering." },
];

const faqs = [
  {
    q: "Which species are available as cubes and steaks?",
    a: "Yellowfin tuna, swordfish and marlin as cubes and steaks; sailfish as cubes and portions; mahi-mahi and red snapper as cubes and skin-on or skinless fillets.",
  },
  {
    q: "Can you cut to our size and weight specification?",
    a: "Yes. Cube size, steak thickness and weight bands, trim and packing are agreed with each buyer, subject to raw material and processing capability.",
  },
  {
    q: "How are cubes and steaks packed?",
    a: "Portions are frozen and packed to the bag weight, inner pack and carton you specify, then held in frozen storage until loading.",
  },
];

// valueAdded lists species by name; the cards show the cuts instead of the frozen forms.
const species = valueAdded.map((v) => ({ ...allSpecies.find((s) => s.name === v.species)!, forms: v.cuts }));

export default function CubesSteaksPage() {
  return (
    <>
      <PageHero
        crumb="Cubes & steaks"
        title={
          <>
            Cubes &amp; steaks, <span className="accent">portioned to order.</span>
          </>
        }
        lede="Skinless, boneless cubes and portions of tuna and billfish, and skin-on or skinless fillets, cut, frozen and packed for food service, retail and further processing."
        fish={["swordfish", "yellowfin-tuna", "marlin"]}
      />

      <section className="section" aria-labelledby="cuts-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="cuts-h" className="h-lg">
              Three cuts, <span className="ink-accent">your spec.</span>
            </h2>
            <p className="lede">Cubes and portions are skinless and boneless; fillets come skin-on or skinless. Photos are of our own product.</p>
          </div>
          <div className="portions">
            {cuts.map((c, i) => (
              <article key={c.name} className="portion" data-reveal={i % 3}>
                <Photo name={c.photo} alt={c.caption} sizes="(max-width: 760px) 100vw, 33vw" caption={c.caption} className="portion__photo" />
                <h3 className="h-sm">{c.name}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section va dark" aria-labelledby="va-h">
        <div className="wrap">
          <Split
            title={
              <>
                What we cut, <span className="accent">by species.</span>
              </>
            }
            aside={<Photo name="sailfish-portions" alt="Frozen sailfish portions, 120/160 g" sizes="(max-width: 900px) 100vw, 50vw" caption="Sailfish portions, 120/160 g" />}
          >
            <p className="lede">Choose the species and cut; we confirm sizes, weights and packing with you before production.</p>
            <table className="spec">
              <caption className="sr-only">Cubes, steaks and fillets by species</caption>
              <thead>
                <tr>
                  <th scope="col">Species</th>
                  <th scope="col">Cubes</th>
                  <th scope="col">Steaks / portions</th>
                  <th scope="col">Fillets</th>
                </tr>
              </thead>
              <tbody>
                {valueAdded.map((v) => (
                  <tr key={v.species}>
                    <th scope="row">{v.species}</th>
                    <td>{v.cuts.includes("Cubes") ? <span className="yes">Available</span> : <span className="no">–</span>}</td>
                    <td>{v.cuts.some((c) => c === "Steaks" || c === "Portions") ? <span className="yes">Available</span> : <span className="no">–</span>}</td>
                    <td>{v.cuts.some((c) => c.includes("fillet")) ? <span className="yes">Skin-on / skinless</span> : <span className="no">–</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Split>
        </div>
      </section>

      <section className="section" aria-labelledby="sp-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2 id="sp-h" className="h-lg">
              The species <span className="ink-accent">behind the cuts.</span>
            </h2>
          </div>
          <div className="sp-grid">
            {species.map((s, i) => (
              <SpeciesCard key={s.slug} s={s} i={i} />
            ))}
          </div>
        </div>
      </section>

      <Faq items={faqs} />
      <ContactBand id="enquire" title="Quote for cubes and steaks." />
      <JsonLd data={breadcrumbs([{ name: "Cubes & steaks", path: "/cubes-steaks/" }])} />
      <JsonLd
        data={productList(
          "Frozen cubes and steaks",
          "/cubes-steaks/",
          valueAdded.map((v) => ({ name: `Frozen ${v.species} ${v.cuts.join(", ").toLowerCase()}`, description: `${v.species} ${v.cuts.join(", ").toLowerCase()}, frozen and packed to buyer specification.` })),
        )}
      />
    </>
  );
}
