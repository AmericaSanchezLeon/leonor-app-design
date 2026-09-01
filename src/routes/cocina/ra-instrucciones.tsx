import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { ArIntro } from "@/components/ar/ArIntro";
import { cocinaStickers } from "@/lib/ar-assets";
import { useLeonor, t } from "@/lib/leonor-context";

export const Route = createFileRoute("/cocina/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Cocina" }] }),
  component: CocinaRA,
});

function CocinaRA() {
  const { language } = useLeonor();
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <ArIntro
        sectionId="cocina"
        title={t("¡Prepárate!", "Get ready!", language)}
        body={t(
          "Vas a usar la cámara trasera de tu celular para descubrir objetos mágicos escondidos en la cocina de Leonora. Coloca tu celular sobre una superficie plana y apunta la cámara hacia ella para revelar la sorpresa.",
          "You'll use your phone's back camera to discover magic objects hidden in Leonora's kitchen. Place your phone on a flat surface and point the camera at it to reveal the surprise.",
          language,
        )}
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
        title={t("Té con Leonora", "Tea with Leonora", language)}
      />
    </div>
  );
}
