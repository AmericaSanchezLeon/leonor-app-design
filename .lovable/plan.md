# Arreglar la RA de máscaras (biblioteca)

La cámara sí abre, pero la máscara nunca se dibuja. Hay tres causas posibles y el código actual no permite distinguirlas porque no muestra ningún estado: si el modelo de detección facial no carga, la pantalla se queda igual, sin aviso.

## Qué se va a hacer

### 1. Hacer visible lo que está pasando
- Mostrar un indicador "Preparando el filtro..." mientras carga el detector facial (con `aria-live` para lectores de pantalla).
- Si el detector falla, mostrar un mensaje claro con botón "Reintentar" en lugar de dejar la cámara sin máscara y sin explicación.
- Añadir un aviso suave "Acerca tu rostro / busca más luz" cuando el detector ya está listo pero no encuentra cara.

### 2. Asegurar que el detector cargue
El modelo y el runtime se descargan de dos CDNs externos; si alguno se bloquea, no hay máscara. Se añade:
- Reintento con un CDN alternativo cuando falla la descarga.
- Los archivos del modelo se sirven desde el propio proyecto como respaldo, para no depender de una red externa.

### 3. Corregir la alineación de la máscara
El video se recorta para llenar la pantalla (`object-cover`), pero el lienzo de la máscara se estira a la pantalla completa. Aunque el detector funcione, la máscara queda desplazada o de tamaño incorrecto (en pantallas verticales el desfase es grande). Se corrige calculando el mismo recorte del video en el lienzo, de forma que la máscara caiga exactamente sobre la cara en cualquier tamaño de pantalla.

### 4. Garantizar que se pinte el primer frame
Hoy el dibujo solo ocurre cuando llega una detección nueva. Si la imagen de la máscara termina de cargar después, no se repinta. Se hará que el cambio de máscara y la carga de su imagen fuercen un repintado inmediato con la última posición conocida del rostro.

### 5. Verificación
Se probará en el navegador con una cámara simulada de video (Chrome permite inyectar un rostro de prueba) para confirmar: detector listo, máscara dibujada, cambio de máscara por swipe y captura de foto con la máscara incluida.

## Detalles técnicos

- `src/lib/use-face-tracking.ts`: exponer `status` (`loading | ready | error`), fallback de CDN + assets locales, `retry()`, y notificar a los suscriptores en cada frame incluso sin rostro.
- `src/components/ar/FaceMaskOverlay.tsx`: mapear coordenadas normalizadas al recorte real de `object-cover` (escala = max(cw/vw, ch/vh), offsets centrados), dimensionar el lienzo al tamaño del contenedor por CSS pixels, y repintar al cambiar `maskImage`.
- `src/components/ar/ARCamera.tsx`: renderizar estados de carga/error/"no hay rostro" del tracking; mantener el `data-face-canvas` para la captura y ajustar la captura al nuevo sistema de coordenadas.
- Sin cambios en datos ni en el resto de la app; solo la experiencia de RA facial.
