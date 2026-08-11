# Convertir Leonorapp en PWA instalable

Objetivo: que la app se pueda instalar en el teléfono (agregar a pantalla de inicio), con ícono propio, nombre y apertura en pantalla completa sin barra del navegador.

No incluye modo offline: eso requiere caché de la app y es un trabajo aparte. Si lo quieres, lo agregamos después.

## Qué se hará

1. Ícono de la app
   - Generar los íconos PNG a partir del logo actual (espiral ámbar sobre fondo claro de la marca): 192x192, 512x512, 512x512 maskable y apple-touch-icon 180x180.
   - Guardarlos en `public/`.

2. Manifest
   - Crear `public/manifest.webmanifest` con:
     - `name`: "Leonorapp — Casa Estudio Leonora Carrington"
     - `short_name`: "Leonorapp"
     - `display`: "standalone", `orientation`: "portrait"
     - `start_url`: "/", `scope`: "/"
     - `theme_color`: #b56503 (ámbar de la marca), `background_color`: fondo claro de la app
     - `lang`: "es", `description` breve
     - entradas de íconos (incluida la maskable para Android)

3. Etiquetas en el head
   - En `src/routes/__root.tsx`: agregar `link` a `manifest.webmanifest`, `apple-touch-icon`, y meta `apple-mobile-web-app-capable` / `apple-mobile-web-app-status-bar-style` / `apple-mobile-web-app-title`.
   - `theme-color` ya existe; se mantiene.
   - Cambiar `lang="en"` a `lang="es"` en el shell raíz (la app está en español; también mejora accesibilidad).

## Notas técnicas

- Sin service worker, sin `vite-plugin-pwa`: no se necesita para instalabilidad y evita cachés obsoletas en la vista previa de Lovable.
- La instalación real solo funciona en la URL publicada (no dentro del iframe de la vista previa).
- iOS y Android congelan campos del manifest al instalar; cambios posteriores de `start_url`/`display` pueden requerir reinstalar.
