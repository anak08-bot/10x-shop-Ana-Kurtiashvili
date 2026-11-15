import type { ReactElement } from "react";

/** Decorative backdrop for the hero: a candle-lit palace hall with arches, columns, a chandelier and a red carpet. */

const W = 1200;
const H = 520;
const FLOOR_Y = 395;
const COLS = [60, 245, 430, 770, 955, 1140]; // x centres of the columns
const ARCHES: ReadonlyArray<[number, number]> = [
  [60, 245],
  [245, 430],
  [430, 770],
  [770, 955],
  [955, 1140],
];

/** Chequered marble floor drawn in perspective (rows get taller towards the viewer). */
function Floor() {
  const tiles: ReactElement[] = [];
  const rows = 5;
  const cols = 14;
  const vanishX = W / 2;
  for (let r = 0; r < rows; r++) {
    const t0 = r / rows;
    const t1 = (r + 1) / rows;
    const y0 = FLOOR_Y + (H - FLOOR_Y) * t0 * t0;
    const y1 = FLOOR_Y + (H - FLOOR_Y) * t1 * t1;
    const s0 = 1 + t0 * t0 * 5; // horizontal scale grows with proximity
    const s1 = 1 + t1 * t1 * 5;
    for (let c = 0; c < cols; c++) {
      const u0 = (c - cols / 2) * 62;
      const u1 = (c + 1 - cols / 2) * 62;
      const pts = `${vanishX + u0 * s0},${y0} ${vanishX + u1 * s0},${y0} ${vanishX + u1 * s1},${y1} ${vanishX + u0 * s1},${y1}`;
      tiles.push(<polygon key={`${r}-${c}`} points={pts} fill={(r + c) % 2 === 0 ? "#2a1218" : "#4a2a2a"} opacity="0.9" />);
    }
  }
  return <g>{tiles}</g>;
}

export function PalaceHall({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ph-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0a14" />
          <stop offset="1" stopColor="#4a1522" />
        </linearGradient>
        <linearGradient id="ph-col" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e4f17" />
          <stop offset="0.35" stopColor="#f0d98f" />
          <stop offset="0.65" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#5d4010" />
        </linearGradient>
        <radialGradient id="ph-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#f4b850" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f4b850" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ph-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9a5a" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="ph-carpet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d1229" />
          <stop offset="1" stopColor="#c4122f" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#ph-wall)" />

      {/* arched windows glowing with evening light */}
      {ARCHES.map(([a, b], i) => {
        const inset = 26;
        const x0 = a + inset;
        const x1 = b - inset;
        const mid = (x0 + x1) / 2;
        const top = i === 2 ? 70 : 130;
        return (
          <g key={a}>
            <path d={`M${x0} ${FLOOR_Y} V${top + (x1 - x0) / 2} A${(x1 - x0) / 2} ${(x1 - x0) / 2} 0 0 1 ${x1} ${top + (x1 - x0) / 2} V${FLOOR_Y} Z`} fill="url(#ph-window)" stroke="#c9a24a" strokeWidth="3" />
            <path d={`M${mid} ${top + 8} V${FLOOR_Y} M${x0} ${top + (x1 - x0) / 2 + 40} H${x1}`} stroke="#c9a24a" strokeOpacity="0.45" strokeWidth="2" />
          </g>
        );
      })}

      {/* gilded columns with capitals and bases */}
      {COLS.map((x) => (
        <g key={x}>
          <rect x={x - 17} y="40" width="34" height={FLOOR_Y - 40} fill="url(#ph-col)" />
          <rect x={x - 26} y="28" width="52" height="16" rx="3" fill="#e3bd62" stroke="#4d3309" strokeWidth="2" />
          <rect x={x - 22} y="44" width="44" height="8" fill="#a47a2b" />
          <rect x={x - 26} y={FLOOR_Y - 14} width="52" height="14" rx="2" fill="#e3bd62" stroke="#4d3309" strokeWidth="2" />
          {[-8, 0, 8].map((dx) => (
            <line key={dx} x1={x + dx} y1="56" x2={x + dx} y2={FLOOR_Y - 18} stroke="#4d3309" strokeOpacity="0.28" strokeWidth="2" />
          ))}
        </g>
      ))}

      {/* cornice */}
      <rect x="0" y="14" width={W} height="14" fill="#c9a24a" />
      <rect x="0" y="28" width={W} height="5" fill="#4d3309" />

      <Floor />
      <polygon points={`${W / 2 - 78},${FLOOR_Y} ${W / 2 + 78},${FLOOR_Y} ${W / 2 + 430},${H} ${W / 2 - 430},${H}`} fill="url(#ph-carpet)" />
      <polygon points={`${W / 2 - 78},${FLOOR_Y} ${W / 2 - 66},${FLOOR_Y} ${W / 2 - 360},${H} ${W / 2 - 430},${H}`} fill="#d4af5f" opacity="0.85" />
      <polygon points={`${W / 2 + 78},${FLOOR_Y} ${W / 2 + 66},${FLOOR_Y} ${W / 2 + 360},${H} ${W / 2 + 430},${H}`} fill="#d4af5f" opacity="0.85" />

      {/* chandelier */}
      <g className="hall-glow" transform="translate(0 -34)">
        <circle cx={W / 2} cy="150" r="170" fill="url(#ph-light)" />
        <path d={`M${W / 2} 28 V92`} stroke="#c9a24a" strokeWidth="3" />
        <path d={`M${W / 2 - 80} 130 Q${W / 2} 190 ${W / 2 + 80} 130`} fill="none" stroke="#e3bd62" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${W / 2 - 46} 112 Q${W / 2} 156 ${W / 2 + 46} 112`} fill="none" stroke="#e3bd62" strokeWidth="4" strokeLinecap="round" />
        <circle cx={W / 2} cy="96" r="9" fill="#f0d98f" stroke="#4d3309" strokeWidth="2" />
        {[-80, -40, 0, 40, 80].map((dx) => (
          <g key={dx}>
            <rect x={W / 2 + dx - 3} y={dx === 0 ? 120 : 118 + Math.abs(dx) * 0.04 + (80 - Math.abs(dx)) * 0.1 - 6} width="6" height="14" fill="#fff4d6" />
            <ellipse cx={W / 2 + dx} cy={dx === 0 ? 114 : 112 + (80 - Math.abs(dx)) * 0.1 - 2} rx="4" ry="7" fill="#ffd36b" />
          </g>
        ))}
      </g>
    </svg>
  );
}
