import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { generateSectionGradient } from "@/lib/section-gradient";
import { sectionIdFromPath, sectionTokenFor } from "@/lib/use-section-context";

export function pathToSectionToken(pathname: string): string {
  return sectionTokenFor(sectionIdFromPath(pathname));
}

export function useSectionBackground() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sectionToken = pathToSectionToken(pathname);
  const [gradient, setGradient] = useState<string>(
    `linear-gradient(135deg, var(${sectionToken}), var(${sectionToken}))`,
  );

  useEffect(() => {
    setGradient(generateSectionGradient(sectionToken));
  }, [sectionToken, pathname]);

  return { gradient, sectionToken };
}
