import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { ArIntro } from "@/components/ar/ArIntro";
import { cocinaStickers } from "@/lib/ar-assets";

export const Route = createFileRoute("/cocina/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Cocina" }] }),
  component: CocinaRA,
});

function CocinaRA() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <ArIntro
        sectionId="cocina"
        title="¡Prepárate!"
        body="Vas a usar la cámara para descubrir objetos mágicos escondidos en la cocina de Leonora. Apunta la cámara hacia tu alrededor para revelar la sorpresa."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div style={{ ["--section-color" as string]: "var(--cocina)" } as CSSProperties}>
      <ARCamera
        mode="surface"
        items={cocinaStickers}
        sectionColor="var(--section-color)"
        title="Té con Leonora"
      />
    </div>
  );
}
