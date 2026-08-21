import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RECETARIO_BOOK } from "@/lib/recetario-book";

export const Route = createFileRoute("/cocina/recetario-libro")({
  head: () => ({ meta: [{ title: "La cocina alquímica — Leonorapp" }] }),
  component: RecetarioLibro,
});

function RecetarioLibro() {
  return (
    <SectionPageLayout sectionId="cocina" bare>
      <div className="pb-24">
        <div className="px-5 pt-8">
          <Link
            to="/cocina/recetario"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Recetario
          </Link>
        </div>

        <div className="px-5">
          <div
            className="mx-auto flex aspect-[2/3] w-64 flex-col items-center justify-between rounded-lg px-6 py-10 text-center shadow-xl"
            style={{ backgroundColor: RECETARIO_BOOK.color, color: "var(--leonor-cream)" }}
          >
            <div className="space-y-1 text-xs leading-relaxed">
              {RECETARIO_BOOK.autores.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <div>
              <p className="font-serif text-2xl leading-tight">{RECETARIO_BOOK.titulo}</p>
              <p className="mt-2 font-serif text-sm leading-relaxed">{RECETARIO_BOOK.subtitulo}</p>
            </div>
            <p className="text-[10px] uppercase tracking-wider opacity-90">{RECETARIO_BOOK.editorial}</p>
          </div>
        </div>

        <div className="px-5 pt-6 text-center">
          <h1 className="font-serif text-2xl leading-tight" style={{ color: "var(--section-color)" }}>
            {RECETARIO_BOOK.titulo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{RECETARIO_BOOK.subtitulo}</p>
        </div>

        <div className="mt-6 space-y-4 px-5">
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
