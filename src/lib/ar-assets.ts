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
  label?: string;
};

export const bibliotecaMasks: ARItem[] = [
  { id: "mascara-0", image: mask0, label: "Mirando hacia adentro" },
  { id: "mascara-1", image: mask1, label: "Abrazo" },
  { id: "mascara-2", image: mask2, label: "La inventora del atole" },
  { id: "mascara-3", image: mask3, label: "Jaguar de la noche" },
];

export const cocinaStickers: ARItem[] = [
  { id: "sticker-1", image: sticker1, label: "A Leonora le encantaba el té" },
  { id: "sticker-2", image: sticker2, label: "3 tazas de té negro" },
  { id: "sticker-3", image: sticker3, label: "Uno herbal por la noche" },
];
