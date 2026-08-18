# Estante de biblioteca como mosaico

Rediseñar `/biblioteca/estante` para que las portadas se vean como un mosaico continuo, sin separaciones ni texto, tal como en la referencia de Figma.

## Cambios

- Cuadrícula de **3 columnas sin espacio** (`grid-cols-3 gap-0`), de borde a borde de la pantalla (sin padding horizontal en la zona del mosaico).
- Cada celda es solo la portada (`aspect-[2/3]`, imagen recortada a cubrir). Se eliminan el título, el autor y el ícono de libro de las tarjetas.
- Cada portada sigue siendo un enlace al detalle del libro, con `aria-label` (título + autor) para lectores de pantalla y anillo de foco visible, ya que no hay texto visible.
- Se mantiene el encabezado "Estante de libros" arriba del mosaico (con el color de la sección) y se quita el párrafo descriptivo para dar protagonismo al mosaico.
- Se mantiene el layout de nivel 2 (`SectionPageLayout`) y su textura de fondo.

## Nota sobre los datos

La app ya carga **todos** los libros de `src/data/booksData.json`, que contiene **8** libros (mismo número que el repositorio original). El mosaico mostrará los 8. Si esperas más títulos, hay que agregarlos al archivo de datos con su imagen de portada — dime y los añadimos.

## Detalle técnico

Archivo tocado: `src/routes/biblioteca/estante.tsx` (solo presentación). Import de `itemIcon` se elimina si queda sin uso.
