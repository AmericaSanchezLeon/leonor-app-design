import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { MosaicTileOverlay } from "@/components/MosaicTileOverlay";
import { RECETARIO_BOOK } from "@/lib/recetario-book";
import recetarioBookCover from "@/assets/img/recetario/cocina-alquimica-cover.png";

export const Route = createFileRoute("/cocina/recetario")({
  head: () => ({
    meta: [
      { title: "Recetario — Leonorapp" },
      { name: "description", content: "Recetas de la cocina de Leonora Carrington." },
    ],
  }),
  component: Recetario,
});

function RecetarioBookCard() {
  return (
    <Link
      to="/cocina/recetario-libro"
      className="group relative block"
      aria-label={RECETARIO_BOOK.titulo}
    >
      <img
        src={recetarioBookCover}
        alt=""
        width={447}
        height={685}
        loading="eager"
        decoding="async"
        className="h-40 w-full object-cover"
      />
      <MosaicTileOverlay title={RECETARIO_BOOK.titulo} colorVar="--cocina" />
    </Link>
  );
}

function Recetario() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="cocina" dialogueSectionId="cocina_recetario">
      <div className="py-8">
        <h1 className="mb-6 px-5 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
          {language === "es" ? "Recetario" : "Recipes"}
        </h1>
        <div className="grid grid-cols-1">
          {recetas.map((r, i) => (
            <Link
              key={i}
              to="/cocina/receta/$recetaId"
              params={{ recetaId: String(i) }}
              aria-label={r.nombre}
              className="group relative block"
            >
              <img
                src={recetaImg(r.imagen, "thumb")}
                alt=""
                width={800}
                height={450}
                loading="eager"
                decoding="async"
                className={`h-40 w-full bg-[var(--section-color)]/10 object-cover ${
                  r.imagenRotada180 ? "rotate-180" : ""
                }`}
              />
              <MosaicTileOverlay title={r.nombre} colorVar="--cocina" />
            </Link>
          ))}
          <RecetarioBookCard />
        </div>
      </div>
    </SectionPageLayout>
  );
}
