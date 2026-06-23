## Alcance

1. Agregar campo `mapsUrl: ""` a cada punto de `src/data/rutasData.json` (16 puntos en 3 rutas: CDMX, San Luis Potosí, Chiapas). Placeholder vacío — el usuario los llena después.
2. Nuevo componente `src/components/RouteTimeline.tsx` — timeline vertical ilustrado: paradas numeradas con pin, conectadas por línea punteada en `var(--comedor)`, cada parada tappable abre `mapsUrl` en nueva pestaña; si vacío, queda visualmente deshabilitada (opacity reducida, cursor default, sin handler).
3. Reemplazar el render actual de `src/routes/comedor/mapas.tsx` por una sección por ruta, cada una con su título/descripción + un `<RouteTimeline puntos={r.puntos} />`.

## Estructura JSON añadida

Cada objeto en `puntos[]` recibe un campo nuevo manteniendo el orden existente:

```json
{
  "estado": "...",
  "nombre_pin_es": "...",
  "nombre_pin_en": "...",
  "direccion_pin": "...",
  "coord_pin": "...",
  "es": "...",
  "en": "...",
  "imagen": "...",
  "mapsUrl": ""
}
```

No se generan URLs desde `coord_pin` automáticamente — el plan exige placeholder vacío para llenado manual.

## RouteTimeline.tsx — comportamiento

Props:

```ts
interface Punto {
  nombre_pin_es?: string;
  nombre_pin_en?: string;
  direccion_pin?: string;
  mapsUrl?: string;
}
interface Props {
  puntos: Punto[];
}
```

Render:

```text
┌─ (1) ─ Casa Estudio Leonora Carrington        [Abrir en Maps ↗]
│ ┊
│ ┊  (línea punteada en var(--comedor))
│ ┊
├─ (2) ─ Casa de Remedios Varo                  [Abrir en Maps ↗]
│ ┊
...
```

- Lista `<ol>` con `relative` y un pseudo-elemento / `<div>` izquierdo de 2px punteado vertical (`border-l-2 border-dashed`) en color `var(--comedor)`, posicionado detrás de los marcadores.
- Cada parada: badge circular numerado (fondo `var(--comedor)`, número blanco, `MapPin` lucide opcionalmente al lado), nombre traducido según `language`, dirección como subtítulo opcional pequeño, y un botón "Abrir en Maps" (texto traducido ES/EN) con icono `ExternalLink`.
- Click handler: `onClick={() => mapsUrl && window.open(mapsUrl, '_blank', 'noopener,noreferrer')}`.
- Estado deshabilitado cuando `!mapsUrl`: `aria-disabled`, `opacity-50`, `cursor-default`, sin onClick efectivo. El nombre sigue visible.
- Toda la parada es un `<button>` para ser tappable en móvil (no sólo el botón Maps).

## Edición de `/comedor/mapas`

Estructura actual (un `<article>` por ruta con `<ol>` interno) se reemplaza por:

```tsx
<SectionPageLayout sectionId="comedor">
  <div className="px-5 py-8">
    <h1>Rutas Gastronómicas</h1>
    {rutas.map((r) => (
      <section>
        <h2 style={{ color: 'var(--comedor)' }}>{title}</h2>
        <p className="text-muted-foreground">{descripcion}</p>
        <RouteTimeline puntos={r.puntos} />
      </section>
    ))}
  </div>
</SectionPageLayout>
```

Cada ruta del JSON ya corresponde a un estado (CDMX, SLP, Chiapas), así que el `title_es/en` actúa como encabezado de sección. No se reagrupa por `estado` del punto — sería redundante.

## Out of scope

- Generar URLs desde `coord_pin` (placeholder vacío exigido).
- Mapa embebido o librería de mapas.
- Cambiar copy, imágenes o descripciones existentes.
- Tocar otras rutas/componentes fuera de mapas.
