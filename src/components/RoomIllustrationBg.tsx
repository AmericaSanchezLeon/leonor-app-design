import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomGradientColors, type RoomGradientId } from "@/lib/room-gradient-colors";

const gradientKeyFor: Record<SectionBgId, RoomGradientId> = {
  cocina: "cocina",
  comedor: "comedor",
  biblioteca: "biblioteca",
  about: "about",
  home: "lobby",
};

export function RoomIllustrationBg({ sectionId }: { sectionId: SectionBgId }) {
  const svg = roomBg[sectionId];
  const { dark, light } = roomGradientColors[gradientKeyFor[sectionId]];
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
        backgroundImage: `linear-gradient(120deg, ${dark}, ${light}, ${dark})`,
        backgroundSize: "220% 220%",
        animation: "room-gradient-move 14s ease-in-out infinite",
        opacity: 0.55,
      }}
    />
  );
}
