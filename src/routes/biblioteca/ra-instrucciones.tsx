import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";

export const Route = createFileRoute("/biblioteca/ra-instrucciones")({
  head: () => ({ meta: [{ title: "Realidad Aumentada — Biblioteca" }] }),
  component: () => (
    <div className="flex min-h-[calc(100vh-104px)] flex-col items-center justify-center px-8 text-center" style={{ backgroundColor: "var(--biblioteca)", color: "var(--leonor-cream)" }}>
      <ScanLine className="mb-6 h-16 w-16" strokeWidth={1.2} />
      <h1 className="font-serif text-3xl">Realidad Aumentada</h1>
      <p className="mt-4 max-w-xs text-sm opacity-90">
        Toca el caldero o un libro de la biblioteca para descubrir las máscaras y mundos de Leonora.
      </p>
      <p className="mt-8 rounded-full bg-white/15 px-5 py-2 text-xs">Próximamente disponible</p>
    </div>
  ),
});
