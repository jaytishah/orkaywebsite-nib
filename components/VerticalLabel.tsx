import { NAV } from "@/lib/content";

/**
 * The edge element: navigation rotated -90deg, hinged on its bottom-right
 * corner so it runs up the right edge of the white panel.
 * Reference geometry preserved verbatim (top: padd - 1.15rem, right: padd).
 */
export default function VerticalLabel() {
  return (
    <ul className="rail__intro__menu f-grotesk t-parrafo t-upper">
      {NAV.map((item) => (
        <li key={item.label}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  );
}
