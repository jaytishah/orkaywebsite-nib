/**
 * A single media layer inside a flip.
 * Mirrors the reference's `.media > .media__wrap-source > .media__source`
 * three-node structure: the wrap is what gets over-sized so the source
 * has somewhere to travel during the parallax.
 */
export default function OverlayImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  /** 0 is the topmost layer — the one showing at rest. */
  index: number;
}) {
  return (
    <div className="media flipMedia__media" data-layer={index}>
      <div className="media__wrap-source image">
        <img className="media__source w-100" src={src} alt={alt} />
      </div>
    </div>
  );
}
