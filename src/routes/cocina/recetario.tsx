import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";
import { itemIcon } from "@/lib/leonor-icons";
import { SectionPageLayout } from "@/components/SectionPageLayout";

const RecetaIcon = itemIcon.receta;

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
      <div className="grid grid-cols-2 gap-4">
        {recetas.map((r, i) => (
          <Link
            key={i}
            to="/cocina/receta/$recetaId"
            params={{ recetaId: String(i) }}
            className="overflow-hidden rounded-2xl bg-card shadow-md transition-transform hover:scale-[1.02]"
          >
            <img
              src={recetaImg(r.imagen, "thumb")}
              alt=""
              width={400}
              height={400}
              loading="eager"
              decoding="async"
              className="aspect-square w-full bg-[var(--section-color)]/10 object-cover"
            />
            <div className="p-3">
              <div className="flex items-start gap-2" style={{ color: "var(--section-color)" }}>
                <itemIcon.receta size={14} strokeWidth={1.75} className="mt-0.5 flex-shrink-0" />
                <p className="font-serif text-sm leading-tight text-foreground">{r.nombre}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </SectionPageLayout>
  );
}
