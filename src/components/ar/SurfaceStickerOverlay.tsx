type Props = {
  stickerImage: string;
};

export function SurfaceStickerOverlay({ stickerImage }: Props) {
  return (
    <img
      src={stickerImage}
      alt=""
      draggable={false}
      className="pointer-events-none absolute bottom-[12%] left-1/2 max-h-[45%] max-w-[65%] -translate-x-1/2 select-none object-contain drop-shadow-lg"
    />
  );
}
