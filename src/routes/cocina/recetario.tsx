import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/cocina/recetario")({
  head: () => ({
    meta: [
      { title: "Recetario — Leonorapp" },
      { name: "description", content: "Recetas de la cocina de Leonora Carrington." },
    ],
  }),
  component: Recetario,
});

function Recetario() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="cocina" dialogueSectionId="cocina_recetario">
      <div className="px-5 py-8">
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Recetario" : "Recipes"}
      </h1>
      <div className="space-y-5">
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
              height={600}
              loading="eager"
              decoding="async"
              className={`aspect-[4/3] w-full bg-[var(--section-color)]/10 object-cover ${
                r.imagenRotada180 ? "rotate-180" : ""
              }`}
            />
            <div
              className="absolute inset-0 flex items-center justify-center px-6"
              style={{ backgroundColor: "color-mix(in oklab, var(--section-color) 45%, transparent)" }}
            >
              <p className="text-center font-serif text-2xl leading-tight text-[var(--leonor-cream)]">
                {r.nombre}
              </p>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </SectionPageLayout>
  );
}
