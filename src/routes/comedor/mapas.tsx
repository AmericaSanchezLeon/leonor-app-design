import { createFileRoute } from "@tanstack/react-router";
import rutas from "@/data/rutasData.json";
import { useLeonor } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RouteTimeline, type TimelinePunto } from "@/components/RouteTimeline";

export const Route = createFileRoute("/comedor/mapas")({
  head: () => ({ meta: [{ title: "Rutas — Leonorapp" }] }),
  component: MapasPage,
});

function MapasPage() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="comedor">
      <div className="px-5 py-8">
        <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
          {language === "es" ? "Rutas de Leonora" : "Leonora's Routes"}
        </h1>
        <div className="space-y-10">
          {rutas.map((r, i) => (
            <section key={i}>
              <h2 className="font-serif text-xl leading-tight" style={{ color: "var(--section-color)" }}>
                {language === "es" ? r.title_es : r.title_en}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {language === "es" ? r.descripcion_es : r.descripcion_en}
              </p>
              {Array.isArray(r.puntos) && r.puntos.length > 0 && (
                <RouteTimeline puntos={r.puntos as TimelinePunto[]} />
              )}
            </section>
          ))}
        </div>
      </div>
    </SectionPageLayout>
  );
}
