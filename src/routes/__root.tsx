import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LeonorProvider } from "@/lib/leonor-context";
import { AppShell } from "@/components/AppShell";
import { RoomLandingLayout } from "@/components/RoomLandingLayout";
import { SleepingCat } from "@/components/SleepingCat";

function NotFoundComponent() {
  return (
    <RoomLandingLayout sectionId="home">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <h1 className="text-6xl leading-tight">¡Shh!</h1>
        <p className="max-w-xs text-base leading-relaxed opacity-90">
          Monsieur está dormido, por favor sal de esta habitación para no despertarlo
        </p>
        <SleepingCat className="h-40 w-auto" />
        <Link
          to="/"
          className="mt-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "var(--leonor-cream)", color: "var(--section-color)" }}
        >
          Volver al inicio
        </Link>
      </div>
    </RoomLandingLayout>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Leonorapp — Casa Estudio Leonora Carrington" },
      { name: "description", content: "Aplicación interactiva de la Casa Estudio Leonora Carrington: cocina, comedor, biblioteca y más." },
      { name: "theme-color", content: "#b56503" },
      { property: "og:title", content: "Leonorapp" },
      { property: "og:description", content: "Casa Estudio Leonora Carrington — museografía interactiva." },
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
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Serif+Text&display=swap" },
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

  return (
    <QueryClientProvider client={queryClient}>
      <LeonorProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </LeonorProvider>
    </QueryClientProvider>
  );
}
