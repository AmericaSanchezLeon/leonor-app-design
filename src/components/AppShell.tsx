import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { X, Settings } from "lucide-react";
import { useLeonor, t } from "@/lib/leonor-context";
import { sectionIcon, type SectionId } from "@/lib/leonor-icons";
import { useSectionBackground } from "@/lib/use-section-background";
import { sectionTokenFor, type SectionContextId } from "@/lib/use-section-context";
import logoUrl from "@/assets/leonorapp-logo.svg";

const navItems: { path: string; id: SectionContextId; label_es: string; label_en: string }[] = [
  { path: "/cocina", id: "cocina", label_es: "Cocina", label_en: "Kitchen" },
  { path: "/comedor", id: "comedor", label_es: "Comedor", label_en: "Dining" },
  { path: "/", id: "home", label_es: "Home", label_en: "Home" },
  { path: "/biblioteca", id: "biblioteca", label_es: "Biblioteca", label_en: "Library" },
  { path: "/about", id: "about", label_es: "About", label_en: "About" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const { language, setLanguage, theme, setTheme } = useLeonor();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { gradient } = useSectionBackground();

  const isActive = (p: string) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden transition-[background-image] duration-700"
      style={{ backgroundImage: gradient }}
    >
      <div
        className="relative mx-auto min-h-screen w-full max-w-[500px] shadow-2xl"
        style={{ backgroundImage: gradient }}
      >
        {/* Header */}
        <header
          className="fixed top-0 left-1/2 z-30 flex h-12 w-full max-w-[500px] -translate-x-1/2 items-center justify-between border-b border-[var(--border)] px-5 backdrop-blur-md"
          style={{ backgroundColor: "var(--header-bg)" }}
        >
          <Link to="/" aria-label="Leonorapp" className="flex items-center gap-2">
            <img src={logoUrl} alt="" className="h-7 w-auto" />
            <span
              className="text-xl leading-none"
              style={{ fontFamily: "var(--font-h1)", color: "var(--foreground)" }}
            >
              Leonorapp
            </span>
          </Link>
          <button
            onClick={() => setShowSettings(true)}
            aria-label={t("Configuración", "Settings", language)}
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--foreground)" }}
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="min-h-screen pt-12 pb-16">{children}</main>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-1/2 z-30 flex h-16 w-full max-w-[500px] -translate-x-1/2 items-stretch shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ backgroundColor: "var(--leonor-cream)" }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = sectionIcon[item.id as SectionId];
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors duration-200"
                style={{
                  backgroundColor: active ? `var(${sectionTokenFor(item.id)})` : "transparent",
                  color: active ? "var(--leonor-cream)" : "#2e2a2a",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon size={18} strokeWidth={1.75} />
                <span>{t(item.label_es, item.label_en, language)}</span>
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
