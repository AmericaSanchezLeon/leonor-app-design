# Quitar textura de fondo en sub-vistas + colores light/dark

## Qué cambia

- La textura `room-bg` al 40% desaparece de **todas** las sub-vistas (recetario, estante, libro, amigos, mapas, RA, etc.).
- La textura se mantiene únicamente en los **cuartos principales** (nivel 1: `/`, `/cocina`, `/comedor`, `/biblioteca`, `/about`), donde ya vive junto al gradiente y al patrón SVG.
- Las sub-vistas pasan a usar el color de fondo neutro del sistema, con soporte light y dark:
  - light: `#FAF9F7` (neutral-lighter)
  - dark: `#343131` (neutral-dark)
- Los acentos por sección (`--section-color`) no cambian.

## Detalle técnico

1. `src/styles.css`
   - Agregar tokens `--neutral-lighter: #faf9f7` y `--neutral-dark: #343131`, expuestos en `@theme inline` como `--color-neutral-lighter` / `--color-neutral-dark`.
   - Ajustar `--background` a `#faf9f7` en `:root` y a `#343131` en `.dark` para que todo el chrome siga el mismo par.
2. `src/components/SectionPageLayout.tsx`
   - Eliminar el `<div>` de textura (`opacity-40` + `roomBg`) y el import de `room-backgrounds`.
   - Cambiar `bg-white` por `bg-[var(--neutral-lighter)] dark:bg-[var(--neutral-dark)]` (vía clase de token), manteniendo `--section-color`.
   - Conservar el `z-10` del contenido para no alterar el layout.
3. Revisar que ningún otro componente de nivel 2 pinte la textura por su cuenta, y que `RoomLandingLayout` / `RoomSvgPattern` queden intactos.
4. Verificar contraste del texto en dark (`#FAF9F7` sobre `#343131` cumple AA) y que los títulos de sección sigan legibles en ambos modos.
