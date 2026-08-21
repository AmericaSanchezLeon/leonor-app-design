import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import rutas from "@/data/rutasData.json";
import { useLeonor, t } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RouteTimeline, type TimelinePunto } from "@/components/RouteTimeline";

export const Route = createFileRoute("/comedor/mapas")({
  head: () => ({ meta: [{ title: "Rutas — Leonorapp" }] }),
  component: MapasPage,
});

function MapasPage() {
  const { language } = useLeonor();
  const [estadoActivo, setEstadoActivo] = useState(rutas[0]?.estado ?? "");
  const rutaActiva = rutas.find((r) => r.estado === estadoActivo) ?? rutas[0];

  return (
    <SectionPageLayout sectionId="comedor" dialogueSectionId="comedor_rutas">
      <div className="px-5 py-8">
        <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
          {language === "es" ? "Rutas de Leonora" : "Leonora's Routes"}
        </h1>

        {/* Placeholder: mapa de México — se reemplaza cuando llegue el asset real. */}
        <div
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed"
          style={{
            borderColor: "color-mix(in srgb, var(--section-color) 40%, transparent)",
            color: "var(--section-color)",
          }}
        >
          <Map className="h-8 w-8 opacity-60" />
          <p className="text-xs uppercase tracking-wider opacity-70">
            {t("Mapa de México (próximamente)", "Map of Mexico (coming soon)", language)}
          </p>
        </div>

        {/* Selector de estado */}
        <div className="mt-4 flex flex-wrap gap-2">
          {rutas.map((r) => {
            const active = r.estado === estadoActivo;
            return (
              <button
                key={r.estado}
                type="button"
                onClick={() => setEstadoActivo(r.estado)}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? "var(--section-color)" : "transparent",
                  color: active ? "var(--leonor-cream)" : "var(--section-color)",
                  border: "1px solid var(--section-color)",
                }}
              >
                {r.estado}
              </button>
            );
          })}
        </div>

        {rutaActiva && (
          <section className="mt-6">
            <h2 className="font-serif text-xl leading-tight" style={{ color: "var(--section-color)" }}>
              {language === "es" ? rutaActiva.title_es : rutaActiva.title_en}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === "es" ? rutaActiva.descripcion_es : rutaActiva.descripcion_en}
            </p>
            {Array.isArray(rutaActiva.puntos) && rutaActiva.puntos.length > 0 && (
              <RouteTimeline puntos={rutaActiva.puntos as TimelinePunto[]} />
            )}
          </section>
        )}
      </div>
    </SectionPageLayout>
  );
}
