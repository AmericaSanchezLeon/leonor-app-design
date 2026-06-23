import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { RoomLanding } from "@/components/RoomLanding";

export const Route = createFileRoute("/biblioteca/")({
  head: () => ({ meta: [{ title: "Biblioteca — Leonorapp" }] }),
  component: () => (
    <RoomLanding
      color="var(--biblioteca)"
      title_es="La Biblioteca"
      title_en="The Library"
      icon={<BookOpen className="h-10 w-10" strokeWidth={1.5} />}
      sectionId="biblioteca"
      links={[
        { to: "/biblioteca/estante", title_es: "Estante de libros", title_en: "Bookshelf", iconKey: "biblioteca-libro" },
        { to: "/biblioteca/ra-instrucciones", title_es: "Realidad Aumentada", title_en: "Augmented Reality", iconKey: "biblioteca-mascara" },
      ]}
    />
  ),
});
