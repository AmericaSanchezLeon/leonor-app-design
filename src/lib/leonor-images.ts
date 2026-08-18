// Resolución de imágenes: todas viven optimizadas (WebP) en el CDN de Lovable.
// Ya no se descarga nada desde raw.githubusercontent.com.
import { imageUrls } from "./leonor-image-urls";

export type ImgVariant = "thumb" | "full";

const url = (key: string) => imageUrls[key] ?? "";

const baseName = (path: string) =>
  path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? path;

/** Retrato de amigo. `path` es el valor `imagen` del JSON. */
export const amigoImg = (path: string, variant: ImgVariant = "thumb") =>
  url(`${baseName(path)}-${variant}`);

// Los nombres en recetas.json son placeholders; se mapean a los archivos reales.
const RECETA_MAP: Record<string, string> = {
  "azafran.JPG": "receta_1",
  "pera.JPG": "receta_2",
};

export const recetaImg = (name: string, variant: ImgVariant = "thumb") =>
  url(`${RECETA_MAP[name] ?? baseName(name)}-${variant}`);

// booksData.json usa nombres placeholder; las portadas se mapean por índice.
const BOOK_COVERS = [
  "libro-tibetano-muertos",
  "libro-english-ghost",
  "libro-gnostic-scriptures",
  "libro-gothic-painting",
  "libro-goddesses-gods",
  "libro-fountain-age",
  "libro-folktales-hungary",
  "libro-magister-ludi",
];

export const bookImg = (i: number, variant: ImgVariant = "thumb") =>
  url(`${BOOK_COVERS[i % BOOK_COVERS.length]}-${variant}`);

// Ilustraciones de mascota por sección (rasterizadas y optimizadas).
export const mascotImg: Record<string, string> = {
  lobby: url("mascotas_yeti"),
  home: url("mascotas_yeti"),
  cocina: url("mascotas_monseur"),
  comedor: url("mascotas_ramona"),
  biblioteca: url("mascotas_minotaura"),
  about: url("mascotas_yeti"),
};
