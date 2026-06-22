import { Link } from "@tanstack/react-router";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import { RoomDialogueCard } from "@/components/RoomDialogueCard";
import type { ReactNode } from "react";

interface RoomLink {
  to: string;
  title_es: string;
  title_en: string;
}

export function RoomLanding({
  color,
  title_es,
  title_en,
  intro_es,
  intro_en,
  sectionId,
  links,
  icon,
}: {
  color: string;
  title_es: string;
  title_en: string;
  intro_es?: string;
  intro_en?: string;
  sectionId?: string;
  links: RoomLink[];
  icon?: ReactNode;
}) {
  const { language } = useLeonor();
  const lang: Lang = language;
  return (
    <div
      className="relative min-h-[calc(100vh-104px)] pb-48"
      style={{ backgroundColor: color }}
    >
      <div className="px-6 py-10 text-center" style={{ color: "var(--leonor-cream)" }}>
        {icon && <div className="mb-4 flex justify-center opacity-90">{icon}</div>}
        <h1 className="font-serif text-4xl leading-tight">
          {t(title_es, title_en, lang)}
        </h1>
        {(intro_es || intro_en) && (
          <p className="mx-auto mt-4 max-w-xs text-sm opacity-90">
            {t(intro_es ?? "", intro_en ?? "", lang)}
          </p>
        )}
      </div>

      <div className="space-y-3 px-6 pb-10">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to as "/cocina"}
            className="block rounded-2xl bg-[var(--leonor-cream)] px-5 py-5 shadow-md transition-transform hover:scale-[1.01]"
          >
            <span className="font-serif text-xl" style={{ color }}>
              {t(l.title_es, l.title_en, lang)} →
            </span>
          </Link>
        ))}
      </div>

      {sectionId && (
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <RoomDialogueCard sectionId={sectionId} color={color} />
        </div>
      )}
    </div>
  );
}
