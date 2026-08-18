import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useLeonor } from "@/lib/leonor-context";
import { generateSectionGradient } from "@/lib/section-gradient";
import { sectionIdFromPath, sectionTokenFor } from "@/lib/use-section-context";

export function pathToSectionToken(pathname: string): string {
  return sectionTokenFor(sectionIdFromPath(pathname));
}

export function useSectionBackground() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme } = useLeonor();
  const sectionToken = pathToSectionToken(pathname);
  const [gradient, setGradient] = useState<string>(`linear-gradient(135deg, var(${sectionToken}), var(${sectionToken}))`);

  useEffect(() => {
    setGradient(generateSectionGradient(sectionToken, theme === "dark"));
  }, [sectionToken, theme, pathname]);

  return { gradient, sectionToken };
}
