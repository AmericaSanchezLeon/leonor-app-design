import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { FaceLandmarker as FLType, NormalizedLandmark } from "@mediapipe/tasks-vision";

const WASM_BASES = [
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
  "https://unpkg.com/@mediapipe/tasks-vision@0.10.35/wasm",
];

// Local copy first (no external network needed), remote as fallback.
const MODEL_URLS = [
  "/mediapipe/face_landmarker.task",
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
];

export type FaceLandmarks = NormalizedLandmark[];
export type FaceTrackingStatus = "loading" | "ready" | "error";

export function useFaceTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<FaceTrackingStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasFace, setHasFace] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const landmarksRef = useRef<FaceLandmarks | null>(null);
  const subscribersRef = useRef<Set<(lm: FaceLandmarks | null) => void>>(new Set());
  const landmarkerRef = useRef<FLType | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load landmarker (with CDN + model fallbacks)
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    (async () => {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");

        let fileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null;
        let lastErr: unknown = null;
        for (const base of WASM_BASES) {
          try {
            fileset = await FilesetResolver.forVisionTasks(base);
            break;
          } catch (e) {
            lastErr = e;
            console.warn("[useFaceTracking] wasm base failed", base, e);
          }
        }
        if (!fileset) throw lastErr ?? new Error("No se pudo cargar el motor de reconocimiento");

        let landmarker: FLType | null = null;
        for (const modelAssetPath of MODEL_URLS) {
          for (const delegate of ["GPU", "CPU"] as const) {
            try {
              landmarker = await FaceLandmarker.createFromOptions(fileset, {
                baseOptions: { modelAssetPath, delegate },
                runningMode: "VIDEO",
                numFaces: 1,
              });
              break;
            } catch (e) {
              console.warn("[useFaceTracking] create failed", modelAssetPath, delegate, e);
              lastErr = e;
            }
          }
          if (landmarker) break;
        }
        if (!landmarker) throw lastErr ?? new Error("No se pudo cargar el modelo facial");

        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus("ready");
      } catch (e) {
        console.error("[useFaceTracking] init failed", e);
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Tracking facial no disponible");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [attempt]);

  // Tracking loop — notifies subscribers on every frame so the overlay always repaints.
  useEffect(() => {
    if (!enabled || status !== "ready") return;
    let lastTs = -1;
    let faceNow = false;

    const tick = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (video && landmarker && video.readyState >= 2 && video.videoWidth > 0) {
        const ts = performance.now();
        if (ts !== lastTs) {
          lastTs = ts;
          try {
            const res = landmarker.detectForVideo(video, ts);
            const lm = res.faceLandmarks?.[0] ?? null;
            landmarksRef.current = lm;
            const found = !!lm;
            if (found !== faceNow) {
              faceNow = found;
              setHasFace(found);
            }
          } catch {
            // ignore transient errors
          }
        }
      }
      subscribersRef.current.forEach((cb) => cb(landmarksRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      landmarksRef.current = null;
      setHasFace(false);
      subscribersRef.current.forEach((cb) => cb(null));
    };
  }, [enabled, status, videoRef]);

  const subscribe = useCallback((cb: (lm: FaceLandmarks | null) => void) => {
    subscribersRef.current.add(cb);
    cb(landmarksRef.current);
    return () => {
      subscribersRef.current.delete(cb);
    };
  }, []);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { status, ready: status === "ready", error, hasFace, subscribe, retry, landmarksRef };
}
