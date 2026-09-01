import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";

export const Route = createFileRoute("/about/")({
  head: () => ({ meta: [{ title: "Sobre el proyecto — Leonorapp" }] }),
  component: () => (
    <RoomLanding
      title_es="Sobre el proyecto"
      title_en="About the project"
      icon={<Info className="h-10 w-10" strokeWidth={1.5} />}
      sectionId="about"
      links={[
        { to: "/about/proyecto", title_es: "Alquimia, tecnología y vida cotidiana", title_en: "Alquimia, tecnología y vida cotidiana", iconKey: "proyecto-libro" },
        { to: "/about/autoras", title_es: "Las Tres Brujas (de MADIC)", title_en: "The Three Witches (of MADIC)", iconKey: "proyecto-autores" },
      ]}
    />
  ),
});
