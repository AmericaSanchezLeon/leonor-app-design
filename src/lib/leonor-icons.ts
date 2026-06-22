import {
  ChefHat,
  UtensilsCrossed,
  Home,
  BookOpen,
  Info,
  Soup,
  Users,
  BookMarked,
} from "lucide-react";

export const sectionIcon = {
  cocina: ChefHat,
  comedor: UtensilsCrossed,
  home: Home,
  biblioteca: BookOpen,
  about: Info,
} as const;

export type SectionId = keyof typeof sectionIcon;

export const itemIcon = {
  receta: Soup,
  libro: BookMarked,
  amigo: Users,
} as const;
