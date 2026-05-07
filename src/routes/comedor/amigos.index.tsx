import { createFileRoute, Link } from "@tanstack/react-router";
import amigos from "@/data/amigosData.json";
import { amigoImg } from "@/lib/leonor-images";

export const Route = createFileRoute("/comedor/amigos/")({
  head: () => ({ meta: [{ title: "Amigos — Leonorapp" }] }),
  component: AmigosPage,
});

function AmigosPage() {
  return (
    <div className="px-5 py-8">
      <h1 className="mb-2 font-serif text-3xl" style={{ color: "var(--comedor)" }}>
        Nuestros Amigos
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Artistas e intelectuales que compartieron mesa con Leonora.
      </p>
      <ul className="space-y-3">
        {amigos.map((a, i) => (
          <li key={i}>
            <Link
              to="/comedor/amigos/$amigoId"
              params={{ amigoId: String(i) }}
              className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-sm transition-transform hover:scale-[1.01]"
            >
              <div
                className="h-16 w-16 flex-shrink-0 rounded-full bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${amigoImg(a.imagen)})` }}
              />
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">{a.amigo}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{a.es}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
