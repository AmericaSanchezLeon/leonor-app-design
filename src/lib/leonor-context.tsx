import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";
export type Theme = "light" | "dark";

interface LeonorCtx {
  language: Lang;
  setLanguage: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<LeonorCtx | null>(null);

export function LeonorProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("es");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Ctx.Provider value={{ language, setLanguage, theme, setTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLeonor() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLeonor must be used inside LeonorProvider");
  return c;
}

export const t = <T,>(es: T, en: T, lang: Lang): T => (lang === "es" ? es : en);
