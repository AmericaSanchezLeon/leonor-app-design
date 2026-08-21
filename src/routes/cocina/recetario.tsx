import { createFileRoute, Link } from "@tanstack/react-router";
import recetas from "@/data/recetas.json";
import { useLeonor } from "@/lib/leonor-context";
import { recetaImg } from "@/lib/leonor-images";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/cocina/recetario")({
  head: () => ({
    meta: [
      { title: "Recetario — Leonorapp" },
      { name: "description", content: "Recetas de la cocina de Leonora Carrington." },
    ],
  }),
  component: Recetario,
});

const RECETARIO_BOOK_ORANGE = "#c1541f";

function RecetarioBook() {
  return (
    <div className="mb-8">
      <div
        className="flex aspect-[2/3] w-full max-w-[280px] mx-auto flex-col items-center justify-between px-6 py-10 text-center"
        style={{ backgroundColor: RECETARIO_BOOK_ORANGE, color: "var(--leonor-cream)" }}
      >
        <div className="space-y-1 text-xs leading-relaxed">
          <p>Alejandra Osorio Olave</p>
          <p>Itzel Alejandra Jiménez Loranca</p>
          <p>América Fabiola Sánchez León</p>
          <p>Ollintzin Mary Carmen Rosas Juárez</p>
        </div>
        <div>
          <p className="font-serif text-2xl leading-tight">La cocina alquímica</p>
          <p className="mt-2 font-serif text-sm leading-relaxed">
            (o cómo salvarse de la hostilidad del conformismo): recetario de Leonora Carrington
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-wider opacity-90">
          Universidad Autónoma Metropolitana
        </p>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-foreground">
        Cocinar es un proceso lúdico, experimental e irreverente para Leonora Carrington, una
        metáfora de los trabajos alquímicos –solve et coagula– que conducen a la Gran Obra. A
        partir de esta faceta, nace La cocina alquímica (o cómo salvarse de la hostilidad del
        conformismo): recetario de Leonora Carrington, libro que muestra, por un lado, algunas de
        las llamativas referencias al acto de cocinar en su obra pictórica, narrativa y
        escultórica; por otro, recopila las recetas cotidianas que preparaba para agasajar en casa
        a familiares, amigos e invitados en distintas etapas de su vida.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-foreground">
        En el caso de algunos de estos platillos, las autoras han ampliado la información gracias
        al rescate de relatos de testigos que ofrecen un panorama más amplio para conocer el
        origen de algunas de estas combinaciones, con el objetivo de que el lector –y cocinero
        potencial– se adentre en las dimensiones contextuales del mundo…
      </p>
    </div>
  );
}

function Recetario() {
  const { language } = useLeonor();
  return (
    <SectionPageLayout sectionId="cocina" dialogueSectionId="cocina_recetario">
      <div className="px-5 py-8">
      <h1 className="mb-6 font-serif text-3xl" style={{ color: "var(--section-color)" }}>
        {language === "es" ? "Recetario" : "Recipes"}
      </h1>
      <RecetarioBook />
      <div className="grid grid-cols-2 gap-0">
        {recetas.map((r, i) => (
          <Link
            key={i}
            to="/cocina/receta/$recetaId"
            params={{ recetaId: String(i) }}
            className="relative block"
          >
            <img
              src={recetaImg(r.imagen, "thumb")}
              alt=""
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              className={`aspect-square w-full bg-[var(--section-color)]/10 object-cover ${
                r.imagenRotada180 ? "rotate-180" : ""
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center px-3">
              <p
                className="text-center font-serif text-lg leading-tight text-[var(--leonor-cream)]"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
              >
                {r.nombre}
              </p>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </SectionPageLayout>
  );
}
