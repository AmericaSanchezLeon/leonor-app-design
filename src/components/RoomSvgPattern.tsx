import { useMemo } from "react";
import { generateRoomPattern } from "@/lib/room-pattern";

interface Props {
  sectionId: string;
  tileUrl: string;
  svgUrls: string[];
  count?: number;
  tileOpacity?: number;
  tileSize?: number;
}

export function RoomSvgPattern({
  sectionId,
  tileUrl,
  svgUrls,
  count = 12,
  tileOpacity = 0.12,
  tileSize = 160,
}: Props) {
  const items = useMemo(
    () => generateRoomPattern(sectionId, svgUrls, count),
    [sectionId, svgUrls, count],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${tileUrl})`,
          backgroundRepeat: "repeat",
          backgroundSize: `${tileSize}px ${tileSize}px`,
          opacity: tileOpacity,
        }}
      />
      {items.map((it, i) => (
        <img
          key={i}
          src={it.svg}
          alt=""
          className="absolute"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            width: it.size,
            height: it.size,
            transform: `translate(-50%,-50%) rotate(${it.rotate}deg)`,
            opacity: it.opacity,
          }}
        />
      ))}
    </div>
  );
}
