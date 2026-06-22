import { createFileRoute, Link } from "@tanstack/react-router";
import books from "@/data/booksData.json";
import { useLeonor } from "@/lib/leonor-context";
import { bookImg } from "@/lib/leonor-images";
import { itemIcon } from "@/lib/leonor-icons";
const LibroIcon = itemIcon.libro;

export const Route = createFileRoute("/biblioteca/estante")({
  head: () => ({ meta: [{ title: "Estante — Leonorapp" }] }),
  component: EstantePage,
});

function EstantePage() {
  const { language } = useLeonor();
  return (
    <div className="px-5 py-8">
      <h1 className="mb-2 font-serif text-3xl" style={{ color: "var(--biblioteca)" }}>
        Estante de libros
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Lecturas que habitaron la biblioteca de la familia Weisz-Carrington.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {books.map((b, i) => (
          <Link
            key={i}
            to="/biblioteca/libro/$libroId"
            params={{ libroId: String(i) }}
            className="overflow-hidden rounded-xl bg-card shadow-md transition-transform hover:scale-[1.02]"
          >
            <div
              className="aspect-[2/3] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bookImg(i)})` }}
            />
            <div className="p-3">
              <div className="flex items-start gap-2" style={{ color: "var(--biblioteca)" }}>
                <LibroIcon size={14} strokeWidth={1.75} className="mt-0.5 flex-shrink-0" />
                <p className="font-serif text-sm leading-tight text-foreground">
                  {language === "es" ? b.nombre_es : b.nombre}
                </p>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {b.autor}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
