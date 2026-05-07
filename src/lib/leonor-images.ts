// Helper to resolve image URLs for the leonorapp2.0 repo (raw GitHub).
const RAW_BASE = "https://raw.githubusercontent.com/AmericaSanchezLeon/leonorapp2.0/main";

export const amigoImg = (path: string) =>
  path.startsWith("http") ? path : `${RAW_BASE}/${path}`;

// Maps recipe filenames in JSON to actual repo paths.
export const recetaImg = (name: string) => {
  const map: Record<string, string> = {
    "azafran.JPG": "src/assets/img/cocina-recetas/receta_1.jpg",
    "pera.JPG": "src/assets/img/cocina-recetas/receta_2.jpg",
  };
  return `${RAW_BASE}/${map[name] ?? `src/assets/img/cocina-recetas/${name}`}`;
};

// Books data uses placeholder filenames; map to real cover images by index.
const BOOK_COVERS = [
  "libro-tibetano-muertos.jpg",
  "libro-english-ghost.jpg",
  "libro-gnostic-scriptures.jpg",
  "libro-gothic-painting.jpg",
  "libro-goddesses-gods.jpg",
  "libro-fountain-age.jpg",
  "libro-folktales-hungary.jpg",
  "libro-magister-ludi.jpg",
];

export const bookImg = (i: number) =>
  `${RAW_BASE}/src/assets/img/biblioteca-libros/${BOOK_COVERS[i % BOOK_COVERS.length]}`;
