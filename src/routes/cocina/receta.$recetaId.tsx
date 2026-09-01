import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { recetaImg } from "@/lib/leonor-images";
import { ArrowLeft, Quote, ScrollText, Camera } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/cocina/receta/$recetaId")({
  head: ({ params }) => {
    const r = recetas[Number(params.recetaId)];
    return { meta: r ? [{ title: `${r.nombre} — Leonorapp` }] : [] };
  },
  component: RecetaPage,
  notFoundComponent: () => <div className="p-8 text-center">Receta no encontrada.</div>,
});

function RecetaPage() {
  const { recetaId } = Route.useParams();
  const r = recetas[Number(recetaId)];
  if (!r) throw notFound();

  return (
    <SectionPageLayout sectionId="cocina" bare>
      <div className="pb-10">
        <img
          src={recetaImg(r.imagen, "full")}
          alt={`Platillo: ${r.nombre}`}
          width={1000}
          height={750}
          fetchPriority="high"
          decoding="async"
          className={`aspect-[4/3] w-full bg-[var(--section-color)]/10 object-cover ${
            r.imagenRotada180 ? "rotate-180" : ""
          }`}
        />
        <div className="px-5 pt-6">
          <Link
            to="/cocina/recetario"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Recetario
          </Link>

          <h1 className="mb-2 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
            {r.nombre}
          </h1>

          {r.dato && (
            <div className="flex items-start gap-3 p-4">
              <Quote
                className="h-8 w-8 shrink-0"
                fill="currentColor"
                strokeWidth={0}
                style={{ color: "var(--section-color)" }}
              />
              <p className="pt-1 text-center font-serif text-sm italic leading-relaxed">{r.dato}</p>
            </div>
          )}

          <h2 className="mt-8 text-xl font-bold">Ingredientes</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {r.ingredientes
              .split("\n")
              .filter(Boolean)
              .map((linea, i) => (
                <li key={i}>{linea}</li>
              ))}
          </ul>

          <hr className="my-6 border-border" />

          <h2 className="text-xl font-bold">Preparación</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {r.preparacion
              .split("\n")
              .filter(Boolean)
              .map((linea, i) => (
                <li key={i}>{linea}</li>
              ))}
          </ul>

          <div className="mt-8 space-y-2 text-xs text-muted-foreground">
            {r.chef && (
              <p className="flex items-center gap-2">
                <ScrollText className="h-4 w-4 shrink-0" />
                Receta por: {r.chef}
              </p>
            )}
            {r.fotografia && (
              <p className="flex items-center gap-2">
                <Camera className="h-4 w-4 shrink-0" />
                Fotografía por: {r.fotografia}
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionPageLayout>
  );
}
