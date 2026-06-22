import { useRef, useState } from "react";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import { mascotImg } from "@/lib/leonor-images";
import mascotData from "@/data/mascotData.json";

type Phrase = { es: string; en: string };

function Dots({ n, active, color }: { n: number; active: number; color: string }) {
  return (
    <div className="mt-3 flex items-center gap-1.5" style={{ color }}>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i === active ? "bg-current" : "border border-current opacity-40"
          }`}
        />
      ))}
    </div>
  );
}

export function RoomDialogueCard({
  sectionId,
  color,
}: {
  sectionId: string;
  color: string;
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
  const mascot = mascotImg[sectionId];

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
    else next();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") next();
      }}
      className="cursor-pointer select-none rounded-3xl bg-[var(--leonor-cream)]/95 px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.15)] backdrop-blur-sm"
      style={{ color, touchAction: "pan-y" }}
    >
      <div className="flex flex-row items-end justify-between gap-3">
        <div className="flex-1">
          <p className="font-serif text-sm italic leading-relaxed">
            “{t(current.es, current.en, lang)}”
          </p>
          <Dots n={n} active={index} color={color} />
        </div>
        {mascot && (
          <img
            src={mascot}
            alt=""
            draggable={false}
            className="h-auto w-20 shrink-0 select-none"
          />
        )}
      </div>
    </div>
  );
}
