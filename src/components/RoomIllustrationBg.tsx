import { useMemo } from "react";
import { Sparkle } from "lucide-react";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomTonePalette, type RoomGradientId } from "@/lib/room-gradient-colors";

const gradientKeyFor: Record<SectionBgId, RoomGradientId> = {
  cocina: "cocina",
  comedor: "comedor",
  biblioteca: "biblioteca",
  about: "about",
  home: "lobby",
};

const TWINKLE_COUNT = 7;

function useTwinkles(count: number) {
  // Randomized once per mount — each simultaneous copy of the background
  // (center column + duplicated side panels) gets its own scattering,
  // which reads as natural variation rather than a mismatch, unlike the
  // shared base gradient these sit on top of.
  return useMemo(
    () =>
      Array.from({ length: count }, () => {
        const duration = 2.5 + Math.random() * 2.5;
        return {
          top: 5 + Math.random() * 88,
          left: 5 + Math.random() * 88,
          size: 8 + Math.random() * 12,
          duration,
          // Negative delay starts each sparkle mid-cycle at a random phase
          // right away, instead of showing it at full (unanimated) opacity
          // until a positive delay elapses.
          delay: -Math.random() * duration,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
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
  const twinkles = useTwinkles(TWINKLE_COUNT);

  // Fixed per section (not randomized per mount): this same texture is
  // rendered more than once at a time on wide viewports (duplicated into
  // the side letterboxes alongside the centered copy), so every instance
  // must resolve to the exact same gradient or the copies visibly seam.
  const [a, b, c, sparkleColor] = tones;
  const gradient = `linear-gradient(135deg, ${a}, ${b}, ${c}, ${a})`;

  if (!svg) return null;

  return (
    <>
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
      {/* Twinkling sparkles: not masked to the illustration, so they can
          appear/fade anywhere across the section, not just inside the
          line-art shapes. Tinted with the room's own lightest tone (with a
          matching glow) so each room's sparkles read as part of its palette
          instead of one fixed color everywhere. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {twinkles.map((s, i) => (
          <Sparkle
            key={i}
            fill="currentColor"
            className="absolute"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              color: sparkleColor,
              filter: `blur(0.6px) drop-shadow(0 0 6px ${sparkleColor})`,
              animation: `sparkle-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
