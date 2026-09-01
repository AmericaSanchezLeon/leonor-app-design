import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { LeonorProvider } from "@/lib/leonor-context";
import { AppShell } from "@/components/AppShell";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { DoorIntro } from "@/components/DoorIntro";
import sleepingCatImg from "@/assets/gato-dormido.png";

const DOOR_INTRO_KEY = "leonor-door-intro-shown";

function SleepingMonsieurScreen({
  onRetry,
}: {
  /** When set, shows a "Try again" button before "Back home" (used for real errors). */
  onRetry?: () => void;
}) {
  return (
    <RoomLandingLayout sectionId="home">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <h1 className="text-6xl leading-tight">¡Shh!</h1>
        <p className="max-w-xs text-base leading-relaxed opacity-90">
          Monsieur está dormido, por favor sal de esta habitación para no despertarlo
        </p>
        <img src={sleepingCatImg} alt="" className="h-40 w-auto" />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--leonor-cream)", color: "var(--section-color)" }}
            >
              Reintentar
            </button>
          )}
          <Link
            to="/"
            className="rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
            style={
              onRetry
                ? {
                    backgroundColor: "transparent",
                    color: "var(--leonor-cream)",
                    border: "1px solid var(--leonor-cream)",
                  }
                : { backgroundColor: "var(--leonor-cream)", color: "var(--section-color)" }
            }
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </RoomLandingLayout>
  );
}

function NotFoundComponent() {
  return <SleepingMonsieurScreen />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <SleepingMonsieurScreen
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Leonorapp — Casa Estudio Leonora Carrington" },
      {
        name: "description",
        content:
          "Aplicación interactiva de la Casa Estudio Leonora Carrington: cocina, comedor, biblioteca y más.",
      },
      { name: "theme-color", content: "#faf9f7" },
      { property: "og:title", content: "Leonorapp" },
      {
        property: "og:description",
        content: "Casa Estudio Leonora Carrington — museografía interactiva.",
      },
      { property: "og:type", content: "website" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Leonorapp" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Serif+Text&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      // sessionStorage persists across in-app navigation but clears when the
      // tab/app is actually closed and reopened — that's our "restart" signal.
      if (sessionStorage.getItem(DOOR_INTRO_KEY) !== "1") {
        setShowIntro(true);
        sessionStorage.setItem(DOOR_INTRO_KEY, "1");
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode) — skip the intro.
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LeonorProvider>
        <AppShell>
          <Outlet />
        </AppShell>
        {showIntro && <DoorIntro onDone={() => setShowIntro(false)} />}
      </LeonorProvider>
    </QueryClientProvider>
  );
}
