import { ExternalLink, ImageIcon } from "lucide-react";
import { useLeonor } from "@/lib/leonor-context";

export interface TimelinePunto {
  nombre_pin_es?: string;
  nombre_pin_en?: string;
  direccion_pin?: string;
  mapsUrl?: string;
  es?: string;
  en?: string;
  imagen?: string;
}

interface Props {
  puntos: TimelinePunto[];
  /** One pin icon URL per punto, same order/length as puntos. */
  pinIcons?: string[];
}

function PinIcon({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="h-9 w-9 shrink-0"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        backgroundColor: "var(--section-color)",
      }}
    />
  );
}

export function RouteTimeline({ puntos, pinIcons }: Props) {
  const { language } = useLeonor();
  const openLabel = language === "es" ? "Abrir en Maps" : "Open in Maps";

  return (
    <ol className="mt-4 space-y-4">
      {puntos.map((p, i) => {
        const nombre = language === "es" ? p.nombre_pin_es : p.nombre_pin_en;
        const url = p.mapsUrl?.trim();
        const enabled = Boolean(url);
        const pinIcon = pinIcons?.[i];

        const handleClick = () => {
          if (enabled) window.open(url, "_blank", "noopener,noreferrer");
        };

        return (
          <li key={i}>
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
              <div className="flex items-start gap-3">
                {pinIcon ? (
                  <PinIcon src={pinIcon} />
                ) : (
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed"
                    style={{
                      borderColor: "color-mix(in srgb, var(--section-color) 40%, transparent)",
                      color: "var(--section-color)",
                    }}
                  >
                    <ImageIcon className="h-5 w-5 opacity-50" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-tight">{nombre}</p>
                  {p.direccion_pin && (
                    <p className="mt-1 text-xs text-muted-foreground">{p.direccion_pin}</p>
                  )}
                  {(language === "es" ? p.es : p.en) && (
                    <p className="mt-2 text-sm leading-relaxed">
                      {language === "es" ? p.es : p.en}
                    </p>
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
