import { useEffect, useState } from "react";
import { useLeonor, t } from "@/lib/leonor-context";
import doorVideoWebm from "@/assets/anim/puerta-entrada.webm";
import doorVideoMp4 from "@/assets/anim/puerta-entrada.mp4";

export function DoorIntro({ onDone }: { onDone: () => void }) {
  const { language } = useLeonor();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Fallback in case the video fails to load or "ended" never fires.
    const fallback = setTimeout(onDone, 8000);
    // Fade the welcome text in once the door has had time to open.
    const textTimer = setTimeout(() => setShowText(true), 2500);
    return () => {
      clearTimeout(fallback);
      clearTimeout(textTimer);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--leonor-amber)" }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        onError={onDone}
        className="h-full w-full object-cover"
      >
        <source src={doorVideoWebm} type="video/webm" />
        <source src={doorVideoMp4} type="video/mp4" />
      </video>
      <h1
        className={`pointer-events-none absolute inset-x-0 bottom-16 px-8 text-center text-2xl leading-tight text-[var(--leonor-cream)] transition-opacity duration-1000 ${
          showText ? "opacity-100" : "opacity-0"
        }`}
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
      >
        {t(
          "Bienvenido a la casa estudio Leonora Carrington",
          "Welcome to the Leonora Carrington house studio",
          language,
        )}
      </h1>
    </div>
  );
}
