import { Link, useRouterState } from "@tanstack/react-router";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import { RoomDialogueCard } from "@/components/RoomDialogueCard";
import { RoomSvgPattern } from "@/components/RoomSvgPattern";
import { roomIcons, type RoomIconKey } from "@/lib/room-icons";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomScatterAssets } from "@/lib/room-scatter";
import type { ReactNode } from "react";

const PATTERN_SECTIONS: SectionBgId[] = ["home", "cocina", "comedor", "biblioteca", "about"];
const isPatternSection = (id?: string): id is SectionBgId =>
  !!id && (PATTERN_SECTIONS as string[]).includes(id);

interface RoomLink {
  to: string;
  title_es: string;
  title_en: string;
  iconKey?: RoomIconKey;
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const patternId = isPatternSection(sectionId) ? sectionId : null;

  return (
    <div
      className="relative min-h-[calc(100vh-104px)] overflow-hidden pb-48"
      style={{ backgroundColor: color }}
    >
      {patternId && (
        <RoomSvgPattern
          sectionId={patternId}
          tileUrl={roomBg[patternId]}
          svgUrls={roomScatterAssets[patternId]}
        />
      )}

      <div className="relative z-[2] px-6 py-10 text-center" style={{ color: "var(--leonor-cream)" }}>
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

      <div className="relative z-[2] space-y-3 px-6 pb-10">
        {links.map((l) => {
          const active = pathname.startsWith(l.to);
          const pair = l.iconKey ? roomIcons[l.iconKey] : null;
          return (
            <Link
              key={l.to}
              to={l.to as "/cocina"}
              className="group flex items-center gap-4 rounded-2xl bg-[var(--leonor-cream)] px-5 py-5 shadow-md transition-transform hover:scale-[1.01]"
            >
              {pair && (
                <span className="relative h-14 w-14 flex-shrink-0">
                  <img
                    src={pair.normal}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                      active ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                    }`}
                  />
                  <img
                    src={pair.active}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </span>
              )}
              <span className="font-serif text-xl" style={{ color }}>
                {t(l.title_es, l.title_en, lang)} →
              </span>
            </Link>
          );
        })}
      </div>

      {sectionId && (
        <div className="absolute inset-x-0 bottom-0 z-[2] px-4 pb-4">
          <RoomDialogueCard sectionId={sectionId} color={color} />
        </div>
      )}
    </div>
  );
}
