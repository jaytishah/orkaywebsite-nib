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
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import { CONTACT } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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
    let unlisten = () => {};
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
      const plane = root.querySelector<HTMLElement>(".brand__plane")!;
      const trail = root.querySelector<HTMLElement>(".brand__trail");
      const ship = root.querySelector<HTMLElement>(".brand__plane__ship")!;
      const globe = root.querySelector<HTMLElement>(".brand__globe")!;
      const arcDash = root.querySelector<SVGPathElement>(".brand__arc__dash")!;
      const arcReveal = root.querySelector<SVGPathElement>(
        ".brand__arc__reveal"
      )!;
      const h = () =>
        root.querySelector<HTMLElement>("[data-stretch]")!.offsetHeight;

      /* The flight path, in the plane anchor's settled coordinate space
         (0,0 = the R's final foot, where the dive ends). It continues the
         dive, hooks right at the bottom, then S-climbs and levels out into
         the globe's left edge at its horizontal midline — so the plane
         arrives flying right, straight into the cut of the globe. Computed
         from live rects so it always ends on the globe, every viewport. */
      const setArc = () => {
        const a = plane.getBoundingClientRect();
        const g = globe.getBoundingClientRect();
        /* a.top carries the current ride offset — remove it, then add the
           full drop to get the settled foot in viewport space */
        const footY =
          a.top - Number(gsap.getProperty(plane, "y")) + R_FINAL * h();
        const ex = g.left - a.left; // the globe's left edge…
        const ey = g.top + g.height / 2 - footY; // …cut horizontally
        const r = Math.min(110, Math.max(30, ex * 0.25)); // the hook
        const k = Math.max(0, (ex - r) * 0.5);
        const d =
          `M0 0 A${r} ${r} 0 0 0 ${r} ${r} ` +
          `C${r + k} ${r} ${ex - k} ${ey} ${ex} ${ey}`;
        arcDash.setAttribute("d", d);
        arcReveal.setAttribute("d", d);
        /* dash rhythm: starts matching the vertical border's dashes where
           the curve leaves the stem, and the gaps open up toward the globe.
           A plain dasharray can't vary along a path, but a full explicit
           dash list can — generate one over the measured length. */
        const L = arcDash.getTotalLength();
        const DASH = 9;
        let list = "";
        for (let p = 0; p < L; ) {
          const gap = 8 + (p / L) * 18; // 8px at the stem → 26px at the globe
          list += `${DASH} ${gap.toFixed(1)} `;
          p += DASH + gap;
        }
        arcDash.setAttribute("stroke-dasharray", list.trim());
      };
      setArc();
      ScrollTrigger.addEventListener("refreshInit", setArc);
      unlisten = () =>
        ScrollTrigger.removeEventListener("refreshInit", setArc);

      const st = { o: 0, r: 0 };
      const apply = () => {
        setters.O(st.o);
        setters.R(st.r);
        /* the plane rides the same value the bot part gets — it can never
           drift out of sync with the descending foot */
        if (!reduce) {
          gsap.set(plane, { y: st.r });
          gsap.set(trail, { height: st.r });
        }
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
      /* the plane peels off: at 2 the R has settled, the vertical trail
         stays, and the plane rides the arc — autoRotate keeps the nose on
         the tangent (its resting pose already points down, the arc's start
         direction, so there is no snap). The dashed trail is the same arc,
         revealed behind the plane by the mask. Reduced motion skips the
         flight; the CSS shows the plane and label at rest. */
      if (!reduce) {
        tl.to(
          ship,
          {
            motionPath: { path: arcDash, autoRotate: -90 },
            duration: 1.8,
            ease: "none",
          },
          2
        );
        tl.to(
          arcReveal,
          { attr: { "stroke-dashoffset": 0 }, duration: 1.8, ease: "none" },
          2
        );
        /* the globe fades up as the plane heads for it, so the flight lands
           on something — the spin itself is a CSS animation */
        tl.to(globe, { opacity: 1, duration: 1.0, ease: "none" }, 2.2);
        /* a scrubbed pulse at the impact point as the plane arrives */
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

    return () => {
      unlisten();
      ctx.revert();
    };
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
              {ch === "R" && (
                <>
                  {/* the dotted line the plane draws down the right of the
                      stem — height driven from st.r in apply() */}
                  <span className="brand__trail" aria-hidden />
                  {/* a 0x0 anchor on the cut line; y driven from st.r, so
                      the nose leads the descending foot. The flight pieces
                      ride inside it and share its settled y. */}
                  <span className="brand__plane" aria-hidden>
                    {/* the flight arc — d is set at runtime (setArc) so it
                        always ends on the globe's left edge; the masked
                        copy reveals the dashes behind the plane */}
                    <svg className="brand__arc">
                      <defs>
                        <mask
                          id="brand-arc-mask"
                          maskUnits="userSpaceOnUse"
                          x="-500"
                          y="-2000"
                          width="5000"
                          height="5000"
                        >
                          <path
                            className="brand__arc__reveal"
                            pathLength={1}
                            fill="none"
                            stroke="#fff"
                            strokeWidth={10}
                            strokeDasharray="1 1"
                            strokeDashoffset={1}
                          />
                        </mask>
                      </defs>
                      {/* dasharray comes from setArc — dash-matched to the
                          vertical border at the stem, gaps widening out */}
                      <path
                        className="brand__arc__dash"
                        fill="none"
                        stroke="#D93A2B"
                        strokeWidth={4}
                        mask="url(#brand-arc-mask)"
                      />
                    </svg>
                    <span className="brand__plane__ship">
                      <svg viewBox="0 0 24 24" fill="#D93A2B">
                        <path d="M12 22 2 4l10 5 10-5z" />
                      </svg>
                    </span>
                  </span>
                </>
              )}
            </span>
          ) : (
            <span key={i} className="brand__letter">
              {ch}
            </span>
          )
        )}
      </span>

      {/* the closing frame: the spinning red globe the plane flies into,
          the 40 export countries baked into its texture. The glow pulses
          at the impact point on its left edge, the label beside it. */}
      <span className="brand__globe" aria-hidden>
        <span className="brand__glow" />
        <span className="brand__glow__label f-edit t-upper">
          40 Countries
        </span>
      </span>
    </section>
  );
}
