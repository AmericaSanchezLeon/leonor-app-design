import { useMemo } from "react";
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

const randomTilt = () => Math.round((Math.random() * 30 - 15) * 10) / 10;

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

  // One random tilt per button, picked fresh on every mount (screen load).
  const leftTilt = useMemo(randomTilt, [leftLink?.to]);
  const rightTilt = useMemo(randomTilt, [rightLink?.to]);

  const renderButton = (l: RoomLink, tilt: number) => {
    const active = pathname.startsWith(l.to);
    const pair = l.iconKey ? roomIcons[l.iconKey] : null;
    return (
      <Link
        to={l.to as "/cocina"}
        className="group flex w-36 flex-col items-center gap-1 rounded-2xl p-1 text-center transition-transform hover:scale-[1.02]"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {pair && (
          <span className="relative h-32 w-32 flex-shrink-0">
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
        <span className="font-serif text-lg leading-tight" style={{ color: "var(--leonor-cream)" }}>
          {t(l.title_es, l.title_en, lang)}
        </span>
      </Link>
    );
  };

  return (
    <RoomLandingLayout sectionId={sectionId}>
      <div className="relative flex flex-1 flex-col items-center justify-center px-4">
        {leftLink && (
          <div className="absolute left-5 top-2">{renderButton(leftLink, leftTilt)}</div>
        )}

        <div className="-mt-32 text-center">
          <h1 className="text-6xl leading-tight">{t(title_es, title_en, lang)}</h1>
          {(intro_es || intro_en) && (
            <p className="mx-auto mt-4 max-w-xs text-base">
              {t(intro_es ?? "", intro_en ?? "", lang)}
            </p>
          )}
        </div>

        {rightLink && (
          <div className="absolute right-5 bottom-40">{renderButton(rightLink, rightTilt)}</div>
        )}
      </div>
    </RoomLandingLayout>
  );
}
