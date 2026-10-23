import Link from "next/link";
import { commitment, leaders, reasons } from "@/content/company";
import { site } from "@/content/site";
import { EnquiryForm } from "./EnquiryForm";
import { Icon, type IconName } from "./Icon";
import { Contours, Photo } from "./Media";

export function ProductLines() {
  const lines = [
    {
      href: "/frozen-seafood/",
      title: "Frozen seafood",
      body: "Tuna, swordfish, mahi-mahi, billfish, mackerel, sardine, ribbonfish and reef fish. Whole round, dressed, loins and fillets.",
      meta: "14 species",
      photo: "frozen-whole",
      alt: "Whole frozen tuna stacked in a cold store",
      cls: "line--a",
    },
    {
      href: "/pre-cooked-tuna/",
      title: "Pre-cooked tuna",
      body: "Skipjack and yellowfin loins and flakes, steam-cooked, cleaned, vacuum packed and frozen for canneries and food makers.",
      meta: "Loins & flakes",
      photo: "loins-bag",
      alt: "Vacuum-packed pre-cooked tuna loins",
      cls: "line--b",
    },
    {
      href: "/pet-food/",
      title: "Pet-food tuna",
      body: "Black meat, belly, shaved and spoon meat from skipjack and yellowfin, frozen raw or cooked and vacuum packed.",
      meta: "Raw & cooked",
      photo: "flakes",
      alt: "Tuna meat packed for pet-food manufacturing",
      cls: "line--c",
    },
    {
      href: "/frozen-seafood/#value-added",
      title: "Cubes & steaks",
      body: "Skinless, boneless cubes and steaks of yellowfin, swordfish, marlin, mahi-mahi, sailfish and red snapper.",
      meta: "Value added",
      photo: "frozen-loins",
      alt: "Frozen raw tuna loins, vacuum packed",
      cls: "line--d",
    },
  ];
  return (
    <section className="section lines" aria-labelledby="lines-h">
      <div className="wrap">
        <div className="lines__head" data-reveal>
          <h2 id="lines-h" className="h-lg">
            Two specialities. <span className="ink-accent">Four ways to buy.</span>
          </h2>
          <p className="lede">
            Frozen and pre-cooked seafood are the heart of Sea Best Exim. Every line is packed to your species, size, grade, cut and
            carton specification.
          </p>
        </div>
        <div className="lines__grid">
          {lines.map((l, i) => (
            <Link key={l.href} href={l.href} className={`line ${l.cls}`} data-reveal={i}>
              <Photo name={l.photo} alt={l.alt} sizes="(max-width: 760px) 100vw, 60vw" className="line__photo" />
              <div className="line__body">
                <span className="line__meta">{l.meta}</span>
                <h3 className="line__title">{l.title}</h3>
                <p>{l.body}</p>
                <span className="line__go" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: "phone", title: "Specification", body: "Species, size, grade, cut and packing agreed directly with a director." },
  { icon: "pin", title: "Sourcing", body: "Fish sourced through our partner network on India's coast." },
  { icon: "check", title: "Quality checks", body: "Product checked against the agreed specification before freezing." },
  { icon: "snow", title: "Freezing & storage", body: "Frozen and held in cold storage at −18 °C or colder." },
  { icon: "cube", title: "Packing", body: "Packed and labelled to your carton, bag and label requirements." },
  { icon: "ship", title: "Reefer shipment", body: "Loaded into reefer containers with documents and shipment updates." },
];

export function ColdChain() {
  return (
    <section className="section chain dark" aria-labelledby="chain-h">
      <Contours seed={7} />
      <div className="wrap chain__inner">
        <div className="chain__head" data-reveal>
          <h2 id="chain-h" className="h-lg">
            From the catch to <span className="accent">your container.</span>
          </h2>
          <p className="lede">One accountable thread, coordinated by our team and checked by our directors, from the first spec sheet to the bill of lading.</p>
        </div>
        <ol className="chain__steps">
          <svg className="chain__current" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 70 C 150 10, 250 110, 400 60 S 650 10, 800 60 S 1050 110, 1200 40" fill="none" stroke="url(#chain-g)" strokeWidth="2" strokeDasharray="6 8" />
            <defs>
              <linearGradient id="chain-g" x1="0" x2="1">
                <stop offset="0" stopColor="#04c9c1" stopOpacity=".2" />
                <stop offset=".5" stopColor="#04c9c1" />
                <stop offset="1" stopColor="#1f7ae0" />
              </linearGradient>
            </defs>
          </svg>
          {steps.map((s, i) => (
            <li key={s.title} className="chain__step" data-reveal={i}>
              <span className="chain__icon">
                <Icon name={s.icon} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Reasons({ id }: { id?: string }) {
  return (
    <section className="section reasons" id={id} aria-labelledby="why-h">
      <div className="wrap reasons__inner">
        <div className="reasons__head">
          <h2 id="why-h" className="h-lg">
            Why buyers choose <span className="ink-accent">Sea Best Exim.</span>
          </h2>
          <p className="lede">
            Quality is the foundation of every relationship we build. Our directors treat it as the company's main pillar, from
            sourcing and processing to quality control, packing and shipment.
          </p>
          {!id && (
            <Link className="btn btn--navy" href="/about/">
              About the company <Icon name="arrow" />
            </Link>
          )}
        </div>
        <ul className="reasons__list">
          {reasons.map((r) => (
            <li key={r.title} data-reveal>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Leadership({ id }: { id?: string }) {
  return (
    <section className="section leaders" id={id} aria-labelledby="lead-h">
      <div className="wrap leaders__inner">
        {leaders.map((l) => (
          <article key={l.name} className="leader" data-reveal>
            <Photo name={l.photo} alt={`${l.name}, ${l.role} of Sea Best Exim`} sizes="(max-width: 760px) 90vw, 36vw" className="leader__photo" />
            <div className="leader__text">
              <h2 id="lead-h" className="h-md">Led by directors who pick up the phone.</h2>
              <blockquote className="leader__quote">
                <p>“{commitment[0].split(". ")[0]}.”</p>
              </blockquote>
              <p className="leader__name">{l.name}</p>
              <p className="muted">{l.role}</p>
              <p className="leader__bio">{l.bio}</p>
              <a className="link-arrow" href={site.phoneHref}>
                Call {site.phone} <Icon name="arrow" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContactBand({ id = "contact", title = "Tell us what you need to import." }: { id?: string; title?: string }) {
  return (
    <section className="section contact dark" id={id} aria-labelledby={`${id}-h`}>
      <Contours seed={9} />
      <div className="wrap contact__inner">
        <div className="contact__lead">
          <h2 id={`${id}-h`} className="h-lg">
            {title}
          </h2>
          <p className="lede">Share the species, specification, volume and destination port. A director replies to every enquiry personally.</p>
          <div className="contact__ways">
            <a href={site.phoneHref} className="contact__way">
              <Icon name="phone" />
              <span>
                <small>Call the directors</small>
                <strong className="num">{site.phone}</strong>
              </span>
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noopener" className="contact__way">
              <Icon name="whatsapp" />
              <span>
                <small>WhatsApp</small>
                <strong className="num">{site.phone}</strong>
              </span>
            </a>
            <a href={`mailto:${site.email}`} className="contact__way">
              <Icon name="mail" />
              <span>
                <small>Email</small>
                <strong>{site.email}</strong>
              </span>
            </a>
          </div>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
