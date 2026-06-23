import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";

export const Route = createFileRoute("/about/")({
  head: () => ({ meta: [{ title: "Sobre el proyecto — Leonorapp" }] }),
  component: () => (
    <RoomLanding
      color="var(--about)"
      title_es="Sobre"
      title_en="About"
      intro_es="Conoce el proyecto y a las autoras detrás de esta museografía interactiva."
      intro_en="Learn about the project and the authors behind this interactive museography."
      icon={<Info className="h-10 w-10" strokeWidth={1.5} />}
      sectionId="about"
      links={[
        { to: "/about/proyecto", title_es: "Sobre el proyecto", title_en: "About the project", iconKey: "proyecto-libro" },
        { to: "/about/autoras", title_es: "Las Autoras", title_en: "The Authors", iconKey: "proyecto-autores" },
      ]}
    />
  ),
});
