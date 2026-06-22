import { useEffect, useRef, useState, type RefObject } from "react";
import type { FaceLandmarker as FLType, NormalizedLandmark } from "@mediapipe/tasks-vision";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type FaceLandmarks = NormalizedLandmark[];

export function useFaceTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarksRef = useRef<FaceLandmarks | null>(null);
  const subscribersRef = useRef<Set<(lm: FaceLandmarks | null) => void>>(new Set());
  const landmarkerRef = useRef<FLType | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load landmarker once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
        const landmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setReady(true);
      } catch (e) {
        console.error("[useFaceTracking] init failed", e);
        if (!cancelled) setError(e instanceof Error ? e.message : "Tracking facial no disponible");
      }
    })();
    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  // Tracking loop
  useEffect(() => {
    if (!enabled || !ready) return;
    let lastTs = -1;
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
            subscribersRef.current.forEach((cb) => cb(lm));
          } catch {
            // ignore transient errors
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      landmarksRef.current = null;
      subscribersRef.current.forEach((cb) => cb(null));
    };
  }, [enabled, ready, videoRef]);

  const subscribe = (cb: (lm: FaceLandmarks | null) => void) => {
    subscribersRef.current.add(cb);
    cb(landmarksRef.current);
    return () => {
      subscribersRef.current.delete(cb);
    };
  };

  return { ready, error, subscribe, landmarksRef };
}
