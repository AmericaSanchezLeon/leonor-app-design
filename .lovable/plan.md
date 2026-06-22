# Card de diálogo anclado con mascota + paginación

Rediseñar el bloque de mascotQuote en `RoomLanding` como un card fijo al borde inferior del viewport de la room, con la ilustración del animal a la derecha y dots de paginación que avanzan solo por tap/swipe.

## Mapeo confirmado de mascotas

Verificado contra el árbol del repo `AmericaSanchezLeon/leonorapp2.0` (`src/assets/img/mascotas/`):

- `mascotas_yeti.svg` → `lobby` (home `/`)
- `mascotas_monseur.svg` → `cocina` (nota: archivo es `monseur`, no `monsieur` ni `monsoeur`)
- `mascotas_ramona.svg` → `comedor`
- `mascotas_minotaura.svg` → `biblioteca`
- `about` → no existe mascota propia; fallback a `yeti`

## Pasos

1. **`src/lib/leonor-images.ts`** — añadir:
   ```ts
   export const mascotImg: Record<string, string> = {
     lobby: `${RAW_BASE}/src/assets/img/mascotas/mascotas_yeti.svg`,
     cocina: `${RAW_BASE}/src/assets/img/mascotas/mascotas_monseur.svg`,
     comedor: `${RAW_BASE}/src/assets/img/mascotas/mascotas_ramona.svg`,
     biblioteca: `${RAW_BASE}/src/assets/img/mascotas/mascotas_minotaura.svg`,
     about: `${RAW_BASE}/src/assets/img/mascotas/mascotas_yeti.svg`,
   };
   ```

2. **`src/components/RoomDialogueCard.tsx`** (nuevo):
   - Props: `sectionId: keyof typeof mascotImg`, `color: string`.
   - Lee `mascotData[sectionId]` (array de `{es,en}`); soporta también claves no-array (errores) devolviendo `null` si no hay frases.
   - `useState<number>(0)` para índice activo. Sin timers, sin autoplay.
   - Avance: `onClick` del card (`(i+1) % n`) y swipe horizontal con `onPointerDown/Up` (delta X > 40 px → siguiente; < -40 → anterior).
   - Layout interno: `flex flex-row items-end justify-between gap-3`, texto+dots a la izquierda (`flex-1`), `<img>` mascota a la derecha (`w-20 h-auto shrink-0`, `select-none`, `draggable={false}`, `alt=""`).
   - Card: fondo `bg-[var(--leonor-cream)]/95 backdrop-blur-sm`, border-radius grande arriba, texto color `color`, sombra arriba.
   - Subcomponente `Dots` inline: render `n` divs, activo `w-2 h-2 bg-current`, inactivo `w-2 h-2 border border-current opacity-40`, todos `rounded-full`.

3. **`src/components/RoomLanding.tsx`** — refactor de posicionamiento:
   - Cambiar el wrapper raíz a `relative min-h-[calc(100vh-104px)] pb-48` (padding-bottom para que el contenido no quede oculto bajo el card).
   - Eliminar el bloque actual de `mascotQuote` (las dos `div` con la cita).
   - Cambiar firma: aceptar `sectionId: string` en vez de `mascotQuote`.
   - Al final del wrapper, antes de cerrar, renderizar:
     ```tsx
     <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
       <RoomDialogueCard sectionId={sectionId} color={color} />
     </div>
     ```

4. **Routes que usan RoomLanding** — pasar `sectionId` en vez de `mascotQuote`:
   - `src/routes/index.tsx` → `sectionId="lobby"`
   - `src/routes/cocina/index.tsx` → `"cocina"`
   - `src/routes/comedor/index.tsx` → `"comedor"`
   - `src/routes/biblioteca/index.tsx` → `"biblioteca"`
   - `src/routes/about/index.tsx` → `"about"`

## Detalles técnicos

- El card es `absolute bottom-0` respecto al contenedor `relative` de RoomLanding (no `fixed`), así no tapa la bottom-nav global del AppShell.
- Swipe: implementado con eventos `pointer*` (no se agregan deps). Threshold 40 px. `touch-action: pan-y` en el card para no bloquear scroll vertical.
- Si `mascotData[sectionId]` no existe o no es array → no se renderiza el card (return `null`).
- Imagen de mascota se carga desde GitHub raw vía `mascotImg[sectionId]`; el archivo `mascotas_monseur.svg` se confirma literalmente con esa ortografía.
- El gradiente dinámico de sección sigue intacto detrás; el card lleva fondo crema semi-translúcido para legibilidad.
