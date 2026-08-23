import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";

// Two-tone gradient per room, matching the color pair baked into each
// illustration's original fill so the moving gradient reads as the same palette.
const roomGradient: Record<SectionBgId, [string, string]> = {
  about: ["#A71D35", "#A62387"],
  biblioteca: ["#0E748E", "#114D8B"],
  cocina: ["#36A852", "#096050"],
  comedor: ["#D83227", "#D96E27"],
  home: ["#D88328", "#D8BA28"],
};

export function RoomIllustrationBg({ sectionId }: { sectionId: SectionBgId }) {
  const svg = roomBg[sectionId];
  const colors = roomGradient[sectionId];
  if (!svg || !colors) return null;
  const [from, to] = colors;

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
        backgroundImage: `linear-gradient(120deg, ${from}, ${to}, ${from})`,
        backgroundSize: "220% 220%",
        animation: "room-gradient-move 14s ease-in-out infinite",
        opacity: 0.55,
      }}
    />
  );
}
