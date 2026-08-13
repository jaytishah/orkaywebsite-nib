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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CHAPTERS, CONTACT } from "@/lib/content";

/* the chapter the closing frame features — its own number, name and image */
const FEATURE = CHAPTERS[5];

gsap.registerPlugin(ScrollTrigger);

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

      const st = { o: 0, r: 0 };
      const apply = () => {
        setters.O(st.o);
        setters.R(st.r);
      };
      const h = () =>
        root.querySelector<HTMLElement>("[data-stretch]")!.offsetHeight;

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
      /* reference: the project frame beside the elongated letters. The image
         wipes up from its bottom edge the moment the R finishes its travel;
         its label and caption follow it in. */
      tl.to(
        root.querySelector(".brand__figure__media"),
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "none" },
        2
      );
      tl.from(
        root.querySelectorAll(
          ".brand__figure__label, .brand__figure__title, .brand__figure__note"
        ),
        { opacity: 0, y: "0.6em", duration: 0.5, stagger: 0.12, ease: "none" },
        2.25
      );
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

      {/* reference: the featured project — a small label above the image,
          the name and a two-line note under it, all centred on the image's
          own column and set on the same bone ground, no panel behind it */}
      <figure className="brand__figure">
        <span className="brand__figure__label f-edit">{FEATURE.num}</span>

        <span className="brand__figure__media">
          <img src={FEATURE.image} alt={FEATURE.alt} />
        </span>

        <figcaption className="brand__figure__caption">
          <span className="brand__figure__title f-edit t-upper">
            {FEATURE.title.join(" ")}
          </span>
          <span className="brand__figure__note f-edit">
            Built for rain, sunshine and every
            <br />
            change of season, year after year.
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
