import Link from "next/link";

/** A body entry is a paragraph, or a string[] rendered as a dashed list. */
export type LegalSection = { title: string; body: (string | string[])[] };

export default function LegalPage({
  title,
  em,
  meta,
  sections,
}: {
  title: string;
  /** the italic serif tail of the title, same register as .outro__title em */
  em: string;
  meta: string;
  sections: LegalSection[];
}) {
  return (
    <main className="legal">
      <Link className="legal__back t-upper" href="/">
        ← Orkay Tiles
      </Link>

      <h1 className="legal__title t-upper">
        {title} <em>{em}</em>
      </h1>
      <p className="legal__meta t-upper">{meta}</p>

      <div className="legal__body">
        {sections.map((s, i) => (
          <section key={s.title}>
            <h2 className="t-upper">
              <span>({String(i + 1).padStart(2, "0")})</span> {s.title}
            </h2>
            {s.body.map((b, j) =>
              Array.isArray(b) ? (
                <ul key={j}>
                  {b.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <p key={j}>{b}</p>
              )
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
