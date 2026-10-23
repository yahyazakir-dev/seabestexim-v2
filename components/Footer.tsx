import Link from "next/link";
import { site } from "@/content/site";
import { promise } from "@/content/company";
import { Icon } from "./Icon";
import { Contours } from "./Media";

export function Footer() {
  return (
    <footer className="footer dark">
      <Contours seed={4} />
      <div className="wrap footer__inner">
        <div className="footer__top">
          <Link href="/" className="footer__logo" aria-label="Sea Best Exim, home">
            <img src="/brand/logo-full-light.svg" alt="Sea Best Exim Pvt. Ltd." width={960} height={746} loading="lazy" />
          </Link>
          <p className="footer__promise">{promise}</p>
        </div>

        <div className="footer__grid">
          <div>
            <h2 className="footer__h">Products</h2>
            <ul>
              <li><Link href="/frozen-seafood/">Frozen seafood</Link></li>
              <li><Link href="/pre-cooked-tuna/">Pre-cooked tuna loins &amp; flakes</Link></li>
              <li><Link href="/pet-food/">Pet-food tuna</Link></li>
              <li><Link href="/frozen-seafood/#value-added">Cubes &amp; steaks</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__h">Company</h2>
            <ul>
              <li><Link href="/about/">About Sea Best Exim</Link></li>
              <li><Link href="/about/#leadership">Leadership</Link></li>
              <li><Link href="/about/#why">Why buyers choose us</Link></li>
              <li><Link href="/about/#contact">Contact &amp; location</Link></li>
            </ul>
          </div>
          <div className="footer__contact">
            <h2 className="footer__h">Contact</h2>
            <a className="footer__big" href={`mailto:${site.email}`}>
              <Icon name="mail" />
              {site.email}
            </a>
            <a className="footer__big num" href={site.phoneHref}>
              <Icon name="phone" />
              {site.phone}
            </a>
            <p className="footer__meta">
              <Icon name="pin" />
              {site.address.line}
            </p>
            <p className="footer__meta">
              <Icon name="clock" />
              {site.hours}
            </p>
          </div>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <span>Frozen &amp; pre-cooked seafood exporters, India</span>
        </div>
      </div>
    </footer>
  );
}
