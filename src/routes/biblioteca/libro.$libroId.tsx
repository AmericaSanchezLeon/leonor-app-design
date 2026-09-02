import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import books from "@/data/booksData.json";
import { bookImg } from "@/lib/leonor-images";
import { useLeonor } from "@/lib/leonor-context";
import { ArrowLeft, BookOpen } from "lucide-react";
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
      <div className="pb-24">
        <img
          src={bookImg(b.slug, "full")}
          alt={`Portada de ${language === "es" ? b.nombre_es : b.nombre}`}
          width={1000}
          height={1500}
          fetchPriority="high"
          decoding="async"
          className="aspect-[2/3] w-full bg-[var(--section-color)]/10 object-cover"
        />

        <div className="px-5 pt-6">
          <Link
            to="/biblioteca/estante"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Estante
          </Link>
          <h1
            className="font-serif text-3xl leading-tight"
            style={{ color: "var(--section-color)" }}
          >
            {language === "es" ? b.nombre_es : b.nombre}
          </h1>
        </div>

        <div className="px-5 pt-6 text-center">
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-medium uppercase tracking-wider text-[var(--leonor-cream)]"
            style={{ backgroundColor: "var(--section-color)" }}
          >
            {b.tema}
          </span>
          <p className="mt-3 font-semibold">{b.autor}</p>
        </div>

        <div className="mt-6 px-5">
          <p className="text-sm leading-relaxed">{b["reseña"]}</p>
          {b.dato && (
            <div
              className="mt-4 flex items-start gap-3 rounded-2xl border-2 p-4"
              style={{ borderColor: "var(--section-color)" }}
            >
              <BookOpen className="h-6 w-6 shrink-0" style={{ color: "var(--section-color)" }} />
              <p className="text-sm leading-relaxed">{b.dato}</p>
            </div>
          )}
        </div>
      </div>
    </SectionPageLayout>
  );
}
