import { createFileRoute, Link } from "@tanstack/react-router";
import amigos from "@/data/amigosData.json";
import { amigoImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/comedor/amigos/")({
  head: () => ({
    meta: [
      { title: "Amigos de Leonora — Leonorapp" },
      {
        name: "description",
        content:
          "Mosaico de retratos de los artistas e intelectuales que compartieron mesa y amistad con Leonora Carrington.",
      },
      { property: "og:title", content: "Amigos de Leonora — Leonorapp" },
      {
        property: "og:description",
        content: "Retratos de los amigos que compartieron mesa con Leonora Carrington.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AmigosPage,
});

function AmigosPage() {
  return (
    <SectionPageLayout sectionId="comedor">
      <div className="py-8">
        <h1 className="mb-6 px-5 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
          Nuestros Amigos
        </h1>
        <ul className="grid grid-cols-3 gap-0">
          {amigos.map((a, i) => (
            <li key={i}>
              <Link
                to="/comedor/amigos/$amigoId"
                params={{ amigoId: String(i) }}
                aria-label={a.amigo}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ ["--tw-ring-color" as string]: "var(--section-color)" }}
              >
                <img
                  src={amigoImg(a.imagen, "thumb")}
                  alt=""
                  width={400}
                  height={600}
                  loading={i < 6 ? "eager" : "lazy"}
                  fetchPriority={i < 3 ? "high" : "auto"}
                  decoding="async"
                  className="block aspect-[2/3] w-full bg-[var(--section-color)]/10 object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionPageLayout>
  );
}
