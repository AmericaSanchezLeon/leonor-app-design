import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RECETARIO_BOOK } from "@/lib/recetario-book";

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
      className="mt-8 block overflow-hidden rounded-2xl shadow-md transition-transform hover:scale-[1.01]"
    >
      <div
        className="flex aspect-[3/2] w-full flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: RECETARIO_BOOK.color, color: "var(--leonor-cream)" }}
      >
        <p className="font-serif text-2xl leading-tight">{RECETARIO_BOOK.titulo}</p>
        <p className="mt-2 font-serif text-sm leading-relaxed">{RECETARIO_BOOK.subtitulo}</p>
      </div>
      <div className="bg-card p-4">
        <p className="text-sm leading-relaxed text-foreground">{RECETARIO_BOOK.parrafos[0]}</p>
      </div>
    </Link>
  );
}

function Recetario() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="cocina" dialogueSectionId="cocina_recetario">
      <div className="px-5 py-8">
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Recetario" : "Recipes"}
      </h1>
      <div className="grid grid-cols-2 gap-0">
        {recetas.map((r, i) => (
          <Link
            key={i}
            to="/cocina/receta/$recetaId"
            params={{ recetaId: String(i) }}
            className="relative block"
          >
            <img
              src={recetaImg(r.imagen, "thumb")}
              alt=""
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              className={`aspect-square w-full bg-[var(--section-color)]/10 object-cover ${
                r.imagenRotada180 ? "rotate-180" : ""
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center px-3">
              <p
                className="text-center font-serif text-lg leading-tight text-[var(--leonor-cream)]"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
              >
                {r.nombre}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <RecetarioBookCard />
      </div>
    </SectionPageLayout>
  );
}
