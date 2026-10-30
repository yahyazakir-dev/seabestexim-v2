"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Icon } from "./Icon";
import { WhatsAppLink } from "./WhatsApp";

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header" data-open={open}>
      <div className="header__bar">
        <Link className="brand" href="/" aria-label="Sea Best Exim, home">
          <img className="brand__icon" src="/brand/logo-icon.svg" alt="" width={776} height={494} />
          <img className="brand__word" src="/brand/logo-wordmark.svg" alt="Sea Best Exim Pvt. Ltd." width={950} height={189} />
        </Link>
        <nav className="nav" id="site-nav" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header__contact">
          <WhatsAppLink />
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
