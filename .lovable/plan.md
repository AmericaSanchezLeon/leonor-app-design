# Sistema visual universal por nivel de navegación

Unificar el color de toda la app según profundidad: las habitaciones (nivel 1) en color sólido con texto claro, y todas sus sub-vistas (nivel 2) en blanco con acentos en el color de la sección.

## Qué se construye

### 1. Hook `useSectionContext()`
Lee la ruta activa y devuelve `{ sectionId, color, isRoomLanding }`.
- `sectionId`: `home | cocina | comedor | biblioteca | about` según el primer segmento de la URL.
- `color`: `var(--leonor-amber)` para home, `var(--<sectionId>)` para el resto.
- `isRoomLanding`: `true` solo en `/`, `/cocina`, `/comedor`, `/biblioteca`, `/about` (sin segmentos extra).
Reemplaza la lógica duplicada de detección de sección que hoy vive en el hook de fondo y en `AppShell`.

### 2. `RoomLandingLayout.tsx` (nivel 1)
Extrae del actual `RoomLanding` la capa de presentación: fondo de color sólido de la sección, patrón SVG, texto en crema/blanco y `--section-color` inyectado como estilo inline. `RoomLanding` pasa a usarlo y deja de recibir/propagar `color` a mano.

### 3. `SectionPageLayout.tsx` (nivel 2, ya existe — se refuerza)
- Sigue aplicando fondo blanco + textura de la sección al 40%.
- El `sectionId` deja de ser obligatorio: si no se pasa, lo toma de `useSectionContext()`.
- Garantiza `--section-color` en el nodo raíz para que todo descendiente lo herede.

### 4. Rutas: asignar el layout correcto
- Nivel 1 (`/`, `/cocina/`, `/comedor/`, `/biblioteca/`, `/about/`): vía `RoomLanding` → `RoomLandingLayout`.
- Nivel 2 (recetario, receta/$id, amigos, amigos/$id, mapas, estante, libro/$id, proyecto, autoras): ya envueltas en `SectionPageLayout`; se verifica una por una.
- Las dos vistas de RA (`/cocina/ra-instrucciones`, `/biblioteca/ra-instrucciones`) son cámara a pantalla completa: se mantienen sin fondo blanco, pero reciben `--section-color` para sus controles en lugar del `sectionColor` que hoy se pasa como prop literal.

### 5. Auditoría de colores hardcodeados
Reemplazar cada `style={{ color: "var(--cocina)" }}`, `var(--comedor)`, `var(--biblioteca)`, `var(--about)` en componentes y rutas hijas por `var(--section-color)`. Alcance: títulos h1/h2, iconos de lista, badges numerados y línea punteada de `RouteTimeline`, botones de Maps, tags de tema en libros, enlaces "volver", y el card de mascota (`RoomDialogueCard` deja de recibir `color` como prop y hereda la variable).

## Notas técnicas

- Un único punto de verdad para el color: la custom property `--section-color`, inyectada por el layout raíz de cada ruta. Ningún componente hijo vuelve a nombrar un token de sección.
- El gradiente de fondo global de `AppShell` no cambia de comportamiento; solo pasa a consumir `useSectionContext()` para saber qué token usar.
- Bottom nav y header quedan igual.
- Sin cambios de datos ni de lógica de negocio: es puramente presentación.
- Verificación final: recorrer las 5 landings y las 11 sub-vistas en el preview comprobando fondo, color de título y contraste de texto de cuerpo (AA).
