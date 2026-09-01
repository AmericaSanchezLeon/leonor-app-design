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
            <p className="text-sm leading-relaxed">
              {language === "es" ? s.descripcion_es : s.descripcion_en}
            </p>
          </section>
        ))}
        <div
          className="overflow-hidden rounded-2xl border shadow-sm"
          style={{ borderColor: "color-mix(in srgb, var(--section-color) 30%, transparent)" }}
        >
          <div className="relative w-full" style={{ height: "calc(var(--app-vh, 100vh) * 0.9)" }}>
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://online.fliphtml5.com/AmericaSanchez/lmbw/"
              title="Alquimia, tecnología y vida cotidiana"
              seamless
              scrolling="no"
              allowTransparency
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
    </SectionPageLayout>
  );
}
