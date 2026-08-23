import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { ArIntro } from "@/components/ar/ArIntro";
import { bibliotecaMasks } from "@/lib/ar-assets";

export const Route = createFileRoute("/biblioteca/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Biblioteca" }] }),
  component: BibliotecaRA,
});

function BibliotecaRA() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <ArIntro
        sectionId="biblioteca"
        title="¡Prepárate!"
        body="Vas a usar la cámara frontal para convertirte en una criatura del mundo de Leonora y ver tu nuevo rostro."
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div style={{ ["--section-color" as string]: "var(--biblioteca)" } as CSSProperties}>
      <ARCamera
        mode="face"
        items={bibliotecaMasks}
        sectionColor="var(--section-color)"
        title="Máscaras de Leonora"
      />
    </div>
  );
}
