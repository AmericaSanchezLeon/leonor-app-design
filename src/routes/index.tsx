import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import rooms from "@/data/roomData.json";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { roomGradientColors, roomGradientCss, type RoomGradientId } from "@/lib/room-gradient-colors";

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

function HomePage() {
  const { language } = useLeonor();
  const sections = rooms.filter((r) => r.id !== "home");

  return (
    <RoomLandingLayout sectionId="home">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <h1 className="text-4xl leading-tight">
          {t(
            "Bienvenido a la casa estudio Leonora Carrington",
            "Welcome to the Leonora Carrington house studio",
            language,
          )}
        </h1>
      </div>

      <nav aria-label={t("Habitaciones", "Rooms", language)} className="flex flex-col">
        {sections.map((r) => {
          const gradientId = r.color in roomGradientColors ? (r.color as RoomGradientId) : undefined;
          return (
            <Link
              key={r.id}
              to={`/${r.id}` as "/cocina"}
              className="relative block aspect-[3/2] w-full border-4"
              style={{
                borderColor: `var(--${r.color})`,
                backgroundImage: gradientId ? roomGradientCss(gradientId) : undefined,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <h2
                  className="text-center text-3xl leading-tight text-[var(--leonor-cream)]"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                >
                  {t(r["es-id"], r["en-id"], language)}
                </h2>
              </div>
            </Link>
          );
        })}
      </nav>
    </RoomLandingLayout>
  );
}
