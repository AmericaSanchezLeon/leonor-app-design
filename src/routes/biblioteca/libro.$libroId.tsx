import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import books from "@/data/booksData.json";
import { bookImg } from "@/lib/leonor-images";
import { useLeonor } from "@/lib/leonor-context";
import { ArrowLeft } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/biblioteca/libro/$libroId")({
  component: LibroDetalle,
  notFoundComponent: () => <div className="p-8">Libro no encontrado.</div>,
});

function LibroDetalle() {
  const { libroId } = Route.useParams();
  const { language } = useLeonor();
  const i = Number(libroId);
  const b = books[i];
  if (!b) throw notFound();
  return (
    <SectionPageLayout sectionId="biblioteca" bare>
    <div className="pb-10">
      <div className="px-5 pt-8">
        <Link to="/biblioteca/estante" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Estante
        </Link>
      </div>
      <div className="px-5">
        <div className="mx-auto aspect-[2/3] w-44 overflow-hidden rounded-lg bg-cover bg-center shadow-xl"
          style={{ backgroundImage: `url(${bookImg(i)})` }}
        />
      </div>
      <div className="px-5 pt-6 text-center">
        <h1 className="font-serif text-2xl leading-tight" style={{ color: "var(--section-color)" }}>
          {language === "es" ? b.nombre_es : b.nombre}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{b.autor}</p>
        <p className="mt-3 text-xs uppercase tracking-wider" style={{ color: "var(--section-color)" }}>
          {b.tema}
        </p>
      </div>
      <div className="mt-6 px-5">
        <p className="text-sm leading-relaxed">{b["reseña"]}</p>
        {b.dato && (
          <p className="mt-4 rounded-lg bg-muted p-3 font-serif text-sm italic">¿Sabías que…? {b.dato}</p>
        )}
      </div>
    </div>
    </SectionPageLayout>
  );
}
