import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import rooms from "@/data/roomData.json";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { MosaicTileOverlay } from "@/components/MosaicTileOverlay";

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

const randomTilt = () => Math.round((Math.random() * 10 - 5) * 10) / 10;

function HomePage() {
  const { language } = useLeonor();
  const sections = rooms.filter((r) => r.id !== "home");
  const tilts = useMemo(() => sections.map(randomTilt), [sections]);

  return (
    <RoomLandingLayout sectionId="home">
      <nav
        aria-label={t("Habitaciones", "Rooms", language)}
        className="grid flex-1 grid-cols-2 content-center place-items-center gap-8 px-8 py-6"
      >
        {sections.map((r, i) => (
          <Link
            key={r.id}
            to={`/${r.id}` as "/cocina"}
            aria-label={t(r["es-id"], r["en-id"], language)}
            className="group relative block aspect-square w-full max-w-40 overflow-hidden rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03]"
            style={{ transform: `rotate(${tilts[i]}deg)` }}
          >
            <img
              src={HOME_ROOM_IMG[r.id]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <MosaicTileOverlay
              title={t(r["es-id"], r["en-id"], language)}
              colorVar={`--${r.color}`}
            />
          </Link>
        ))}
      </nav>
    </RoomLandingLayout>
  );
}
