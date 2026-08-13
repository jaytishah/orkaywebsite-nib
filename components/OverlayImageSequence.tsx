import OverlayImage from "./OverlayImage";

export type FlipDirection =
  | "upDown"
  | "leftRight"
  | "rightLeft"
  /** the incoming image physically slides in from the left, over the old one */
  | "slideLeft"
  /** ...and from the right */
  | "slideRight";

export type FlipImage = { src: string; alt: string };

/**
 * A stack of image layers occupying exactly the same box, clipped by the
 * parent. Layers are painted bottom-up, so the array is rendered in reverse:
 * `images[0]` ends up on top and is what shows at rest.
 *
 * The `slide*` directions invert that: there the INCOMING image travels over
 * the one showing, so it has to be painted on top — DOM order is left alone
 * and `images[n]` sits above `images[n-1]`, parked outside the box until its
 * step. See `buildFlipTimeline`.
 *
 * Each scroll step moves the topmost remaining layer away and reveals the
 * next one. The transition is driven entirely by scroll position — no
 * autoplay, no timer, no arrows, no dots, no click. See `buildFlipTimeline`.
 */
export default function OverlayImageSequence({
  images,
  direction = "upDown",
  className = "",
  start,
  duration,
}: {
  images: FlipImage[];
  direction?: FlipDirection;
  className?: string;
  /** ScrollTrigger `start`, as the reference carries it: `data-start`. */
  start?: string;
  /** Length of one transition, as the reference's `data-duration`. */
  duration?: number;
}) {
  return (
    <div
      className={`flipMedia flipMedia--${direction} ${className}`.trim()}
      data-flip={direction}
      data-steps={images.length - 1}
      data-start={start}
      data-duration={duration}
    >
      {(() => {
        const layers = images.map((img, i) => (
          <OverlayImage key={img.src} index={i} src={img.src} alt={img.alt} />
        ));
        return direction.startsWith("slide") ? layers : layers.reverse();
      })()}
    </div>
  );
}
