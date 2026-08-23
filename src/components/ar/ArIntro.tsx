import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import type { SectionContextId } from "@/lib/use-section-context";

export function ArIntro({
  sectionId,
  title,
  body,
  buttonLabel = "Comenzar",
  onStart,
}: {
  sectionId: SectionContextId;
  title: string;
  body: string;
  buttonLabel?: string;
  onStart: () => void;
}) {
  return (
    <RoomLandingLayout sectionId={sectionId} withDialogue={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <h1 className="text-5xl leading-tight">{title}</h1>
        <p className="max-w-xs text-base leading-relaxed opacity-90">{body}</p>
        <button
          type="button"
          onClick={onStart}
          className="mt-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "var(--leonor-cream)", color: "var(--section-color)" }}
        >
          {buttonLabel}
        </button>
      </div>
    </RoomLandingLayout>
  );
}
