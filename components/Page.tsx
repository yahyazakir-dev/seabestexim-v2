import Link from "next/link";
import { FORM_GLOSSARY, type Species } from "@/content/products";
import { JsonLd, faqPage } from "@/lib/seo";
import { Icon } from "./Icon";
import { Contours, Fish } from "./Media";

export function PageHero({
  crumb,
  title,
  lede,
  fish,
  children,
}: {
  crumb: string;
  title: React.ReactNode;
  lede: string;
  fish: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="phero dark">
      <Contours seed={crumb.length} />
      <div className="phero__school" aria-hidden="true">
        {fish.map((f, i) => (
          <Fish key={f} slug={f} eager className={`phero__fish phero__fish--${i}`} />
        ))}
      </div>
      <div className="wrap phero__inner">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <h1 className="phero__title">{title}</h1>
        <p className="phero__lede">{lede}</p>
        <div className="phero__ctas">
          <Link className="btn" href="#enquire">
            Request a quote <Icon name="arrow" />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

export function SpeciesCard({ s, i = 0 }: { s: Species; i?: number }) {
  return (
    <article className="sp" data-reveal={i % 3}>
      <div className="sp__art">
        <Fish slug={s.slug} alt={`${s.name} (${s.latin})`} />
      </div>
      <h3 className="sp__name">{s.name}</h3>
      <p className="sp__latin">{s.latin}</p>
      <p className="sp__note">{s.note}</p>
      <ul className="chips" aria-label={`${s.name}: forms available`}>
        {s.forms.map((f) => (
          <li key={f} className="chip" title={FORM_GLOSSARY[f]}>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Faq({ items, title = "Buyer questions" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="section faq" aria-labelledby="faq-h">
      <div className="wrap faq__inner">
        <h2 id="faq-h" className="h-md">
          {title}
        </h2>
        <div className="faq__list">
          {items.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <span aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqPage(items)} />
    </section>
  );
}

export function Split({ title, children, aside, flip }: { title: React.ReactNode; children: React.ReactNode; aside: React.ReactNode; flip?: boolean }) {
  return (
    <div className={`split ${flip ? "split--flip" : ""}`}>
      <div className="split__text" data-reveal>
        <h2 className="h-lg">{title}</h2>
        {children}
      </div>
      <div className="split__aside" data-reveal="1">
        {aside}
      </div>
    </div>
  );
}
