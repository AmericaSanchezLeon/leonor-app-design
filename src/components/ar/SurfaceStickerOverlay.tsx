type Props = {
  stickerImage: string;
};

export function SurfaceStickerOverlay({ stickerImage }: Props) {
  return (
    <img
      src={stickerImage}
      alt=""
      draggable={false}
      className="pointer-events-none absolute left-1/2 top-1/2 max-h-[38%] max-w-[65%] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-lg"
    />
  );
}
