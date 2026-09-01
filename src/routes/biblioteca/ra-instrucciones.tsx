import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { ArIntro } from "@/components/ar/ArIntro";
import { bibliotecaMasks } from "@/lib/ar-assets";
import { useLeonor, t } from "@/lib/leonor-context";
import mascaraPrincipal from "@/assets/ar/biblioteca/mascara-principal.png";

export const Route = createFileRoute("/biblioteca/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Biblioteca" }] }),
  component: BibliotecaRA,
});

function BibliotecaRA() {
  const { language } = useLeonor();
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <ArIntro
        sectionId="biblioteca"
        title={t("¡Hurra!", "Hooray!", language)}
        body={t(
          "Encontraste la máscara mágica de Leonora, al ponértela podrás convertirte en criatura del mundo de Leonora. Deberás abrir la cámara frontal y podrás ver tu nuevo rostro.",
          "You found Leonora's magic mask — put it on and you can turn into a creature from Leonora's world. You'll need to open the front camera to see your new face.",
          language,
        )}
        image={mascaraPrincipal}
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
        title={t("Máscaras de Leonora", "Leonora's masks", language)}
      />
    </div>
  );
}
