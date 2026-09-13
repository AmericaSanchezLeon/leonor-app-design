import { createFileRoute } from "@tanstack/react-router";
import { Utensils } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";

export const Route = createFileRoute("/comedor/")({
  head: () => ({ meta: [{ title: "Comedor — Leonorapp" }] }),
  component: () => (
    <RoomLanding
      title_es="El Comedor"
      title_en="The Dining Room"
      icon={<Utensils className="h-10 w-10" strokeWidth={1.5} />}
      sectionId="comedor"
      links={[
        { to: "/comedor/amigos", title_es: "Nuestros Amigos", title_en: "Our Friends", iconKey: "comedor-amigos" },
        { to: "/comedor/mapas", title_es: "Rutas de Leonora", title_en: "Leonora's Routes", iconKey: "comedor-rutas" },
      ]}
    />
  ),
});
