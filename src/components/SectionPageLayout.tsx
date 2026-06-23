import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { roomBg, type SectionBgId } from "@/lib/room-backgrounds";

type SectionId = Exclude<SectionBgId, "home">;

interface Props {
  sectionId: SectionId;
  title?: string;
  back?: { to: string; label: string };
  bare?: boolean;
  children: ReactNode;
}

export function SectionPageLayout({ sectionId, title, back, bare = false, children }: Props) {
  const bgUrl = roomBg[sectionId];
  const style = { ["--section-color" as string]: `var(--${sectionId})` } as CSSProperties;

  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-white" style={style}>
      {/* texture layer */}
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
      <div className="relative z-10">
        {bare ? (
          children
        ) : (
          <div className="px-5 py-8">
            {back && (
              <Link
                to={back.to as "/cocina"}
                className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> {back.label}
              </Link>
            )}
            {title && (
              <h1
                className="mb-6 font-serif text-3xl"
                style={{ color: "var(--section-color)" }}
              >
                {title}
              </h1>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
