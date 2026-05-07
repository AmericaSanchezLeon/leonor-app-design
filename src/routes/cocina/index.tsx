import { createFileRoute } from "@tanstack/react-router";
import { ChefHat } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";
import mascot from "@/data/mascotData.json";

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
      mascotQuote={mascot.cocina[0]}
      links={[
        { to: "/cocina/recetario", title_es: "Recetario", title_en: "Recipes" },
        { to: "/cocina/ra-instrucciones", title_es: "Realidad Aumentada", title_en: "Augmented Reality" },
      ]}
    />
  ),
});
