import bgAbout from "@/assets/img/room-bg/bg_about.svg";
import bgBiblioteca from "@/assets/img/room-bg/bg_biblioteca.svg";
import bgCocina from "@/assets/img/room-bg/bg_cocina.svg";
import bgComedor from "@/assets/img/room-bg/bg_comedor.svg";
import bgHome from "@/assets/img/room-bg/bg_home.svg";

export type SectionBgId = "about" | "biblioteca" | "cocina" | "comedor" | "home";

export const roomBg: Record<SectionBgId, string> = {
  about: bgAbout,
  biblioteca: bgBiblioteca,
  cocina: bgCocina,
  comedor: bgComedor,
  home: bgHome,
};
