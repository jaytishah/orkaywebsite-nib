"use client";

/**
 * The closing wordmark — reference: normalisboring.es, whose footer sets a
 * giant "BORING" that elongates on scroll.
 *
 * Driven by the brand artwork, not live text. The earlier build sliced a
 * Playfair 900 "R" at its waist and scaled the band to fill the extension;
 * no cut through that glyph is clean, because its leg is diagonal — every
 * band scaled tall sheared the leg sideways and tore the foot serif off it.
 * The artwork fixes it at the source: "ARKAY text 1-02.png" redraws the R
 * with the leg vertical below the bowl, so a band taken there is two parallel
 * strokes and scales without distorting anything.
 *
 * Both PNGs were measured — ink bounds and per-row stroke edges — and every
 * number here comes off that measurement:
 *   · 01 is the rest frame, 02 the extended one. K, A and Y are identical in
 *     both; only the O and R are extruded, straight down.
 *   · Comparing the two baselines, the O extends 1446px of the source and the
 *     R 2389px.
 *   · Each band is exactly that extension tall, cut where the strokes run
 *     parallel: 7px of edge drift across the O's band and 8px across the R's,
 *     out of a 10667px-wide source — 0.07%.
 * So scaleY(0) reassembles frame 01's bounding box exactly, scaleY(1) is
 * frame 02 pixel-for-pixel, and every frame between is a true stretch. The
 * sprites are cut from 02 alone; 01 only supplied the rest measurements.
 *
 * Choreography (ours, per the brief): O and R rise together first, then the R
 * alone keeps going. The reference stretches all its letters at once.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CONTACT } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/* Every sprite's box in the artwork's own pixels, exactly as cut from frame
   02. Positions are laid out for the R at full travel, so collapsing the
   bands is what produces the rest state. */
const W = 3833;
const BOX = {
  kay: { x: 1699, y: 7, w: 2134, h: 821 },
  "o-top": { x: 0, y: 0, w: 821, h: 403 },
  "o-band": { x: 0, y: 403, w: 821, h: 542 },
  "o-bot": { x: 0, y: 945, w: 821, h: 434 },
  "r-top": { x: 916, y: 7, w: 669, h: 741 },
  "r-band": { x: 916, y: 748, w: 669, h: 896 },
  "r-bot": { x: 916, y: 1644, w: 669, h: 80 },
} as const;

/* How far past the artwork the R keeps going — the one knob for its length.
   1 stops at frame 02 exactly; above that the band simply scales on, because
   it is two parallel strokes and has nothing in it left to distort. If you
   change this, retune --brand-globe-drop in globals.css: a longer R makes the
   stage taller, which gives the globe more room inside it, not less. */
const R_MAX = 2;

/* the stage has to be tall enough to hold the R at full travel */
const H = BOX["r-band"].y + BOX["r-band"].h * R_MAX + BOX["r-bot"].h;

/* The R's travel is the longer one, so "together" ends the moment it has
   dropped as far as the O's whole extension. After that the R goes on alone,
   and phase two is given its length in proportion — otherwise the R would
   visibly speed up the moment the O stops. */
const TOGETHER = BOX["o-band"].h / BOX["r-band"].h;
const PHASE_TWO = ((R_MAX - TOGETHER) * BOX["r-band"].h) / BOX["o-band"].h;

function Sprite({ name }: { name: keyof typeof BOX }) {
  const b = BOX[name];
  return (
    <img
      className="brand__part"
      data-part={name}
      src={`/images/wordmark-${name}.png`}
      alt=""
      style={{
        left: `${(b.x / W) * 100}%`,
        top: `${(b.y / H) * 100}%`,
        width: `${(b.w / W) * 100}%`,
        height: `${(b.h / H) * 100}%`,
      }}
    />
  );
}

export default function BrandStretch() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      const q = (s: string) => root.querySelector<HTMLElement>(s)!;
      const band = { o: q('[data-part="o-band"]'), r: q('[data-part="r-band"]') };
      const foot = { o: q('[data-part="o-bot"]'), r: q('[data-part="r-bot"]') };

      /* t is 0..1 of that letter's extension. The band scales from the cut
         line; the foot rides down with it, and because the band's laid-out
         height IS the extension, the two always meet — no seam to open. */
      const st = { o: 0, r: 0 };
      const apply = () =>
        (["o", "r"] as const).forEach((k) => {
          gsap.set(band[k], { scaleY: st[k] });
          gsap.set(foot[k], { y: -(1 - st[k]) * band[k].offsetHeight });
        });
      /* before first paint, so the extended artwork never flashes */
      apply();

      const tl = gsap.timeline({
        scrollTrigger: {
          /* reference values: trigger the word itself, scrub 2 */
          trigger: root,
          start: "top 55%",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });
      tl.to(st, { o: 1, r: TOGETHER, duration: 1, ease: "none", onUpdate: apply }, 0);
      tl.to(st, { r: R_MAX, duration: PHASE_TWO, ease: "none", onUpdate: apply }, 1);

      /* The globe gets its own trigger rather than riding the stretch's tail.
         Tacked onto that timeline it began the moment the R's tween ended —
         but the R's foot sits on the stage's bottom edge, still well below the
         viewport at that point, so the two read as simultaneous: the foot is
         still travelling up into view as the globe arrives. Waiting on the
         section's own bottom instead means the globe starts only once the
         finished R is actually on screen, and it stays true if R_MAX changes.
         Reduced motion skips all of it; the CSS shows the globe at rest. */
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const gl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            /* a hair past "bottom bottom", where the stretch ends — the extra
               margin lets scrub 2 finish catching up before the globe moves */
            start: "bottom 92%",
            end: "bottom 62%",
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
        gl.to(q(".brand__globe"), { opacity: 1, duration: 1.0, ease: "none" }, 0);
        gl.to(
          q(".brand__glow"),
          {
            keyframes: { opacity: [0, 0.55, 0.3, 0.5] },
            duration: 0.9,
            ease: "none",
          },
          0.6
        );
        gl.to(q(".brand__glow__label"), { opacity: 1, duration: 0.6, ease: "none" }, 0.9);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="brand" aria-label="Orkay" ref={rootRef}>
      {/* reference: the pair of contact links set in serif above the word */}
      <div className="brand__links f-edit">
        <a href={`tel:${CONTACT.indiaSales.replace(/\s/g, "")}`}>
          India {CONTACT.indiaSales}
        </a>
        <span aria-hidden>|</span>
        <a href={`tel:${CONTACT.exportSales.replace(/\s/g, "")}`}>
          Export {CONTACT.exportSales}
        </a>
      </div>

      <span className="brand__word" style={{ aspectRatio: `${W} / ${H}` }} aria-hidden>
        <Sprite name="o-top" />
        <Sprite name="o-band" />
        <Sprite name="o-bot" />
        <Sprite name="r-top" />
        <Sprite name="r-band" />
        <Sprite name="r-bot" />
        <Sprite name="kay" />
      </span>

      {/* the closing frame: the spinning red globe, the 40 export countries
          baked into its texture, the label on its left edge */}
      <span className="brand__globe" aria-hidden>
        <span className="brand__glow" />
        <span className="brand__glow__label f-edit t-upper">40 Countries</span>
      </span>
    </section>
  );
}
