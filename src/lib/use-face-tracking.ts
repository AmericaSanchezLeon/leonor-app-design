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

type Delegate = "GPU" | "CPU";

export type FaceLandmarks = NormalizedLandmark[];
export type FaceTrackingStatus = "loading" | "ready" | "error";

// How long (or how many failed frames) we tolerate the GPU delegate never
// producing a face before assuming it's silently broken on this device —
// some mobile GPUs load the delegate fine but can't actually run inference
// on it, and MediaPipe doesn't throw when that happens; it just returns no
// landmarks forever. CPU delegate is slower but reliably works everywhere.
const GPU_FAILURE_STREAK_LIMIT = 10;
const GPU_NO_DETECTION_TIMEOUT_MS = 7000;

export function useFaceTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<FaceTrackingStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasFace, setHasFace] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [forceCpu, setForceCpu] = useState(false);

  const landmarksRef = useRef<FaceLandmarks | null>(null);
  const subscribersRef = useRef<Set<(lm: FaceLandmarks | null) => void>>(new Set());
  const landmarkerRef = useRef<FLType | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeDelegateRef = useRef<Delegate | null>(null);
  const gpuFallbackTriedRef = useRef(false);

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

        const delegates: Delegate[] = forceCpu ? ["CPU"] : ["GPU", "CPU"];
        let landmarker: FLType | null = null;
        let usedDelegate: Delegate | null = null;
        for (const modelAssetPath of MODEL_URLS) {
          for (const delegate of delegates) {
            try {
              landmarker = await FaceLandmarker.createFromOptions(fileset, {
                baseOptions: { modelAssetPath, delegate },
                runningMode: "VIDEO",
                numFaces: 1,
              });
              usedDelegate = delegate;
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
        activeDelegateRef.current = usedDelegate;
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
  }, [attempt, forceCpu]);

  // Tracking loop — notifies subscribers on every frame so the overlay always repaints.
  useEffect(() => {
    if (!enabled || status !== "ready") return;
    let lastTs = -1;
    let faceNow = false;
    let failureStreak = 0;
    let fallbackTriggered = false;
    const readySince = performance.now();

    const fallBackToCpu = () => {
      if (fallbackTriggered || gpuFallbackTriedRef.current) return;
      fallbackTriggered = true;
      gpuFallbackTriedRef.current = true;
      console.warn("[useFaceTracking] GPU delegate not producing results, forcing CPU");
      setForceCpu(true);
      setAttempt((a) => a + 1);
    };

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
            failureStreak = 0;
            const found = !!lm;
            if (found !== faceNow) {
              faceNow = found;
              setHasFace(found);
            }
            if (
              !found &&
              activeDelegateRef.current === "GPU" &&
              ts - readySince > GPU_NO_DETECTION_TIMEOUT_MS
            ) {
              fallBackToCpu();
              return;
            }
          } catch (e) {
            failureStreak++;
            if (failureStreak === 1) console.warn("[useFaceTracking] detectForVideo failed", e);
            if (activeDelegateRef.current === "GPU" && failureStreak >= GPU_FAILURE_STREAK_LIMIT) {
              fallBackToCpu();
              return;
            }
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

  const retry = useCallback(() => {
    gpuFallbackTriedRef.current = false;
    setForceCpu(false);
    setAttempt((a) => a + 1);
  }, []);

  return { status, ready: status === "ready", error, hasFace, subscribe, retry, landmarksRef };
}
