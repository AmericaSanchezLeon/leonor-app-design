# Fondo SVG por sección en RoomLanding

Añadir dos capas decorativas encima del color base de cada `RoomLanding`: un tile repetido y 8–14 instancias dispersas del mismo set de SVGs, con posición/rotación/escala/opacidad derivadas de un seed determinístico por `sectionId` (estables entre renders).

## Assets del zip

El zip `svg_fondos.zip` trae, por sección, un archivo base y 4–6 variantes "copia":

- **Lobby** (`home`): `bg_home.svg` + `bg_home copia.svg` + `copia-01..05` (6 variantes)
- **Cocina**: `bg_cocina.svg` + `copia-01..05` (5 variantes)
- **Comedor**: `bg_comedor.svg` + `copia-01..05` (5 variantes)
- **Biblioteca**: `bg_biblioteca.svg` + `copia-01..04` (4 variantes)
- **About**: `bg_about.svg` + `copia-01..05` (5 variantes)

Interpretación: **base = tile** (mismo archivo que ya vive en `src/assets/img/room-bg/` y se usa como textura en `SectionPageLayout`), **copias = elementos dispersos**. Reutilizo el `roomBg` existente para la capa tile y subo sólo las copias como assets nuevos.

Los nombres se renombrarán a slugs sin espacios al subir (p.ej. `bg_cocina-01.svg`).

## Cambios

### 1) Nuevos assets — copias como pointers CDN

Para cada sección, subir sus copias con `lovable-assets create` a `src/assets/img/room-bg-scatter/[sectionId]/bg_[section]-NN.svg.asset.json`. Un barrel `src/lib/room-scatter.ts` los agrupa:

```ts
export const roomScatterAssets: Record<SectionBgId, string[]> = {
  home:       [/* 6 urls */],
  cocina:     [/* 5 */],
  comedor:    [/* 5 */],
  biblioteca: [/* 4 */],
  about:      [/* 5 */],
};
```

### 2) Util seedeada — `src/lib/room-pattern.ts`

```ts
export interface ScatterItem {
  svg: string; x: number; y: number;   // % del contenedor
  size: number;                        // px, 24–80
  rotate: number;                      // 0–360
  opacity: number;                     // 0.15–0.5
}
export function generateRoomPattern(
  sectionId: string,
  svgUrls: string[],
  count = 12,                          // 8–14
): ScatterItem[]
```

- PRNG: `mulberry32` sembrado con hash FNV-1a del `sectionId` → misma salida entre renders sin `useMemo` externo, aunque el componente lo memoiza igual.
- Rangos como los pide el brief; `x`/`y` en 0–100 con margen 4% para evitar recorte.

### 3) Componente — `src/components/RoomSvgPattern.tsx`

```tsx
<div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
  {/* Capa 1: tile CSS */}
  <div className="absolute inset-0"
       style={{ backgroundImage: `url(${tileUrl})`,
                backgroundRepeat: "repeat",
                backgroundSize: "160px 160px",
                opacity: "var(--pattern-tile-opacity, 0.12)" }} />
  {/* Capa 2: dispersos */}
  {items.map((it, i) => (
    <img key={i} src={it.svg} alt=""
         className="absolute"
         style={{ left: `${it.x}%`, top: `${it.y}%`,
                  width: it.size, height: it.size,
                  transform: `translate(-50%,-50%) rotate(${it.rotate}deg)`,
                  opacity: it.opacity }} />
  ))}
</div>
```

Props: `sectionId: SectionBgId`, `tileUrl: string`, `svgUrls: string[]`, `count?: number`. `useMemo([sectionId, count])` para congelar la generación.

### 4) Integración en `RoomLanding.tsx`

El wrapper actual pasa a `relative overflow-hidden`. Se inserta `<RoomSvgPattern>` justo tras el `<div>` de color, con las capas de contenido subiendo a `z-[2]` (título/links/dialogue). Requiere que `RoomLanding` reciba/derive `sectionId` tipado — hoy ya llega como string opcional; se usa como `SectionBgId` si coincide, sino se omite el patrón (fallback: sólo color).

### 5) Sin cambios de lógica

- Rutas, gradientes globales de `AppShell` y `SectionPageLayout` intactos.
- Listas internas y bottom nav no se tocan.

## Fuera de alcance

- No animación de los dispersos.
- No aplicar el patrón en vistas hijas (ya tienen `SectionPageLayout` con textura al 40%).
- No cambiar los tokens de color existentes.
