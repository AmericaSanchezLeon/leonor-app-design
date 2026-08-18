# Amigos como mosaico grande + textos completos

## Lo que encontré

- Los datos están completos: 8 libros y 22 amigos, idénticos al repositorio original (`booksData.json`, `amigosData.json`). No falta ningún registro y todas las imágenes tienen su versión WebP en el CDN.
- Lo que se "corta" en amigos es la presentación: la lista actual usa tarjetas con foto circular de 64px y la biografía recortada a 2 líneas (`line-clamp-2`).
- En el detalle de libro, las reseñas terminan en "..." porque así vienen escritas en la base de datos original (el campo `reseña` está truncado en el origen). Eso no se puede recuperar desde el código; el texto de "¿Sabías que…?" sí está completo.

## Cambios

1. **/comedor/amigos — mosaico grande igual que la biblioteca**
   - Rejilla de 3 columnas sin espacios (`grid-cols-3 gap-0`), de borde a borde, cada retrato en `aspect-[2/3]` con `object-cover`.
   - Sin nombre ni biografía visibles en el mosaico (se leen al entrar al detalle); se conserva la accesibilidad con `aria-label` con el nombre del amigo en cada enlace, más foco visible.
   - Se eliminan el `line-clamp-2` y el ícono de lista; se mantiene el título de sección arriba.
   - Carga: `loading="eager"` + `fetchPriority="high"` en las primeras 6 imágenes, `lazy` para el resto, con `width`/`height` para evitar saltos de layout.
2. **Detalle de amigo** — se muestra la biografía completa (ya lo hace) y se agrega respiro inferior para que el último párrafo no quede debajo de la barra de navegación.
3. **Detalle de libro** — igual: se asegura que reseña y dato se vean completos, con espacio inferior suficiente sobre la barra inferior.

## Detalle técnico

- `src/routes/comedor/amigos.index.tsx`: reemplazar la `<ul className="space-y-3">` por la misma estructura de mosaico usada en `src/routes/biblioteca/estante.tsx`.
- Padding inferior: subir `pb-10` a `pb-24` en `amigos.$amigoId.tsx` y `libro.$libroId.tsx` para librar los 64px de la bottom nav.
- Sin cambios de datos ni de lógica; todo queda en presentación.
