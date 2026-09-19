import { createFileRoute } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";

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

  return (
    <RoomLandingLayout sectionId="home" dialogueDefaultOpen>
      <div className="relative flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl leading-tight">{t("Bienvenidx", "Welcomex", language)}</h1>
          <p className="mx-auto mt-4 max-w-xs text-base">
            {t(
              "a la Casa Estudio Leonora Carrington",
              "to the Leonora Carrington Casa Estudio",
              language,
            )}
          </p>
        </div>
      </div>
    </RoomLandingLayout>
  );
}
