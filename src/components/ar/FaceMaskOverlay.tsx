import { useEffect, useRef, type RefObject } from "react";
import type { FaceLandmarks } from "@/lib/use-face-tracking";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  maskImage: string;
  mirror: boolean;
  subscribe: (cb: (lm: FaceLandmarks | null) => void) => () => void;
  /** Multiplier on the default mask size (1 = default). */
  scale?: number;
  /** Shifts the mask down (positive) or up (negative), in units of eye distance. */
  offsetY?: number;
};

// Landmark indices (MediaPipe Face Landmarker 478-pt)
const LEFT_EYE = 33;
const RIGHT_EYE = 263;
// Face-contour points used to size the mask to the whole face rather than
// just the distance between the eyes: top of the forehead, chin, and the
// two temples.
const FOREHEAD = 10;
const CHIN = 152;
const LEFT_FACE = 234;
const RIGHT_FACE = 454;

export function FaceMaskOverlay({
  videoRef,
  maskImage,
  mirror,
  subscribe,
  scale: maskScaleProp = 1,
  offsetY = 0,
}: Props) {
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
      const videoScale = Math.max(cw / vw, ch / vh);
      const ox = (cw - vw * videoScale) / 2;
      const oy = (ch - vh * videoScale) / 2;
      canvas.dataset["arOx"] = String(ox);
      canvas.dataset["arOy"] = String(oy);
      canvas.dataset["arScale"] = String(videoScale);

      const le = lm[LEFT_EYE];
      const re = lm[RIGHT_EYE];
      const top = lm[FOREHEAD];
      const bottom = lm[CHIN];
      const left = lm[LEFT_FACE];
      const right = lm[RIGHT_FACE];
      if (!le || !re || !top || !bottom || !left || !right) return;

      const toScreen = (p: { x: number; y: number }) => ({
        x: ox + p.x * vw * videoScale,
        y: oy + p.y * vh * videoScale,
      });
      const leP = toScreen(le);
      const reP = toScreen(re);
      const topP = toScreen(top);
      const bottomP = toScreen(bottom);
      const leftP = toScreen(left);
      const rightP = toScreen(right);

      const eyeDx = reP.x - leP.x;
      const eyeDy = reP.y - leP.y;
      const eyeDist = Math.hypot(eyeDx, eyeDy);
      if (!eyeDist) return;

      // Size the mask to fully cover the detected face (forehead-to-chin
      // and temple-to-temple), like object-fit: cover against the face's
      // own bounding box, instead of a fixed multiple of eye distance —
      // that left gaps at the forehead/chin for many face shapes.
      const faceHeight = Math.hypot(bottomP.x - topP.x, bottomP.y - topP.y);
      const faceWidth = Math.hypot(rightP.x - leftP.x, rightP.y - leftP.y);
      const aspect = img.naturalHeight / img.naturalWidth || 1;
      const COVERAGE_PAD = 1.15;
      const widthForFaceWidth = faceWidth * COVERAGE_PAD;
      const widthForFaceHeight = (faceHeight * COVERAGE_PAD) / aspect;
      const width = Math.max(widthForFaceWidth, widthForFaceHeight) * maskScaleProp;
      const height = width * aspect;

      const cx = (topP.x + bottomP.x + leftP.x + rightP.x) / 4;
      const cy = (topP.y + bottomP.y + leftP.y + rightP.y) / 4;
      const angle = Math.atan2(eyeDy, eyeDx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.translate(0, eyeDist * offsetY);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    };

    drawRef.current = draw;
    const unsub = subscribe(draw);
    return () => {
      unsub();
      drawRef.current = null;
    };
  }, [subscribe, videoRef, maskScaleProp, offsetY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ transform: mirror ? "scaleX(-1)" : undefined }}
    />
  );
}
