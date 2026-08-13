import BrandStretch from "@/components/BrandStretch";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import { BRAND, CONTACT, CHAPTERS } from "@/lib/content";

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
        <figure className="showcase__small">
          <img
            src="/images/space-beige-living.png"
            alt="Beige marble-look porcelain feature wall and floor in a living room"
          />
        </figure>
      </section>

      {/* ---- the pitch ----
           Three display lines with the last pushed to the right axis, the
           paragraph on the right half behind a single accent dot, and one
           centred pill closing the panel. */}
      <section className="pitch">
        <h2 className="pitch__title f-edit t-upper">
          <span>Excellence in its</span>
          <span>highest</span>
          <span className="t-right">Expression</span>
        </h2>

        <div className="pitch__body">
          <p>
            At Orkay Tiles our priority is a close, personal service — helping
            architects, dealers and homeowners find the right surface. Our team
            is on hand to answer your questions and guide you through every step,
            from selection to packing and export. Talk to us and start the
            process.
          </p>
          <p className="pitch__contact">
            India — {CONTACT.indiaSales}
            <br />
            Export — {CONTACT.exportSales}
          </p>
        </div>

        <a className="pitch__cta f-edit" href="#outro">
          Request information
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

        <div className="outro__grid">
          <div>
            <h3>Products</h3>
            {CHAPTERS.map((c) => (
              <p key={c.num}>{c.title.join(" ")}</p>
            ))}
          </div>
          <div>
            <h3>Corporate Office</h3>
            <p>{CONTACT.address}</p>
          </div>
          <div>
            <h3>Sales</h3>
            <p>India — {CONTACT.indiaSales}</p>
            <p>Export — {CONTACT.exportSales}</p>
          </div>
          <div>
            <h3>Since</h3>
            <p>{BRAND.since}</p>
            <p>{BRAND.place}</p>
          </div>
        </div>

        <div className="outro__foot t-subtitulo">
          <span>
            {BRAND.name} — {BRAND.tagline}
          </span>
          <span>{BRAND.madeIn}</span>
        </div>
      </section>
    </>
  );
}
