import Link from "next/link";
import { Contours, Fish } from "@/components/Media";

export default function NotFound() {
  return (
    <section className="phero dark nf">
      <Contours seed={3} />
      <div className="wrap phero__inner">
        <Fish slug="sardine" eager className="nf__fish" />
        <h1 className="phero__title">This one got away.</h1>
        <p className="phero__lede">The page you were looking for has moved or no longer exists.</p>
        <div className="phero__ctas">
          <Link className="btn" href="/">Back to the homepage</Link>
          <Link className="btn btn--ghost" href="/frozen-seafood/">See the frozen range</Link>
        </div>
      </div>
    </section>
  );
}
