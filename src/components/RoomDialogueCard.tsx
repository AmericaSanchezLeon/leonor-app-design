import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import { mascotImg } from "@/lib/leonor-images";
import mascotData from "@/data/mascotData.json";

type Phrase = { es: string; en: string };

function Dots({ n, active }: { n: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-4 rounded-full ${
            i === active ? "bg-current" : "border border-current opacity-40"
          }`}
        />
      ))}
    </div>
  );
}

type Variant = "room" | "internal";

export function RoomDialogueCard({
  sectionId,
  variant = "room",
}: {
  sectionId: string;
  variant?: Variant;
}) {
  const { language } = useLeonor();
  const lang: Lang = language;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const raw = (mascotData as Record<string, unknown>)[sectionId];
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const phrases = raw as Phrase[];
  const n = phrases.length;
  const current = phrases[index];
  const mascot = mascotImg[sectionId] ?? mascotImg[sectionId.split("_")[0]];

  const next = () => setIndex((i) => (i + 1) % n);
  const prev = () => setIndex((i) => (i - 1 + n) % n);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx > 40) prev();
    else if (dx < -40) next();
  };

  return (
    <div className="fixed inset-x-0 bottom-20 left-1/2 z-20 w-full max-w-[500px] -translate-x-1/2 px-4">
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={`flex select-none items-center gap-1 overflow-hidden rounded-3xl px-3 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.15)] backdrop-blur-sm ${
          variant === "internal"
            ? "bg-[var(--section-color)]"
            : "bg-[var(--leonor-cream)]/95"
        }`}
        style={{
          color: variant === "internal" ? "var(--leonor-cream)" : "var(--section-color)",
          touchAction: "pan-y",
        }}
      >
        {n > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label={t("Anterior", "Previous", lang)}
            className="shrink-0 self-center rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-1 flex-col items-center gap-2 pb-1">
          <p className="text-center font-serif text-sm not-italic leading-relaxed">
            {t(current.es, current.en, lang)}
          </p>
          {n > 1 && <Dots n={n} active={index} />}
          {mascot && (
            <img
              src={mascot}
              alt=""
              width={96}
              height={96}
              loading="eager"
              decoding="async"
              draggable={false}
              className="h-24 w-24 shrink-0 select-none"
            />
          )}
        </div>

        {n > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label={t("Siguiente", "Next", lang)}
            className="shrink-0 self-center rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
