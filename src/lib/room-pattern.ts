export interface ScatterItem {
  svg: string;
  x: number; // % 0-100
  y: number; // % 0-100
  size: number; // px
  rotate: number; // deg
  opacity: number;
}

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRoomPattern(
  sectionId: string,
  svgUrls: string[],
  count = 12,
): ScatterItem[] {
  if (svgUrls.length === 0) return [];
  const rand = mulberry32(fnv1a(sectionId));
  const items: ScatterItem[] = [];
  for (let i = 0; i < count; i++) {
    const svg = svgUrls[Math.floor(rand() * svgUrls.length)];
    items.push({
      svg,
      x: 4 + rand() * 92,
      y: 4 + rand() * 92,
      size: 24 + rand() * 56,
      rotate: rand() * 360,
      opacity: 0.15 + rand() * 0.35,
    });
  }
  return items;
}
