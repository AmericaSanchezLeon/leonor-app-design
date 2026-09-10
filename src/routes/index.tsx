import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLeonor, t } from "@/lib/leonor-context";
import { mascotImg } from "@/lib/leonor-images";
import rooms from "@/data/roomData.json";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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

function HomePage() {
  const { language } = useLeonor();
  const sections = rooms.filter((r) => r.id !== "home");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <RoomLandingLayout sectionId="home">
      <div className="flex flex-1 min-h-0 flex-col px-5 pb-28 pt-6">
        <Carousel
          setApi={setApi}
          opts={{ align: "center" }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <CarouselContent className="-ml-0 h-full">
            {sections.map((r, i) => {
              const mascot = mascotImg[r.id];
              const title = t(r["es-id"], r["en-id"], language);
              return (
                <CarouselItem key={r.id} className="flex h-full basis-full flex-col pl-0">
                  <div
                    className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[2rem] border-2"
                    style={{ borderColor: `var(--${r.color})` }}
                  >
                    <img
                      src={HOME_ROOM_IMG[r.id]}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tabular-nums"
                      style={{ backgroundColor: `var(--${r.color})`, color: "var(--leonor-cream)" }}
                    >
                      {String(i + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}
                    </span>
                    <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 backdrop-blur-sm">
                      {title}
                    </span>
                    {mascot && (
                      <span className="absolute bottom-6 right-6 h-12 w-12 overflow-hidden rounded-full bg-white shadow-lg">
                        <img
                          src={mascot}
                          alt=""
                          className="h-full w-full select-none object-cover object-top"
                        />
                      </span>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <p className="mt-4 text-xs uppercase tracking-wide opacity-70">
                      Leonorapp · {title}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <h2 className="font-serif text-3xl leading-tight">{title}</h2>
                      <ArrowRight className="h-6 w-6 flex-shrink-0" />
                    </div>
                    <hr className="my-4 border-current/20" />
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/${r.id}` as "/cocina"}
                        className="text-sm font-semibold hover:underline"
                      >
                        {t("Entrar", "Enter", language)} →
                      </Link>
                      <Dots n={sections.length} active={current} />
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </RoomLandingLayout>
  );
}
