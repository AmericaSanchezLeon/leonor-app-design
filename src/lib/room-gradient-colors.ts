export type RoomGradientId = "cocina" | "comedor" | "biblioteca" | "about" | "lobby";

interface RoomGradient {
  dark: string;
  light: string;
}

export const roomGradientColors: Record<RoomGradientId, RoomGradient> = {
  cocina: { dark: "#01493D", light: "#34A853" },
  comedor: { dark: "#D83327", light: "#D96D27" },
  biblioteca: { dark: "#104C8B", light: "#09748D" },
  about: { dark: "#A71D36", light: "#A62386" },
  lobby: { dark: "#D88428", light: "#D8B928" },
};

export const roomGradientCss = (id: RoomGradientId, angle = "120deg") => {
  const { dark, light } = roomGradientColors[id];
  return `linear-gradient(${angle}, ${dark}, ${light})`;
};

/** Wider per-room tone ranges, used to build a randomized texture gradient. */
export const roomTonePalette: Record<RoomGradientId, string[]> = {
  cocina: ["#01493D", "#0B6B4F", "#34A853", "#7FD858"],
  comedor: ["#8C1D14", "#D83327", "#D96D27", "#F2A65A"],
  biblioteca: ["#0B2F5C", "#104C8B", "#09748D", "#4FB3C9"],
  about: ["#6B1026", "#A71D36", "#A62386", "#D9509E"],
  lobby: ["#8C5A12", "#D88428", "#D8B928", "#F2D675"],
};
