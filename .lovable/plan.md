
## Resumen

Voy a reconstruir **Leonor App** como una aplicación web móvil (estilo PWA) sobre el stack actual del proyecto (TanStack Start + React + Tailwind v4), portando:

- **UI / diseño** desde el repo `Leonorappfigma` (basado en Vite + react-router + componentes shadcn).
- **Datos de contenido** (JSON: libros, recetas, amigos, mascotas, rutas, about, rooms) desde `leonorapp2.0`.

El repo de Figma ya tiene React + Tailwind, así que principalmente es **adaptar su routing y componentes a TanStack Router** y conectar las páginas a los datos JSON del segundo repo.

## Estructura de la app (5 secciones principales)

Header con título "Leonorapp" + botón de configuración (idioma ES/EN, tema claro/oscuro). Bottom nav con 5 secciones:

```text
Cocina   Comedor   Home   Biblioteca   About
(verde)  (rojo)    (ámbar) (azul)      (vino)
```

## Rutas a crear (TanStack file-based)

```text
src/routes/
  __root.tsx                              -> shell (header + bottom nav + settings)
  index.tsx                               -> Home
  cocina/index.tsx                        -> Cocina
  cocina/ra-instrucciones.tsx
  cocina/recetario.tsx                    -> grid recetas (recetas.json)
  cocina/recetario-libro.tsx
  cocina/receta.$recetaId.tsx
  comedor/index.tsx
  comedor/mapas.tsx                       -> rutasData.json
  comedor/amigos.tsx                      -> amigosData.json
  comedor/amigos.$amigoId.tsx
  biblioteca/index.tsx
  biblioteca/estante.tsx                  -> booksData.json
  biblioteca/libro.$libroId.tsx
  biblioteca/ra-instrucciones.tsx
  about/index.tsx
  about/autoras.tsx
  about/proyecto.tsx                      -> aboutData.json
```

## Pasos

1. **Dependencias** — añadir `lucide-react` (íconos) si no está. No se añade `vite-plugin-pwa` (ver notas técnicas abajo).
2. **Datos** — copiar los 7 JSON del repo `leonorapp2.0` a `src/data/`:
   - `aboutData.json`, `amigosData.json`, `booksData.json`, `mascotData.json`, `recetas.json`, `roomData.json`, `rutasData.json`.
3. **Imágenes** — descargar y copiar a `src/assets/`:
   - Imágenes de `Leonorappfigma/src/assets/` (fondos de habitaciones, ilustraciones).
   - Imágenes de libros desde `leonorapp2.0/src/assets/img/biblioteca-libros/` para conectarlas con `booksData.json`.
   - (Las imágenes muy grandes >2MB se omiten o sustituyen para no inflar el bundle).
4. **Estilos / tema** — actualizar `src/styles.css` con:
   - Paleta de colores Leonor: `#b56503` (ámbar), `#035f4f` (verde cocina), `#c42718` (rojo comedor), `#03667c` (azul biblioteca), `#a61b37` (vino about), fondo `#faf9f7`.
   - Fuentes Google: `DM Serif Text`, `DM Serif Display`, `DM Sans` vía `<link>` en `__root.tsx`.
5. **Layout raíz** (`__root.tsx`) — portar `Root.tsx` del repo Figma:
   - Header fijo con título y botón Settings.
   - Sidebar de Settings con toggles de idioma (ES/EN) y tema (light/dark) — estado global vía context.
   - Bottom nav con las 5 secciones, color activo dinámico.
   - Contenedor centrado (max-width ~500px) estilo móvil.
6. **Páginas** — portar cada página del repo Figma reemplazando `react-router` por `@tanstack/react-router` y conectando a los JSON correspondientes:
   - Biblioteca/estante → mapea `booksData.json` a una vista de estantería.
   - Biblioteca/libro/:id → detalle de libro.
   - Cocina/recetario → grid desde `recetas.json`.
   - Comedor/amigos → tarjetas desde `amigosData.json`.
   - Comedor/mapas → desde `rutasData.json`.
   - About/proyecto → contenido desde `aboutData.json`.
   - Páginas con instrucciones de Realidad Aumentada (RA) se portan como pantallas estáticas explicativas (sin RA real).
7. **i18n básico** — context `language` ya manejado en el shell; los textos de las páginas se mantienen en español (que es lo que viene en los JSON). Toggle a inglés queda preparado pero solo afecta etiquetas del shell por ahora.
8. **Metadata** — cada ruta con su `head()` (title + description) específico.
9. **Limpiar** placeholder en `src/routes/index.tsx`.

## Notas técnicas

- **Stack actual**: TanStack Start v1 + React 19 + Tailwind v4 + Vite 7. El repo Figma usa react-router DOM, así que se adapta el routing (no se instala react-router).
- **PWA**: el repo original incluye `vite-plugin-pwa` y `manifest.json`. Por las restricciones de Lovable (service workers rompen el preview en iframe), **no** voy a registrar service worker. Si quieres instalabilidad real (Add to Home Screen) puedo añadir solo el `manifest.json` + íconos sin SW. Lo dejo fuera por defecto y lo añadimos al final si publicas.
- **Imágenes pesadas**: el repo de libros tiene fotos de 1–2 MB cada una. Las copio tal cual pero conviene optimizarlas más adelante.
- **Sin backend**: todos los datos son JSON estáticos importados, sin Lovable Cloud por ahora. Si después quieres editar contenido desde un panel admin, podemos migrar a Cloud.
- **Sin Realidad Aumentada**: las pantallas "RA" se portan como mockups; implementar AR real (WebXR / 8thWall) es un proyecto aparte.

## Lo que NO incluye este plan

- Service worker / offline real (ver nota PWA).
- Funcionalidad de Realidad Aumentada activa.
- Traducción completa al inglés del contenido.
- Optimización agresiva de imágenes.
- Panel de administración para editar contenido.

¿Confirmas que avance con esto, o quieres ajustar algo antes (por ejemplo: omitir alguna sección, incluir el manifest PWA desde el inicio, o priorizar solo Biblioteca y Cocina primero)?
