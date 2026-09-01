import mask0 from "@/assets/ar/biblioteca/mascara0.png";
import mask1 from "@/assets/ar/biblioteca/mascara1.png";
import mask2 from "@/assets/ar/biblioteca/mascara2.png";
import mask3 from "@/assets/ar/biblioteca/mascara3.png";
import sticker1 from "@/assets/ar/cocina/sticker1.png";
import sticker2 from "@/assets/ar/cocina/sticker2.png";
import sticker3 from "@/assets/ar/cocina/sticker3.png";

export type ARItem = {
  id: string;
  image: string;
  label_es?: string;
  label_en?: string;
};

export const bibliotecaMasks: ARItem[] = [
  { id: "mascara-0", image: mask0, label_es: "Mirando hacia adentro", label_en: "Looking in" },
  {
    id: "mascara-1",
    image: mask1,
    label_es: "La inventora del atole",
    label_en: "The inventor of atole",
  },
  { id: "mascara-2", image: mask2, label_es: "Abrazo", label_en: "Hug" },
  { id: "mascara-3", image: mask3, label_es: "Jaguar de la noche", label_en: "Night jaguar" },
];

export const cocinaStickers: ARItem[] = [
  {
    id: "sticker-1",
    image: sticker1,
    label_es: "A Leonora le encantaba el té",
    label_en: "Leonora loved tea",
  },
  {
    id: "sticker-2",
    image: sticker2,
    label_es: "3 tazas de té negro",
    label_en: "3 cups of black tea",
  },
  {
    id: "sticker-3",
    image: sticker3,
    label_es: "Uno herbal por la noche",
    label_en: "One herbal at night",
  },
];
