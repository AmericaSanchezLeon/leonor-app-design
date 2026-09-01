import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RECETARIO_BOOK } from "@/lib/recetario-book";
import recetarioBookCover from "@/assets/img/recetario/cocina-alquimica-cover.png";

export const Route = createFileRoute("/cocina/recetario-libro")({
  head: () => ({ meta: [{ title: "La cocina alquímica — Leonorapp" }] }),
  component: RecetarioLibro,
});

function RecetarioLibro() {
  return (
    <SectionPageLayout sectionId="cocina" bare>
      <div className="px-5 py-8 pb-24">
        <Link
          to="/cocina/recetario"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Recetario
        </Link>
        <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
          Recetario
        </h1>

        <img
          src={recetarioBookCover}
          alt={RECETARIO_BOOK.titulo}
          width={447}
          height={685}
          className="mx-auto w-64 rounded-lg shadow-xl"
        />

        <div className="mt-6 space-y-4">
          {RECETARIO_BOOK.parrafos.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {p}
            </p>
          ))}
          <a
            href={RECETARIO_BOOK.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-2"
            style={{ color: "var(--section-color)" }}
          >
            {RECETARIO_BOOK.url}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </SectionPageLayout>
  );
}
