/** Static gold trophy for reduced-motion / low-end / pre-3D. */
export default function TrophySvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>
        <linearGradient id="tg" x1="0" x2="1"><stop offset="0" stopColor="#8a6a12" /><stop offset=".35" stopColor="#f3d27a" /><stop offset=".6" stopColor="#c9a227" /><stop offset="1" stopColor="#6e530c" /></linearGradient>
      </defs>
      <path d="M100 6l9 18 20 3-14 14 3 20-18-9-18 9 3-20-14-14 20-3z" fill="url(#tg)" />
      <path d="M45 70h110c0 50-20 80-45 88v22h-20v-22C65 150 45 120 45 70z" fill="url(#tg)" />
      <path d="M46 76c-30 0-34 40 2 50M154 76c30 0 34 40-2 50" stroke="url(#tg)" strokeWidth="8" fill="none" />
      <rect x="52" y="96" width="96" height="10" fill="#b0121a" />
      <path d="M70 180h60l8 22H62z" fill="url(#tg)" />
      <rect x="50" y="202" width="100" height="40" rx="4" fill="#160304" stroke="url(#tg)" strokeWidth="3" />
    </svg>
  );
}
