import type { CSSProperties } from "react";
import { RoomIllustrationBg } from "@/components/RoomIllustrationBg";
import { sectionTokenFor, type SectionContextId } from "@/lib/use-section-context";

export function ArIntro({
  sectionId,
  title,
  body,
  image,
  buttonLabel = "Comenzar",
  onStart,
}: {
  sectionId: SectionContextId;
  title: string;
  body: string;
  image?: string;
  buttonLabel?: string;
  onStart: () => void;
}) {
  const color = `var(${sectionTokenFor(sectionId)})`;

  return (
    <div
      className="relative flex min-h-[calc(100vh-104px)] flex-col overflow-hidden"
      style={
        {
          ["--section-color" as string]: color,
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        } as CSSProperties
      }
    >
      <RoomIllustrationBg sectionId={sectionId} opacity={0.1} />

      <div className="relative z-[2] flex flex-1 flex-col items-center gap-6 px-6 py-10 text-center">
        <h1 className="text-5xl leading-tight" style={{ color: "var(--section-color)" }}>
          {title}
        </h1>
        <p className="max-w-xs text-base leading-relaxed opacity-80">{body}</p>

        {image && (
          <img
            src={image}
            alt=""
            className="mx-auto w-56 max-w-full flex-1 object-contain"
          />
        )}

        <button
          type="button"
          onClick={onStart}
          className="mb-4 shrink-0 rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "var(--section-color)", color: "var(--leonor-cream)" }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
