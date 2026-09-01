import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";
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

function SocialIcon({ href, label, badge, children }: { href: string; label: string; badge?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={
        badge
          ? "flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background transition hover:opacity-80"
          : "text-foreground transition hover:opacity-70"
      }
    >
      {children}
    </a>
  );
}

function AutorasPage() {
  const { language } = useLeonor();
  const data = about.Link2?.[0];
  const autoras: Autora[] = (data?.autoras as Autora[]) ?? [];

  return (
    <SectionPageLayout sectionId="about">
    <div className="px-5 py-8">
      <h1 className="mb-2 text-center font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Las Tres Brujas (de MADIC)" : "The Three Witches (of MADIC)"}
      </h1>
      {data && (
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {language === "es" ? data.descripcion_es : data.descripcion_en}
        </p>
      )}
      <ul className="space-y-4">
        {autoras.map((a, i) => {
          const imagen = a.imagen ? imagenesByKey[a.imagen] : undefined;
          return (
            <li
              key={i}
              className="rounded-xl border bg-card p-4 shadow-sm"
              style={{ borderColor: "color-mix(in srgb, var(--section-color) 30%, transparent)" }}
            >
              <div className="flex items-start gap-3">
                {imagen && (
                  <div
                    aria-hidden
                    className="h-16 w-16 shrink-0"
                    style={{
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
                  <p className="font-serif text-base" style={{ color: "var(--section-color)" }}>
                    {a.autora}
                  </p>
                  {a.descripcion && (
                    <p className="mt-2 text-sm leading-relaxed">{a.descripcion}</p>
                  )}
                  {(a.correo || a.linkedin || a.github) && (
                    <div className="mt-3 flex items-center gap-3">
                      {a.correo && (
                        <SocialIcon href={`mailto:${a.correo}`} label={`Mandar mail a ${a.autora}`}>
                          <Mail className="h-5 w-5" />
                        </SocialIcon>
                      )}
                      {a.linkedin && (
                        <SocialIcon href={a.linkedin} label={`Link de LinkedIn de ${a.autora}`} badge>
                          <Linkedin className="h-3.5 w-3.5" />
                        </SocialIcon>
                      )}
                      {a.github && (
                        <SocialIcon href={a.github} label={`Link de Github de ${a.autora}`} badge>
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
                          </svg>
                        </SocialIcon>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
    </SectionPageLayout>
  );
}
