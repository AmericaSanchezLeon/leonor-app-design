import { MapPin, ExternalLink } from "lucide-react";
import { useLeonor } from "@/lib/leonor-context";

export interface TimelinePunto {
  nombre_pin_es?: string;
  nombre_pin_en?: string;
  direccion_pin?: string;
  mapsUrl?: string;
}

interface Props {
  puntos: TimelinePunto[];
}

export function RouteTimeline({ puntos }: Props) {
  const { language } = useLeonor();
  const openLabel = language === "es" ? "Abrir en Maps" : "Open in Maps";

  return (
    <ol className="relative mt-4 space-y-5 pl-12">
      {/* línea punteada vertical */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-3 bottom-3 border-l-2 border-dashed"
        style={{ borderColor: "var(--section-color)" }}
      />
      {puntos.map((p, i) => {
        const nombre = language === "es" ? p.nombre_pin_es : p.nombre_pin_en;
        const url = p.mapsUrl?.trim();
        const enabled = Boolean(url);

        const handleClick = () => {
          if (enabled) window.open(url, "_blank", "noopener,noreferrer");
        };

        return (
          <li key={i} className="relative">
            {/* badge numerado */}
            <div
              className="absolute -left-12 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm ring-4 ring-white"
              style={{ backgroundColor: "var(--section-color)" }}
            >
              {i + 1}
            </div>

            <button
              type="button"
              onClick={handleClick}
              aria-disabled={!enabled}
              disabled={!enabled}
              className={`group block w-full rounded-xl border bg-card p-4 text-left shadow-sm transition ${
                enabled
                  ? "hover:shadow-md active:scale-[0.99] cursor-pointer"
                  : "opacity-50 cursor-default"
              }`}
              style={{ borderColor: "color-mix(in srgb, var(--section-color) 30%, transparent)" }}
            >
              <div className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--section-color)" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-tight">{nombre}</p>
                  {p.direccion_pin && (
                    <p className="mt-1 text-xs text-muted-foreground">{p.direccion_pin}</p>
                  )}
                </div>
              </div>

              <div
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: enabled ? "var(--section-color)" : undefined }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {openLabel}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
