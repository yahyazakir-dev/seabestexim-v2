import type { Metadata } from "next";
import { PageHero, Split } from "@/components/Page";
import { ContactBand, Leadership, Reasons } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Media";
import { commitment, promise } from "@/content/company";
import { site } from "@/content/site";
import { JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Sea Best Exim: Director-Led Seafood Exporter in Kochi, India",
  description:
    "Sea Best Exim Private Limited is a director-led exporter of frozen seafood and pre-cooked tuna based in Kochi, Kerala. Our commitments, leadership, address, map and contact details.",
  alternates: { canonical: "/about/" },
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/about/#location`,
  name: site.legalName,
  url: `${site.url}/about/`,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/og.jpg`,
  parentOrganization: { "@id": `${site.url}/#org` },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.countryCode,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "18:30" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About us"
        title={
          <>
            Quality is our <span className="accent">guiding principle.</span>
          </>
        }
        lede="Sea Best Exim Private Limited is a director-led seafood export company. We coordinate sourcing, processing, quality control, packing and shipment so buyers deal with one accountable partner."
        fish={["red-snapper", "sailfish"]}
      />

      <section className="section" aria-labelledby="story-h">
        <div className="wrap">
          <Split
            title={
              <span id="story-h">
                Every shipment, <span className="ink-accent">a lasting partnership.</span>
              </span>
            }
            aside={<Photo name="reefer" alt="Reefer container being loaded with cartons for export" sizes="(max-width: 900px) 100vw, 50vw" />}
          >
            {commitment.map((p) => (
              <p key={p.slice(0, 20)} className="lede">
                {p}
              </p>
            ))}
            <p className="promise">
              <strong>Our promise is simple:</strong> {promise.charAt(0).toLowerCase() + promise.slice(1)}
            </p>
          </Split>
        </div>
      </section>

      <Reasons id="why" />
      <Leadership id="leadership" />

      <section className="section locate" id="location" aria-labelledby="loc-h">
        <div className="wrap locate__inner">
          <div className="locate__text" data-reveal>
            <h2 id="loc-h" className="h-lg">
              Find us in <span className="ink-accent">Kochi.</span>
            </h2>
            <p className="lede">Kochi, the Queen of the Arabian Sea, has shipped Kerala&apos;s produce to the world for centuries.</p>
            <ul className="locate__list">
              <li>
                <Icon name="pin" />
                <span>
                  <strong>{site.legalName}</strong>
                  <br />
                  {site.address.line}
                </span>
              </li>
              <li>
                <Icon name="mail" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <Icon name="clock" />
                <span>{site.hours}</span>
              </li>
            </ul>
            <a className="btn btn--navy" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`} target="_blank" rel="noopener">
              Open in Google Maps <Icon name="arrow" />
            </a>
          </div>
          <div className="locate__map" data-reveal="1">
            <iframe
              title="Map showing Sea Best Exim in Kochi, Kerala"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=12&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <ContactBand id="contact" />
      <JsonLd data={breadcrumbs([{ name: "About us", path: "/about/" }])} />
      <JsonLd data={localBusiness} />
    </>
  );
}
