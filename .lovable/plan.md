## Alcance

1. **Logo en header**: reemplazar el texto "Leonorapp" del `AppShell` por el SVG subido (`leonorapp-logo-horizontal.svg`).
2. **Bottom nav**: sin cambios (Lucide se queda — no hay icono per-sección y se acepta así).
3. **Activity tiles del `RoomLanding`**: cada tile muestra el ícono normal de `room-icons/`; cuando esa ruta está activa (o en hover) se intercambia por la variante `icono-hover-…` de `room-icons-svg/`.
4. **Esquema de color invertido**: el fondo sólido de sección queda solo en `RoomLanding`. Todas las sub-vistas hijas pasan a fondo blanco con textura `room-bg/bg_<seccion>.svg` al 40 % y headers/títulos en `var(--<seccion>)`.

## Assets

**Logo (uploaded):** copiar `user-uploads://leonorapp-logo-horizontal.svg` a `src/assets/leonorapp-logo.svg` (SVG pequeño, va al repo, import directo Vite).

**Desde el repo `leonorapp2.0` vía `raw.githubusercontent.com`:**

```
src/assets/img/room-icons/             (8 PNG, 300 KB–1.5 MB c/u)
src/assets/img/room-icons-svg/         (8 PNG con prefijo "icono-hover-")
src/assets/img/room-bg/                (5 SVG ≤45 KB)
```

Los 16 PNG de `room-icons*` pesan ~12 MB en total → se suben como **Lovable Assets** (`lovable-assets create` por archivo → `.asset.json` pointer). Los 5 SVG de `room-bg` van al repo directo.

## Mapeo ícono → activity tile

```
room      | tile           | icon key            | route
----------|----------------|---------------------|----------------------------
cocina    | Recetario      | cocina-libro        | /cocina/recetario
cocina    | Realidad Aum.  | cocina-tetera       | /cocina/ra-instrucciones
biblioteca| Estante        | biblioteca-libro    | /biblioteca/estante
biblioteca| Realidad Aum.  | biblioteca-mascara  | /biblioteca/ra-instrucciones
comedor   | Amigos         | comedor-amigos      | /comedor/amigos
comedor   | Rutas / Mapas  | comedor-rutas       | /comedor/mapas
about     | El proyecto    | proyecto-libro      | /about/proyecto
about     | Las autoras    | proyecto-autores    | /about/autoras
```

## Nuevos archivos

- `src/lib/room-icons.ts` — record `key → { normal, active }` con URLs de los `.asset.json` pointers, + helper `tileIcon(sectionId, tileKey)`.
- `src/lib/room-backgrounds.ts` — importa los 5 SVG de `room-bg/` y exporta `roomBg[sectionId]`.
- `src/lib/use-section-theme.ts` — hook: dado un `sectionId` devuelve `{ color: "var(--cocina)", bgUrl }`. Si no recibe prop, deriva de `useRouterState().location.pathname`.
- `src/components/SectionPageLayout.tsx` — wrapper para sub-vistas:
  - Root `relative bg-white min-h-[...]`, expone CSS var `--section-color: var(--<seccion>)` al subtree.
  - Capa textura: `absolute inset-0 z-0 pointer-events-none opacity-40` con `background-image: url(roomBg[section])`, `background-size: cover`, `background-position: center`.
  - Header opcional con `h1` en `var(--section-color)` + botón back (flecha) hacia `/<seccion>`.
  - `<div className="relative z-10">` envuelve children.
  - Props: `sectionId`, `title?`, `back?`, `bare?` (omite header/padding para vistas full-bleed como AR camera), `children`.

## Edits

### `src/components/AppShell.tsx`
- Header: reemplazar `<Link>Leonorapp</Link>` por `<Link to="/"><img src={logo} alt="Leonorapp" className="h-7 w-auto" /></Link>` (importando `@/assets/leonorapp-logo.svg`). Mantener el resto del header igual.
- Bottom nav: sin cambios.

### `src/components/RoomLanding.tsx`
- Extender `RoomLink` con `iconKey: string`. Cada tile renderiza:
  - `<img src={roomIcons[iconKey].normal}>` por defecto, swap a `.active` cuando `pathname.startsWith(link.to)` (visualmente solo se ve en hover; el route activo navega y desmonta el landing).
  - Tamaño ~56 px, a la izquierda del título; tile sigue siendo el card cream actual sobre fondo sólido de sección.
  - Hover swap con dos `<img>` superpuestos (`opacity-0 group-hover:opacity-100`) para feedback inmediato.

### Rutas que pasan `links` a `RoomLanding`
`src/routes/cocina/index.tsx`, `comedor/index.tsx`, `biblioteca/index.tsx`, `about/index.tsx` → agregar `iconKey` a cada link. Sin otros cambios (siguen con fondo sólido de sección).

### Sub-vistas hijas → envueltas en `SectionPageLayout`
Cada una pierde su `<div>` wrapper actual + el `style={{ color: "var(--<seccion>)" }}` hardcodeado en `h1`, y delega al layout:

- `src/routes/cocina/recetario.tsx`
- `src/routes/cocina/receta.$recetaId.tsx`
- `src/routes/cocina/ra-instrucciones.tsx` (`bare`)
- `src/routes/biblioteca/estante.tsx`
- `src/routes/biblioteca/libro.$libroId.tsx`
- `src/routes/biblioteca/ra-instrucciones.tsx` (`bare`)
- `src/routes/comedor/amigos.index.tsx`
- `src/routes/comedor/amigos.$amigoId.tsx`
- `src/routes/comedor/mapas.tsx`
- `src/routes/about/proyecto.tsx`
- `src/routes/about/autoras.tsx`

Listas internas (recetas, libros, amigos) NO reciben los room-icons — su markup interno queda como está; solo el wrapper y header cambian.

## Notas técnicas

- PNG de `room-icons*` se referencian vía `import iconJson from "@/assets/img/room-icons/icono-cocina-tetera.png.asset.json"` → `iconJson.url`. `room-icons.ts` centraliza imports y arma el record.
- Active state en tiles: comparar `pathname.startsWith(link.to)` dentro de `RoomLanding`; CSS `:hover` swap adicional via dos `<img>` apilados.
- Textura `room-bg`: `background-size: cover`, `background-position: center` por default. Si algún SVG es claramente tileable se ajusta a `repeat` (decisión al ver el archivo; default `cover`).
- Token `--section-color`: `style={{ ['--section-color' as string]: `var(--${sectionId})` }}` en el root de `SectionPageLayout`; descendientes usan `style={{ color: "var(--section-color)" }}`.
- z-index dentro de `SectionPageLayout`: textura `z-0`, contenido `relative z-10`.
- Sin cambios en `leonor-icons.ts`, `roomData.json`, tokens de `styles.css`, `RoomDialogueCard`, ni componentes UI compartidos.

## Out of scope

- Bottom nav (sigue con Lucide por decisión del usuario).
- Reemplazar `itemIcon.receta` / `itemIcon.libro` en listas internas.
- Cambios visuales en `RoomDialogueCard` y demás componentes UI compartidos.
