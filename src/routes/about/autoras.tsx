import { createFileRoute } from "@tanstack/react-router";
import about from "@/data/aboutData.json";
import { useLeonor } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/about/autoras")({
  head: () => ({ meta: [{ title: "Las Autoras — Leonorapp" }] }),
  component: AutorasPage,
});

interface Autora {
  nombre?: string;
  rol_es?: string;
  rol_en?: string;
  bio_es?: string;
  bio_en?: string;
}

function AutorasPage() {
  const { language } = useLeonor();
  const data = about.Link2?.[0];
  const autoras: Autora[] = (data?.autoras as Autora[]) ?? [];

  return (
    <SectionPageLayout sectionId="about">
    <div className="px-5 py-8">
      <h1 className="mb-2 font-serif text-3xl" style={{ color: "var(--about)" }}>
        {language === "es" ? "Las Autoras" : "The Authors"}
      </h1>
      {data && (
        <p className="mb-6 text-sm text-muted-foreground">
          {language === "es" ? data.descripcion_es : data.descripcion_en}
        </p>
      )}
      <ul className="space-y-5">
        {autoras.map((a, i) => (
          <li key={i} className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="font-serif text-lg" style={{ color: "var(--about)" }}>{a.nombre}</p>
            {(a.rol_es || a.rol_en) && (
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {language === "es" ? a.rol_es : a.rol_en}
              </p>
            )}
            {(a.bio_es || a.bio_en) && (
              <p className="mt-2 text-sm leading-relaxed">{language === "es" ? a.bio_es : a.bio_en}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
    </SectionPageLayout>
  );
}
