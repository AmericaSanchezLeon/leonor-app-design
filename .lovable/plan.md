# Acelerar la carga de imágenes

## Qué pasa hoy

Todas las fotos (portadas de libros, retratos de amigos, recetas, mascotas) se descargan una por una desde GitHub, en tamaño original y sin comprimir. Medición real:

- Portada de libro: **1.5 MB** cada una → el mosaico del estante descarga ~**12 MB**
- Foto de receta: **1.6 MB**
- Retrato de amigo: **312 KB**
- Ilustración de mascota (SVG): **227 KB**, y aparece en todas las pantallas principales

Además GitHub no es un CDN de imágenes: no optimiza, no entrega formatos modernos y responde lento desde México.

## Qué haré

1. **Mover todas las imágenes al CDN de Lovable**, ya optimizadas: reduzco cada imagen al tamaño real en que se muestra en pantalla (móvil) y la convierto a WebP. Esperado: portadas de ~1.5 MB a ~40-70 KB, recetas a ~80 KB, retratos a ~50 KB. Reducción total estimada: **más del 90%**.
2. **Versión pequeña para listas y grande para detalle**: el mosaico del estante y las listas cargan miniaturas; la pantalla de detalle carga una versión mayor (pero igualmente optimizada).
3. **Optimizar los SVG de mascotas** (limpieza de metadatos), que hoy pesan más que una foto.
4. **Mejorar la percepción de carga**: reservar el espacio de cada imagen (sin saltos de layout), `loading="lazy"` + `decoding="async"` fuera de pantalla, carga prioritaria de lo visible al entrar, y un fondo de color de sección como placeholder mientras llega la imagen.

Sin cambios de diseño: mismas imágenes, mismos encuadres, mismo layout.

## Detalles técnicos

- Descarga de los originales del repo `leonorapp2.0`, procesamiento con ImageMagick (resize + `-quality 78` WebP, dos variantes: `thumb` ~400px de ancho, `full` ~1000px), subida con `lovable-assets create` y punteros `.asset.json` en `src/assets/img/...`.
- Reescritura de `src/lib/leonor-images.ts`: `bookImg(i, variant)`, `recetaImg(name, variant)`, `amigoImg(path, variant)` y `mascotImg` dejan de construir URLs de `raw.githubusercontent.com` y devuelven las URLs del CDN desde mapas de punteros importados. Se elimina `RAW_BASE`.
- Ajuste de los consumidores para pedir la variante correcta: `biblioteca/estante.tsx` y las listas usan `thumb`; `libro.$libroId`, `receta.$recetaId`, `comedor/amigos.$amigoId` usan `full`.
- En los detalles, cambiar los `div` con `background-image` por `<img>` con `width`/`height` y `fetchPriority="high"`, para que el navegador empiece la descarga antes (hoy espera al CSS) y no haya reflow.
- `aspect-ratio` explícito en el mosaico y skeleton con `var(--section-color)` a baja opacidad; `alt` descriptivo conservado donde ya existe.
