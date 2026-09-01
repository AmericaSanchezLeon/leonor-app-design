import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

interface LeonorCtx {
  language: Lang;
  setLanguage: (l: Lang) => void;
}

const Ctx = createContext<LeonorCtx | null>(null);

export function LeonorProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("es");

  return <Ctx.Provider value={{ language, setLanguage }}>{children}</Ctx.Provider>;
}

export function useLeonor() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLeonor must be used inside LeonorProvider");
  return c;
}

export const t = <T,>(es: T, en: T, lang: Lang): T => (lang === "es" ? es : en);
