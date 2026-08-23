import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import about from "@/data/aboutData.json";
import { useLeonor } from "@/lib/leonor-context";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import monitasAmerica from "@/assets/img/autoras/monitas-america.svg";
import monitasOllin from "@/assets/img/autoras/monitas-ollin.svg";
import monitasItzel from "@/assets/img/autoras/monitas-itzel.svg";

export const Route = createFileRoute("/about/autoras")({
  head: () => ({ meta: [{ title: "Las Tres Brujas — Leonorapp" }] }),
  component: AutorasPage,
});

const imagenesByKey: Record<string, string> = {
  america: monitasAmerica,
  ollin: monitasOllin,
  itzel: monitasItzel,
};

interface Autora {
  autora?: string;
  rol?: string;
  descripcion?: string;
  imagen?: string;
  correo?: string;
  linkedin?: string;
  github?: string;
}

function AutorasPage() {
  const { language } = useLeonor();
  const data = about.Link2?.[0];
  const autoras: Autora[] = (data?.autoras as Autora[]) ?? [];

  return (
    <SectionPageLayout sectionId="about">
    <div className="px-5 py-8">
      <h1 className="mb-2 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Las Tres Brujas (de MADIC)" : "The Three Witches (of MADIC)"}
      </h1>
      {data && (
        <p className="mb-6 text-sm text-muted-foreground">
          {language === "es" ? data.descripcion_es : data.descripcion_en}
        </p>
      )}
      <ul className="space-y-5">
        {autoras.map((a, i) => {
          const imagen = a.imagen ? imagenesByKey[a.imagen] : undefined;
          return (
            <li
              key={i}
              className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm"
            >
              {imagen && (
                <div
                  aria-hidden
                  className="shrink-0"
                  style={{
                    width: 48,
                    height: 108,
                    WebkitMaskImage: `url(${imagen})`,
                    maskImage: `url(${imagen})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    backgroundColor: "var(--section-color)",
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg" style={{ color: "var(--section-color)" }}>
                  {a.autora}
                </p>
                {a.rol && (
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {a.rol}
                  </p>
                )}
                {a.descripcion && (
                  <p className="mt-2 text-sm leading-relaxed">{a.descripcion}</p>
                )}
                {(a.correo || a.linkedin || a.github) && (
                  <div className="mt-3 flex items-center gap-3">
                    {a.correo && (
                      <a
                        href={`mailto:${a.correo}`}
                        aria-label={`Mandar mail a ${a.autora}`}
                        className="text-muted-foreground transition hover:opacity-70"
                        style={{ color: "var(--section-color)" }}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {a.linkedin && (
                      <a
                        href={a.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Link de LinkedIn de ${a.autora}`}
                        style={{ color: "var(--section-color)" }}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {a.github && (
                      <a
                        href={a.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Link de Github de ${a.autora}`}
                        style={{ color: "var(--section-color)" }}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
    </SectionPageLayout>
  );
}
