"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { parade, speciesBySlug } from "@/content/products";
import { fishClips } from "@/content/fish-clips";
import { Icon } from "./Icon";
import { Contours } from "./Media";

const FISH = parade.map((slug) => ({ ...speciesBySlug(slug), clip: fishClips[slug] }));

// Scroll timeline, in timeline seconds: the first fish is processed in PROCESS,
// then each later fish takes SEG (swim out/in, then its own clip plays).
const PROCESS = 0.8;
const SEG = 1.5;
const TOTAL = PROCESS + (FISH.length - 1) * SEG;
const restAt = (i: number) => PROCESS + i * SEG;

const media = (slug: string, part = "") => `/fish-video/${slug}${part}`;

// iosMode picks the iPhone behaviour (both tested on iPhone 16/17; "play" chosen for the live site):
//   play:   each fish's video plays start to end when the scroll reaches it
//   stills: each fish crossfades from its first to its last frame as the scroll passes (no video on iOS)
export function Parade({ iosMode = "play" }: { iosMode?: "stills" | "play" }) {
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
      // iPhones/iPads (every iOS browser is WebKit) get still frames crossfaded on scroll instead of scrubbed video:
      // iOS limits loaded videos, blocks loading in Low Power Mode and can reload pages holding several decoders.
      const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (IOS) el.dataset.ios = iosMode;

      // Rest position of the clips, measured from the copy around them.
      // "side": wide screens with room beside the info block; the fish sits centred in that space.
      // "stacked": everything narrower; the fish is the hero across the top with the species name
      // set behind it, and the info block below.
      const place = () => {
        const vw = el.clientWidth;
        const vh = window.innerHeight;
        const stage = el.querySelector<HTMLElement>(".parade__stage")!.getBoundingClientRect();
        const infoRight = Math.max(...[...el.querySelectorAll<HTMLElement>(".parade__info")].map((i) => i.getBoundingClientRect().right));
        const right = vw - Math.max(56, vw * 0.04);
        const left = infoRight - stage.left + Math.max(24, vw * 0.02);
        const stacked = vh >= vw || right - left < 620;
        el.dataset.layout = stacked ? "stacked" : "side";
        let cx: number, cy: number, w: number, ny: number;
        if (stacked) {
          const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
          const tag = el.querySelector<HTMLElement>(".parade__info .parade__state")!.getBoundingClientRect();
          const top = Math.max(headerBottom, stage.top) - stage.top;
          const bottom = tag.top - stage.top;
          // the visible fish + its split labels fill roughly 9%–66% of the 16:9 frame
          const room = Math.max(bottom - top - 12, 120);
          w = Math.min(vw * 1.22, ((room / 0.6) * 16) / 9, 1100);
          const h = (w * 9) / 16;
          cx = vw / 2;
          cy = (top + bottom) / 2 + h * 0.125;
          ny = cy + h * 0.02;
          // landing: the first fish sits in the band between the call-to-action buttons and the species bar
          const ctas = el.querySelector<HTMLElement>(".parade__ctas")!.getBoundingClientRect();
          const bar = el.querySelector<HTMLElement>(".parade__index")!.getBoundingClientRect();
          const band = Math.max(bar.top - ctas.bottom, 80);
          const w0 = Math.min(vw * 1.06, ((band / 0.42) * 16) / 9, w);
          el.style.setProperty("--f0w", `${w0}px`);
          el.style.setProperty("--f0y", `${(ctas.bottom + bar.top) / 2 - stage.top + w0 * 0.02}px`);
        } else {
          // the fish fills about 78% of the frame width
          w = Math.min((right - left) / 0.78, vw * 0.62, 1160);
          cx = (left + right) / 2;
          cy = vh * 0.56;
          ny = 0;
        }
        el.style.setProperty("--fx", `${cx}px`);
        el.style.setProperty("--fy", `${cy}px`);
        el.style.setProperty("--fw", `${w}px`);
        el.style.setProperty("--ny", `${ny}px`);
      };

      const pinSpan = () => {
        const stage = el.querySelector<HTMLElement>(".parade__stage")!;
        return el.clientHeight - parseFloat(getComputedStyle(el).paddingBottom) - stage.offsetHeight;
      };

      const build = (intro: boolean) => gsap.context(() => {
        place();
        const fishes = gsap.utils.toArray<HTMLElement>(".parade__fish", el);
        const videos = gsap.utils.toArray<HTMLVideoElement>(".clip video", el);
        const stills = gsap.utils.toArray<HTMLElement>(".clip__still", el);
        const splits = gsap.utils.toArray<HTMLElement>(".clip", el).map((c) => c.querySelectorAll<HTMLElement>(".clip__tag"));
        const names = gsap.utils.toArray<HTMLElement>(".parade__name", el);
        const infos = gsap.utils.toArray<HTMLElement>(".parade__info", el);
        const states = gsap.utils.toArray<HTMLElement>(".parade__state", el);
        const tiles = infos.map((info) => info.querySelectorAll<HTMLElement>(".ptile"));
        const hero = el.querySelector<HTMLElement>(".parade__hero");
        const N = fishes.length;
        const offs: (() => void)[] = [];

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
        gsap.set(states, { autoAlpha: 0, x: -30 });
        gsap.set(tiles.flatMap((t) => [...t]), { autoAlpha: 0, y: 18, scale: 0.92 });
        // product tiles (fillets, cubes, portions) arrive after the species info, one by one
        const showTiles = (k: number, at: number) => {
          if (tiles[k]?.length) tl.to(tiles[k], { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.12, ease: "back.out(1.6)" }, at);
        };
        gsap.set(splits.flatMap((s) => [...s]), { autoAlpha: 0, y: 10 });
        if (IOS) gsap.set(stills, { opacity: 0 });

        // per clip: puts the video on the frame the scroll position calls for (set in process())
        const syncs: (() => void)[] = [];
        // load a clip just before it is needed rather than all of them up front
        const warm = (i: number) => {
          if (IOS && iosMode === "stills") return;
          const v = videos[i];
          if (v && v.preload !== "auto") {
            v.preload = "auto";
            v.muted = true;
            v.load();
            // iOS plays its clips end to end (see process); elsewhere a muted play/pause readies scrubbing
            if (IOS) return;
            v.play()
              .then(() => {
                v.pause();
                syncs[i]?.();
              })
              .catch(() => {});
          }
        };
        warm(0);
        warm(1);

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
            // the stage stays pinned for (section height - stage height); measured from the stage, not the screen,
            // so mobile address bars (and the strip under the stage) can't shift where the sequence ends
            end: () => `+=${pinSpan()}`,
            scrub: 0.9,
            invalidateOnRefresh: true,
            // no snapping on iOS: programmatic scroll fights Safari's momentum scrolling and makes the fish jump
            snap: IOS ? undefined : { snapTo: "labels", inertia: false, duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: "power2.inOut" },
            onUpdate: (self) => {
              const t = self.progress * TOTAL;
              const i = Math.max(0, Math.min(N - 1, Math.round((t - PROCESS) / SEG)));
              setActive(i);
              warm(i);
              warm(i + 1);
              warm(i + 2);
            },
          },
        });

        // The clip plays with the scroll: frost forms (frozen), or the tuna splits into
        // frozen half + pre-cooked loins (both). Scrolling back plays it in reverse.
        const process = (k: number, at: number) => {
          tl.to(states[k], { autoAlpha: 1, x: 0, duration: PROCESS * 0.4, ease: "power2.out" }, at + PROCESS * 0.2);
          if (splits[k].length) tl.to(splits[k], { autoAlpha: 1, y: 0, duration: PROCESS * 0.25, stagger: 0.05, ease: "power2.out" }, at + PROCESS * 0.75);
          if (IOS && iosMode === "stills") {
            tl.fromTo(stills[k], { opacity: 0 }, { opacity: 1, duration: PROCESS, ease: "power1.inOut", immediateRender: false }, at);
            return;
          }
          if (IOS) {
            // iOS: no scrubbing. When the scroll reaches this fish its clip plays normally, start to end; scrolling
            // back above it rewinds it. If iOS refuses to play (Low Power Mode), the finished frame fades in instead.
            const v = videos[k];
            const play = () => {
              v.muted = true;
              v.currentTime = 0;
              v.playbackRate = 1.5; // ~5 s per fish, closer to the pace of the scrolled version
              v.play()?.catch(() => gsap.to(stills[k], { opacity: 1, duration: 0.6 }));
            };
            const rewind = () => {
              v.pause();
              v.currentTime = 0;
              gsap.set(stills[k], { opacity: 0 });
            };
            tl.to({}, { duration: PROCESS, onStart: play, onReverseComplete: rewind }, at);
            return;
          }
          const v = videos[k];
          const clock = { t: 0 };
          const sync = () => {
            if (!v.duration) return;
            const next = clock.t * (v.duration - 0.05);
            if (Math.abs(v.currentTime - next) > 1 / 40) v.currentTime = next;
          };
          syncs[k] = sync;
          // a clip that loads after the scroll has passed it catches up to where it should be
          v.addEventListener("loadeddata", sync);
          offs.push(() => v.removeEventListener("loadeddata", sync));
          tl.fromTo(clock, { t: 0 }, { t: 1, duration: PROCESS, ease: "none", immediateRender: false, onUpdate: sync }, at);
        };

        tl.addLabel("landing", 0);
        // first fish: the headline gives way to the species and it is processed in place
        if (hero) tl.to(hero, { autoAlpha: 0, y: -50, filter: "blur(10px)", duration: 0.4, ease: "power2.in" }, 0);
        tl.fromTo(names[0], { autoAlpha: 0, filter: "blur(14px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }, 0.2)
          .to(infos[0], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.25);
        // the landing fish sits low beside the headline; glide it to where every other fish rests
        if (N > 1) {
          const swim0 = fishes[0].querySelector<HTMLElement>(".parade__swim")!;
          const centre = (f: HTMLElement) => [f.offsetLeft + f.offsetWidth / 2, f.offsetTop + f.offsetHeight / 2];
          const [x0, y0] = centre(fishes[0]);
          const [x1, y1] = centre(fishes[1]);
          const cs = getComputedStyle(swim0);
          const [tx = 0, ty = 0] = cs.translate === "none" ? [] : cs.translate.split(" ").map(parseFloat);
          const s0 = cs.scale === "none" ? 1 : parseFloat(cs.scale);
          tl.to(swim0, { x: x1 - x0 - tx, y: y1 - y0 - ty, scale: fishes[1].offsetWidth / fishes[0].offsetWidth / s0, duration: PROCESS, ease: "power2.inOut", immediateRender: false }, 0);
        }
        process(0, 0.05);
        showTiles(0, 0.45);
        tl.addLabel("s0", restAt(0));

        for (let k = 1; k < N; k++) {
          const at = restAt(k - 1);
          const prev = fishes[k - 1];
          const next = fishes[k];
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
            .to(states[k - 1], { autoAlpha: 0, x: -30, duration: 0.25 }, at)
            .to(names[k - 1], { autoAlpha: 0, xPercent: 12, filter: "blur(12px)", duration: 0.35 }, at)
            .fromTo(names[k], { autoAlpha: 0, xPercent: -14, filter: "blur(14px)" }, { autoAlpha: 1, xPercent: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, at + 0.5)
            .to(infos[k - 1], { autoAlpha: 0, y: -20, duration: 0.25 }, at)
            .to(infos[k], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.62);
          if (splits[k - 1].length) tl.to(splits[k - 1], { autoAlpha: 0, duration: 0.2 }, at);
          if (tiles[k - 1]?.length) tl.to(tiles[k - 1], { autoAlpha: 0, y: -12, duration: 0.2 }, at);
          process(k, at + 0.7);
          showTiles(k, at + 0.9);
          tl.addLabel(`s${k}`, restAt(k));
        }
        return () => offs.forEach((off) => off());
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
  }, [iosMode]);

  const jump = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const stage = el.querySelector<HTMLElement>(".parade__stage")!;
    const span = el.clientHeight - parseFloat(getComputedStyle(el).paddingBottom) - stage.offsetHeight;
    window.scrollTo({ top: top + (span * restAt(i)) / TOTAL, behavior: "smooth" });
  };

  return (
    <section ref={root} className="parade dark" aria-label="Sea Best Exim seafood range" style={{ ["--n" as string]: TOTAL + 1 }}>
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

        <div className="parade__glow" aria-hidden="true" />

        <div className="parade__fishes">
          {FISH.map((s, i) => (
            <div key={s.slug} className={`parade__fish parade__fish--${s.slug}`} data-first={i === 0 || undefined}>
              <div className="parade__swim">
                <div className="clip" data-process={s.clip.process}>
                  <video
                    src={media(s.slug, ".mp4")}
                    poster={media(s.slug, "-first.jpg")}
                    muted
                    playsInline
                    preload="none"
                    disableRemotePlayback
                    aria-label={
                      s.clip.process === "both"
                        ? `${s.name} splitting into a frozen half and pre-cooked loins`
                        : `${s.name} freezing as frost forms over it`
                    }
                  />
                  {/* stills: the iPhone version (crossfaded, see IOS) and the reduced-motion end state */}
                  <img className="clip__start" src={media(s.slug, "-first.jpg")} alt="" loading={i < 2 ? "eager" : "lazy"} />
                  <img className="clip__still" src={media(s.slug, "-last.jpg")} alt="" loading={i < 2 ? "eager" : "lazy"} />
                  {s.clip.process === "both" && (
                    <>
                      <span className="clip__tag clip__tag--cooked">Pre-cooked loins</span>
                      <span className="clip__tag clip__tag--frozen">Frozen</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="parade__hero wrap">
          <h1 className="parade__title">
            Frozen &amp; pre‑cooked seafood, <span className="accent">exported from India.</span>
          </h1>
          <p className="parade__lede">
            <span className="parade__lede-long">
              Pre-cooked tuna loins and flakes, frozen whole fish, raw materials for pet food, fillets, cubes and portions, sourced and shipped to your
              specification with the directors on the line.
            </span>
            <span className="parade__lede-short">Pre-cooked tuna loins and frozen whole fish, packed to your specification.</span>
          </p>
          <div className="parade__ctas">
            <Link className="btn" href="/about/#contact">
              Send an enquiry <Icon name="arrow" />
            </Link>
          </div>
        </div>

        <div className="parade__infos wrap">
          {FISH.map((s, i) => {
            const forms = s.clip.forms ?? s.forms;
            return (
              <div key={s.slug} className="parade__info" data-first={i === 0 || undefined}>
                <p className="parade__state" data-process={s.clip.process}>
                  <Icon name="snow" />
                  Frozen
                  {s.clip.process === "both" && (
                    <>
                      <span className="parade__state-plus">+</span>
                      <Icon name="flame" />
                      Pre-cooked
                    </>
                  )}
                </p>
                <h2 className="parade__info-name">{s.name}</h2>
                <p className="parade__latin">{s.latin}</p>
                <p className="parade__note">{s.clip.note ?? s.note}</p>
                <ul className="chips" aria-label={`${s.name} forms`}>
                  {forms.map((f) => (
                    <li key={f} className="chip">
                      {f}
                    </li>
                  ))}
                </ul>
                {s.clip.products && (
                  <ul className="parade__products" aria-label={`${s.name} products`}>
                    {s.clip.products.map((p) => (
                      <li key={p.img} className="ptile">
                        <img src={`/img/${p.img}-640.webp`} alt={`${s.name}: ${p.label}`} loading="lazy" decoding="async" />
                        <span>{p.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="parade__pack">{s.clip.pack}</p>
              </div>
            );
          })}
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
