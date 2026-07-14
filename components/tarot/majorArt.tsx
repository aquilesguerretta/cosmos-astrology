"use client";

/* Unique line-art scenes for the 22 Major Arcana.
   Local canvas: 100 × 140 (center ≈ 50,70). Stroke-only, gold palette.
   TarotCardArt translates this into the card's center panel. */

const GOLD = "#E8C97A";
const DIM = "#C9A84C";

const S = {
  fill: "none",
  stroke: GOLD,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const S2 = { ...S, stroke: DIM, strokeWidth: 1.2 };

function Rays({ cx, cy, r1, r2, n, rot = 0, stroke = GOLD, w = 1.3 }: { cx: number; cy: number; r1: number; r2: number; n: number; rot?: number; stroke?: string; w?: number }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const a = ((i / n) * Math.PI * 2) + rot;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
            stroke={stroke} strokeWidth={w} strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Star8({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <Rays cx={cx} cy={cy} r1={3} r2={r} n={4} rot={0} w={1.7} />
      <Rays cx={cx} cy={cy} r1={3} r2={r * 0.62} n={4} rot={Math.PI / 4} w={1.3} stroke={DIM} />
      <circle cx={cx} cy={cy} r={2.4} fill={GOLD} stroke="none" />
    </g>
  );
}

function MiniCup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-7 0 H7 M-7 0 C-7 7 7 7 7 0 M0 6.4 V11 M-4.6 12.6 H4.6" {...S} strokeWidth={1.5} />
    </g>
  );
}

function pentagramPoints(cx: number, cy: number, r: number, startDeg: number): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const a = ((startDeg + i * 144) * Math.PI) / 180;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts.map((p) => p.join(",")).join(" ");
}

export function MajorScene({ n }: { n: number }) {
  switch (n) {
    case 0: // The Fool — cliff edge, bindle, white rose, small sun
      return (
        <g>
          <circle cx={80} cy={24} r={7} {...S2} />
          <Rays cx={80} cy={24} r1={9} r2={13} n={8} stroke={DIM} w={1} />
          <path d="M14 112 H50 L50 126 H14" {...S} />
          <path d="M22 118 H42 M20 124 H34" {...S2} strokeWidth={0.9} />
          <path d="M34 100 L70 58" {...S} strokeWidth={1.8} />
          <circle cx={70} cy={58} r={6.5} {...S} />
          <circle cx={26} cy={102} r={3} {...S} />
          <path d="M23 99 Q26 96 29 99 M23 105 Q26 108 29 105" {...S2} strokeWidth={1} />
        </g>
      );
    case 1: // The Magician — lemniscate, raised wand, table of four suits
      return (
        <g>
          <path d="M36 24 C36 16 50 16 50 24 C50 32 64 32 64 24 C64 16 50 16 50 24 C50 32 36 32 36 24" {...S} />
          <path d="M50 38 V78" {...S} strokeWidth={1.8} />
          <circle cx={50} cy={36} r={1.8} fill={GOLD} stroke="none" />
          <path d="M18 96 H82 M24 96 V112 M76 96 V112" {...S} />
          <path d="M28 88 L34 82 M31 91 L37 85" {...S2} strokeWidth={1.3} />
          <path d="M44 84 H56 M44 84 C44 90 56 90 56 84 M50 89 V92" {...S2} strokeWidth={1.3} />
          <path d="M66 82 V92 M62 90 H70" {...S2} strokeWidth={1.3} />
          <circle cx={80} cy={87} r={5} {...S2} strokeWidth={1.2} />
        </g>
      );
    case 2: // High Priestess — pillars, veil, scroll, crescent
      return (
        <g>
          <path d="M20 34 V108 M27 34 V108 M17 34 H30 M17 108 H30" {...S} />
          <path d="M73 34 V108 M80 34 V108 M70 34 H83 M70 108 H83" {...S} />
          <path d="M27 44 C40 56 60 56 73 44" {...S2} />
          <path d="M27 52 C40 64 60 64 73 52" {...S2} strokeWidth={0.9} />
          <path d="M42 72 H58 V82 H42 Z" {...S} />
          <circle cx={42} cy={77} r={2.6} {...S2} strokeWidth={1} />
          <circle cx={58} cy={77} r={2.6} {...S2} strokeWidth={1} />
          <path d="M56 112 A11 11 0 1 1 56 124 A8.6 8.6 0 1 0 56 112" {...S} transform="translate(-6 -2)" />
        </g>
      );
    case 3: // The Empress — venus shield, wheat, crown of stars
      return (
        <g>
          {[26, 38, 50, 62, 74].map((x, i) => (
            <circle key={i} cx={x} cy={i % 2 ? 26 : 22} r={1.6} fill={GOLD} stroke="none" />
          ))}
          <path d="M50 100 C36 90 30 76 40 68 C46 63 50 68 50 73 C50 68 54 63 60 68 C70 76 64 90 50 100 Z" {...S} />
          <circle cx={50} cy={76} r={5.4} {...S2} />
          <path d="M50 81.4 V88 M46.8 85 H53.2" {...S2} />
          <path d="M20 116 C22 96 22 82 20 64" {...S} />
          <path d="M20 72 L14 66 M20 72 L26 66 M20 84 L14 78 M20 84 L26 78 M20 96 L14 90 M20 96 L26 90" {...S2} strokeWidth={1.1} />
          <path d="M80 116 C78 96 78 82 80 64" {...S} />
          <path d="M80 72 L74 66 M80 72 L86 66 M80 84 L74 78 M80 84 L86 78 M80 96 L74 90 M80 96 L86 90" {...S2} strokeWidth={1.1} />
        </g>
      );
    case 4: // The Emperor — throne, ram horns, orb
      return (
        <g>
          <path d="M30 44 H70 M30 44 V108 M70 44 V108 M24 108 H76" {...S} />
          <path d="M30 44 C21 44 18 35 25 30 C30 27 34 32 30 36" {...S} />
          <path d="M70 44 C79 44 82 35 75 30 C70 27 66 32 70 36" {...S} />
          <path d="M36 108 V118 M64 108 V118" {...S2} />
          <circle cx={50} cy={78} r={7} {...S} />
          <path d="M50 71 V64 M46.5 67.5 H53.5" {...S} />
          <path d="M36 92 H64" {...S2} />
        </g>
      );
    case 5: // Hierophant — triple cross, crossed keys
      return (
        <g>
          <path d="M50 26 V100" {...S} strokeWidth={1.9} />
          <path d="M39 38 H61 M35 52 H65 M30 66 H70" {...S} />
          <circle cx={36} cy={114} r={5.4} {...S} />
          <path d="M40 110 L54 96 M50 100 L54 104 M46 104 L49 107" {...S2} />
          <circle cx={64} cy={114} r={5.4} {...S} />
          <path d="M60 110 L46 96 M50 100 L46 104 M54 104 L51 107" {...S2} />
        </g>
      );
    case 6: // The Lovers — radiant sun above two interlocked rings
      return (
        <g>
          <circle cx={50} cy={28} r={9} {...S} />
          <Rays cx={50} cy={28} r1={11.5} r2={17} n={10} stroke={DIM} w={1.1} />
          <circle cx={41} cy={82} r={15} {...S} />
          <circle cx={59} cy={82} r={15} {...S} />
          <path d="M50 78 C47 75 43 76 43 80 C43 83 47 86 50 88 C53 86 57 83 57 80 C57 76 53 75 50 78 Z" fill={GOLD} stroke="none" opacity={0.9} />
        </g>
      );
    case 7: // The Chariot — canopy of stars, body, wheels, winged emblem
      return (
        <g>
          <path d="M26 34 H74 M28 34 V62 M72 34 V62" {...S} />
          {[36, 50, 64].map((x) => (
            <circle key={x} cx={x} cy={27} r={1.5} fill={GOLD} stroke="none" />
          ))}
          <path d="M28 62 H72 V96 H28 Z" {...S} />
          <circle cx={35} cy={106} r={9} {...S} />
          <path d="M35 97 V115 M26 106 H44 M29 100 L41 112 M41 100 L29 112" {...S2} strokeWidth={1} />
          <circle cx={65} cy={106} r={9} {...S} />
          <path d="M65 97 V115 M56 106 H74 M59 100 L71 112 M71 100 L59 112" {...S2} strokeWidth={1} />
          <circle cx={50} cy={76} r={4.4} {...S} />
          <path d="M45.6 76 C38 70 34 74 32 78 M54.4 76 C62 70 66 74 68 78" {...S2} />
        </g>
      );
    case 8: // Strength — lemniscate above a gentle lion
      return (
        <g>
          <path d="M38 24 C38 17 50 17 50 24 C50 31 62 31 62 24 C62 17 50 17 50 24 C50 31 38 31 38 24" {...S} />
          <circle cx={50} cy={82} r={17} {...S} />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const x1 = 50 + Math.cos(a) * 19;
            const y1 = 82 + Math.sin(a) * 19;
            const x2 = 50 + Math.cos(a) * 25;
            const y2 = 82 + Math.sin(a) * 25;
            return <path key={i} d={`M${x1} ${y1} Q${x1 + (x2 - x1) * 0.5 + 2} ${y1 + (y2 - y1) * 0.5} ${x2} ${y2}`} {...S2} strokeWidth={1.2} />;
          })}
          <path d="M42 78 Q45 80 48 78 M52 78 Q55 80 58 78" {...S} strokeWidth={1.3} />
          <circle cx={50} cy={90} r={4.6} {...S2} />
          <path d="M47 96 Q50 99 53 96" {...S2} strokeWidth={1.2} />
        </g>
      );
    case 9: // The Hermit — lantern with a six-point spark, staff, rays
      return (
        <g>
          <path d="M70 26 V118" {...S} strokeWidth={1.8} />
          <circle cx={70} cy={24} r={2.4} {...S2} />
          <path d="M32 46 L46 46 L50 56 L50 76 L28 76 L28 56 Z" {...S} />
          <path d="M35 40 H43 M39 40 V46" {...S2} />
          <path d="M39 60 L42 66 L39 72 L36 66 Z" fill={GOLD} stroke="none" />
          <path d="M22 84 L14 92 M39 82 V94 M54 84 L62 92" {...S2} strokeWidth={1.1} />
          <path d="M16 118 H60" {...S2} />
        </g>
      );
    case 10: // Wheel of Fortune — eight-spoked wheel, rising/falling marks
      return (
        <g>
          <circle cx={50} cy={72} r={27} {...S} />
          <circle cx={50} cy={72} r={10} {...S} />
          <Rays cx={50} cy={72} r1={10} r2={27} n={8} w={1.3} />
          <circle cx={50} cy={72} r={2.2} fill={GOLD} stroke="none" />
          <path d="M83 66 L88 74 L78 74 Z" fill={GOLD} stroke="none" opacity={0.85} />
          <path d="M17 78 L12 70 L22 70 Z" {...S2} strokeWidth={1.2} />
          {[[50, 34], [50, 110], [21, 45], [79, 45]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.5} fill={DIM} stroke="none" />
          ))}
        </g>
      );
    case 11: // Justice — sword behind balanced scales
      return (
        <g>
          <path d="M50 22 V98" {...S} strokeWidth={1.8} />
          <path d="M50 22 L46 30 M50 22 L54 30" {...S} />
          <path d="M41 96 H59 M50 98 V106" {...S} />
          <path d="M50 40 L26 52 M50 40 L74 52" {...S2} />
          <path d="M26 52 L20 66 M26 52 L32 66 M17 66 A9 9 0 0 0 35 66" {...S} />
          <path d="M74 52 L68 66 M74 52 L80 66 M65 66 A9 9 0 0 0 83 66" {...S} />
        </g>
      );
    case 12: // The Hanged Man — living gallows, inverted figure, halo
      return (
        <g>
          <path d="M26 30 H74 M30 30 V40 M70 30 V40" {...S} />
          <path d="M30 30 L26 24 M70 30 L74 24" {...S2} />
          <path d="M50 30 V44" {...S2} />
          <path d="M50 44 L58 56 M50 44 V78" {...S} strokeWidth={1.8} />
          <path d="M50 58 L41 70 M50 58 L59 70" {...S} />
          <circle cx={50} cy={87} r={7} {...S} />
          <circle cx={50} cy={87} r={12} {...S2} strokeDasharray="3 4" strokeWidth={1.1} />
        </g>
      );
    case 13: // Death — banner pole with the white five-petal rose
      return (
        <g>
          <path d="M32 24 V118" {...S} strokeWidth={1.8} />
          <path d="M32 30 H80 V74 H32" {...S} />
          <circle cx={56} cy={52} r={4.2} {...S} />
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const x = 56 + Math.cos(a) * 8.6;
            const y = 52 + Math.sin(a) * 8.6;
            return <circle key={i} cx={x} cy={y} r={3.6} {...S2} strokeWidth={1.2} />;
          })}
          <path d="M56 62 C54 74 58 82 56 92" {...S2} />
          <path d="M56 74 Q48 72 46 66 M56 82 Q64 80 66 74" {...S2} strokeWidth={1.1} />
        </g>
      );
    case 14: // Temperance — water poured between two cups, wings, triangle
      return (
        <g>
          <path d="M40 22 C32 16 22 18 18 26 M60 22 C68 16 78 18 82 26" {...S2} />
          <MiniCup x={32} y={88} s={1.15} />
          <MiniCup x={68} y={58} s={1.15} />
          <path d="M64 64 C54 70 46 76 36 84" {...S} />
          <path d="M67 66 C57 72 49 78 39 86" {...S2} strokeWidth={1} />
          <path d="M50 108 L57 120 H43 Z" {...S} />
        </g>
      );
    case 15: // The Devil — inverted pentagram, horns, chain
      return (
        <g>
          <circle cx={50} cy={60} r={21} {...S} />
          <polygon points={pentagramPoints(50, 60, 16, 90)} {...S2} strokeWidth={1.3} />
          <path d="M34 44 C28 38 28 30 34 28 M66 44 C72 38 72 30 66 28" {...S} />
          <ellipse cx={36} cy={104} rx={7} ry={4.6} {...S} transform="rotate(-18 36 104)" />
          <ellipse cx={50} cy={109} rx={7} ry={4.6} {...S} />
          <ellipse cx={64} cy={104} rx={7} ry={4.6} {...S} transform="rotate(18 64 104)" />
        </g>
      );
    case 16: // The Tower — struck crown, lightning, falling sparks
      return (
        <g>
          <path d="M38 50 V116 M62 50 V116 M34 116 H66 M38 50 H62" {...S} />
          <path d="M38 66 H62 M38 84 H62 M50 50 V66 M44 66 V84 M56 84 V116" {...S2} strokeWidth={1} />
          <path d="M64 44 L70 34 L74 42 L80 32" {...S} transform="rotate(14 70 38)" />
          <path d="M84 14 L60 42 L70 42 L44 76" fill="none" stroke={GOLD} strokeWidth={2.1} strokeLinejoin="round" />
          {[[28, 62], [24, 84], [74, 70], [80, 92], [32, 104]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q2 4 0 7`} {...S2} strokeWidth={1.3} />
          ))}
        </g>
      );
    case 17: // The Star — the great star, seven small, jug into the pool
      return (
        <g>
          <Star8 cx={50} cy={40} r={19} />
          {[[22, 26], [78, 26], [16, 52], [84, 52], [30, 64], [70, 64], [50, 12]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.5} fill={DIM} stroke="none" />
          ))}
          <circle cx={34} cy={92} r={6} {...S} />
          <path d="M39 88 L46 84" {...S} />
          <path d="M40 95 C46 102 52 108 60 113" {...S} />
          <path d="M24 120 Q34 115 44 120 T64 120 T84 118" {...S2} />
        </g>
      );
    case 18: // The Moon — crescent, falling dew, two towers, the long path
      return (
        <g>
          <path d="M56 22 A16 16 0 1 0 56 54 A12.6 12.6 0 0 1 56 22" {...S} transform="translate(-6 0)" />
          <Rays cx={50} cy={38} r1={19} r2={24} n={12} stroke={DIM} w={1} />
          {[[36, 66], [50, 70], [64, 66]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q2 4 0 7`} {...S2} strokeWidth={1.2} />
          ))}
          <path d="M20 82 H30 V108 H20 Z M24 82 V76 M27 82 V76" {...S2} strokeWidth={1.2} />
          <path d="M70 82 H80 V108 H70 Z M73 82 V76 M76 82 V76" {...S2} strokeWidth={1.2} />
          <path d="M14 122 C30 112 44 122 50 114 C58 104 72 114 86 104" {...S} />
        </g>
      );
    case 19: // The Sun — great radiant face of rays, sunflowers, banner
      return (
        <g>
          <circle cx={50} cy={48} r={16} {...S} />
          <Rays cx={50} cy={48} r1={19} r2={30} n={8} w={1.6} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = ((i + 0.5) / 8) * Math.PI * 2;
            const x1 = 50 + Math.cos(a) * 19;
            const y1 = 48 + Math.sin(a) * 19;
            const x2 = 50 + Math.cos(a) * 27;
            const y2 = 48 + Math.sin(a) * 27;
            const mx = (x1 + x2) / 2 + Math.cos(a + Math.PI / 2) * 3;
            const my = (y1 + y2) / 2 + Math.sin(a + Math.PI / 2) * 3;
            return <path key={i} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} {...S2} strokeWidth={1.2} />;
          })}
          <circle cx={50} cy={48} r={2} fill={GOLD} stroke="none" />
          {[[28, 96], [50, 100], [72, 96]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={3.4} {...S2} strokeWidth={1.2} />
              <Rays cx={x} cy={y} r1={4.6} r2={7} n={8} stroke={DIM} w={0.9} />
            </g>
          ))}
          <path d="M22 118 C36 110 64 124 78 114" {...S} />
        </g>
      );
    case 20: // Judgement — the trumpet, banner with cross, rising arcs
      return (
        <g>
          <path d="M20 30 C24 24 32 24 36 28 M64 24 C70 18 80 20 82 27" {...S2} />
          <path d="M30 46 L70 30 M30 52 L70 62 M30 46 V52 M70 30 L80 26 M70 62 L80 64 M80 26 V64" {...S} />
          <path d="M58 60 V78 H74 V60" {...S} />
          <path d="M66 62 V76 M60 69 H72" {...S2} />
          {[[28, 116], [48, 118], [68, 116]].map(([x, y], i) => (
            <path key={i} d={`M${x - 8} ${y} A8 8 0 0 1 ${x + 8} ${y}`} {...S} />
          ))}
        </g>
      );
    case 21: // The World — the laurel wreath, center star, ribbons
    default:
      return (
        <g>
          <path d="M50 22 C26 32 26 108 50 118" {...S} />
          <path d="M50 22 C74 32 74 108 50 118" {...S} />
          {Array.from({ length: 7 }).map((_, i) => {
            const t = i / 6;
            const y = 32 + t * 76;
            const xl = 50 - (24 - Math.abs(t - 0.5) * 10);
            const xr = 50 + (24 - Math.abs(t - 0.5) * 10);
            return (
              <g key={i}>
                <path d={`M${xl} ${y} l-6 -3 M${xl} ${y} l-6 3`} {...S2} strokeWidth={1.1} />
                <path d={`M${xr} ${y} l6 -3 M${xr} ${y} l6 3`} {...S2} strokeWidth={1.1} />
              </g>
            );
          })}
          <path d="M44 18 L56 26 M56 18 L44 26 M44 114 L56 122 M56 114 L44 122" {...S2} />
          <Star8 cx={50} cy={70} r={13} />
        </g>
      );
  }
}
