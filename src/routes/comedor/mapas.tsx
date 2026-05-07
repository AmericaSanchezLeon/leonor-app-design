import { createFileRoute } from "@tanstack/react-router";
import rutas from "@/data/rutasData.json";
import { useLeonor } from "@/lib/leonor-context";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/comedor/mapas")({
  head: () => ({ meta: [{ title: "Rutas — Leonorapp" }] }),
  component: MapasPage,
});

interface Punto {
  nombre_es?: string;
  nombre_en?: string;
  descripcion_es?: string;
  descripcion_en?: string;
  direccion?: string;
}

function MapasPage() {
  const { language } = useLeonor();
  return (
    <div className="px-5 py-8">
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--comedor)" }}>
        Rutas Gastronómicas
      </h1>
      <div className="space-y-8">
        {rutas.map((r, i) => (
          <article key={i} className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="font-serif text-xl leading-tight" style={{ color: "var(--comedor)" }}>
              {language === "es" ? r.title_es : r.title_en}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === "es" ? r.descripcion_es : r.descripcion_en}
            </p>
            {Array.isArray(r.puntos) && r.puntos.length > 0 && (
              <ol className="mt-4 space-y-3 border-l-2 border-[var(--comedor)]/30 pl-4">
                {(r.puntos as Punto[]).map((p, j) => (
                  <li key={j} className="relative">
                    <MapPin className="absolute -left-[22px] top-1 h-3 w-3" style={{ color: "var(--comedor)" }} />
                    <p className="font-serif text-base leading-tight">
                      {language === "es" ? p.nombre_es : p.nombre_en}
                    </p>
                    {p.direccion && <p className="text-xs text-muted-foreground">{p.direccion}</p>}
                    {(p.descripcion_es || p.descripcion_en) && (
                      <p className="mt-1 text-xs">{language === "es" ? p.descripcion_es : p.descripcion_en}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
