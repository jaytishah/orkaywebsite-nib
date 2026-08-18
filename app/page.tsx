import BrandStretch from "@/components/BrandStretch";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import {
  BRAND,
  CONTACT,
  CHAPTERS,
  FOOTER_BLURB,
  MENU,
  SHOWCASE_MARK,
  SOCIALS,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
      </main>

      {/* ---- the statement, once the rail has run out ----
           Reference anatomy: a full-viewport cream panel holding one giant
           serif line, a parenthesised contact link centred above it, and the
           other half of the wordmark set upside down in the far corner. */}
      <section className="statement">
        <a className="statement__contact f-edit" href="#outro">
          (Contact us)
        </a>

        <h2 className="statement__title t-upper">
          <span>Design beyond</span>
          <span>the surface</span>
        </h2>

        <span className="statement__mark f-edit t-upper" aria-hidden>
          Tiles®
        </span>
      </section>

      {/* ---- the pair ----
           Reference anatomy: a big near-square image hard against the left
           padding and a smaller landscape one beside it, both hung from the
           same top line, two columns of cream left free at the right. */}
      <section className="showcase">
        <figure className="showcase__large">
          <img
            src="/images/family-tiles.png"
            alt="A father marking his son's height against a marble-look tiled wall"
          />
        </figure>
        {/* the right column runs the full height of the square beside it, so
            the mark falls to the bottom of the dead space under the
            landscape image rather than floating directly beneath it */}
        <div className="showcase__col">
          <figure className="showcase__small">
            <img
              src="/images/space-beige-living.png"
              alt="Beige marble-look porcelain feature wall and floor in a living room"
            />
          </figure>

          <div className="showcase__mark">
            <img
              className="showcase__mark__logo"
              src="/images/orkay-logo.svg"
              alt={BRAND.name}
            />
            <p className="showcase__mark__tagline f-grotesk">
              {SHOWCASE_MARK.tagline}
            </p>
            <p className="showcase__mark__line t-subtitulo f-grotesk t-upper">
              {SHOWCASE_MARK.line}
            </p>
          </div>
        </div>
      </section>

      {/* ---- the pitch ----
           Three display lines with the last pushed to the right axis, the
           paragraph on the right half behind a single accent dot, and one
           centred pill closing the panel. */}
      <section className="pitch">
        <h2 className="pitch__title f-edit t-upper">
          <span>A surface is a</span>
          <span>decision</span>
          <span className="t-right">you live with</span>
        </h2>

        <div className="pitch__body">
          <p>
            Architects, dealers and homeowners arrive with a space and a feeling
            about it. We help them find the surface that answers it, then stay
            with it through selection, packing and export.
          </p>
          <p className="pitch__contact">
            India — {CONTACT.indiaSales}
            <br />
            Export — {CONTACT.exportSales}
          </p>
        </div>

        <a className="pitch__cta f-edit" href="#outro">
          Ask about a surface
        </a>
      </section>

      {/* ---- the wordmark, elongating on scroll ----
           Reference: normalisboring.es — the giant footer "BORING". */}
      <BrandStretch />

      <section className="outro" id="outro">
        <h2 className="outro__title">
          Ceramic wall tiles, digital porcelain, glazed vitrified and{" "}
          <em>porcelain slabs.</em>
        </h2>

        {/* ---- the columns ----
             Reference anatomy (orkaytiles.com footer): the mark and its blurb
             on the left, quick links and products beside it, the full contact
             card on the right — recut in this site's register. */}
        <div className="outro__grid">
          <div className="outro__brand">
            <img src="/images/orkay-logo-white.svg" alt={BRAND.name} />
            <p className="outro__brand__tagline f-edit">
              Explore Orkay Tiles — <em>{BRAND.tagline}</em>
            </p>
            <p className="outro__brand__blurb">{FOOTER_BLURB}</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            {MENU.map((m) => (
              <p key={m.label}>
                <a href={m.href}>{m.label}</a>
              </p>
            ))}
            <p>
              <a href="/privacy-policy">Privacy Policy</a>
            </p>
            <p>
              <a href="/terms-and-conditions">Terms &amp; Conditions</a>
            </p>
          </div>
          <div>
            <h3>Our Products</h3>
            {CHAPTERS.map((c) => (
              <p key={c.num}>
                <a href="#chapters">{c.title.join(" ")}</a>
              </p>
            ))}
          </div>
          <div>
            <h3>Contact Details</h3>
            <p>{CONTACT.address}</p>
            <p className="outro__contact">
              <a href={`tel:${CONTACT.indiaSales.replace(/\s/g, "")}`}>
                India — {CONTACT.indiaSales}
              </a>
              <a href={`tel:${CONTACT.exportSales.replace(/\s/g, "")}`}>
                Export — {CONTACT.exportSales}
              </a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </div>

        <div className="outro__foot t-subtitulo">
          <span>
            Copyright © {new Date().getFullYear()} {BRAND.name}. All Rights
            Reserved.
          </span>
          <span>{BRAND.madeIn}</span>
          <span className="outro__social">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </span>
        </div>
      </section>
    </>
  );
}
