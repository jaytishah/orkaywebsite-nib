import gsap from "gsap";

/** Layers of a flip, in sequence order — index 0 is what shows at rest. */
export function flipLayers(el: Element): HTMLElement[] {
  const nodes = Array.from(
    el.querySelectorAll<HTMLElement>(":scope > .flipMedia__media")
  );
  // slide stacks are already painted in sequence order; the rest are reversed
  return isSlide(el) ? nodes : nodes.reverse();
}

const isSlide = (el: Element) => !!el.getAttribute("data-flip")?.startsWith("slide");

/**
 * The reference's flipMedia choreography, ported value-for-value, then
 * chained so a stack of N images steps through N-1 transitions.
 *
 *   upDown     : the top layer slides up and out (-105%, power3.out) while the
 *                revealed layer's source drifts down from -10%, over a span
 *                40% longer than the wipe — so the material keeps settling
 *                after the wipe has landed. That tail IS the settle beat.
 *   leftRight  : the top layer's clip-path inset collapses from the right
 *   rightLeft  : ...and from the left, both with the incoming source
 *                un-scaling from 1.2 (power2.out)
 *   slideLeft  : the incoming layer is parked one full box-width to the LEFT
 *                and glides right until it has covered the outgoing one. It
 *                is a real translation, not a fade and not a clip reveal —
 *                the old image stays fully opaque underneath until the last
 *                pixel is covered. Its source counter-drifts at 25% for depth.
 *   slideRight : ...mirrored, parked to the right, gliding left.
 *
 * Nothing here is time-driven. The returned timeline is paused and is only
 * ever advanced by scroll position. `step` is the length of one transition;
 * the timeline runs for `step * (layers - 1)`.
 */
export function buildFlipTimeline(el: Element, step = 1.2) {
  const layers = flipLayers(el);
  if (layers.length < 2) return null;

  const leftRight = el.classList.contains("flipMedia--leftRight");
  const rightLeft = el.classList.contains("flipMedia--rightLeft");
  const slideFrom = el.classList.contains("flipMedia--slideLeft")
    ? -100
    : el.classList.contains("flipMedia--slideRight")
    ? 100
    : 0;
  const tl = gsap.timeline({ paused: true });

  for (let i = 0; i < layers.length - 1; i++) {
    const out = layers[i];
    const incoming = layers[i + 1];
    const inSource = incoming.querySelector(".media__source");
    const at = i * step;

    if (slideFrom) {
      // x: 0 matters — GSAP parses the CSS parking transform
      // (translateX(±100%)) as a *pixel* x, and xPercent animates on top of
      // it; without clearing it the layer glides from 200% back to 100%.
      tl.fromTo(
        incoming,
        { xPercent: slideFrom, x: 0 },
        { xPercent: 0, x: 0, duration: step, ease: "power2.inOut" },
        at
      );
      // the photograph lags the frame it arrives in, then catches up
      tl.fromTo(
        inSource,
        { xPercent: -slideFrom * 0.25 },
        { xPercent: 0, duration: step, ease: "power2.inOut" },
        at
      );
      // the covered image eases away under it
      tl.fromTo(
        out.querySelector(".media__source"),
        { xPercent: 0 },
        { xPercent: slideFrom * 0.12, duration: step, ease: "power2.inOut" },
        at
      );
    } else if (leftRight || rightLeft) {
      const clip = leftRight ? "0% 100% 0% 0%" : "0% 0% 0% 100%";
      tl.to(out, { "--clipPath": clip, duration: step, ease: "power2.out" }, at);
      tl.from(
        inSource,
        { scale: 1.2, duration: step + 0.5, ease: "power2.out" },
        at
      );
    } else {
      tl.to(out, { y: "-105%", duration: step, ease: "power3.out" }, at);
      tl.from(
        inSource,
        { y: "-10%", duration: step + 0.5, ease: "power3.out" },
        at
      );
    }
  }

  return tl;
}

/** Split an element's text into per-character spans, preserving inline tags. */
export function splitChars(root: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text) return;
      const frag = document.createDocumentFragment();
      for (const ch of Array.from(text)) {
        const span = document.createElement("span");
        span.className = "char";
        span.style.display = "inline-block";
        span.style.willChange = "transform";
        // a plain space alone in an inline-block is leading AND trailing
        // whitespace of its line box, so it collapses to zero width and the
        // words jam together — the non-breaking space is what holds it open
        span.textContent = ch === " " ? " " : ch;
        // lets CSS reach a specific letter (the O carries the logo's dot);
        // upper-cased because the source text is mixed case and the type is
        // uppercased visually, by text-transform
        span.dataset.char = ch.toUpperCase();
        frag.appendChild(span);
        chars.push(span);
      }
      node.parentNode?.replaceChild(frag, node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };

  Array.from(root.childNodes).forEach(walk);
  return chars;
}
