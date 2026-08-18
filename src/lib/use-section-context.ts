import { useRouterState } from "@tanstack/react-router";

export type SectionContextId = "home" | "cocina" | "comedor" | "biblioteca" | "about";

const SECTIONS: SectionContextId[] = ["cocina", "comedor", "biblioteca", "about"];

export function sectionIdFromPath(pathname: string): SectionContextId {
  const seg = pathname.split("/")[1] ?? "";
  return (SECTIONS as string[]).includes(seg) ? (seg as SectionContextId) : "home";
}

export function sectionTokenFor(sectionId: SectionContextId): string {
  return sectionId === "home" ? "--leonor-amber" : `--${sectionId}`;
}

export function isRoomLandingPath(pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "") return true;
  return SECTIONS.some((s) => clean === `/${s}`);
}

export interface SectionContext {
  sectionId: SectionContextId;
  token: string;
  color: string;
  isRoomLanding: boolean;
}

/**
 * Single source of truth for "which section am I in, and at what depth".
 * Level 1 (room landing) = solid section color; level 2 = white + accents.
 */
export function useSectionContext(): SectionContext {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sectionId = sectionIdFromPath(pathname);
  const token = sectionTokenFor(sectionId);
  return {
    sectionId,
    token,
    color: `var(${token})`,
    isRoomLanding: isRoomLandingPath(pathname),
  };
}
