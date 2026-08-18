import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import rooms from "@/data/roomData.json";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { roomIcons, type RoomIconKey } from "@/lib/room-icons";

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
        content: "Una museografía interactiva del universo doméstico y simbólico de Leonora Carrington.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const ROOM_ICON: Record<string, RoomIconKey> = {
  cocina: "cocina-libro",
  comedor: "comedor-amigos",
  biblioteca: "biblioteca-libro",
  about: "proyecto-libro",
};

function HomePage() {
  const { language } = useLeonor();
  const sections = rooms.filter((r) => r.id !== "home");

  return (
    <RoomLandingLayout sectionId="home">
      <div className="px-5 py-10 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] opacity-80">
          {t("Bienvenida a", "Welcome to", language)}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight">
          {t("Casa Estudio", "House Studio", language)}
          <br />
          Leonora Carrington
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm opacity-90">
          {t(
            "Una museografía interactiva de su universo doméstico y simbólico.",
            "An interactive museography of her domestic and symbolic universe.",
            language,
          )}
        </p>
      </div>

      <nav aria-label={t("Habitaciones", "Rooms", language)} className="grid grid-cols-2 gap-3 px-5 pb-10">
        {sections.map((r) => {
          const pair = roomIcons[ROOM_ICON[r.id] ?? "proyecto-libro"];
          return (
            <Link
              key={r.id}
              to={`/${r.id}` as "/cocina"}
              className="group flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[var(--leonor-cream)] p-5 text-center shadow-md transition-transform hover:scale-[1.02]"
            >
              {pair && (
                <span className="relative h-16 w-16 flex-shrink-0">
                  <img
                    src={pair.normal}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-0"
                  />
                  <img
                    src={pair.active}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </span>
              )}
              <h2 className="font-serif text-xl leading-tight" style={{ color: `var(--${r.color})` }}>
                {t(r["es-id"], r["en-id"], language)}
              </h2>
            </Link>
          );
        })}
      </nav>
    </RoomLandingLayout>
  );
}
