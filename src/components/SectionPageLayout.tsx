import type { CSSProperties, ReactNode } from "react";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";
import { useSectionContext, sectionTokenFor, type SectionContextId } from "@/lib/use-section-context";

interface Props {
  /** Defaults to the active route's section. */
  sectionId?: SectionContextId | Exclude<SectionBgId, "home">;
  bare?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Level 2 wrapper: white background, section texture overlay,
 * and `--section-color` exposed to all descendants for accents.
 */
export function SectionPageLayout({ sectionId, bare = false, className, children }: Props) {
  const ctx = useSectionContext();
  const id = (sectionId ?? ctx.sectionId) as SectionBgId;
  const bgUrl = roomBg[id];
  const style = {
    ["--section-color" as string]: `var(${sectionTokenFor(id as SectionContextId)})`,
  } as CSSProperties;

  return (
    <div
      className={`relative min-h-[calc(100vh-112px)] bg-white ${className ?? ""}`}
      style={style}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className={`relative z-10 ${bare ? "" : ""}`}>{children}</div>
    </div>
  );
}
