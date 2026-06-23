import { createFileRoute } from "@tanstack/react-router";
import { ChefHat } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";

export const Route = createFileRoute("/cocina/")({
  head: () => ({
    meta: [
      { title: "Cocina — Leonorapp" },
      { name: "description", content: "La cocina de Leonora: recetas y secretos." },
    ],
  }),
  component: () => (
    <RoomLanding
      color="var(--cocina)"
      title_es="La Cocina"
      title_en="The Kitchen"
      icon={<ChefHat className="h-10 w-10" strokeWidth={1.5} />}
      sectionId="cocina"
      links={[
        { to: "/cocina/recetario", title_es: "Recetario", title_en: "Recipes", iconKey: "cocina-libro" },
        { to: "/cocina/ra-instrucciones", title_es: "Realidad Aumentada", title_en: "Augmented Reality", iconKey: "cocina-tetera" },
      ]}
    />
  ),
});
