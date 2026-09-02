/**
 * Hover/select gradient "film" + title shown over a mosaic grid tile. The
 * parent link must be `className="group relative ..."` for group-hover to
 * reach this.
 */
export function MosaicTileOverlay({ title, colorVar }: { title: string; colorVar: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100"
      style={{
        backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(${colorVar}) 55%, transparent), color-mix(in oklab, var(${colorVar}) 88%, transparent))`,
      }}
    >
      <h2
        className="text-center text-lg leading-tight text-[var(--leonor-cream)]"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
      >
        {title}
      </h2>
    </div>
  );
}
