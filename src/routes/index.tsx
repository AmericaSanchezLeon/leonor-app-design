import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLeonor, t } from "@/lib/leonor-context";
import rooms from "@/data/roomData.json";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { sectionIcon } from "@/lib/leonor-icons";
import { mascotImg } from "@/lib/leonor-images";

import cocinaInicio from "@/assets/img/home-rooms/cocina.png";
import comedorInicio from "@/assets/img/home-rooms/comedor.png";
import bibliotecaInicio from "@/assets/img/home-rooms/biblioteca.png";
import aboutInicio from "@/assets/img/home-rooms/about.png";

const HOME_ROOM_IMG: Record<string, string> = {
  cocina: cocinaInicio,
  comedor: comedorInicio,
  biblioteca: bibliotecaInicio,
  about: aboutInicio,
};

type RoomLink = { title_es: string; title_en: string };
type Room = {
  "es-id": string;
  "en-id": string;
  color: string;
  id: string;
  mascot?: string;
  link1?: RoomLink;
  link2?: RoomLink;
};

const mascotLabel = (slug?: string) =>
  slug ? slug.replace(/^mascotas?_/, "").replace(/^./, (c) => c.toUpperCase()) : null;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leonorapp — Casa Estudio Leonora Carrington" },
      {
        name: "description",
        content:
          "Recorre la casa de Leonora Carrington: cocina, comedor, biblioteca y la historia del proyecto.",
      },
      { property: "og:title", content: "Leonorapp — Casa Estudio Leonora Carrington" },
      {
        property: "og:description",
        content:
          "Una museografía interactiva del universo doméstico y simbólico de Leonora Carrington.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { language } = useLeonor();
  const sections = useMemo(() => (rooms as Room[]).filter((r) => r.id !== "home"), []);
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = cardRefs.current.findIndex((el) => el === visible.target);
        if (idx !== -1) setActive(idx);
      },
      { threshold: [0.5, 0.75] },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  return (
    <RoomLandingLayout sectionId="home">
      <div className="flex min-h-0 flex-1 flex-col">
        <nav
          aria-label={t("Habitaciones", "Rooms", language)}
          className="flex flex-1 snap-y snap-mandatory flex-col gap-5 overflow-y-auto px-4 pb-2 pt-4"
        >
          {sections.map((r, i) => {
            const color = `var(--${r.color})`;
            const Icon = sectionIcon[r.id as keyof typeof sectionIcon];
            const mascot = mascotImg[r.id];
            const name = t(r["es-id"], r["en-id"], language);
            const links = [r.link1, r.link2].filter((l): l is RoomLink => !!l);
            const mName = mascotLabel(r.mascot);

            return (
              <div
                key={r.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="shrink-0 snap-start"
              >
                <Link to={`/${r.id}` as "/cocina"} aria-label={name} className="group block">
                  <div className="relative">
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border-4"
                      style={{ borderColor: color }}
                    >
                      <img
                        src={HOME_ROOM_IMG[r.id]}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 top-0 flex gap-2 bg-gradient-to-b from-black/55 to-transparent p-3">
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--leonor-cream)]"
                          style={{ backgroundColor: color }}
                        >
                          {String(i + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-[var(--leonor-cream)]/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--leonor-cream)]">
                          {name}
                        </span>
                      </div>
                    </div>

                    {mascot && (
                      <div
                        className="absolute -bottom-7 right-4 flex items-center gap-2 rounded-2xl py-1.5 pl-1.5 pr-4 shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                        style={{ backgroundColor: color }}
                      >
                        <img src={mascot} alt="" className="h-11 w-11 rounded-xl object-cover" />
                        <div className="text-left leading-tight text-[var(--leonor-cream)]">
                          <p className="text-[9px] uppercase tracking-wider opacity-80">
                            {t("Conoce a", "Meet", language)}
                          </p>
                          <p className="text-sm font-semibold">{mName ?? name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-1 pt-9">
                    {links.length > 0 && (
                      <p className="text-[11px] uppercase tracking-wider opacity-70">
                        {links.map((l) => t(l.title_es, l.title_en, language)).join(" · ")}
                      </p>
                    )}
                    <h2 className="mt-1 font-serif text-3xl leading-tight">{name}</h2>

                    <div
                      className="mt-4 flex items-center justify-between border-t pt-3"
                      style={{ borderColor: "color-mix(in oklab, var(--leonor-cream) 25%, transparent)" }}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        {t("Entrar", "Enter", language)}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      {Icon && (
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          <Icon className="h-4 w-4 text-[var(--leonor-cream)]" />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 justify-center gap-1.5 pb-2" aria-hidden>
          {sections.map((r, i) => (
            <span
              key={r.id}
              className="h-1.5 w-4 rounded-full transition-opacity"
              style={{ backgroundColor: "var(--leonor-cream)", opacity: i === active ? 1 : 0.35 }}
            />
          ))}
        </div>
      </div>
    </RoomLandingLayout>
  );
}
