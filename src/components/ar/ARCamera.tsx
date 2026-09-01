import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Download,
  Facebook,
  Instagram,
  MessageCircle,
  Share2,
  SwitchCamera,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaceMaskOverlay } from "./FaceMaskOverlay";
import { SurfaceStickerOverlay } from "./SurfaceStickerOverlay";
import { useFaceTracking } from "@/lib/use-face-tracking";
import { useLeonor, t, type Lang } from "@/lib/leonor-context";
import type { ARItem } from "@/lib/ar-assets";

const itemLabel = (item: ARItem, lang: Lang) => t(item.label_es, item.label_en, lang) ?? item.id;

type Mode = "face" | "surface";
type PermState = "prompt" | "granted" | "denied" | "notfound" | "error";

type Props = {
  mode: Mode;
  items: ARItem[];
  sectionColor: string;
  title: string;
};

export function ARCamera({ mode, items, sectionColor, title }: Props) {
  const navigate = useNavigate();
  const { language } = useLeonor();
  const lang: Lang = language;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [index, setIndex] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    mode === "surface" ? "environment" : "user",
  );
  const [perm, setPerm] = useState<PermState>("prompt");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [noFaceStuck, setNoFaceStuck] = useState(false);

  const enableFace = mode === "face" && facingMode === "user" && perm === "granted";
  const {
    subscribe,
    ready: faceReady,
    error: faceError,
    hasFace,
    retry: retryFace,
  } = useFaceTracking(videoRef, enableFace);

  // If nothing is ever detected, offer a manual retry instead of leaving the
  // "acerca tu rostro" message up forever with no way out.
  useEffect(() => {
    if (!enableFace || !faceReady || faceError || hasFace) {
      setNoFaceStuck(false);
      return;
    }
    const t = setTimeout(() => setNoFaceStuck(true), 12000);
    return () => clearTimeout(t);
  }, [enableFace, faceReady, faceError, hasFace]);

  const item = items[index];

  // Camera lifecycle
  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setPerm("error");
          setErrorMsg(
            t(
              "Tu navegador no soporta cámara.",
              "Your browser doesn't support camera access.",
              lang,
            ),
          );
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setPerm("granted");
        setErrorMsg(null);
      } catch (e) {
        const err = e as DOMException;
        if (err.name === "NotAllowedError" || err.name === "SecurityError") {
          setPerm("denied");
        } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
          setPerm("notfound");
        } else {
          setPerm("error");
          setErrorMsg(
            err.message ?? t("Error al abrir la cámara", "Couldn't open the camera", lang),
          );
        }
      }
    };
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facingMode, retryNonce]);

  // Swipe handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let active = false;
    const down = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-ar-control]")) return;
      active = true;
      startX = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 50) return;
      const n = items.length;
      setIndex((i) => (dx < 0 ? (i + 1) % n : (i - 1 + n) % n));
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", () => (active = false));
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, [items.length]);

  const flipCamera = () => {
    setFacingMode((f) => (f === "user" ? "environment" : "user"));
  };

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video (mirror if front)
    ctx.save();
    if (facingMode === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    // Draw overlay
    if (item) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (mode === "surface") {
            // bottom-center, max 65% width / 45% height, object-contain
            const maxW = w * 0.65;
            const maxH = h * 0.45;
            const aspect = img.naturalWidth / img.naturalHeight;
            let dw = maxW;
            let dh = dw / aspect;
            if (dh > maxH) {
              dh = maxH;
              dw = dh * aspect;
            }
            const dx = (w - dw) / 2;
            const dy = h - dh - h * 0.12;
            ctx.drawImage(img, dx, dy, dw, dh);
          } else {
            // face mode: paint current face overlay canvas, mapping its
            // object-cover geometry back to the raw video frame.
            const overlayCanvas = containerRef.current?.querySelector(
              "canvas[data-face-canvas]",
            ) as HTMLCanvasElement | null;
            if (overlayCanvas && overlayCanvas.width > 0) {
              const s = Number(overlayCanvas.dataset["arScale"] ?? "0");
              const ox = Number(overlayCanvas.dataset["arOx"] ?? "0");
              const oy = Number(overlayCanvas.dataset["arOy"] ?? "0");
              ctx.save();
              if (facingMode === "user") {
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
              }
              if (s > 0) {
                ctx.drawImage(overlayCanvas, ox, oy, w * s, h * s, 0, 0, w, h);
              } else {
                ctx.drawImage(overlayCanvas, 0, 0, w, h);
              }
              ctx.restore();
            }
          }

          resolve();
        };
        img.onerror = () => resolve();
        img.src = item.image;
      });
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setCapturedUrl(url);
    }, "image/png");
  };

  const share = async () => {
    if (!capturedUrl) return;
    try {
      const res = await fetch(capturedUrl);
      const blob = await res.blob();
      const file = new File([blob], `leonor-ar-${Date.now()}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Leonor AR" });
        return;
      }
    } catch {
      // fallthrough to download
    }
    download();
  };

  const download = () => {
    if (!capturedUrl) return;
    const a = document.createElement("a");
    a.href = capturedUrl;
    a.download = `leonor-ar-${Date.now()}.png`;
    a.click();
  };

  const retake = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
  };

  // Permission error screen
  if (perm === "denied" || perm === "notfound" || perm === "error") {
    const messages: Record<string, { t: string; s: string }> = {
      denied: {
        t: t("Necesitamos acceso a tu cámara", "We need access to your camera", lang),
        s: t(
          "Activa el permiso de cámara en tu navegador y vuelve a intentar.",
          "Enable camera permission in your browser and try again.",
          lang,
        ),
      },
      notfound: {
        t: t("No encontramos una cámara", "We couldn't find a camera", lang),
        s: t(
          "Conecta una cámara o prueba en otro dispositivo.",
          "Connect a camera or try another device.",
          lang,
        ),
      },
      error: {
        t: t("No pudimos abrir la cámara", "We couldn't open the camera", lang),
        s: errorMsg ?? t("Intenta de nuevo.", "Try again.", lang),
      },
    };
    const m = messages[perm];
    return (
      <div
        className="flex h-[calc(var(--app-vh,100dvh)-112px)] flex-col items-center justify-center px-8 text-center"
        style={{ backgroundColor: sectionColor, color: "var(--leonor-cream)" }}
      >
        <CameraOff className="mb-6 h-16 w-16" strokeWidth={1.2} />
        <h1 className="font-serif text-2xl">{m.t}</h1>
        <p className="mt-3 max-w-xs text-sm opacity-90">{m.s}</p>
        <button
          onClick={() => {
            setPerm("prompt");
            setErrorMsg(null);
            setRetryNonce((n) => n + 1);
          }}
          className="mt-8 rounded-full bg-white/20 px-6 py-2 text-sm transition hover:bg-white/30"
        >
          {t("Reintentar", "Retry", lang)}
        </button>
        <button onClick={() => navigate({ to: ".." })} className="mt-3 text-xs underline">
          {t("Volver", "Back", lang)}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-label={title}
      className="relative h-[calc(var(--app-vh,100dvh)-112px)] w-full overflow-hidden bg-black touch-pan-y select-none"
      style={{ touchAction: "pan-y" }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: facingMode === "user" ? "scaleX(-1)" : undefined }}
      />

      {/* Overlay */}
      {item && mode === "face" && facingMode === "user" && (
        <FaceMaskOverlayWrapper
          videoRef={videoRef}
          maskImage={item.image}
          mirror={facingMode === "user"}
          subscribe={subscribe}
        />
      )}
      {item && mode === "surface" && <SurfaceStickerOverlay stickerImage={item.image} />}

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <button
          data-ar-control
          onClick={() => navigate({ to: ".." })}
          className="rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
          aria-label={t("Cerrar", "Close", lang)}
        >
          <X className="h-5 w-5" />
        </button>
        <button
          data-ar-control
          onClick={flipCamera}
          className="rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
          aria-label={t("Cambiar cámara", "Switch camera", lang)}
        >
          <SwitchCamera className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-x-0 top-16 flex justify-center px-6" aria-live="polite">
        {enableFace && !faceReady && !faceError && (
          <span className="rounded-full bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur">
            {t("Preparando el filtro…", "Getting the filter ready…", lang)}
          </span>
        )}
        {enableFace && faceError && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-black/60 px-4 py-3 text-center backdrop-blur">
            <span className="max-w-[16rem] text-xs text-white">
              {t(
                "No pudimos activar el filtro facial. Revisa tu conexión e inténtalo de nuevo.",
                "We couldn't turn on the face filter. Check your connection and try again.",
                lang,
              )}
            </span>
            <button
              data-ar-control
              onClick={retryFace}
              className="min-h-[44px] rounded-full bg-white/20 px-5 text-xs text-white transition hover:bg-white/30"
            >
              {t("Reintentar", "Retry", lang)}
            </button>
          </div>
        )}
        {enableFace && faceReady && !faceError && !hasFace && (
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-black/55 px-3 py-1.5 text-center text-xs text-white backdrop-blur">
              {t(
                "Acerca tu rostro y busca más luz",
                "Bring your face closer and find more light",
                lang,
              )}
            </span>
            {noFaceStuck && (
              <button
                data-ar-control
                onClick={retryFace}
                className="min-h-[36px] rounded-full bg-white/20 px-4 text-xs text-white backdrop-blur transition hover:bg-white/30"
              >
                {t("¿Sigue sin funcionar? Reintentar", "Still not working? Retry", lang)}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar: chevrons + dots (paginadores) + capture */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-6">
        {items.length > 1 ? (
          <div className="flex items-center gap-3">
            <button
              data-ar-control
              onClick={goPrev}
              aria-label={t("Anterior", "Previous", lang)}
              className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  data-ar-control
                  onClick={() => setIndex(i)}
                  aria-label={`${t("Ir a", "Go to", lang)} ${itemLabel(it, lang)}`}
                  className="h-2 w-2 rounded-full transition"
                  style={{
                    backgroundColor: i === index ? sectionColor : "rgba(255,255,255,0.4)",
                    outline: i === index ? "2px solid rgba(255,255,255,0.6)" : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
            <button
              data-ar-control
              onClick={goNext}
              aria-label={t("Siguiente", "Next", lang)}
              className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <button
          data-ar-control
          onClick={capture}
          aria-label={t("Capturar foto", "Take photo", lang)}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur transition active:scale-95"
          style={{ boxShadow: `0 0 0 4px ${sectionColor}` }}
        >
          <Camera className="h-7 w-7 text-white" />
        </button>
      </div>

      {/* Captured preview modal */}
      {capturedUrl && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-6">
          <img
            src={capturedUrl}
            alt={t("Captura", "Capture", lang)}
            className="max-h-[70%] max-w-full rounded-lg object-contain"
          />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={share}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white"
              style={{ backgroundColor: sectionColor }}
            >
              <Share2 className="h-4 w-4" /> {t("Compartir", "Share", lang)}
            </button>
            <button
              onClick={download}
              className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm text-white backdrop-blur"
            >
              <Download className="h-4 w-4" /> {t("Descargar", "Download", lang)}
            </button>
            <button
              onClick={retake}
              className="rounded-full bg-white/10 px-5 py-2 text-sm text-white backdrop-blur"
            >
              {t("Tomar otra", "Take another", lang)}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/70">
              {t("Compartir en redes", "Share on social", lang)}
            </span>
            <div className="flex items-center gap-3">
              {[
                { label: "WhatsApp", Icon: MessageCircle },
                { label: "Instagram", Icon: Instagram },
                { label: "Facebook", Icon: Facebook },
                { label: "X", Icon: Twitter },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  onClick={share}
                  aria-label={`${t("Compartir por", "Share via", lang)} ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper adds data attribute to the inner canvas so capture() can grab it.
function FaceMaskOverlayWrapper(props: React.ComponentProps<typeof FaceMaskOverlay>) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const canvas = ref.current?.querySelector("canvas");
    if (canvas) canvas.setAttribute("data-face-canvas", "true");
  });
  return (
    <div ref={ref} className="absolute inset-0">
      <FaceMaskOverlay {...props} />
    </div>
  );
}
