import { useMemo } from "react";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomTonePalette, type RoomGradientId } from "@/lib/room-gradient-colors";

const gradientKeyFor: Record<SectionBgId, RoomGradientId> = {
  cocina: "cocina",
  comedor: "comedor",
  biblioteca: "biblioteca",
  about: "about",
  home: "lobby",
};

function shuffle<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

  // Randomized on every mount (i.e. every time the screen loads) so the
  // texture doesn't always show the same two tones.
  const gradient = useMemo(() => {
    const [a, b, c] = shuffle(tones);
    const angle = 90 + Math.floor(Math.random() * 90);
    return `linear-gradient(${angle}deg, ${a}, ${b}, ${c}, ${a})`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

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
