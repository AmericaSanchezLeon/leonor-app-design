# AR Camera Filter — biblioteca + cocina

Convertir las dos páginas `ra-instrucciones` (mockup actual) en una experiencia de cámara con overlays, swipe para cambiar, captura de foto y share/download. Biblioteca usa face tracking (MediaPipe); cocina usa un sticker fijo anclado al borde inferior (sin tracking).

## Assets

Las 7 imágenes subidas se copian al repo en `src/assets/ar/`:

```
src/assets/ar/biblioteca/mascara0.png   (azul, manos)
src/assets/ar/biblioteca/mascara1.png   (verde, ceja alta)
src/assets/ar/biblioteca/mascara2.png   (rosa, triangular)
src/assets/ar/biblioteca/mascara3.png   (naranja, cuernos)
src/assets/ar/cocina/sticker1.png       (tetera — "A Leonora le encantaba el té")
src/assets/ar/cocina/sticker2.png       (latas — "3 tazas de té negro")
src/assets/ar/cocina/sticker3.png       (taza — "uno herbal")
```

Se importan vía Vite (`import mask0 from "@/assets/ar/biblioteca/mascara0.png"`) y se agrupan en arrays `bibliotecaMasks` / `cocinaStickers` exportados desde `src/lib/ar-assets.ts`.

## Arquitectura

```
src/
  lib/
    ar-assets.ts                 ← arrays { id, image, anchor? } por room
    use-face-tracking.ts         ← hook MediaPipe Face Landmarker
  components/
    ar/
      ARCamera.tsx               ← shell común: getUserMedia, video, canvas, swipe, captura, share, errores
      FaceMaskOverlay.tsx        ← biblioteca: posiciona máscara según landmarks
      SurfaceStickerOverlay.tsx  ← cocina: sticker anclado bottom-center, escala responsive
  routes/
    biblioteca/ra-instrucciones.tsx  ← <ARCamera mode="face" items={bibliotecaMasks} />
    cocina/ra-instrucciones.tsx      ← <ARCamera mode="surface" items={cocinaStickers} />
```

## Componentes

### `ARCamera` (shell)
- Props: `mode: "face" | "surface"`, `items: ARItem[]`, `sectionColor: string`.
- Estado: `currentIndex`, `facingMode` (`"user" | "environment"`), `permissionState` (`prompt | granted | denied | error`), `isCapturing`.
- `useEffect`: abre `getUserMedia({ video: { facingMode } })`, asigna a `videoRef.current.srcObject`. Re-ejecuta al cambiar `facingMode`. Cleanup detiene tracks.
- Swipe horizontal sobre el viewport: `onPointerDown/Move/Up`, threshold 50px, wrap-around con `(i + n) % n`. No interfiere con tap en botones.
- Botones overlay (estilo room color):
  - Flip cámara (`SwitchCamera` lucide)
  - Capturar (`Circle` grande centrado abajo)
  - Cerrar / volver (`X` arriba izq → `useNavigate`)
  - Dots de paginación abajo (igual patrón que `RoomDialogueCard`)
- Renderiza el overlay según `mode`: `<FaceMaskOverlay>` o `<SurfaceStickerOverlay>`, pasándole `videoRef`, `item`, `facingMode`.
- Captura: crea canvas offscreen del tamaño del video, dibuja `videoEl` (con `scale(-1,1)` si front), luego dibuja el overlay actual con las mismas transforms que el render en vivo, exporta `toBlob("image/png")`. Abre modal post-captura con preview + botones Share / Download / Retomar.
- Share: si `navigator.canShare?.({ files: [file] })` → `navigator.share`. Si no → link `download="leonor-ar-<timestamp>.png"`.

### `useFaceTracking(videoRef, enabled)`
- Carga `FaceLandmarker` de `@mediapipe/tasks-vision` con WASM desde CDN (`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@<version>/wasm`) y el modelo `face_landmarker.task` (también CDN). `runningMode: "VIDEO"`, `numFaces: 1`.
- Loop con `requestAnimationFrame`: llama `detectForVideo(video, performance.now())`, guarda landmarks en una `useRef` (no state) para evitar re-render por frame; expone un `subscribe(cb)` que el overlay usa para repintar su propio canvas/transform.
- `enabled=false` cuando `facingMode === "environment"` → pausa loop, libera nada (mantiene landmarker para resume rápido).
- Devuelve `{ ready, error, subscribe }`.

### `FaceMaskOverlay`
- Canvas absoluto sobre el video, mismo tamaño (resize observer).
- Cada frame: lee landmarks vía `subscribe`. Si hay cara:
  - `leftEye = lm[33]`, `rightEye = lm[263]`, `noseTip = lm[1]`, `chin = lm[152]`, `foreheadTop ≈ lm[10]`.
  - Centro = midpoint ojos. Ancho = `distance(leftEye, rightEye) * k` (k≈2.6). Alto proporcional al aspect ratio nativo de la imagen.
  - Rotación = `atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x)`.
  - `ctx.translate(cx, cy); ctx.rotate(angle); ctx.drawImage(maskImg, -w/2, -h/2, w, h)`.
- Si front camera: el canvas se transforma con `scaleX(-1)` (mismo flip que video) para que el mirror sea consistente.
- Sin cara detectada: no dibuja (cara desaparece → mask desaparece).

### `SurfaceStickerOverlay`
- Solo CSS: `<img>` posicionado `absolute bottom-[8%] left-1/2 -translate-x-1/2`, `max-w-[60%] max-h-[45%] object-contain pointer-events-none select-none`.
- Sin tracking, sin canvas. Para la captura: el `ARCamera` lo redibuja sobre el canvas con las mismas coordenadas calculadas a partir del tamaño del video.

## Manejo de permisos / errores

`permissionState` se setea en el `catch` de `getUserMedia`:
- `NotAllowedError` → UI con icono `CameraOff`, mensaje "Necesitamos acceso a tu cámara" + botón "Reintentar" (re-llama getUserMedia).
- `NotFoundError` / `OverconstrainedError` → "No encontramos cámara disponible".
- Cualquier otro error → mensaje genérico + `Reintentar`.

Toda la UI de error usa `sectionColor` como acento y respeta el theme actual.

## Edits a rutas

`src/routes/biblioteca/ra-instrucciones.tsx` y `src/routes/cocina/ra-instrucciones.tsx`: reemplazar el mockup actual (icono + texto "Próximamente") por:

```tsx
<ARCamera mode="face" items={bibliotecaMasks} sectionColor="var(--biblioteca)" />
```

Mantener el `Route = createFileRoute(...)` y el `head` actual (solo cambia `component`).

## Dependencias

`bun add @mediapipe/tasks-vision` (solo eso; no se agrega gesture lib — swipe con `pointer*` nativos).

## Notas técnicas

- MediaPipe WASM se carga desde CDN para evitar configurar `assetsInclude` o servir desde `/public`. Si en runtime falla por CORS/CSP, fallback: copiar wasm + .task a `public/mediapipe/` (no se hace por defecto).
- Captura sobre canvas respeta `videoWidth/videoHeight` reales (no el tamaño CSS), para que la foto exportada sea de calidad nativa.
- Loop de tracking corre fuera de React (rAF + refs); React solo re-renderiza al cambiar `currentIndex` / `facingMode` / `permissionState`.
- Scope: `comedor` y `about` no se tocan. No se modifica routing ni layout global.
- Si MediaPipe falla al cargar (offline, bloqueado): la cámara y el flip siguen funcionando, los overlays no aparecen, se muestra un toast suave "Tracking facial no disponible".

## Out of scope

- Posteo directo a redes (solo `navigator.share` + download).
- Grabación de video.
- Multiface.
- Surface tracking real (cocina es overlay fijo, decidido).
