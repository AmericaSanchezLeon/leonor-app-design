import type { CSSProperties, ReactNode } from "react";
import { RoomDialogueCard } from "@/components/RoomDialogueCard";
import { RoomIllustrationBg } from "@/components/RoomIllustrationBg";
import { type SectionBgId } from "@/lib/room-backgrounds";
import { useSectionContext, sectionTokenFor, type SectionContextId } from "@/lib/use-section-context";

const PATTERN_SECTIONS: SectionBgId[] = ["home", "cocina", "comedor", "biblioteca", "about"];
const isPatternSection = (id?: string): id is SectionBgId =>
  !!id && (PATTERN_SECTIONS as string[]).includes(id);

interface Props {
  /** Defaults to the active route's section. */
  sectionId?: SectionContextId;
  /** Render the mascot dialogue card anchored to the bottom. */
  withDialogue?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Level 1 wrapper: solid section background, light (cream) text,
 * section pattern, and `--section-color` exposed to all descendants.
 */
export function RoomLandingLayout({
  sectionId,
  withDialogue = true,
  className,
  children,
}: Props) {
  const ctx = useSectionContext();
  const id = sectionId ?? ctx.sectionId;
  const color = `var(${sectionTokenFor(id)})`;
  const style = {
    ["--section-color" as string]: color,
    backgroundColor: color,
    color: "var(--leonor-cream)",
  } as CSSProperties;

  return (
    <div
      className={`relative flex h-[calc(100dvh-112px)] flex-col overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {isPatternSection(id) && <RoomIllustrationBg sectionId={id} />}

      <div className="relative z-[2] flex flex-1 flex-col">{children}</div>

      {withDialogue && <RoomDialogueCard sectionId={id === "home" ? "lobby" : id} />}
    </div>
  );
}
