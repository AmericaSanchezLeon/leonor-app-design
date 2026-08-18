# Importar la base de datos completa de Leonor App

Objetivo: reemplazar los datos parciales que hoy tiene la app (8 libros, 2 recetas, 3 rutas) por el contenido completo del Excel, en español e inglés, con sus imágenes.

## Qué falta hoy

Comparando el archivo con los JSON actuales:

| Contenido | En la app hoy | En la base de datos |
|---|---|---|
| Libros | 8 | ~44 |
| Recetas | 2 | varias (recetario completo) |
| Rutas / estados | 3 | varias, con pines |
| Pines de mapa | sin dirección ni coordenadas | estado, nombre ES/EN, dirección, coordenadas, link, imagen |
| Amigos | 22 | lista completa del archivo |
| Diálogos de mascotas | parciales | todos los diálogos por pantalla, ES + EN |

## Pendiente para arrancar

Necesito el `.xlsx` original (el PDF corta el texto de las celdas largas y perdería reseñas y diálogos). En cuanto lo subas, ejecuto el plan completo.

## Pasos

1. **Leer el Excel hoja por hoja** y mapear cada hoja a su JSON destino: interfaz/diálogos, libros, recetas, rutas, pines, amigos.
2. **Regenerar los JSON en `src/data/`** conservando los nombres de campo que ya usan los componentes, y agregando los campos nuevos (dirección, coordenadas, link de Maps, `nombre_pin_en`, `dato`, etc.). Donde el archivo trae ES y EN, se guardan ambos idiomas.
3. **Pines de mapa**: los pines pasan a formar parte de `rutasData.json` agrupados por estado, con coordenadas y link, para que el timeline de rutas y el mapa usen la misma fuente.
4. **Imágenes**: para cada nombre de imagen referenciado (`LibroTibetano_1.jpg`, `Polaroids_AlanGlass.svg`, etc.) busco el archivo en el repo original `leonorapp2.0`, lo convierto a WebP optimizado (miniatura + tamaño completo, igual que el pipeline actual) y lo subo al CDN, extendiendo `src/lib/leonor-image-urls.ts`. Los registros cuyo archivo no exista en el repo quedan con un placeholder ilustrado en lugar de imagen rota.
5. **Ajustes de vistas** solo donde el contenido nuevo lo requiera: mosaico de biblioteca con los ~44 libros, detalle de libro mostrando `tema` y `dato`, detalle de receta completo, timeline de rutas con los pines y su botón de Maps.
6. **Verificación**: recorro biblioteca, cocina, comedor (amigos, rutas, mapas) y about en el navegador para confirmar que todos los registros cargan, sin imágenes roras ni texto cortado, y reporto los conteos finales.

## Notas técnicas

- Los datos siguen siendo JSON estáticos en `src/data/` (sin base de datos), como hoy; carga instantánea y sin backend.
- Parseo del Excel con `openpyxl`/`duckdb` en el sandbox; los JSON se escriben con UTF-8 y saltos de línea reales en los textos largos.
- Se respeta el sistema visual por niveles ya existente (`RoomLandingLayout` / `SectionPageLayout`) y las reglas de accesibilidad (alt text, `aria-label` en los mosaicos, contraste AA).
