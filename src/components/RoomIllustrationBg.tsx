import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomTonePalette, type RoomGradientId } from "@/lib/room-gradient-colors";

const gradientKeyFor: Record<SectionBgId, RoomGradientId> = {
  cocina: "cocina",
  comedor: "comedor",
  biblioteca: "biblioteca",
  about: "about",
  home: "lobby",
};

export function RoomIllustrationBg({
  sectionId,
  opacity = 0.55,
}: {
  sectionId: SectionBgId;
  /** Overall opacity of the textured pattern; defaults to the full-strength room look. */
  opacity?: number;
}) {
  const svg = roomBg[sectionId];
  const tones = roomTonePalette[gradientKeyFor[sectionId]];

  // Fixed per section (not randomized per mount): this same texture is
  // rendered more than once at a time on wide viewports (duplicated into
  // the side letterboxes alongside the centered copy), so every instance
  // must resolve to the exact same gradient or the copies visibly seam.
  const [a, b, c] = tones;
  const gradient = `linear-gradient(135deg, ${a}, ${b}, ${c}, ${a})`;

  if (!svg) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{
        WebkitMaskImage: `url(${svg})`,
        maskImage: `url(${svg})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "top center",
        maskPosition: "top center",
        WebkitMaskSize: "cover",
        maskSize: "cover",
        backgroundImage: gradient,
        backgroundSize: "220% 220%",
        animation: "room-gradient-move 14s ease-in-out infinite",
        opacity,
      }}
    />
  );
}
