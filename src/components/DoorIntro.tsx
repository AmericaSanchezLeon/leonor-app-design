import { useEffect } from "react";
import doorVideoWebm from "@/assets/anim/puerta-entrada.webm";
import doorVideoMp4 from "@/assets/anim/puerta-entrada.mp4";

export function DoorIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // Fallback in case the video fails to load or "ended" never fires.
    const fallback = setTimeout(onDone, 5000);
    return () => clearTimeout(fallback);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--leonor-amber)" }}
    >
      <video autoPlay muted playsInline onEnded={onDone} onError={onDone} className="h-full w-full object-cover">
        <source src={doorVideoWebm} type="video/webm" />
        <source src={doorVideoMp4} type="video/mp4" />
      </video>
    </div>
  );
}
