import type { CSSProperties, ReactNode } from "react";
import type { SectionBgId } from "@/lib/room-backgrounds";
import {
  useSectionContext,
  sectionTokenFor,
  type SectionContextId,
} from "@/lib/use-section-context";
import { RoomDialogueCard } from "@/components/RoomDialogueCard";

interface Props {
  /** Defaults to the active route's section. */
  sectionId?: SectionContextId | Exclude<SectionBgId, "home">;
  bare?: boolean;
  className?: string;
  /** Renders the mascot dialogue card, colored with the room's section color, anchored to the bottom. */
  dialogueSectionId?: string;
  children: ReactNode;
}

/**
 * Level 2 wrapper: flat neutral background (light/dark),
 * and `--section-color` exposed to all descendants for accents.
 */
export function SectionPageLayout({
  sectionId,
  bare = false,
  className,
  dialogueSectionId,
  children,
}: Props) {
  const ctx = useSectionContext();
  const id = (sectionId ?? ctx.sectionId) as SectionBgId;
  const style = {
    ["--section-color" as string]: `var(${sectionTokenFor(id as SectionContextId)})`,
  } as CSSProperties;

  return (
    <div
      className={`relative min-h-[calc(var(--app-vh,100dvh)-112px)] bg-neutral-lighter text-foreground ${dialogueSectionId ? "pb-52" : ""} ${className ?? ""}`}
      style={style}
    >
      <div className={`relative z-10 ${bare ? "" : ""}`}>{children}</div>

      {dialogueSectionId && <RoomDialogueCard sectionId={dialogueSectionId} variant="internal" />}
    </div>
  );
}
