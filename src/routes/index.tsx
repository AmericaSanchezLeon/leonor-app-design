import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import rooms from "@/data/roomData.json";
import { ChefHat, Utensils, BookOpen, Info } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leonorapp — Casa Estudio Leonora Carrington" },
      { name: "description", content: "Recorre la casa de Leonora Carrington: cocina, comedor, biblioteca y la historia del proyecto." },
    ],
  }),
  component: HomePage,
});

const ICONS: Record<string, typeof ChefHat> = {
  cocina: ChefHat,
  comedor: Utensils,
  biblioteca: BookOpen,
  about: Info,
};

const COLOR: Record<string, string> = {
  cocina: "var(--cocina)",
  comedor: "var(--comedor)",
  biblioteca: "var(--biblioteca)",
  about: "var(--about)",
};

function HomePage() {
  const { language } = useLeonor();
  const sections = rooms.filter((r) => r.id !== "home");

  return (
    <div className="px-5 py-8">
      <div className="mb-8 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("Bienvenida a", "Welcome to", language)}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight" style={{ color: "var(--leonor-amber)" }}>
          {t("Casa Estudio", "House Studio", language)}
          <br />
          Leonora Carrington
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-muted-foreground">
          {t(
            "Una museografía interactiva de su universo doméstico y simbólico.",
            "An interactive museography of her domestic and symbolic universe.",
            language,
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((r) => {
          const Icon = ICONS[r.id] ?? Info;
          const color = COLOR[r.id] ?? "var(--leonor-amber)";
          return (
            <Link
              key={r.id}
              to={`/${r.id}` as "/cocina"}
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl p-5 text-center transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: color, color: "var(--leonor-cream)" }}
            >
              <Icon className="mb-3 h-8 w-8 opacity-90" strokeWidth={1.5} />
              <h2 className="font-serif text-2xl leading-tight">
                {t(r["es-id"], r["en-id"], language)}
              </h2>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 text-center font-serif text-xs italic text-muted-foreground">
        “{t("La pintura es como cocinar — un acto de magia.", "Painting is like cooking — an act of magic.", language)}”
      </p>
    </div>
  );
}
