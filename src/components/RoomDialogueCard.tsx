import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
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

  if (!open) {
    return (
      <div className="fixed inset-x-0 bottom-20 left-1/2 z-20 flex w-full max-w-[500px] -translate-x-1/2 justify-end px-4">
        <div className="relative h-20 w-20">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full"
            style={{ backgroundColor: "var(--leonor-cream)", opacity: 0.6 }}
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("Abrir mensaje", "Open message", lang)}
            className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 ${
              variant === "internal" ? "bg-[var(--section-color)]" : "bg-[var(--leonor-cream)]"
            }`}
          >
            {mascot && (
              <img
                src={mascot}
                alt=""
                width={96}
                height={96}
                loading="eager"
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-cover object-top"
              />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-20 left-1/2 z-20 w-full max-w-[500px] -translate-x-1/2 px-4">
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={`relative flex h-40 select-none items-stretch overflow-hidden rounded-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.15)] ${
          variant === "internal" ? "bg-[var(--section-color)]" : "bg-[var(--neutral-lighter)]"
        }`}
        style={{
          color: variant === "internal" ? "var(--leonor-cream)" : "var(--section-color)",
          touchAction: "pan-y",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("Cerrar mensaje", "Close message", lang)}
          className="absolute right-2 top-2 z-10 rounded-full p-1 opacity-85 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        {n > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label={t("Anterior", "Previous", lang)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 opacity-85 transition-opacity hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* info — 3/5 of the card's width */}
        <div className="flex w-3/5 flex-col items-center justify-center gap-2 px-9">
          <p className="text-center font-serif text-sm not-italic leading-relaxed">
            {t(current.es, current.en, lang)}
          </p>
          {n > 1 && <Dots n={n} active={index} />}
        </div>

        {/* mascot img — 2/5 of the card's width */}
        {mascot && (
          <div className="flex w-2/5 shrink-0 items-end justify-center overflow-hidden pr-9">
            <img
              src={mascot}
              alt=""
              width={96}
              height={96}
              loading="eager"
              decoding="async"
              draggable={false}
              className="h-full w-full select-none object-contain object-bottom"
            />
          </div>
        )}

        {n > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label={t("Siguiente", "Next", lang)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 opacity-85 transition-opacity hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
