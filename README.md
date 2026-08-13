# Orkay Tiles — From Walls to Beyond

A recreation of the **normalisboring.es** scroll experience with Orkay Tiles
content, imagery and branding. The composition, motion and interaction are the
reference's; only the brand is Orkay's.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Next.js 15 (App Router) · TypeScript · GSAP + ScrollTrigger · Lenis.

---

## How the reference was ported

The reference's stylesheet and scripts were read directly
(`css/main.css`, `js/main.js`, `js/scroll.js`) and its primitives were carried
over value-for-value rather than approximated by eye.

| Reference | Here |
| --- | --- |
| `--fsize: 1.0416666667vw` fluid rem base | same, in [globals.css](app/globals.css) |
| `--supertitulo` … `--subtitulo` type scale | same tokens, same values |
| `--grid-gap: 1.5rem`, `--wrapper-padd: 1.65rem`, 12-col arithmetic | same, exposed as `--col` |
| `main .mod-scroll` — `display:flex; width:fit-content`, panels at `100vh` | `main .rail` |
| `.mod-scroll__intro` — editorial panel, `justify-content:center` | `.rail__intro`, on the reference's `.bg-black.c-white` variant |
| `.mod-scroll__intro__wrap-titles` — `grid-template-columns: auto auto`, 3 blocks | same, so line 2 of block 2 lands beside "WALLS" |
| `.mod-scroll__intro__menu` — `rotate(-90deg)`, `transform-origin: bottom right` | `.rail__intro__menu` ([VerticalLabel](components/VerticalLabel.tsx)) |
| `.mod-scroll__section` — `top:50%; left:padd; translateY(-50%)` | same |
| `.mod-scroll__images__image-single` — `aspect-ratio: 1279/960; height:100vh`, panel `overflow: clip` | same |
| overlay `aspect-ratio: 835/557`, vertically centred, flush right, inset `1 col + gap` | same inset; width scaled to the 50vw window (see below) |
| `.flipMedia` two-layer clip primitive, `--clipPath: inset()` | [OverlayImageSequence](components/OverlayImageSequence.tsx) |
| `pin: "main"`, `scrub: 1`, horizontal `x` translate with `ease:"none"` | [Hero.tsx](components/Hero.tsx) |
| `.mod-scroll__images-text`, `.mod-scroll__projects__item`, `.mod-scroll__cierre` | [RailSections.tsx](components/RailSections.tsx) |

### The flip, exactly

From the reference's `setFlips()` in `js/main.js`, reproduced in
[lib/flip.ts](lib/flip.ts):

```
upDown     up:   y  1.2s power3.out  -105%
           down: source y -10% → 0 over 1.7s power3.out   (40% longer — the tail is the settle)
leftRight  up:   --clipPath → 0% 100% 0% 0%   1.3s power2.out
rightLeft  up:   --clipPath → 0% 0% 0% 100%   1.3s power2.out
           down: source scale 1.2 → 1 over 1.8s power2.out
```

No autoplay, no timer, no arrows, no dots, no click. Every flip is a paused
timeline placed on the scrubbed master, so scrolling back reverses it.

---

## The hero timeline

`scrub: 1` over a pinned `.rail-viewport`. Beats are expressed as multiples of
viewport height so the pacing holds at any window size:

```
0                                                                     pin end
├── HOLD    0.35vh          composition still — scroll begins, nothing moves
├── FLIP    0.95vh × steps  overlay wipes through the material stack;
│                           large image drifts LEFT inside its own clip
├── SETTLE  0.45vh          incoming material finishes its parallax
├── TRAVEL  railWidth − 100vw   the rail slides left through the chapters
└── TAIL    1.10vh          closing panel holds while its own flip lands
```

The large image sits in a wrap that is `100% + 15vw` wide inside a clipped
panel, so it can drift the full distance leftward without ever exposing the
panel behind it.

### The one place the geometry could not be copied verbatim

The reference hangs the overlay off `right: 0` of an image panel that is ~83vw
wide, at `5.45` of 12 columns. Because our composition rests at an exact 50/50
split, that panel's *visible window* is 50vw — a verbatim `right: 0` would put
the overlay almost entirely off-screen at rest. The overlay therefore keeps the
reference's aspect (835/557), its vertical centring, its `1 col + 1 gap` inset
and its ~71% overlay-to-window ratio, expressed against the visible window
instead of the full panel: `4.55` columns. Everything else is the reference's
own arithmetic.

The 50/50 split is the *initial* viewport: the type panel is `50vw`, the image
panel is `1279/960 × 100vh` wide (~75vw), so the right half of the screen is
image and the panel keeps a hidden reserve to parallax into. During HOLD →
SETTLE the rail's `x` is untouched — the left half, the typography and the split
do not move at all. Only the overlay changes.

Below 950px the rail unrolls vertically (as the reference does) and each flip
gets its own scrubbed trigger. The type scale, the image layering and the
overlay overlap are preserved.

---

## Content and imagery

All copy is Orkay's own, from orkaytiles.com — see [lib/content.ts](lib/content.ts).
No statistics, certifications, awards or export figures were invented.

All photography is Orkay's own product and lifestyle imagery, downloaded from
orkaytiles.com. The two hero *material* images are crops of Orkay's own
high-resolution renders, so the tile surface shown is a real Orkay product:

| File | Source |
| --- | --- |
| `space-porcelain-bathroom.jpg` | `CRYSTAL-STATUARIO_VIEW-1` |
| `space-wooden-plank-living.jpg` | `NEST-GREY_view-1` |
| `space-slab-living.png` | `SLAB2` |
| `space-countertop-kitchen.png` | `COUNTER-1` |
| `space-ceramic-bathroom.jpg` | `CERAMIC` |
| `space-outdoor-pool.png` | `outdoor-tiles` |
| `material-wooden-plank.jpg` | crop of `NEST-GREY_view-1` (plank wall) |
| `material-counter-top.jpg` | crop of `COUNTER-1` (full-body slab island) |
| `material-counter-vanity.jpg` | crop of `CRYSTAL-STATUARIO_VIEW-1` (nero top + walnut) |
| `material-ceramic-decor.jpg` | crop of `CERAMIC` (décor band + wall) |
| `material-porcelain-slab.jpg` | crop of `SLAB2` (veined slab floor) |
| `material-porcelain-marble.jpg` | crop of `CRYSTAL-STATUARIO_VIEW-1` (floor) |

Hero sequence: **main = space** (porcelain bathroom), **overlay = material** —
two dark surfaces, as in the reference, which also uses exactly two layers.

The overlay is an N-layer stack, so `MATERIALS` in
[HeroImage.tsx](components/HeroImage.tsx) can hold more than two; the timeline
and the captions size themselves from the array length and the pin grows by
`FLIP` per extra step. Any entry needs tonal contrast against the bright marble
main image, which is why the light crops are not in the hero set.

## Typefaces

The reference uses Juana, PP Editorial New and Izmir — all licensed. Substituted
with **Archivo** (grotesk, 300) and **Instrument Serif** (editorial italic),
matched on weight, uppercase proportion and tracking rather than on name.
Swap them in [layout.tsx](app/layout.tsx) if the real licences are available.
