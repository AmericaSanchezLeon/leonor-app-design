import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { bibliotecaMasks } from "@/lib/ar-assets";

export const Route = createFileRoute("/biblioteca/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Biblioteca" }] }),
  component: () => (
    <div style={{ ["--section-color" as string]: "var(--biblioteca)" } as CSSProperties}>
      <ARCamera
        mode="face"
        items={bibliotecaMasks}
        sectionColor="var(--section-color)"
        title="Máscaras de Leonora"
      />
    </div>
  ),
});
