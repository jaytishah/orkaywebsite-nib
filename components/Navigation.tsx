import { CONTACT, MENU } from "@/lib/content";

/** Deliberately minimal — mark and one line of contact, nothing that
 *  competes with the hero composition.
 *
 *  The contact line is a sibling of <header>, not a child: `position: fixed`
 *  makes the header its own stacking context, and `mix-blend-mode` only
 *  blends within that. Kept outside, it blends against the page and stays
 *  legible over every panel the rail carries under it. */
export default function Navigation() {
  return (
    <>
      <header className="header">
        <a className="header__logo" href="/" aria-label="Orkay Tiles">
          <img src="/images/orkay-logo.svg" alt="Orkay Tiles" />
          <img src="/images/orkay-logo-white.svg" alt="" data-logo-white />
        </a>
      </header>

      {/* Frosted glass rather than a colour that has to be swapped: the nav
          carries its own white panel behind the type, so it stays legible
          over every panel the rail runs under it. */}
      <nav className="navpill f-grotesk t-parrafo" aria-label="Main">
        {MENU.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="header__contact f-grotesk t-parrafo"
        href={`tel:${CONTACT.exportSales.replace(/\s/g, "")}`}
      >
        Export {CONTACT.exportSales}
      </a>
    </>
  );
}
