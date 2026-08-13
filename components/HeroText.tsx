import { BRAND } from "@/lib/content";
import VerticalLabel from "./VerticalLabel";

/**
 * Panel 1 — the editorial half.
 *
 * The title is set as the reference's staggered statement: a long line at
 * the left margin, a short line indented to the axis, and the closing word
 * back at the left margin. All three are one grotesk at one weight — no
 * italic, no second face.
 *
 * The indent axis is not a magic number: the composition is a two-column
 * grid whose first column is `max-content`, so the axis lands exactly where
 * the longest left-margin line ends. "To", the paragraph and the meta line
 * all sit in column 2, which is what puts them on one vertical.
 */
export default function HeroText() {
  return (
    <div className="rail__intro" data-panel="intro">
      <div className="wrapper">
        <VerticalLabel />

        <div className="rail__intro__section f-edit t-parrafo-l" data-intro-fade>
          Home
        </div>
        <div className="rail__intro__copyright t-subtitulo f-grotesk" data-intro-fade>
          {BRAND.name} ©2026
        </div>

        <div className="rail__intro__content">
          <div className="rail__intro__wrap-titles">
            <div className="rail__intro__title" data-split-title>
              <span className="splitline clip-y">From Walls</span>
            </div>
            <div className="rail__intro__title" data-split-title>
              <span className="splitline clip-y">To</span>
            </div>
            <div className="rail__intro__title" data-split-title>
              <span className="splitline clip-y">Beyond</span>
            </div>
          </div>

          <div className="rail__intro__text f-grotesk" data-intro-text>
            <p>
              Since 1996, Orkay Tiles has been manufacturing premium ceramic and
              porcelain tiles in Morbi, Gujarat — surfaces where design,
              technology and enduring quality meet.
            </p>
          </div>

          <div className="rail__intro__meta t-subtitulo f-grotesk" data-intro-fade>
            <span>{BRAND.since}</span>
            <span>{BRAND.place}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
