import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useLeonor } from "@/lib/leonor-context";
import { generateSectionGradient } from "@/lib/section-gradient";

export function pathToSectionToken(pathname: string): string {
  const seg = pathname.split("/")[1] || "";
  switch (seg) {
    case "cocina": return "--cocina";
    case "comedor": return "--comedor";
    case "biblioteca": return "--biblioteca";
    case "about": return "--about";
    default: return "--leonor-amber";
  }
}

export function useSectionBackground() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme } = useLeonor();
  const sectionToken = pathToSectionToken(pathname);
  const [gradient, setGradient] = useState<string>(`linear-gradient(135deg, var(${sectionToken}), var(${sectionToken}))`);

  useEffect(() => {
    setGradient(generateSectionGradient(sectionToken));
  }, [sectionToken, theme, pathname]);

  return { gradient, sectionToken };
}
