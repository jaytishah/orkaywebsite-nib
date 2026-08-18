import OverlayImageSequence, { FlipImage } from "./OverlayImageSequence";
import { HERO_MARK } from "@/lib/content";

/**
 * The overlay sequence — MATERIAL, against the SPACE behind it.
 * Every surface here is a real Orkay product, cropped from Orkay's own
 * photography. Index 0 shows at rest; each scroll step reveals the next.
 */
export const MATERIALS: (FlipImage & { caption: string })[] = [
  {
    src: "/images/mood-plank-firelight.jpg",
    alt: "Orkay wooden plank tiles around a fireplace, in warm evening light",
    caption: "Warmth that lives with you",
  },
  {
    src: "/images/mood-onyx-living.jpg",
    alt: "Orkay onyx-look porcelain slabs on the feature wall and glossy floor of a living room",
    caption: "Drama carved in stone",
  },
];

/**
 * Panel 2 — the large photographic half.
 *
 * The panel is wider than the viewport half it occupies (aspect 1279/960 at
 * full viewport height, as in the reference) and clips its own content, so
 * the image can drift left inside it without the composition moving.
 *
 * The overlay is vertically centred and seated beside the large image in the
 * panel's right padding — one grid gap off the image and off the panel edge,
 * never overlapping either. Same aspect as the reference (835/557).
 */
export default function HeroImage() {
  return (
    <div className="rail__images principal" data-panel="images">
      {/* reference: the statement runs across the top of the section */}
      <h2 className="rail__images__headline t-upper">{HERO_MARK.headline}</h2>

      <div className="media rail__images__image-single" data-hero-main>
        {/* over-wide, so the leftward parallax never exposes the panel */}
        <div className="media__wrap-source image" data-hero-main-inner>
          <img
            className="media__source w-100"
            src="/images/space-travertine-living.jpg"
            alt="Orkay travertine-look tiles across the floor and walls of a garden-side living room"
          />
        </div>
      </div>

      <OverlayImageSequence direction="upDown" images={MATERIALS} />

      <div className="rail__images__caption t-subtitulo f-grotesk">
        {MATERIALS.map((m, i) => (
          <span key={m.src} data-caption={i}>
            {m.caption}
          </span>
        ))}
      </div>

      {/* reference: the wordmark inverted in the bottom-right corner — the
          whole block rotated, ® leading */}
      <div className="rail__images__mark">
        <span className="rail__images__mark__word f-edit t-upper">
          {HERO_MARK.name}
          <sup>®</sup>
        </span>
      </div>
    </div>
  );
}
