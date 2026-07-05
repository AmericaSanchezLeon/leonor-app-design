# Nuevo logo

Reemplazar el logo actual con el SVG que subiste (`logo.svg` — trazo naranja `#b56503` sobre transparente).

## Cambios

1. **`src/assets/leonorapp-logo.svg`** — sobrescribir con el contenido del SVG subido. Este archivo ya lo consume `AppShell.tsx` en el header, así que la sustitución se propaga sin tocar componentes.
2. **`public/favicon.svg`** — sobrescribir con el mismo SVG para que el favicon también use la nueva marca. Sin cambios en `__root.tsx` (ya apunta a `/favicon.svg`).

## Fuera de alcance

- No cambio el color ámbar del header ni el tamaño de render (h-7).
- No genero variantes PNG/ICO; el SVG cubre navegadores modernos.
- No toco tokens de color ni layout.
