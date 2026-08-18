/**
 * Every string here is Orkay's own, taken from orkaytiles.com.
 * No invented statistics, certifications, awards or export numbers.
 */

export const BRAND = {
  name: "Orkay Tiles",
  tagline: "From Walls to Beyond",
  since: "Since 1996",
  place: "Morbi · Gujarat · India",
  madeIn: "Made in India, Since 1996",
} as const;

export const CONTACT = {
  address:
    "Corporate Office. 62/63/64, Shakti Chember-1, 8A National Highway, Morbi-363642, (Gujarat), INDIA",
  indiaSales: "+91 98246 54222",
  exportSales: "+91 97120 54222",
  email: "info@orkaytiles.com",
} as const;

/** Orkay's own footer copy, from orkaytiles.com. */
export const FOOTER_BLURB =
  "We manufacture Ceramic Wall Tiles, Digital Porcelain Tiles, Glazed Vitrified Tiles & Double Charged Vitrified Tiles. We focus on Quality and Unique Designs for our clients that enable them to stay ahead in competition and grow their businesses.";

/** Live profiles, hrefs taken from the orkaytiles.com footer. */
export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/orkaytiles" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/orkay-tiles/" },
  { label: "Instagram", href: "https://www.instagram.com/orkay_tiles/" },
  { label: "YouTube", href: "https://www.youtube.com/@orkaytiles" },
] as const;

/**
 * The images panel's own chrome — reference: a single statement line across
 * the top of the section and the collection's wordmark set upside down in
 * the opposite corner, its line above it.
 */
export const HERO_MARK = {
  headline: "Rooms, not samples",
  name: BRAND.name,
} as const;

export const NAV = [
  { label: "About Us", href: "#about" },
  { label: "Our Products", href: "#chapters" },
  { label: "Packing Details", href: "#outro" },
  { label: "Contact Us", href: "#outro" },
] as const;

/** The fixed pill nav. `#top` is the document head — see Hero.tsx. */
export const MENU = [
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#chapters" },
  /* the outro block is already the contact card — address and both sales desks */
  { label: "Contact Us", href: "#outro" },
  { label: "Home", href: "#top" },
] as const;

/**
 * The showcase pair's right column, under the landscape image. Every line is
 * Orkay's own: Morbi is where the factories are (see the intro paragraph),
 * and the export desk in the header is the "to the world" half.
 */
export const SHOWCASE_MARK = {
  tagline: "From Morbi to the world.",
  /* the mark carries "since 1996" already — this line only places it */
  line: BRAND.place,
} as const;

/**
 * The values panel — geometry and type ported value-for-value from the
 * reference terms section. One image rides the pointer for all three rows.
 */
export const VALUES = [
  { num: "01", word: "Design" },
  { num: "02", word: "Technology" },
  { num: "03", word: "Durability" },
] as const;

export const VALUES_IMAGE = "/images/GIRL-SLEEPING.png";

export const VALUES_INTRO =
  "Ceramic and porcelain manufactured in Morbi since 1996 — design, technology and enduring quality held in a single surface, for walls, floors, counters and façades.";

/**
 * The closing handoff — the strip's last card freezes on screen while a
 * vertical image carousel rises over it and the statement lands beside it.
 * Line breaks are authored: the type is vw-fluid, so they hold at any width.
 */
export const HANDOFF = {
  label: "Products",
  /* Same register as the other statement panels: uppercase grotesk, the two
     closing lines pushed to the right axis, the last one in italic serif. */
  lines: [
    { text: "Every surface" },
    { text: "a room needs," },
    { text: "made in Morbi", right: true },
    { text: "since 1996.", right: true, em: true },
  ] as { text: string; right?: boolean; em?: boolean }[],
  paragraph: [
    "Ceramic walls, digital porcelain, glazed and",
    "double charged vitrified, wooden planks,",
    "counter tops and full porcelain slabs —",
    "the complete range, from one factory.",
  ],
  carousel: [
    {
      src: "/images/space-countertop-kitchen.png",
      alt: "Orkay counter top slab on a kitchen island",
    },
    {
      src: "/images/space-wooden-plank-living.jpg",
      alt: "Orkay wooden plank porcelain on a living room wall and floor",
    },
  ],
  linkLabel: "View all",
  linkHref: "#outro",
} as const;

export type Chapter = {
  num: string;
  title: string[];
  text: string;
  image: string;
  alt: string;
  /** panel colour, sampled off the card's own photograph */
  tint: string;
};

/** ink that stays readable on a card's tint — light type over the dark ones */
export function tintInk(tint: string) {
  const n = parseInt(tint.slice(1), 16);
  const lum = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 140 ? "var(--bone)" : "var(--ink)";
}

/** The six real Orkay product categories, with Orkay's own descriptions. */
export const CHAPTERS: Chapter[] = [
  {
    num: "(01)",
    title: ["Porcelain", "Tiles"],
    text: "Porcelain tiles are currently very popular for their wide variety of usages including walls to floors to bathroom sink and cabinets.",
    image: "/images/space-porcelain-facade.jpg",
    alt: "Orkay porcelain tiles cladding a modern house facade surrounded by ferns",
    tint: "#a49a8d",
  },
  {
    num: "(02)",
    title: ["Porcelain", "Slab Tiles"],
    text: "Porcelain slabs are big in sizes and serve as a better option than natural stone due to its scratch and stain resistance surface and longevity and very low maintance.",
    image: "/images/man-sitting-beige.png",
    alt: "Orkay porcelain slab flooring and feature wall in a living room",
    tint: "#c5b4a8",
  },
  {
    num: "(03)",
    title: ["Ceramic", "Tiles"],
    text: "Ceramic tile is a suitable choice for many areas of the home, whether it's walls or backsplashes of kitchen.",
    image: "/images/ceramic-tiles.png",
    alt: "Orkay ceramic wall tiles in a bathroom",
    tint: "#d2c8bf",
  },
  {
    num: "(04)",
    title: ["Wooden", "Plank"],
    text: "Wood looking porcelain tiles is better choice than natural wood plank due to its low maintenance and quick installation and better prices.",
    image: "/images/wooden-plank-demo.png",
    alt: "Orkay wooden plank porcelain on a living room wall and floor",
    tint: "#4b2407",
  },
  {
    num: "(05)",
    title: ["Counter", "Tops"],
    text: "Tiles as countertop are gaining huge popularity because its non pours, resistance to heat and durable surface makes it better choice than granite or marble.",
    image: "/images/IHBEIGE.png",
    alt: "Orkay counter top slab on a kitchen island",
    tint: "#c9b094",
  },
  {
    num: "(06)",
    title: ["Outdoor", "Tiles"],
    text: "Outdoor tiles are often made to survive the most severe weather conditions, including rain, sunshine, and temperature changes.",
    image: "/images/outdoor-tiles.png",
    alt: "Orkay blue marble-look porcelain floor seen from above, a woman reading in a blue lounge chair",
    tint: "#c0ab95",
  },
];
