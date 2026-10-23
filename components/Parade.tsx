"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { parade, speciesBySlug } from "@/content/products";
import { site } from "@/content/site";
import { Icon } from "./Icon";
import { Contours } from "./Media";

const FISH = parade.map(speciesBySlug);

export function Parade() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dataset.mode = "static";
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    let onResize: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { MotionPathPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/MotionPathPlugin"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      el.dataset.mode = "motion";

      const build = (intro: boolean) => gsap.context(() => {
        const fishes = gsap.utils.toArray<HTMLElement>(".parade__fish", el);
        const names = gsap.utils.toArray<HTMLElement>(".parade__name", el);
        const infos = gsap.utils.toArray<HTMLElement>(".parade__info", el);
        const hero = el.querySelector<HTMLElement>(".parade__hero");
        const N = fishes.length;

        // Paths are in viewport units so the swim scales with the screen.
        const W = () => window.innerWidth;
        // vertical sweep follows the width so tall phones get the same arc as desktops
        const H = () => Math.min(window.innerHeight, window.innerWidth * 0.62);
        const enter = () => [
          { x: -W() * 0.95, y: H() * 0.22 },
          { x: -W() * 0.55, y: H() * 0.26 },
          { x: -W() * 0.22, y: H() * 0.06 },
          { x: -W() * 0.07, y: 0 },
          { x: 0, y: 0 },
        ];
        const exit = () => [
          { x: 0, y: 0 },
          { x: W() * 0.07, y: 0 },
          { x: W() * 0.24, y: H() * 0.05 },
          { x: W() * 0.5, y: -H() * 0.04 },
          { x: W() * 1.05, y: -H() * 0.26 },
        ];

        gsap.set(fishes, { autoAlpha: 0 });
        gsap.set(names, { autoAlpha: 0 });
        gsap.set(infos, { autoAlpha: 0, y: 24 });

        // The first fish swims onto the landing.
        gsap.set(fishes[0], { autoAlpha: 1 });
        // swim forward along the entry path; a from() tween would reverse the auto-rotation
        if (intro)
          gsap.fromTo(
            fishes[0].querySelector(".parade__swim"),
            { scale: 0.72, rotation: -16 },
            { scale: 1, duration: 2.4, ease: "power3.out", motionPath: { path: enter(), curviness: 1.3 }, keyframes: { rotation: [-16, -12, 8, 0], easeEach: "sine.inOut" } },
          );
        if (intro) gsap.from(".parade__hero > *", { autoAlpha: 0, y: 30, filter: "blur(8px)", duration: 1.2, stagger: 0.12, ease: "power3.out", delay: 0.15 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            invalidateOnRefresh: true,
            snap: { snapTo: "labels", inertia: false, duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: "power2.inOut" },
            onUpdate: (self) => setActive(Math.round(self.progress * (N - 1))),
          },
        });

        tl.addLabel("s0", 0);
        for (let k = 1; k < N; k++) {
          const at = k - 1;
          const prev = fishes[k - 1];
          const next = fishes[k];
          if (k === 1 && hero) tl.to(hero, { autoAlpha: 0, y: -50, filter: "blur(10px)", duration: 0.45, ease: "power2.in" }, at);
          tl.to(prev, { motionPath: { path: exit(), curviness: 1.25 }, scale: 1.12, duration: 0.72, ease: "power1.in" }, at)
            .to(prev, { keyframes: { rotation: [0, 6, -8, -20], easeEach: "sine.inOut" }, duration: 0.72, ease: "power1.in" }, at)
            .to(prev, { autoAlpha: 0, duration: 0.15 }, at + 0.6)
            .fromTo(
              next,
              { autoAlpha: 0, scale: 0.7, rotation: -16 },
              { motionPath: { path: enter(), curviness: 1.3 }, autoAlpha: 1, scale: 1, duration: 0.72, ease: "power2.out", immediateRender: false },
              at + 0.28,
            )
            .fromTo(next, { rotation: -16 }, { keyframes: { rotation: [-16, -12, 8, 0], easeEach: "sine.inOut" }, duration: 0.72, ease: "power2.out", immediateRender: false }, at + 0.28)
            .to(names[k - 1] ?? {}, { autoAlpha: 0, xPercent: 12, filter: "blur(12px)", duration: 0.35 }, at)
            .fromTo(names[k], { autoAlpha: 0, xPercent: -14, filter: "blur(14px)" }, { autoAlpha: 1, xPercent: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, at + 0.5)
            .to(infos[k - 1] ?? {}, { autoAlpha: 0, y: -20, duration: 0.25 }, at)
            .to(infos[k], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.62)
            .addLabel(`s${k}`, k);
        }
      }, el);

      ctx = build(true);
      // swim paths are in pixels, so rebuild them when the width changes
      let lastW = window.innerWidth;
      let t: number | undefined;
      onResize = () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => {
          if (Math.abs(window.innerWidth - lastW) < 40) return;
          lastW = window.innerWidth;
          ctx?.revert();
          ctx = build(false);
          ScrollTrigger.refresh();
        }, 200);
      };
      window.addEventListener("resize", onResize);
    })();

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  const jump = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * i) / (FISH.length - 1), behavior: "smooth" });
  };

  return (
    <section ref={root} className="parade dark" aria-label="Sea Best Exim seafood range" style={{ ["--n" as string]: FISH.length }}>
      <div className="parade__stage">
        <div className="parade__sea" aria-hidden="true">
          <Contours seed={2} className="contours parade__contours" />
          <div className="parade__rays" />
          <div className="parade__bubbles">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} style={{ ["--i" as string]: i }} />
            ))}
          </div>
        </div>

        <div className="parade__names" aria-hidden="true">
          {FISH.map((s, i) => (
            <p key={s.slug} className="parade__name" data-first={i === 0 || undefined} style={{ ["--l" as string]: Math.max(...s.name.split(" ").map((w) => w.length)) }}>
              {s.name}
            </p>
          ))}
        </div>

        <div className="parade__fishes">
          {FISH.map((s, i) => (
            <div key={s.slug} className={`parade__fish parade__fish--${s.slug}`} data-first={i === 0 || undefined}>
              <div className="parade__swim">
                <img src={`/fish/${s.slug}.svg`} alt={i === 0 ? `${s.name} illustration` : ""} draggable={false} fetchPriority={i === 0 ? "high" : "auto"} />
              </div>
            </div>
          ))}
        </div>

        <div className="parade__hero wrap">
          <h1 className="parade__title">
            Frozen &amp; pre‑cooked seafood, <span className="accent">exported from India.</span>
          </h1>
          <p className="parade__lede">
            Pre-cooked tuna loins and flakes, frozen whole fish, pet-food tuna and value-added cuts, sourced and shipped to your
            specification with the directors on the line.
          </p>
          <div className="parade__ctas">
            <Link className="btn" href="/about/#contact">
              Send an enquiry <Icon name="arrow" />
            </Link>
            <a className="btn btn--ghost" href={site.phoneHref}>
              <Icon name="phone" /> {site.phone}
            </a>
          </div>
        </div>

        <div className="parade__infos wrap">
          {FISH.map((s, i) => (
            <div key={s.slug} className="parade__info" data-first={i === 0 || undefined}>
              <h2 className="parade__info-name">{s.name}</h2>
              <p className="parade__latin">{s.latin}</p>
              <p className="parade__note">{s.note}</p>
              <ul className="chips" aria-label={`${s.name} forms`}>
                {s.forms.map((f) => (
                  <li key={f} className="chip">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <nav className="parade__index wrap" aria-label="Species">
          <span className="parade__count num" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} <i>/ {String(FISH.length).padStart(2, "0")}</i>
          </span>
          <ol>
            {FISH.map((s, i) => (
              <li key={s.slug}>
                <button type="button" aria-current={active === i || undefined} onClick={() => jump(i)}>
                  <span className="sr-only">Show </span>
                  {s.name}
                </button>
              </li>
            ))}
          </ol>
          <Link className="parade__all" href="/frozen-seafood/">
            Full frozen range <Icon name="arrow" />
          </Link>
        </nav>

        <div className="parade__cue" aria-hidden="true">
          <span />
          Scroll the catch
        </div>
      </div>
    </section>
  );
}
