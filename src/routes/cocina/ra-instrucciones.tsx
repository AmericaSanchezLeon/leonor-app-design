import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { cocinaStickers } from "@/lib/ar-assets";

export const Route = createFileRoute("/cocina/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Cocina" }] }),
  component: () => (
    <div style={{ ["--section-color" as string]: "var(--cocina)" } as CSSProperties}>
      <ARCamera
        mode="surface"
        items={cocinaStickers}
        sectionColor="var(--section-color)"
        title="Té con Leonora"
      />
    </div>
  ),
});
