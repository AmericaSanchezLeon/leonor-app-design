import { createFileRoute } from "@tanstack/react-router";
import { ARCamera } from "@/components/ar/ARCamera";
import { bibliotecaMasks } from "@/lib/ar-assets";

export const Route = createFileRoute("/biblioteca/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Biblioteca" }] }),
  component: () => (
    <ARCamera
      mode="face"
      items={bibliotecaMasks}
      sectionColor="var(--biblioteca)"
      title="Máscaras de Leonora"
    />
  ),
});
