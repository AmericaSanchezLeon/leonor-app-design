import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLeonor, t } from "@/lib/leonor-context";
import { sectionIcon, type SectionId } from "@/lib/leonor-icons";
import { useSectionBackground } from "@/lib/use-section-background";
import {
  sectionTokenFor,
  sectionIdFromPath,
  type SectionContextId,
} from "@/lib/use-section-context";
import { RoomIllustrationBg } from "@/components/RoomIllustrationBg";
import logoUrl from "@/assets/leonorapp-logo.svg";

const navItems: { path: string; id: SectionContextId; label_es: string; label_en: string }[] = [
  { path: "/cocina", id: "cocina", label_es: "Cocina", label_en: "Kitchen" },
  { path: "/comedor", id: "comedor", label_es: "Comedor", label_en: "Dining" },
  { path: "/", id: "home", label_es: "Home", label_en: "Home" },
  { path: "/biblioteca", id: "biblioteca", label_es: "Biblioteca", label_en: "Library" },
  { path: "/about", id: "about", label_es: "About", label_en: "About" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLeonor();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { gradient } = useSectionBackground();

  const isActive = (p: string) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");

  // CSS `dvh` doesn't always recompute reliably after a client-side route
  // change on mobile browsers (the toolbar-driven viewport resize event that
  // would normally trigger it doesn't fire on SPA navigation), which is what
  // caused room screens to render with a stale/mismatched height depending
  // on which page you came from. Recompute an explicit pixel value instead,
  // on resize and on every navigation.
  useEffect(() => {
    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };
    setVh();
    window.visualViewport?.addEventListener("resize", setVh);
    window.addEventListener("resize", setVh);
    return () => {
      window.visualViewport?.removeEventListener("resize", setVh);
      window.removeEventListener("resize", setVh);
    };
  }, [pathname]);

  const sectionId = sectionIdFromPath(pathname);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden transition-[background-image] duration-700"
      style={{ backgroundImage: gradient }}
    >
      {/* Landscape/wide-viewport letterboxes: duplicate the center column's
          own texture into the side margins (fixed to the same 500px scale
          it renders at in the center) instead of stretching one instance
          across the whole width. */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-[500px]">
          <RoomIllustrationBg sectionId={sectionId} />
        </div>
        <div className="absolute right-0 top-0 h-full w-[500px]">
          <RoomIllustrationBg sectionId={sectionId} />
        </div>
      </div>
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
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            aria-label={t("Cambiar idioma", "Switch language", language)}
            className="rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-opacity hover:opacity-70"
            style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
          >
            {language === "es" ? "EN" : "ES"}
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
      </div>
    </div>
  );
}
