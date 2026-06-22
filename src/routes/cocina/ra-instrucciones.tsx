import { createFileRoute } from "@tanstack/react-router";
import { ARCamera } from "@/components/ar/ARCamera";
import { cocinaStickers } from "@/lib/ar-assets";

export const Route = createFileRoute("/cocina/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Cocina" }] }),
  component: () => (
    <ARCamera
      mode="surface"
      items={cocinaStickers}
      sectionColor="var(--cocina)"
      title="Té con Leonora"
    />
  ),
});
