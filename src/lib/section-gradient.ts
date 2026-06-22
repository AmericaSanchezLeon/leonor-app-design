// Generates a randomized linear-gradient string based on a section's CSS color token.
// Reads the actual computed value (so it respects light/dark theme), converts to HSL,
// and produces 2-3 stops with random hue/lightness/saturation perturbations.

function hexToHsl(hex: string): [number, number, number] {
  const m = hex.replace("#", "").trim();
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function resolveColor(token: string): string {
  // token can be "--cocina" (CSS var name), "var(--cocina)", or a literal hex.
  if (typeof window === "undefined") return token.startsWith("#") ? token : "#b56503";
  let varName = token;
  const varMatch = token.match(/var\((--[\w-]+)\)/);
  if (varMatch) varName = varMatch[1];
  if (varName.startsWith("--")) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (v) return v;
  }
  return token.startsWith("#") ? token : "#b56503";
}

export function generateSectionGradient(token: string): string {
  const base = resolveColor(token);
  // If we couldn't resolve to hex, fallback flat color
  if (!base.startsWith("#")) {
    return `linear-gradient(135deg, ${base}, ${base})`;
  }
  const [h, s, l] = hexToHsl(base);
  const stops = Math.random() > 0.5 ? 3 : 2;
  const angle = Math.floor(rand(0, 360));
  const parts: string[] = [];
  for (let i = 0; i < stops; i++) {
    const dh = rand(-15, 15);
    const ds = rand(-10, 10);
    const dl = rand(-15, 15);
    const hh = (h + dh + 360) % 360;
    const ss = clamp(s + ds, 20, 95);
    const ll = clamp(l + dl, 15, 75);
    const pos = Math.round((i / (stops - 1)) * 100);
    parts.push(`hsl(${hh.toFixed(1)} ${ss.toFixed(1)}% ${ll.toFixed(1)}%) ${pos}%`);
  }
  return `linear-gradient(${angle}deg, ${parts.join(", ")})`;
}
