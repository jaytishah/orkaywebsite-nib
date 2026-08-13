export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator f-grotesk t-subtitulo" aria-hidden="true">
      <span>Scroll</span>
      <span className="scroll-indicator__rule" data-scroll-rule />
    </div>
  );
}
