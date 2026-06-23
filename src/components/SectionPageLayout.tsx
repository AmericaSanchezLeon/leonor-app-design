import type { CSSProperties, ReactNode } from "react";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";

type SectionId = Exclude<SectionBgId, "home">;

interface Props {
  sectionId: SectionId;
  bare?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps sub-views with a white background, the section texture overlay,
 * and exposes `--section-color` for descendants.
 */
export function SectionPageLayout({ sectionId, bare = false, className, children }: Props) {
  const bgUrl = roomBg[sectionId];
  const style = { ["--section-color" as string]: `var(--${sectionId})` } as CSSProperties;

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
