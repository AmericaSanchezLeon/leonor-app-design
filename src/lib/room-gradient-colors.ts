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
