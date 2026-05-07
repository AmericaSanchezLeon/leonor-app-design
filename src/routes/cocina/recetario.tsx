import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";

export const Route = createFileRoute("/cocina/recetario")({
  head: () => ({
    meta: [
      { title: "Recetario — Leonorapp" },
      { name: "description", content: "Recetas de la cocina de Leonora Carrington." },
    ],
  }),
  component: Recetario,
});

function Recetario() {
  const { language } = useLeonor();
  return (
    <div className="px-5 py-8" style={{ minHeight: "calc(100vh - 104px)" }}>
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--cocina)" }}>
        {language === "es" ? "Recetario" : "Recipes"}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {recetas.map((r, i) => (
          <Link
            key={i}
            to="/cocina/receta/$recetaId"
            params={{ recetaId: String(i) }}
            className="overflow-hidden rounded-2xl bg-card shadow-md transition-transform hover:scale-[1.02]"
          >
            <div
              className="aspect-square w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${recetaImg(r.imagen)})` }}
            />
            <div className="p-3">
              <p className="font-serif text-sm leading-tight">{r.nombre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
