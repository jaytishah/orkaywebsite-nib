"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import HeroText from "./HeroText";
import HeroImage from "./HeroImage";
import RailSections from "./RailSections";
import ScrollIndicator from "./ScrollIndicator";
import { buildFlipTimeline, splitChars } from "@/lib/flip";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setVh = () =>
      document.documentElement.style.setProperty(
        "--100vh",
        `${window.innerHeight}px`
      );
    setVh();

    /* ---------- smooth scroll (as in the reference) ---------- */
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const rail = railRef.current!;
      const viewport = viewportRef.current!;
      const heroFlip = rail.querySelector<HTMLElement>(
        '[data-panel="images"] .flipMedia'
      )!;
      const heroMain = rail.querySelector<HTMLElement>("[data-hero-main]")!;
      const heroMainInner = rail.querySelector<HTMLElement>(
        "[data-hero-main-inner]"
      )!;
      const introWrapper = rail.querySelector<HTMLElement>(
        '[data-panel="intro"] .wrapper'
      )!;
      const captions = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-caption]")
      );

      /* ================================================================
         LOAD — the composition assembles, then holds
         ================================================================ */
      const intro = gsap.timeline({ delay: 0.1 });

      rail
        .querySelectorAll<HTMLElement>("[data-split-title] .splitline")
        .forEach((line, i) => {
          if (line.dataset.split === "done") return;
          line.dataset.split = "done";
          const chars = splitChars(line);
          if (!chars.length) return;
          // alternate lines enter from opposite directions — reference behaviour
          intro.from(
            chars,
            {
              yPercent: i % 2 !== 0 ? -110 : 110,
              duration: 0.65,
              stagger: 0.03,
              ease: "power3.out",
            },
            i === 0 ? 0 : "<+=0.05"
          );
        });

      intro.from(
        rail.querySelectorAll("[data-intro-text] p"),
        { yPercent: 100, opacity: 0, duration: 0.5, ease: "power3.out" },
        "<+=0.05"
      );
      intro.from(
        rail.querySelectorAll("[data-intro-fade]"),
        { opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
        "<"
      );
      intro.from(
        rail.querySelectorAll(".rail__intro__menu li"),
        { y: 44, opacity: 0, duration: 1, stagger: -0.15, ease: "power3.out" },
        "<"
      );

      // the two image reveals use the reference's --clipPath primitive
      intro.from(
        heroMain,
        { "--clipPath": "0% 0% 0% 100%", duration: 1.4, ease: "power3.inOut" },
        0
      );
      intro.from(
        heroFlip,
        { "--clipPath": "100% 0% 0% 0%", duration: 0.95, ease: "power3.out" },
        0.55
      );
      gsap.set(captions.slice(1), { opacity: 0 });
      intro.from(
        captions[0],
        { opacity: 0, duration: 0.6, ease: "power2.out" },
        1.1
      );

      // reference intro-out: the wrapper narrows 100vw → 80vw while the
      // principal image moves -5vw → -15vw (scroll.js: 'anim width & image').
      // Desktop only — on mobile the wrapper is the full column.
      if (window.matchMedia("(min-width: 951px)").matches) {
        intro.fromTo(
          introWrapper,
          { width: "100vw" },
          { width: "80vw", duration: 1.25, ease: "power3.out" },
          "-=.5"
        );
        intro.fromTo(
          heroMainInner,
          { x: "-5vw" },
          { x: "-15vw", duration: 1.25, ease: "power2.out" },
          "<"
        );
        // panel widths changed — re-measure every trigger range
        intro.eventCallback("onComplete", () => ScrollTrigger.refresh());
      }

      /* one filmstrip card's text choreography — masked slide-ups, corner
         by corner, then the title, character by character. Shared by the
         desktop and mobile builds. */
      const buildStripTextTl = (card: HTMLElement) => {
        const [tlm, trm, blm, brm] = Array.from(
          card.querySelectorAll<HTMLElement>(".strip-card__meta > *")
        );
        const title = card.querySelector<HTMLElement>("[data-card-title]")!;
        if (title.dataset.split !== "done") {
          title.dataset.split = "done";
          splitChars(title);
        }
        const chars = Array.from(title.querySelectorAll<HTMLElement>(".char"));
        // a breakpoint flip can rebuild this mid-reveal — re-base to the
        // shown state so from() always captures clean end values
        gsap.set([tlm, trm, blm, brm, ...chars], { yPercent: 0, opacity: 1 });

        const tl = gsap.timeline({ paused: true });
        const up = { yPercent: 100, duration: 0.33, ease: "power2.out" };
        tl.from(tlm, up, 0);
        tl.from(trm, up, 0.2);
        tl.from(blm, up, 0.2);
        tl.from(brm, { ...up, opacity: 0 }, 0.4);
        tl.from(
          chars,
          { yPercent: 110, duration: 0.25, stagger: 0.05, ease: "power2.out" },
          0.5
        );
        return tl;
      };

      /* the handoff panel's statement — the label, then the headline
         character by character with lines alternating direction, then the
         paragraph line by line. Shared by the desktop and mobile builds. */
      const buildHandoffTextTl = (root: HTMLElement) => {
        const label = root.querySelector<HTMLElement>(
          "[data-handoff-label] > span"
        );
        const lines = Array.from(
          root.querySelectorAll<HTMLElement>("[data-handoff-title] > span")
        );
        const parLines = Array.from(
          root.querySelectorAll<HTMLElement>("[data-handoff-par] .clip-y > span")
        );
        const lineChars = lines.map((line) => {
          if (line.dataset.split !== "done") {
            line.dataset.split = "done";
            splitChars(line);
          }
          return Array.from(line.querySelectorAll<HTMLElement>(".char"));
        });
        // re-base to the shown state — a breakpoint flip can rebuild this
        // mid-reveal (same rule as the strip cards)
        gsap.set([label, ...parLines, ...lineChars.flat()], {
          yPercent: 0,
          opacity: 1,
        });

        const tl = gsap.timeline({ paused: true });
        if (label)
          tl.from(
            label,
            { opacity: 0, yPercent: 100, duration: 0.33, ease: "power3.out" },
            0
          );
        lineChars.forEach((chars, i) => {
          if (!chars.length) return;
          // even lines rise from below, odd lines drop from above
          tl.from(
            chars,
            {
              yPercent: i % 2 !== 0 ? -110 : 110,
              duration: 0.65,
              stagger: 0.03,
              ease: "power3.out",
            },
            "<+=0.2"
          );
        });
        tl.from(
          parLines,
          { yPercent: 100, duration: 0.5, stagger: 0.09, ease: "power3.out" },
          "<+=0.33"
        );
        return tl;
      };

      /* ================================================================
         DESKTOP — pinned hero, scroll-driven composition
         ================================================================ */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 951px)", () => {
        /* The reference's scroll model, verbatim (scroll.js):
           one paused timeline translating the rail linearly, pinned with
           scrub: 1, pin distance = the rail's own width in px. Everything
           else — parallax, flips, colour swaps — is a scrubbed trigger
           against that travel via containerAnimation, so each fires exactly
           when its panel crosses the viewport, forward and backward. */
        const scrollTl = gsap.timeline({ paused: true });
        scrollTl.to(rail, {
          x: () => -Math.max(0, rail.scrollWidth - window.innerWidth),
          duration: 100,
          ease: "none",
        });

        const st = ScrollTrigger.create({
          // the anchor handler below reads this back to place the nav's jumps
          id: "rail-pin",
          animation: scrollTl,
          trigger: viewport,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          start: "top top",
          end: () => `+=${rail.scrollWidth}`,
          invalidateOnRefresh: true,
        });

        const subTriggers: ScrollTrigger[] = [];
        const cleanups: (() => void)[] = [];

        // principal image parallax — reference: x -15vw → 0,
        // start "0% 78%", end "90% 100%", scrub .5
        const imagesPanel = rail.querySelector<HTMLElement>(
          '[data-panel="images"]'
        )!;
        const imgTl = gsap.timeline({ paused: true });
        imgTl.fromTo(
          heroMainInner,
          { x: "-15vw" },
          { x: "0vw", ease: "none" }
        );
        subTriggers.push(
          ScrollTrigger.create({
            containerAnimation: scrollTl,
            animation: imgTl,
            trigger: imagesPanel,
            start: "0% 78%",
            end: "90% 100%",
            scrub: 0.5,
          })
        );

        // the hero overlay flip — reference default: start "100% 100%",
        // end "+=75%", scrub .35. Captions ride the same timeline.
        const heroFlipTl = buildFlipTimeline(heroFlip, 1.2)!;
        heroFlipTl.to(captions[0], { opacity: 0, duration: 0.4 }, 0);
        heroFlipTl.to(captions[1], { opacity: 1, duration: 0.4 }, 0.6);
        subTriggers.push(
          ScrollTrigger.create({
            containerAnimation: scrollTl,
            animation: heroFlipTl,
            trigger: heroFlip,
            start: "100% 100%",
            end: "+=75%",
            scrub: 0.35,
          })
        );

        // every other flip on the rail — reference values per variant:
        // rightLeft "100% 70%", leftRight "0% 70%" (data-start overrides),
        // the closing panel's flip "0% 0%" end "+=50%" scrub .33
        rail
          .querySelectorAll<HTMLElement>(
            ':scope > :not([data-panel="images"]) .flipMedia'
          )
          .forEach((el) => {
            // reference: data-duration on the element, else 1.5
            const flipTl = buildFlipTimeline(
              el,
              Number(el.dataset.duration) || 1.3
            );
            if (!flipTl) return;
            // the cierre's flip gets its own trigger in the closing block
            if (el.closest(".rail__cierre")) return;
            // reference: data-start on the element, else "100% 100%"
            let start = el.dataset.start || "100% 100%";
            if (!el.dataset.start) {
              if (el.classList.contains("flipMedia--rightLeft"))
                start = "100% 70%";
              else if (el.classList.contains("flipMedia--leftRight"))
                start = "0% 70%";
            }
            subTriggers.push(
              ScrollTrigger.create({
                containerAnimation: scrollTl,
                animation: flipTl,
                trigger: el.closest<HTMLElement>("[data-sync-flip]") ?? el,
                start,
                end: "+=75%",
                scrub: 0.35,
              })
            );
          });

        /* ---------- the closing panel holds full-screen ----------
           Reference verbatim (scroll.js 'anima last slide'): the red panel
           is 150vw carrying a 100vw content frame. As the frame crosses the
           screen its image layers parallax in from the left. The moment the
           frame owns the screen, it counter-translates right at exactly the
           rail's rate over the remaining 50vw of travel — the whole screen
           holds still, image dead-centre — and the flip plays during that
           hold, never before it. */
        const cierre = rail.querySelector<HTMLElement>(".rail__cierre");
        if (cierre) {
          const content = cierre.querySelector<HTMLElement>(
            "[data-cierre-content]"
          )!;
          const cierreMedia = content.querySelector<HTMLElement>(".flipMedia");
          // reference: ((cierre.offsetWidth - content.offsetWidth)*100)/innerWidth
          const percentMov = () =>
            ((cierre.offsetWidth - content.offsetWidth) * 100) /
            window.innerWidth;

          // parallax in — reference: from x -100%, content "left 100%" →
          // "left 0%", scrub .1
          if (cierreMedia) {
            const parallaxTl = gsap.timeline({ paused: true });
            parallaxTl.from(
              cierreMedia.querySelectorAll(":scope > *"),
              { x: "-100%", ease: "none" },
              0
            );
            subTriggers.push(
              ScrollTrigger.create({
                containerAnimation: scrollTl,
                animation: parallaxTl,
                trigger: content,
                start: "0% 100%",
                end: "0% 0%",
                scrub: 0.1,
              })
            );
            cleanups.push(() => parallaxTl.kill());
          }

          // the hold — reference: x 0% → percentMov%, cierre "left 0%" →
          // "left -percentMov%", scrub 0
          const holdTl = gsap.timeline({ paused: true });
          holdTl.fromTo(
            content,
            { x: "0%" },
            { x: () => `${percentMov()}%`, ease: "none" },
            0
          );
          subTriggers.push(
            ScrollTrigger.create({
              containerAnimation: scrollTl,
              animation: holdTl,
              trigger: cierre,
              start: "0% 0%",
              end: () => `+=${percentMov()}%`,
              scrub: true,
              invalidateOnRefresh: true,
            })
          );
          cleanups.push(() => holdTl.kill());

          // the flip — reference: "0% 0%", end "+=50%", scrub .33 — it runs
          // entirely inside the hold, while the image is centred full-screen
          const cierreFlipTl = cierreMedia && buildFlipTimeline(cierreMedia, 1);
          if (cierreFlipTl)
            subTriggers.push(
              ScrollTrigger.create({
                containerAnimation: scrollTl,
                animation: cierreFlipTl,
                trigger: cierre,
                start: "0% 0%",
                end: "+=50%",
                scrub: 0.33,
              })
            );
        }

        // the vertical word strip rides the scroll — reference:
        // from y 175vh, trigger "0% 95%" → "100% 0%", scrub .5.
        // GSAP decomposes the CSS `translateY(100vh) rotate(-90deg)` and
        // animates back to it, so the strip travels 75vh up the panel.
        const carousel = rail.querySelector<HTMLElement>(
          ".rail__carousel__content"
        );
        if (carousel) {
          const carouselTl = gsap.timeline({ paused: true });
          carouselTl.from(carousel, { y: "175vh", ease: "none" }, 0);
          subTriggers.push(
            ScrollTrigger.create({
              containerAnimation: scrollTl,
              animation: carouselTl,
              trigger: carousel.closest<HTMLElement>(".rail__carousel"),
              start: "0% 95%",
              end: "100% 0%",
              scrub: 0.5,
            })
          );
        }

        /* ---------- the values panel ---------- */
        const valuesPanel = rail.querySelector<HTMLElement>(
          '[data-panel="values"]'
        );
        if (valuesPanel) {
          // reference parallax, verbatim: the rows track via PADDING — a
          // layout property, because a transform would create a stacking
          // context and isolate the blend-difference knockout on the words
          const rows = Array.from(
            valuesPanel.querySelectorAll<HTMLElement>("[data-values-row]")
          );
          const rowsTl = gsap.timeline({ paused: true });
          if (rows[0]) rowsTl.to(rows[0], { paddingLeft: "12vw" }, 0);
          if (rows[1]) rowsTl.to(rows[1], { paddingRight: "3vw" }, 0);
          // reference: the paragraph's clearance narrows in step, easing
          // the second word leftward as the panel crosses
          const valuesIntro = valuesPanel.querySelector<HTMLElement>(
            ".rail__values__intro"
          );
          if (valuesIntro) rowsTl.to(valuesIntro, { marginRight: "3vw" }, 0);
          if (rows[2]) rowsTl.to(rows[2], { paddingLeft: "20vw" }, 0);
          subTriggers.push(
            ScrollTrigger.create({
              containerAnimation: scrollTl,
              animation: rowsTl,
              trigger: valuesPanel,
              start: "0% 100%",
              end: "100% 0%",
              scrub: 1,
            })
          );

          // the image that rides the pointer. It trails rather than pins —
          // quickTo re-targets an existing tween on every move, so the box is
          // always easing toward the cursor instead of snapping to it.
          const cursor = document.querySelector<HTMLElement>(
            "[data-values-cursor]"
          );
          const fine = window.matchMedia("(pointer: fine)").matches;
          if (cursor && fine) {
            gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0 });
            const xTo = gsap.quickTo(cursor, "x", {
              duration: 0.55,
              ease: "power3",
            });
            const yTo = gsap.quickTo(cursor, "y", {
              duration: 0.55,
              ease: "power3",
            });
            // the box is a child of the travelling panel now, so the pointer's
            // viewport coords have to be re-based against the panel every
            // frame — otherwise it drifts sideways with the rail under a
            // stationary cursor
            let px = -1;
            let py = -1;
            // reference behaviour: the image exists only while the pointer is
            // actually over this panel — it collapses (scale + fade) the
            // moment the pointer crosses into a neighbouring section. The
            // test runs every tick, so the rail sliding the panel under a
            // stationary pointer counts as entering/leaving too.
            let inSection = false;
            const sync = () => {
              const r = valuesPanel.getBoundingClientRect();
              const inside =
                px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
              if (inside !== inSection) {
                inSection = inside;
                gsap.to(cursor, {
                  autoAlpha: inside ? 1 : 0,
                  scale: inside ? 1 : 0,
                  duration: 0.33,
                  ease: "power2.out",
                });
              }
              // centred on the pointer, so half a box either side has to stay
              // inside the panel — otherwise it bleeds over its neighbours
              const hw = cursor.offsetWidth / 2;
              const hh = cursor.offsetHeight / 2;
              xTo(gsap.utils.clamp(hw, r.width - hw, px - r.left));
              yTo(gsap.utils.clamp(hh, r.height - hh, py - r.top));
            };
            const onMove = (e: PointerEvent) => {
              px = e.clientX;
              py = e.clientY;
            };
            window.addEventListener("pointermove", onMove);
            gsap.ticker.add(sync);

            // hovering a row swaps its image into the box — a top-down clip
            // wipe over a scale settle, prev layer kept one z below
            const imgs = Array.from(
              cursor.querySelectorAll<HTMLElement>("img")
            );
            let current = 0;
            rows.forEach((row, i) => {
              const onRow = () => {
                if (current === i || !imgs[i]) return;
                cursor.querySelector("img.prev")?.classList.remove("prev");
                const on = cursor.querySelector("img.on");
                if (on) {
                  on.classList.add("prev");
                  on.classList.remove("on");
                }
                imgs[i].classList.add("on");
                gsap.from(imgs[i], {
                  "--clipPath": "100% 0% 0% 0%",
                  duration: 1.25,
                  ease: "power3.out",
                });
                gsap.from(imgs[i], {
                  scale: 2,
                  duration: 2,
                  delay: -0.75,
                  ease: "power2.out",
                });
                current = i;
              };
              row.addEventListener("mouseenter", onRow);
              cleanups.push(() =>
                row.removeEventListener("mouseenter", onRow)
              );
            });

            cleanups.push(() => {
              window.removeEventListener("pointermove", onMove);
              gsap.ticker.remove(sync);
            });
          }
        }

        /* ---------- the filmstrip ---------- */
        const stripCards = Array.from(
          rail.querySelectorAll<HTMLElement>("[data-strip-card]")
        );
        if (stripCards.length) {
          let stripSt: ScrollTrigger | undefined;
          const textTls: gsap.core.Timeline[] = [];

          // one shared timeline, cards staggered a unit apart: the card
          // widens while its image shortens — the cover crop opens outward.
          // Widening a flex item pushes every later card to the right, into
          // the reserve the section already holds.
          const expTl = gsap.timeline({ paused: true });
          stripCards.forEach((card, i) => {
            const media = card.querySelector<HTMLElement>("[data-card-media]")!;
            expTl.fromTo(
              card,
              { width: "15vw" },
              { width: "60vw", duration: 1, ease: "power1.inOut" },
              i
            );
            expTl.fromTo(
              media,
              { height: "87vh" },
              { height: "66.66vh", duration: 1, ease: "power1.inOut" },
              i
            );

            // the text fires halfway through this card's expansion, both
            // directions — exits run 2.5x faster than entries
            const textTl = buildStripTextTl(card);
            textTls.push(textTl);
            expTl.call(
              () => {
                if (stripSt?.direction === -1) textTl.timeScale(2.5).reverse();
                else textTl.timeScale(1).play();
              },
              [],
              i + 0.5
            );
          });

          stripSt = ScrollTrigger.create({
            containerAnimation: scrollTl,
            animation: expTl,
            trigger: stripCards[0].parentElement,
            start: "0% 80%",
            // 60vw of travel per card — the width each one opens to
            end: () => `+=${0.6 * stripCards.length * window.innerWidth}`,
            scrub: true,
          });
          subTriggers.push(stripSt);
          cleanups.push(() => {
            expTl.kill();
            textTls.forEach((t) => t.kill());
          });
        }

        /* ---------- the handoff : horizontal in, vertical out ---------- */
        const handoff = rail.querySelector<HTMLElement>(
          '[data-panel="handoff"]'
        );
        if (handoff) {
          const card = handoff.querySelector<HTMLElement>(
            "[data-handoff-card]"
          )!;
          const cardIn = handoff.querySelector<HTMLElement>(
            "[data-handoff-content]"
          )!;
          const panel = handoff.querySelector<HTMLElement>(
            "[data-handoff-panel]"
          )!;
          const hCarousel = handoff.querySelector<HTMLElement>(
            "[data-handoff-carousel]"
          )!;
          const items = handoff.querySelectorAll<HTMLElement>(
            ".rail__handoff__item:not(.rail__handoff__item--link)"
          );
          const textTl = buildHandoffTextTl(handoff);

          // The whole frame is pushed right at exactly the rate the rail
          // travels left — 100vw over the trigger's 100vw of travel — so it
          // sits still on screen while everything inside it moves
          // vertically. No pinning, no position:fixed, just the
          // counter-translate. The columns re-proportion in lockstep
          // (60/40 → 42.5/57.5), so the frame stays exactly 100vw and
          // nothing downstream ever shifts — no refresh needed.
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
          });
          tl.to(handoff, { x: "100vw", duration: 2 }, 0);

          // phase 1 — carousel rises from below the fold, card content is
          // pushed up behind it, tall images compress toward natural height
          tl.to(card, { width: "42.5vw", duration: 1 }, 0);
          tl.to(panel, { width: "57.5vw", duration: 1 }, 0);
          tl.fromTo(
            hCarousel,
            { y: "100vh" },
            { y: "33.34vh", duration: 1 },
            0
          );
          tl.to(cardIn, { y: "-33.33vh", duration: 1 }, 0);
          tl.fromTo(items, { height: "66vh" }, { height: "33.33vh", duration: 1 }, 0);

          // phase 2 — second push; 37.5 + 37.5 + 25 = exactly 100vh, all
          // three tiles land flush with the viewport. The statement fires
          // here, time-based, both directions.
          tl.to(hCarousel, { y: "0vh", duration: 0.75 }, 1);
          tl.to(cardIn, { y: "-66.66vh", duration: 0.75 }, 1);
          tl.to(
            items,
            {
              height: "37.5vh",
              duration: 0.75,
              ease: "power1.inOut",
              onStart: () => textTl.timeScale(1).play(),
              onReverseComplete: () => textTl.reverse(),
            },
            1
          );
          // t 1.75 → 2 : a short frozen beat for the statement, then release

          subTriggers.push(
            ScrollTrigger.create({
              containerAnimation: scrollTl,
              animation: tl,
              trigger: handoff,
              start: "0% 0%",
              // relative form — the only end syntax the parser resolves
              // reliably with containerAnimation; matches the spacer width
              end: "+=100%",
              // hard-linked: any scrub lag would visibly unfreeze the frame
              scrub: true,
            })
          );

          // the card's own corners + title reveal as it arrives, pre-freeze
          const cardTextTl = buildStripTextTl(card);
          subTriggers.push(
            ScrollTrigger.create({
              containerAnimation: scrollTl,
              trigger: handoff,
              start: "0% 60%",
              onEnter: () => cardTextTl.timeScale(1).play(),
              onLeaveBack: () => cardTextTl.timeScale(2.5).reverse(),
            })
          );
          cleanups.push(() => {
            tl.kill();
            textTl.kill();
            cardTextTl.kill();
          });
        }

        // the fixed mark inverts while a dark panel is under it
        const whiteMark = document.querySelector("[data-logo-white]");
        gsap.set(whiteMark, { opacity: 1 }); // black intro is under it at rest
        subTriggers.push(
          ScrollTrigger.create({
            containerAnimation: scrollTl,
            trigger: rail.querySelector<HTMLElement>('[data-panel="intro"]'),
            start: "100% 3%",
            onEnter: () => gsap.to(whiteMark, { opacity: 0, duration: 0.25 }),
            onLeaveBack: () =>
              gsap.to(whiteMark, { opacity: 1, duration: 0.25 }),
          })
        );
        rail
          .querySelectorAll<HTMLElement>(
            '[data-panel="images-text"], .rail__cierre'
          )
          .forEach((panel) => {
            subTriggers.push(
              ScrollTrigger.create({
                containerAnimation: scrollTl,
                trigger: panel,
                start: "0% 3%",
                end: "100% 3%",
                onToggle: (self) =>
                  gsap.to(whiteMark, {
                    opacity: self.isActive ? 1 : 0,
                    duration: 0.25,
                  }),
              })
            );
          });

        // header + indicator step aside once the closing panel has arrived
        const headerEls = document.querySelectorAll(
          ".header, .header__contact, .scroll-indicator"
        );
        subTriggers.push(
          ScrollTrigger.create({
            containerAnimation: scrollTl,
            trigger: rail.querySelector<HTMLElement>(".rail__cierre"),
            start: "50% 100%",
            onEnter: () => gsap.to(headerEls, { opacity: 0, duration: 0.4 }),
            onLeaveBack: () =>
              gsap.to(headerEls, { opacity: 1, duration: 0.4 }),
          })
        );

        return () => {
          cleanups.forEach((fn) => fn());
          subTriggers.forEach((t) => t.kill());
          st.kill();
        };
      });

      /* ================================================================
         MOBILE — the rail unrolls vertically; the flips still scrub
         ================================================================ */
      mm.add("(max-width: 950px)", () => {
        const triggers = Array.from(
          rail.querySelectorAll<HTMLElement>(".flipMedia")
        ).map((el) => {
          const flipTl = buildFlipTimeline(el, 1.2);
          if (!flipTl) return null;
          return ScrollTrigger.create({
            animation: flipTl,
            // same rule as desktop: synced flips share one trigger, so one
            // scroll progress drives both
            trigger: el.closest<HTMLElement>("[data-sync-flip]") ?? el,
            start: "bottom bottom",
            end: "+=75%",
            scrub: 0.35,
          });
        });

        gsap.set(captions, { opacity: 1 });
        gsap.set(heroMainInner, { x: 0 });

        // mobile: the strip lies flat, so it tracks sideways instead
        // (reference: fromTo x 0 → -3em, scrub .5)
        const carousel = rail.querySelector<HTMLElement>(
          ".rail__carousel__content"
        );
        if (carousel) {
          const carouselTl = gsap.timeline({ paused: true });
          carouselTl.fromTo(
            carousel,
            { x: "0em" },
            { x: "-3em", ease: "none" },
            0
          );
          triggers.push(
            ScrollTrigger.create({
              animation: carouselTl,
              trigger: carousel.closest<HTMLElement>(".rail__carousel"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            })
          );
        }

        // the values panel is static on mobile — stacked rows, no parallax,
        // no follower (reference behaviour)

        // the filmstrip stacks vertically — each card a curtain reveal with
        // a parallax settle; the text follows once the card holds. The
        // class (not [data-strip-card]) so the handoff's anchor card gets
        // the same treatment here — on desktop it is deliberately excluded
        // from the expansion.
        const stripTls: gsap.core.Timeline[] = [];
        rail
          .querySelectorAll<HTMLElement>(".strip-card")
          .forEach((card) => {
            const media = card.querySelector<HTMLElement>("[data-card-media]")!;
            const img = media.querySelector<HTMLElement>("img")!;
            const curtain = gsap.timeline({ paused: true });
            curtain.fromTo(
              media,
              { height: 0 },
              { height: "62svh", ease: "power1.inOut" },
              0
            );
            curtain.fromTo(
              img,
              { scale: 1.5, yPercent: -15 },
              { scale: 1, yPercent: 0, ease: "power1.inOut" },
              0
            );
            const textTl = buildStripTextTl(card);
            stripTls.push(curtain, textTl);
            triggers.push(
              ScrollTrigger.create({
                animation: curtain,
                trigger: card,
                start: "0% 90%",
                end: "0% 25%",
                scrub: 0.25,
                onLeave: () => textTl.timeScale(1).play(),
                onLeaveBack: () => textTl.timeScale(2.5).reverse(),
              })
            );
          });

        // the handoff stacks: the carousel becomes an in-flow image list
        // with a parallax settle per image; the statement plays once,
        // slightly quick, when the panel arrives
        const handoff = rail.querySelector<HTMLElement>(
          '[data-panel="handoff"]'
        );
        if (handoff) {
          const textTl = buildHandoffTextTl(handoff);
          stripTls.push(textTl);
          handoff
            .querySelectorAll<HTMLElement>(
              ".rail__handoff__item:not(.rail__handoff__item--link) img"
            )
            .forEach((img) => {
              const pTl = gsap.timeline({ paused: true });
              // the image is 140% of its tile — this sweeps the crop window
              // top to bottom as the tile crosses the lower viewport
              pTl.fromTo(
                img,
                { yPercent: -28.5, scale: 1.1 },
                { yPercent: 0, scale: 1, ease: "power1.out" },
                0
              );
              stripTls.push(pTl);
              triggers.push(
                ScrollTrigger.create({
                  animation: pTl,
                  trigger: img.closest<HTMLElement>(".rail__handoff__item"),
                  start: "0% bottom",
                  end: "100% bottom",
                  scrub: 0.25,
                })
              );
            });
          triggers.push(
            ScrollTrigger.create({
              trigger: handoff.querySelector<HTMLElement>(
                "[data-handoff-panel]"
              ),
              start: "15% bottom",
              once: true,
              onEnter: () => textTl.timeScale(1.25).play(),
            })
          );
        }

        // the mark starts over the black intro panel, then crosses onto white
        const whiteMark = document.querySelector("[data-logo-white]");
        gsap.set([whiteMark], { opacity: 1 });
        const markSwap = ScrollTrigger.create({
          trigger: rail.querySelector('[data-panel="intro"]'),
          start: "bottom 12%",
          onEnter: () => {
            gsap.to(whiteMark, { opacity: 0, duration: 0.25 });
          },
          onLeaveBack: () => {
            gsap.to(whiteMark, { opacity: 1, duration: 0.25 });
          },
        });

        return () => {
          triggers.forEach((t) => t?.kill());
          stripTls.forEach((t) => t.kill());
          markSwap.kill();
        };
      });

      return () => mm.revert();
    }, viewportRef);

    /* Every in-page anchor, rail-aware. While the hero is pinned the panels
       on the rail all occupy the same document position — a native jump to
       one lands on the pin start, whichever panel was asked for. The rail
       translates linearly across the pin's range, so a panel's own offset
       along the rail is exactly its share of that range. Off the rail (and
       on mobile, where the rail unrolls vertically) it is a plain scroll. */
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.button !== 0) return;
      const el = e.target instanceof Element ? e.target : null;
      const link = el?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href")!.slice(1);
      if (id === "top") {
        e.preventDefault();
        return lenis.scrollTo(0);
      }
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const rail = railRef.current!;
      const pin = ScrollTrigger.getById("rail-pin");
      const panel = target.closest<HTMLElement>(".rail > *");
      if (pin && panel && rail.contains(panel)) {
        const travel = rail.scrollWidth - window.innerWidth;
        const progress = travel > 0 ? panel.offsetLeft / travel : 0;
        return lenis.scrollTo(pin.start + progress * (pin.end - pin.start));
      }
      lenis.scrollTo(target);
    };
    document.addEventListener("click", onAnchorClick);

    const onResize = () => {
      setVh();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <div className="rail-viewport" ref={viewportRef}>
        <div className="rail" ref={railRef}>
          <HeroText />
          <HeroImage />
          <RailSections />
        </div>
      </div>


      <ScrollIndicator />
    </>
  );
}
