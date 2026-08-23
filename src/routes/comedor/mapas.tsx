import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import rutas from "@/data/rutasData.json";
import { useLeonor } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { RouteTimeline, type TimelinePunto } from "@/components/RouteTimeline";
import { rutasPinesByEstado } from "@/lib/rutas-pines";

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

        {/* Tabs de estado */}
        <div className="flex border-b" style={{ borderColor: "color-mix(in srgb, var(--section-color) 30%, transparent)" }}>
          {rutas.map((r) => {
            const active = r.estado === estadoActivo;
            return (
              <button
                key={r.estado}
                type="button"
                onClick={() => setEstadoActivo(r.estado)}
                className="flex-1 border-b-2 px-2 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  borderColor: active ? "var(--section-color)" : "transparent",
                  color: active ? "var(--section-color)" : "var(--muted-foreground)",
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
              <RouteTimeline
                puntos={rutaActiva.puntos as TimelinePunto[]}
                pinIcons={rutasPinesByEstado[rutaActiva.estado]}
              />
            )}
          </section>
        )}
      </div>
    </SectionPageLayout>
  );
}
