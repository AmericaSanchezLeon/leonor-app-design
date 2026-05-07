import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { X, Settings } from "lucide-react";
import { useLeonor, t } from "@/lib/leonor-context";

const navItems = [
  { path: "/cocina", label_es: "Cocina", label_en: "Kitchen", color: "var(--cocina)" },
  { path: "/comedor", label_es: "Comedor", label_en: "Dining", color: "var(--comedor)" },
  { path: "/", label_es: "Home", label_en: "Home", color: "var(--leonor-amber)" },
  { path: "/biblioteca", label_es: "Biblioteca", label_en: "Library", color: "var(--biblioteca)" },
  { path: "/about", label_es: "About", label_en: "About", color: "var(--about)" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const { language, setLanguage, theme, setTheme } = useLeonor();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (p: string) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "var(--leonor-amber)" }}>
      <div className="relative mx-auto min-h-screen w-full max-w-[500px] bg-background shadow-2xl">
        {/* Header */}
        <header className="fixed top-0 left-1/2 z-30 flex h-12 w-full max-w-[500px] -translate-x-1/2 items-center justify-between px-5 backdrop-blur-md" style={{ backgroundColor: "color-mix(in oklab, var(--leonor-amber) 92%, transparent)" }}>
          <Link to="/" className="font-serif text-xl tracking-wide" style={{ color: "var(--leonor-cream)" }}>
            Leonorapp
          </Link>
          <button
            onClick={() => setShowSettings(true)}
            aria-label={t("Configuración", "Settings", language)}
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--leonor-cream)" }}
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="min-h-screen pt-12 pb-14">{children}</main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-1/2 z-30 flex h-14 w-full max-w-[500px] -translate-x-1/2 items-stretch shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ backgroundColor: "var(--leonor-cream)" }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-1 items-center justify-center text-xs transition-all duration-200"
                style={{
                  backgroundColor: active ? item.color : "transparent",
                  color: active ? "var(--leonor-cream)" : "#2e2a2a",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t(item.label_es, item.label_en, language)}
              </Link>
            );
          })}
        </nav>

        {/* Settings sidebar */}
        {showSettings && (
          <>
            <button
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setShowSettings(false)}
              aria-label="Close"
            />
            <aside
              className="fixed top-0 right-0 z-50 h-full w-[315px] max-w-[80vw] overflow-y-auto p-7 shadow-2xl"
              style={{ backgroundColor: "color-mix(in oklab, var(--leonor-paper) 95%, transparent)" }}
            >
              <button onClick={() => setShowSettings(false)} className="mb-8 transition-opacity hover:opacity-70">
                <X className="h-6 w-6" />
              </button>
              <h2 className="mb-12 font-serif text-3xl leading-tight">
                {t("Configuración", "Settings", language)}
              </h2>

              <section className="mb-10 space-y-4">
                <h3 className="font-serif text-xl">{t("Idioma", "Language", language)}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span>EN</span>
                  <button
                    onClick={() => setLanguage(language === "es" ? "en" : "es")}
                    className="relative inline-flex h-9 w-14 items-center rounded-full transition-colors"
                    style={{ backgroundColor: "color-mix(in oklab, var(--leonor-amber) 50%, transparent)" }}
                  >
                    <span
                      className="inline-block h-5 w-5 transform rounded-full shadow transition-transform"
                      style={{
                        backgroundColor: "var(--leonor-amber)",
                        transform: language === "es" ? "translateX(28px)" : "translateX(8px)",
                      }}
                    />
                  </button>
                  <span>ES</span>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-serif text-xl">{t("Modo color", "Color mode", language)}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span>{t("Oscuro", "Dark", language)}</span>
                  <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="relative inline-flex h-9 w-14 items-center rounded-full transition-colors"
                    style={{ backgroundColor: "color-mix(in oklab, var(--leonor-amber) 50%, transparent)" }}
                  >
                    <span
                      className="inline-block h-5 w-5 transform rounded-full shadow transition-transform"
                      style={{
                        backgroundColor: "var(--leonor-amber)",
                        transform: theme === "light" ? "translateX(28px)" : "translateX(8px)",
                      }}
                    />
                  </button>
                  <span>{t("Claro", "Light", language)}</span>
                </div>
              </section>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
