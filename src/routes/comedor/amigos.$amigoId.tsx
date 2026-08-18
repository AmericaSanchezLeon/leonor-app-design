import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import amigos from "@/data/amigosData.json";
import { amigoImg } from "@/lib/leonor-images";
import { useLeonor } from "@/lib/leonor-context";
import { ArrowLeft } from "lucide-react";
import { SectionPageLayout } from "@/components/SectionPageLayout";

export const Route = createFileRoute("/comedor/amigos/$amigoId")({
  component: AmigoDetalle,
  notFoundComponent: () => <div className="p-8">No encontrado.</div>,
});

function AmigoDetalle() {
  const { amigoId } = Route.useParams();
  const { language } = useLeonor();
  const a = amigos[Number(amigoId)];
  if (!a) throw notFound();
  return (
    <SectionPageLayout sectionId="comedor" bare>
    <div className="pb-10">
      <div
        className="aspect-square w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${amigoImg(a.imagen)})` }}
      />
      <div className="px-5 pt-6">
        <Link to="/comedor/amigos" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Amigos
        </Link>
        <h1 className="font-serif text-3xl leading-tight" style={{ color: "var(--section-color)" }}>
          {a.amigo}
        </h1>
        <p className="mt-4 text-sm leading-relaxed">{language === "es" ? a.es : a.en}</p>
      </div>
    </div>
    </SectionPageLayout>
  );
}
