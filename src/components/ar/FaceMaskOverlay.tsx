import { useEffect, useRef, type RefObject } from "react";
import type { FaceLandmarks } from "@/lib/use-face-tracking";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  maskImage: string;
  mirror: boolean;
  subscribe: (cb: (lm: FaceLandmarks | null) => void) => () => void;
};

// Landmark indices (MediaPipe Face Landmarker 478-pt)
const LEFT_EYE = 33;
const RIGHT_EYE = 263;

export function FaceMaskOverlay({ videoRef, maskImage, mirror, subscribe }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgReadyRef = useRef(false);
  const lastRef = useRef<FaceLandmarks | null>(null);
  const drawRef = useRef<((lm: FaceLandmarks | null) => void) | null>(null);

  // Preload mask image, repaint as soon as it's decoded / when it changes
  useEffect(() => {
    imgReadyRef.current = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgReadyRef.current = true;
      drawRef.current?.(lastRef.current);
    };
    img.src = maskImage;
    imgRef.current = img;
    drawRef.current?.(lastRef.current);
  }, [maskImage]);

  // Subscribe to landmarks → redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (lm: FaceLandmarks | null) => {
      lastRef.current = lm;
      const video = videoRef.current;
      if (!video) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // Canvas matches its own CSS box so the overlay lines up with the
      // object-cover video, whatever the screen ratio is.
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;

      ctx.clearRect(0, 0, cw, ch);
      const img = imgRef.current;
      if (!vw || !vh || !lm || !imgReadyRef.current || !img) return;

      // Replicate object-cover mapping: scale up, center, crop overflow.
      const scale = Math.max(cw / vw, ch / vh);
      const ox = (cw - vw * scale) / 2;
      const oy = (ch - vh * scale) / 2;
      canvas.dataset["arOx"] = String(ox);
      canvas.dataset["arOy"] = String(oy);
      canvas.dataset["arScale"] = String(scale);

      const le = lm[LEFT_EYE];
      const re = lm[RIGHT_EYE];
      if (!le || !re) return;

      const lex = ox + le.x * vw * scale;
      const ley = oy + le.y * vh * scale;
      const rex = ox + re.x * vw * scale;
      const rey = oy + re.y * vh * scale;

      const eyeDx = rex - lex;
      const eyeDy = rey - ley;
      const eyeDist = Math.hypot(eyeDx, eyeDy);
      if (!eyeDist) return;

      const width = eyeDist * 2.8;
      const aspect = img.naturalHeight / img.naturalWidth || 1;
      const height = width * aspect;

      const cx = (lex + rex) / 2;
      const cy = (ley + rey) / 2;
      const angle = Math.atan2(eyeDy, eyeDx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    };

    drawRef.current = draw;
    const unsub = subscribe(draw);
    return () => {
      unsub();
      drawRef.current = null;
    };
  }, [subscribe, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ transform: mirror ? "scaleX(-1)" : undefined }}
    />
  );
}
