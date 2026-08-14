"use client";

/**
 * The closing wordmark — reference: normalisboring.es, whose footer sets a
 * giant "BORING" that elongates as it scrolls into view. The reference draws
 * the word as an SVG with a normal and an elongated path per letter and
 * scrubs GSAP MorphSVGPlugin between them; MorphSVG is a paid Club plugin,
 * so this rebuilds the same move from live text: each stretching letter is
 * sliced at its waist, the lower half slides down, and a thin band of the
 * glyph's own mid-section is scaled tall to fill the gap. The stems extend
 * while the caps keep their drawing — visually the same elongation.
 *
 * Choreography (ours, per the brief): O and R rise together first, then the
 * R alone keeps going. The reference stretches all its letters at once.
 */

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CONTACT } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/* three.js only for the closing frame — kept out of the page's first load and
   off the server entirely. Until it arrives (or if it never does) the CSS
   globe in globals.css is what is on screen. */
const Globe = dynamic(() => import("./Globe"), { ssr: false });

const WORD = ["O", "R", "K", "A", "Y"];

/* The waist line per stretching letter, as a fraction of the line box.
   Measured off the rendered Playfair 900 glyphs, not guessed: in the R the
   bowl meets the stem at 57.6% and the foot serifs flare at 87.6%, so 86%
   is the last clean stem+leg band — cutting there leaves the whole drawing
   intact above and extrudes only the two verticals. The O cuts mid-counter,
   where both sides are parallel. Keep in sync with the clip-path
   percentages in globals.css (.brand__part--*). */
const CUT: Record<string, number> = { O: 0.52, R: 0.86 };
/* height of the band that becomes the extension — 0.5% of the line box each
   side of the cut (the CSS clips the mid part to cut ± 0.5%). Thin, so the
   glyph's taper across the band never reads as a step at the seams. */
const SLICE = 0.01;

/* extension distances, as fractions of the line box. Keep in sync with the
   section's bottom padding and the figure's bottom offset in globals.css —
   that is what puts the figure's bottom on the R's final baseline. */
const PHASE_ONE = 1.0; // O and R, together
const R_FINAL = 2.2; // where the R alone ends up

export default function BrandStretch() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      const setters: Record<string, (ext: number) => void> = {};

      root.querySelectorAll<HTMLElement>("[data-stretch]").forEach((el) => {
        const cut = CUT[el.dataset.stretch!];
        const bot = el.querySelector<HTMLElement>(".brand__part--bot")!;
        const mid = el.querySelector<HTMLElement>(".brand__part--mid")!;
        setters[el.dataset.stretch!] = (ext) => {
          const h = el.offsetHeight;
          gsap.set(bot, { y: ext });
          /* origin on the cut line: the scaled band then overlaps 1% under
             each half, so no seam can open between the three layers */
          gsap.set(mid, {
            y: ext / 2,
            scaleY: 1 + ext / (SLICE * h),
            transformOrigin: `50% ${cut * 100}%`,
          });
        };
      });

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const globe = root.querySelector<HTMLElement>(".brand__globe")!;
      const h = () =>
        root.querySelector<HTMLElement>("[data-stretch]")!.offsetHeight;

      const st = { o: 0, r: 0 };
      const apply = () => {
        setters.O(st.o);
        setters.R(st.r);
      };

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
      tl.to(
        st,
        {
          o: () => PHASE_ONE * h(),
          r: () => PHASE_ONE * h(),
          duration: 1,
          ease: "none",
          onUpdate: apply,
        },
        0
      );
      tl.to(
        st,
        { r: () => R_FINAL * h(), duration: 1, ease: "none", onUpdate: apply },
        1
      );
      /* the closing frame arrives once the R has settled at 2. Reduced motion
         skips it; the CSS shows the globe and label at rest. */
      if (!reduce) {
        tl.to(globe, { opacity: 1, duration: 1.0, ease: "none" }, 2.2);
        /* a scrubbed pulse on the globe's left edge as it lands */
        tl.to(
          root.querySelector(".brand__glow"),
          {
            keyframes: { opacity: [0, 0.55, 0.3, 0.5] },
            duration: 0.9,
            ease: "none",
          },
          3.4
        );
        tl.to(
          root.querySelector(".brand__glow__label"),
          { opacity: 1, duration: 0.6, ease: "none" },
          3.7
        );
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

      <span className="brand__word" aria-hidden>
        {WORD.map((ch, i) =>
          CUT[ch] ? (
            <span
              key={i}
              className="brand__letter"
              data-stretch={ch}
              style={{ "--cut": `${CUT[ch] * 100}%` } as React.CSSProperties}
            >
              <span className="brand__ghost">{ch}</span>
              <span className="brand__part brand__part--top">{ch}</span>
              <span className="brand__part brand__part--mid">{ch}</span>
              <span className="brand__part brand__part--bot">{ch}</span>
            </span>
          ) : (
            <span key={i} className="brand__letter">
              {ch}
            </span>
          )
        )}
      </span>

      {/* the closing frame: the spinning black globe the plane flies into,
          the 40 export countries baked into its texture. The glow pulses
          at the impact point on its left edge, the label beside it.
          The element keeps painting the CSS globe — Globe lays a real
          three.js sphere over it and adds `is-3d`, which turns the CSS one
          off. The plane's flight still measures this box, not the canvas. */}
      <span className="brand__globe" aria-hidden>
        <Globe />
        <span className="brand__glow" />
        <span className="brand__glow__label f-edit t-upper">
          40 Countries
        </span>
      </span>
    </section>
  );
}
