import { Link, useRouterState } from "@tanstack/react-router";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { roomIcons, type RoomIconKey } from "@/lib/room-icons";
import type { SectionContextId } from "@/lib/use-section-context";
import type { ReactNode } from "react";

interface RoomLink {
  to: string;
  title_es: string;
  title_en: string;
  iconKey?: RoomIconKey;
}

export function RoomLanding({
  title_es,
  title_en,
  intro_es,
  intro_en,
  sectionId,
  links,
  icon,
}: {
  /** @deprecated color now comes from the section context */
  color?: string;
  title_es: string;
  title_en: string;
  intro_es?: string;
  intro_en?: string;
  sectionId?: SectionContextId;
  links: RoomLink[];
  icon?: ReactNode;
}) {
  const { language } = useLeonor();
  const lang: Lang = language;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [leftLink, rightLink] = links;

  const renderButton = (l: RoomLink) => {
    const active = pathname.startsWith(l.to);
    const pair = l.iconKey ? roomIcons[l.iconKey] : null;
    return (
      <Link
        to={l.to as "/cocina"}
        className="group flex w-24 flex-col items-center gap-2 text-center transition-transform hover:scale-[1.02]"
      >
        {pair && (
          <span className="relative h-16 w-16 flex-shrink-0">
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
        <span className="font-serif text-sm leading-tight" style={{ color: "var(--leonor-cream)" }}>
          {t(l.title_es, l.title_en, lang)}
        </span>
      </Link>
    );
  };

  return (
    <RoomLandingLayout sectionId={sectionId}>
      <div className="flex flex-col items-center gap-6 px-4 py-10">
        <div>{leftLink && renderButton(leftLink)}</div>

        <div className="text-center">
          <h1 className="font-serif text-4xl leading-tight">{t(title_es, title_en, lang)}</h1>
          {(intro_es || intro_en) && (
            <p className="mx-auto mt-4 max-w-xs text-sm opacity-90">
              {t(intro_es ?? "", intro_en ?? "", lang)}
            </p>
          )}
        </div>

        <div>{rightLink && renderButton(rightLink)}</div>
      </div>
    </RoomLandingLayout>
  );
}
