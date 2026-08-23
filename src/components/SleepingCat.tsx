export function SleepingCat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* ears */}
      <path d="M78 78 L62 40 L104 62" />
      <path d="M118 60 L134 24 L156 66" />
      {/* head + chin */}
      <path d="M62 82 C48 108 54 138 92 148 C114 154 136 146 148 126" />
      {/* closed eyes */}
      <path d="M90 100 Q98 92 106 100" />
      <path d="M116 100 Q124 92 132 100" />
      {/* nose / mouth */}
      <path d="M106 112 Q111 118 116 112" />
      {/* whiskers */}
      <path d="M58 112 L18 106" />
      <path d="M58 120 L14 124" />
      <path d="M62 128 L20 138" />
      {/* curled body + tail sweeping around */}
      <path d="M148 126 C230 158 312 140 336 100 C350 76 340 52 318 56 C288 62 280 96 232 102 C196 106 168 98 156 80" />
      {/* fluffy tail tip */}
      <path d="M330 62 L344 48" />
      <path d="M322 54 L332 38" />
      <path d="M312 50 L318 34" />
    </svg>
  );
}
