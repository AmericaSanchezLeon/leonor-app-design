import { createFileRoute } from "@tanstack/react-router";
import about from "@/data/aboutData.json";
import { useLeonor } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/about/proyecto")({
  head: () => ({ meta: [{ title: "El proyecto — Leonorapp" }] }),
  component: ProyectoPage,
});

function ProyectoPage() {
  const { language } = useLeonor();
  const sections = about.Link1 ?? [];
  return (
    <SectionPageLayout sectionId="about">
    <div className="px-5 py-8">
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Sobre el proyecto" : "About the project"}
      </h1>
      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-serif text-xl leading-tight" style={{ color: "var(--section-color)" }}>
              {language === "es" ? s.title_es : s.title_en}
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {language === "es" ? s.descripcion_es : s.descripcion_en}
            </p>
          </section>
        ))}
      </div>
    </div>
    </SectionPageLayout>
  );
}
