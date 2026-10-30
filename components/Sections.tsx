import Link from "next/link";
import { leaders, reasons } from "@/content/company";
import { site } from "@/content/site";
import { EnquiryForm } from "./EnquiryForm";
import { WhatsAppLink } from "./WhatsApp";
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
      title: "Raw materials for pet food",
      body: "Frozen and cooked tuna meat, frozen belly meat and other by-products from skipjack and yellowfin tuna.",
      meta: "Frozen & cooked",
      photo: "black-meat",
      alt: "Frozen tuna meat packed in a block for pet food",
      cls: "line--c",
    },
    {
      href: "/cubes-steaks/",
      title: "Cubes & steaks",
      body: "Skinless, boneless cubes, steaks and portions, plus skin-on and skinless fillets of mahi-mahi and red snapper.",
      meta: "Value added",
      photo: "sailfish-cubes",
      alt: "Frozen sailfish cubes, 35/45 g",
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
  { icon: "mail", title: "Specification", body: "Species, size, grade, cut and packing agreed directly with a director." },
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
      <div className="wrap">
        <h2 id="lead-h" className="h-lg leaders__h" data-reveal>
          Meet our <span className="ink-accent">directors.</span>
        </h2>
        <ul className="leaders__grid">
          {leaders.map((l, i) => (
            <li key={l.name} className="leader" data-reveal={i}>
              <Photo name={l.photo} alt={`${l.name}, ${l.role}, Sea Best Exim`} sizes="(max-width: 640px) 90vw, 40vw" className="leader__photo" />
              <p className="leader__name">{l.name}</p>
              <p className="leader__role">{l.role}</p>
            </li>
          ))}
        </ul>
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
          <p className="lede">Share the species, specification, volume and destination port. Our directors read every enquiry.</p>
          <WhatsAppLink className="contact__wa">
            <span>Chat with us on WhatsApp</span>
          </WhatsAppLink>
          <ul className="contact__mails">
            {site.emails.map((m) => (
              <li key={m.email}>
                <a href={`mailto:${m.email}`} className="contact__way">
                  <Icon name="mail" />
                  <span>
                    <small>{m.label}</small>
                    <strong>{m.email}</strong>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
