# Plan: íconos Lucide + fondo gradiente dinámico por sección

## 1. Util de gradiente — `src/lib/section-gradient.ts`

```ts
export function generateSectionGradient(baseHex: string): string
```

- Convierte el hex base a HSL.
- Genera 2-3 stops aleatorios en cada llamada:
  - Hue: ±15° desde base
  - Luminosidad: ±15% sobre base (clamp 15-75%)
  - Saturación: pequeña variación ±10%
- Ángulo aleatorio (0-360°).
- Devuelve un string `linear-gradient(<deg>, hsl(...) 0%, hsl(...) 50%, hsl(...) 100%)`.
- Resuelve el color base leyendo la CSS custom property si recibe un nombre tipo `--cocina` (vía `getComputedStyle(document.documentElement)`), con fallback al hex.
- Se ejecuta en el cliente (en `useEffect`) para que respete el tema claro/oscuro vigente.

## 2. Hook `useSectionBackground` — `src/lib/use-section-background.ts`

- Lee `useRouterState({ select: s => s.location.pathname })`.
- Tabla `pathname[0]` → token de sección:
  - `/` → `--leonor-amber`
  - `/cocina/*` → `--cocina`
  - `/comedor/*` → `--comedor`
  - `/biblioteca/*` → `--biblioteca`
  - `/about/*` → `--about`
- Recalcula gradiente con `useMemo` dependiendo de `pathname` + `theme` (del contexto Leonor) → al navegar o cambiar tema, regenera.
- Devuelve `{ gradient: string, sectionToken: string }`.

## 3. AppShell — fondo dinámico

En `src/components/AppShell.tsx`:
- Llamar `useSectionBackground()`.
- Cambiar el wrapper exterior actual (`backgroundColor: var(--leonor-amber)`) por `backgroundImage: gradient` aplicado al contenedor raíz que cubre toda la vista (mantener el `max-w-[500px]` interno con `bg-background` o transparente para que el gradiente se vea por detrás del card central — y además pintar el `<main>` interno con el mismo gradiente para que las subrutas lo hereden).
- El header conserva su tinte ámbar; bottom nav sin cambios.

## 4. Mapas de íconos Lucide

`src/lib/leonor-icons.ts`:

```ts
import { ChefHat, UtensilsCrossed, Home, BookOpen, Info,
         Soup, Users, BookMarked } from "lucide-react";

export const sectionIcon = {
  cocina: ChefHat,
  comedor: UtensilsCrossed,
  home: Home,
  biblioteca: BookOpen,
  about: Info,
} as const;

export const itemIcon = {
  receta: Soup,
  libro: BookMarked,
  amigo: Users,
} as const;
```

## 5. Bottom nav con íconos

En `AppShell.tsx`, render de cada nav item:
- Icono arriba (`sectionIcon[id]`, `size={18}`, `currentColor`)
- Label debajo (`text-[10px]`)
- Layout `flex-col items-center justify-center gap-0.5`

## 6. Listas con íconos por tipo

- `src/routes/cocina/recetario.tsx`: añadir `<Soup>` pequeño en la esquina del card o junto al nombre.
- `src/routes/biblioteca/estante.tsx`: `<BookMarked>` junto al título del libro.
- `src/routes/comedor/amigos.index.tsx`: `<Users>` (o ícono de persona) en el contenedor izquierdo además del avatar, o como fallback. Aplicaremos como decoración junto al nombre, heredando `currentColor` del color de sección.

## 7. RoomLanding (opcional, coherencia)

Aceptar `icon` ya existe; los `index.tsx` de cada sección ya pueden pasar `sectionIcon[id]` renderizado. No cambia el contrato — sólo asegurar que los landings pasan el ícono Lucide correcto.

## Detalles técnicos

- Sin clases Tailwind para colores dinámicos: todo vía `style={{ backgroundImage }}`.
- Gradiente recalculado con `Math.random()` en cada montaje del hook → cumple "cada carga/navegación".
- Compatibilidad dark: `getComputedStyle` lee la variable después de aplicada la clase `.dark`, así que el gradiente respeta el tema vigente.
- Sin nuevas dependencias (lucide-react ya está instalado).

## Archivos tocados

- nuevo: `src/lib/section-gradient.ts`
- nuevo: `src/lib/use-section-background.ts`
- nuevo: `src/lib/leonor-icons.ts`
- editar: `src/components/AppShell.tsx`
- editar: `src/routes/cocina/recetario.tsx`
- editar: `src/routes/biblioteca/estante.tsx`
- editar: `src/routes/comedor/amigos.index.tsx`
- editar (opcional): `src/routes/{cocina,comedor,biblioteca,about}/index.tsx` para pasar `sectionIcon` a `RoomLanding`.
