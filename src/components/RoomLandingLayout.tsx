import type { CSSProperties, ReactNode } from "react";
import { RoomDialogueCard } from "@/components/RoomDialogueCard";
import { RoomSvgPattern } from "@/components/RoomSvgPattern";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { roomScatterAssets } from "@/lib/room-scatter";
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
      className={`relative min-h-[calc(100vh-104px)] overflow-hidden pb-48 ${className ?? ""}`}
      style={style}
    >
      {isPatternSection(id) && (
        <RoomSvgPattern sectionId={id} tileUrl={roomBg[id]} svgUrls={roomScatterAssets[id]} />
      )}

      <div className="relative z-[2]">{children}</div>

      {withDialogue && (
        <div className="absolute inset-x-0 bottom-0 z-[2] px-4 pb-4">
          <RoomDialogueCard sectionId={id} />
        </div>
      )}
    </div>
  );
}
