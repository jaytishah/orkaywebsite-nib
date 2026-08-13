import {
  BRAND,
  CHAPTERS,
  HANDOFF,
  VALUES,
  VALUES_IMAGE,
  VALUES_INTRO,
  tintInk,
} from "@/lib/content";
import OverlayImageSequence from "./OverlayImageSequence";

/**
 * Everything the rail carries after the hero. Same editorial language:
 * full-height panels, oversized uppercase type, layered and overlapping
 * imagery, no cards, no grids of products.
 */
export default function RailSections() {
  return (
    <>
      {/* ---- panel 3 : the statement ---- */}
      <div className="rail__text" data-panel="text" id="about">
        <div className="wrapper">
          <div className="rail__text__section f-edit t-parrafo-l">About Us</div>

          <div className="rail__text__wrap-text">
            <div className="rail__text__title" data-lines>
              <span className="rail__text__title__line clip-y">
                <span>Surfaces made</span>
              </span>
              <span className="rail__text__title__line clip-y">
                <span>to outlast</span>
              </span>
              <span className="rail__text__title__line t-right clip-y">
                <span>
                  the <em>trend</em>
                </span>
              </span>
            </div>

            <div className="rail__text__text f-grotesk">
              <p>
                We manufacture Ceramic Wall Tiles, Digital Porcelain Tiles,
                Glazed Vitrified Tiles &amp; Double Charged Vitrified Tiles.
                From wall tiles to GVT/PGVT, nano vitrified tiles to porcelain
                slabs, we infuse our practicable aesthetic and function-first
                commitment into every product we make.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- panel 4 : material, on black ----
           Two overlapping images: the large one is full viewport height,
           the small one is 70% of it, straddling its right edge, vertically
           centred. `data-sync-flip` is what ties the two stacks to a
           single scroll progress in Hero.tsx — the large image slides in
           from the left while the small one slides in from the right, and
           they land on the same frame. The copy follows, after both. */}
      <div className="rail__images-text" data-panel="images-text">
        <div className="wrapper">
          <div className="rail__images-text__stack" data-sync-flip>
            {/* both pairs stay in the same light, warm register — an
                incoming image never drops the composition into shadow */}
            <OverlayImageSequence
              direction="slideLeft"
              images={[
                {
                  src: "/images/space-concrete-living.jpg",
                  alt: "Orkay wooden plank porcelain paving a garden terrace, two people sitting out in evening light",
                },
                {
                  src: "/images/tiles-photo.png",
                  alt: "Orkay concrete-effect porcelain on the floor and wall of a living room",
                },
              ]}
            />

            <OverlayImageSequence
              direction="slideRight"
              images={[
                {
                  src: "/images/material-porcelain-marble.jpg",
                  alt: "Orkay blue marble-look porcelain floor seen from above, a woman reading in a blue lounge chair",
                },
                {
                  src: "/images/material-blue-marble.jpg",
                  alt: "Orkay porcelain surface — polished marble-look finish",
                },
              ]}
            />
          </div>

          <div className="rail__images-text__text">
            <p>
              A tile is a wall, a floor, a counter, a façade — and then it is a
              room. <em>From walls to beyond.</em>
            </p>
          </div>
        </div>
      </div>

      {/* ---- vertical word strip (reference: .mod-scroll__carousel) ----
           A 1.5em-wide beige panel; the content box is laid out horizontally
           then hinged -90deg on its top-left corner after being dropped a
           full viewport height, so the wording runs bottom-to-top. */}
      <div className="rail__carousel t-supertitulo-l" data-panel="carousel">
        <div className="rail__carousel__content">
          {[0, 1, 2].map((i) => (
            <span key={i}>
              <p className="rail__carousel__text f-edit t-supertitulo t-upper">
                Values
              </p>
              <img className="rail__carousel__image" src="/images/asterisk.svg" alt="" />
            </span>
          ))}
        </div>
      </div>

      {/* ---- panel : two overlapping images, no text ----
           Reference verbatim (`mod-scroll__images.secundario`): the large
           stack fills the panel height, the smaller one hangs off its right
           edge, vertically centred and overlapping it. One reveals from the
           left, the other from the right, and their `data-start` values put
           them within 16% of each other so they read as simultaneous. */}
      <div className="rail__images secundario" data-panel="images-secundario">
        <OverlayImageSequence
          direction="rightLeft"
          start="116% 100%"
          duration={1.7}
          images={[
            {
              src: "/images/space-slab-living.png",
              alt: "Orkay porcelain tiles cladding a modern house facade surrounded by ferns",
            },
            {
              src: "/images/space-porcelain-facade.jpg",
              alt: "Orkay porcelain slab flooring and feature wall in a living room",
            },
          ]}
        />

        <OverlayImageSequence
          direction="leftRight"
          start="100% 100%"
          duration={1.7}
          images={[
            {
              src: "/images/space-ceramic-bathroom.jpg",
              alt: "Orkay ceramic wall tiles in a bathroom",
            },
            {
              src: "/images/coffe-tiles.png",
              alt: "Orkay blue marble flooring in a living space with a lounge chair",
            },
          ]}
        />
      </div>

      {/* ---- panel : the three values ----
           Type and geometry ported value-for-value from the reference:
           every word in the serif at supertitulo-l over blend-difference,
           so the letters invert wherever they cross the follow image.
           The rows track via PADDING tweens in Hero.tsx — layout, not
           transform, because a transform would isolate the blend. */}
      <div className="rail__values" data-panel="values">
        {/* the pointer image — one layer, shared by every row */}
        <div className="values-cursor" data-values-cursor aria-hidden>
          <img src={VALUES_IMAGE} alt="" className="on" />
        </div>

        {VALUES.map((v, i) => (
          <div className="rail__values__row" data-values-row key={v.word}>
            {/* reference anatomy: the paragraph lives IN the second row's
                flex flow, before the title — it is what pushes the word
                rightward, so the two can never overlap */}
            {i === 1 && (
              <p className="rail__values__intro f-grotesk t-parrafo">
                {VALUES_INTRO}
              </p>
            )}
            <div className="rail__values__wrap-title">
              <div className="rail__values__num f-edit t-parrafo">{v.num}</div>
              <h2 className="rail__values__word t-supertitulo-l f-edit lh-less2 t-upper">
                <span className="rail__values__word__filter">
                  <span className="rail__values__word__color">{v.word}</span>
                </span>
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ---- the filmstrip : six chapters as expanding cards ----
           The section reserves its final width; each card opens 15vw → 60vw
           inside it as it arrives, pushing its siblings outward. The
           expansion and the masked text reveals live in Hero.tsx. */}
      <div className="rail__strip" data-panel="strip" id="chapters">
        <div className="rail__strip__intro">
          <div className="f-edit t-parrafo-l">Products</div>
          <p className="rail__strip__text f-grotesk">
            Six families of surfaces — every format Orkay makes, from ceramic
            walls to full porcelain slabs.
          </p>
        </div>

        <div className="rail__strip__cards">
          {CHAPTERS.slice(0, 5).map((chapter) => (
            <article
              className="strip-card"
              data-strip-card
              key={chapter.num}
              style={{ background: chapter.tint, color: tintInk(chapter.tint) }}
            >
              <div className="strip-card__media" data-card-media>
                <img src={chapter.image} alt={chapter.alt} />
              </div>
              <div className="strip-card__panel f-grotesk">
                <h2 className="strip-card__title" data-card-title>
                  {chapter.title.join(" ")}
                </h2>
                <span className="strip-card__meta strip-card__meta--tl">
                  <span>{BRAND.since}</span>
                </span>
                <span className="strip-card__meta strip-card__meta--tr">
                  <span>{BRAND.place}</span>
                </span>
                <span className="strip-card__meta strip-card__meta--bl">
                  <span>{chapter.num}</span>
                </span>
                <span className="strip-card__meta strip-card__meta--br">
                  <a className="strip-card__cta" href="#outro">
                    The range
                  </a>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ---- the handoff : the row's sixth card is the anchor ----
           A flex pair that always sums to 100vw: the card column (60vw,
           narrowing to 42.5) and the statement panel (40vw, growing to
           57.5). Hero.tsx counter-translates the whole frame right at
           exactly the rate the rail travels left, so it holds still on
           screen while the carousel rises vertically inside the card.
           The empty .rail__pin after it buys the horizontal distance the
           frozen beat consumes. */}
      <div className="rail__handoff" data-panel="handoff">
        <article
          className="strip-card rail__handoff__card"
          data-handoff-card
          style={{
            background: CHAPTERS[5].tint,
            color: tintInk(CHAPTERS[5].tint),
          }}
        >
          <div className="rail__handoff__inner" data-handoff-content>
            <div className="strip-card__media" data-card-media>
              <img src={CHAPTERS[5].image} alt={CHAPTERS[5].alt} />
            </div>
            <div className="strip-card__panel f-grotesk">
              <h2 className="strip-card__title" data-card-title>
                {CHAPTERS[5].title.join(" ")}
              </h2>
              <span className="strip-card__meta strip-card__meta--tl">
                <span>{BRAND.since}</span>
              </span>
              <span className="strip-card__meta strip-card__meta--tr">
                <span>{BRAND.place}</span>
              </span>
              <span className="strip-card__meta strip-card__meta--bl">
                <span>{CHAPTERS[5].num}</span>
              </span>
              <span className="strip-card__meta strip-card__meta--br">
                <a className="strip-card__cta" href="#outro">
                  The range
                </a>
              </span>
            </div>
          </div>

          {/* the vertical carousel, parked a full viewport below */}
          <div className="rail__handoff__carousel" data-handoff-carousel>
            {HANDOFF.carousel.map((im) => (
              <div className="rail__handoff__item" key={im.src}>
                <img src={im.src} alt={im.alt} />
              </div>
            ))}
            <a
              className="rail__handoff__item rail__handoff__item--link"
              href={HANDOFF.linkHref}
            >
              <span className="rail__handoff__view t-upper f-grotesk">
                {HANDOFF.linkLabel}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          </div>
        </article>

        <div className="rail__handoff__panel" data-handoff-panel>
          <div className="rail__handoff__wrap">
            <span
              className="rail__handoff__label f-edit t-parrafo-l"
              data-handoff-label
            >
              <span>{HANDOFF.label}</span>
            </span>
            <h2 className="rail__handoff__title" data-handoff-title>
              {HANDOFF.lines.map((line) => (
                <span
                  className={`rail__handoff__line clip-y${line.right ? " t-right" : ""
                    }`}
                  key={line.text}
                >
                  {line.em ? <em>{line.text}</em> : line.text}
                </span>
              ))}
            </h2>
            <div className="rail__handoff__par f-grotesk" data-handoff-par>
              {HANDOFF.paragraph.map((line) => (
                <span className="clip-y" key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rail__pin" data-handoff-pin aria-hidden />

      {/* ---- closing panel ----
           Reference verbatim (`mod-scroll__cierre`): 150vw of red carrying a
           100vw × 100vh content frame with the image grid-centred inside it.
           The frame counter-translates right over the rail's last 50vw of
           travel (Hero.tsx), so it holds full-screen while the flip plays —
           the image never leaves the centre of the screen. */}
      <div className="rail__cierre" data-panel="cierre">
        <div className="rail__cierre__content" data-cierre-content>
          <div className="rail__cierre__head t-subtitulo f-grotesk t-upper">
            <span>{BRAND.madeIn}</span>
            <span>{BRAND.place}</span>
          </div>

          <OverlayImageSequence
            direction="upDown"
            className="rail__cierre__image"
            images={[
              {
                src: "/images/space-wooden-plank-living.jpg",
                alt: "Orkay wooden plank porcelain on a living room wall and floor",
              },
              {
                src: "/images/white-marble-ih.png",
                alt: "Orkay white marble-look porcelain wall and floor, a man in a black suit standing against it",
              },
            ]}
          />

          <h2 className="rail__cierre__title">
            From walls
            <br />
            to <em>beyond.</em>
          </h2>
        </div>
      </div>
    </>
  );
}
