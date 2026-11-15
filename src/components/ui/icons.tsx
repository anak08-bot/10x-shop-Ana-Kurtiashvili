import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CartIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
  </Base>
);
export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const MoonIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Base>
);
export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Base>
);
export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Base>
);
export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);
export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
  </Base>
);

/** Brand mark: a royal crown. Pass a className to set size/colour (it uses currentColor). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M9 47 L4.5 19 L19 31 L32 11 L45 31 L59.5 19 L55 47 Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M9 51.5h46v6H9z" fill="currentColor" />
      <circle cx="4.5" cy="16" r="3.2" fill="currentColor" />
      <circle cx="32" cy="8" r="3.4" fill="currentColor" />
      <circle cx="59.5" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}

export const CrownIcon = LogoMark;

/** Large, detailed crown used by the coronation animation. Gradient ids are unique to this one instance. */
export function RoyalCrown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 270" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3bf" />
          <stop offset="0.3" stopColor="#e3bd62" />
          <stop offset="0.55" stopColor="#a47a2b" />
          <stop offset="0.8" stopColor="#f2d98a" />
          <stop offset="1" stopColor="#8a6320" />
        </linearGradient>
        <radialGradient id="rc-ruby" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff9aa9" />
          <stop offset="0.45" stopColor="#d3153a" />
          <stop offset="1" stopColor="#5e0616" />
        </radialGradient>
        <radialGradient id="rc-sapphire" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#9fc2ff" />
          <stop offset="0.5" stopColor="#2b5fd0" />
          <stop offset="1" stopColor="#10286b" />
        </radialGradient>
        <radialGradient id="rc-pearl" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d2c2" />
        </radialGradient>
        <linearGradient id="rc-velvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4122f" />
          <stop offset="1" stopColor="#5e0616" />
        </linearGradient>
      </defs>

      {/* velvet cap */}
      <path d="M44 200 Q40 92 150 66 Q260 92 256 200 Z" fill="url(#rc-velvet)" stroke="#3d040e" strokeWidth="2" />
      <path d="M150 66 Q120 130 112 200 M150 66 Q180 130 188 200 M150 66 L150 200" stroke="#ff7b8f" strokeOpacity="0.28" strokeWidth="2" fill="none" />

      {/* gold crown body */}
      <path
        d="M36 212 L20 84 L58 146 L88 54 L120 134 L150 30 L180 134 L212 54 L242 146 L280 84 L264 212 Z"
        fill="url(#rc-gold)"
        stroke="#4d3309"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M58 146 L88 54 M120 134 L150 30 M180 134 L212 54" stroke="#fff3bf" strokeOpacity="0.55" strokeWidth="2" fill="none" />

      {/* pearls on the tips */}
      {[
        [20, 76],
        [88, 46],
        [150, 22],
        [212, 46],
        [280, 76],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="9" fill="url(#rc-pearl)" stroke="#8a6320" strokeWidth="2" />
      ))}
      {/* small cross on the centre tip */}
      <path d="M150 0 v16 M143 6 h14" stroke="#e9c768" strokeWidth="5" strokeLinecap="round" />

      {/* big centre jewel */}
      <path d="M150 92 l15 22 -15 22 -15 -22 z" fill="url(#rc-ruby)" stroke="#4d3309" strokeWidth="2.5" />
      <path d="M150 98 l5 8" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />

      {/* jewelled band */}
      <rect x="30" y="196" width="240" height="26" rx="4" fill="url(#rc-gold)" stroke="#4d3309" strokeWidth="2.5" />
      {[52, 86, 120, 150, 180, 214, 248].map((x, i) => (
        <circle key={x} cx={x} cy="209" r={i === 3 ? 8 : 6} fill={i % 2 === 0 ? "url(#rc-ruby)" : "url(#rc-sapphire)"} stroke="#4d3309" strokeWidth="1.5" />
      ))}

      {/* ermine cuff */}
      <path d="M26 222 H274 Q282 222 280 238 Q278 254 262 254 H38 Q22 254 20 238 Q18 222 26 222 Z" fill="#faf6ec" stroke="#8a7a58" strokeWidth="2" />
      {[
        [56, 240],
        [100, 244],
        [150, 240],
        [200, 244],
        [244, 240],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 8} l4 14 l-4 -3 l-4 3 z`} fill="#2b2420" />
      ))}
    </svg>
  );
}
