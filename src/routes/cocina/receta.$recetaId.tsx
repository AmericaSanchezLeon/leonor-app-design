import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { recetaImg } from "@/lib/leonor-images";
import { ArrowLeft } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/cocina/receta/$recetaId")({
  component: RecetaPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">Receta no encontrada.</div>
  ),
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
        className="aspect-[4/3] w-full bg-[var(--section-color)]/10 object-cover"
      />
      <div className="px-5 pt-6">
        <Link to="/cocina/recetario" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Recetario
        </Link>
        <h1 className="font-serif text-3xl leading-tight" style={{ color: "var(--section-color)" }}>
          {r.nombre}
        </h1>
        {r.chef && <p className="mt-1 text-sm text-muted-foreground">por {r.chef}</p>}
        {r.dato && (
          <p className="mt-3 rounded-lg bg-muted p-3 font-serif text-sm italic">{r.dato}</p>
        )}
        <h2 className="mt-6 font-serif text-xl" style={{ color: "var(--section-color)" }}>Ingredientes</h2>
        <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{r.ingredientes}</pre>
        <h2 className="mt-6 font-serif text-xl" style={{ color: "var(--section-color)" }}>Preparación</h2>
        <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{r.preparacion}</pre>
      </div>
    </div>
    </SectionPageLayout>
  );
}
