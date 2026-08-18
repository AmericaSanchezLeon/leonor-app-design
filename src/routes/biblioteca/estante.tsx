import { createFileRoute, Link } from "@tanstack/react-router";
import books from "@/data/booksData.json";
import { useLeonor } from "@/lib/leonor-context";
import { bookImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/biblioteca/estante")({
  head: () => ({ meta: [{ title: "Estante — Leonorapp" }] }),
  component: EstantePage,
});

function EstantePage() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="biblioteca">
      <div className="py-8">
        <h1
          className="mb-6 px-5 font-serif text-3xl"
          style={{ color: "var(--section-color)" }}
        >
          Estante de libros
        </h1>
        <ul className="grid grid-cols-3 gap-0">
          {books.map((b, i) => {
            const title = language === "es" ? b.nombre_es : b.nombre;
            return (
              <li key={i}>
                <Link
                  to="/biblioteca/libro/$libroId"
                  params={{ libroId: String(i) }}
                  aria-label={`${title} — ${b.autor}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ ["--tw-ring-color" as string]: "var(--section-color)" }}
                >
                  <img
                    src={bookImg(i, "thumb")}
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
            );
          })}
        </ul>
      </div>
    </SectionPageLayout>
  );
}
