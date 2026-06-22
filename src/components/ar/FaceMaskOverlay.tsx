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

  // Preload mask image
  useEffect(() => {
    imgReadyRef.current = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgReadyRef.current = true;
    };
    img.src = maskImage;
    imgRef.current = img;
  }, [maskImage]);

  // Subscribe to landmarks → redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (lm: FaceLandmarks | null) => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;
      if (canvas.width !== vw) canvas.width = vw;
      if (canvas.height !== vh) canvas.height = vh;

      ctx.clearRect(0, 0, vw, vh);
      const img = imgRef.current;
      if (!lm || !imgReadyRef.current || !img) return;

      const le = lm[LEFT_EYE];
      const re = lm[RIGHT_EYE];
      if (!le || !re) return;

      const lex = le.x * vw;
      const ley = le.y * vh;
      const rex = re.x * vw;
      const rey = re.y * vh;

      const eyeDx = rex - lex;
      const eyeDy = rey - ley;
      const eyeDist = Math.hypot(eyeDx, eyeDy);

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

    const unsub = subscribe(draw);
    return unsub;
  }, [subscribe, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={{ transform: mirror ? "scaleX(-1)" : undefined }}
    />
  );
}
