import { ZODIAC } from "@/components/ui";

const INNER_PLANETS = ["☉", "☽", "♀", "♂", "♃", "♄", "♅"];

/** Decorative orbiting zodiac wheel for the landing hero (figma ZodiacWheelMark). */
export function ZodiacWheelMark() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* outer ring — slow orbit */}
      <div className="animate-orbit absolute inset-0">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <defs>
            <radialGradient id="zwm-rg1" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#4A2D9E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="195" fill="url(#zwm-rg1)" />
          <circle cx="200" cy="200" r="190" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.4" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.3" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.25" />
          {ZODIAC.map((z, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = 200 + Math.cos(angle) * 160;
            const y1 = 200 + Math.sin(angle) * 160;
            const x2 = 200 + Math.cos(angle) * 190;
            const y2 = 200 + Math.sin(angle) * 190;
            const gx = 200 + Math.cos(angle + Math.PI / 12) * 175;
            const gy = 200 + Math.sin(angle + Math.PI / 12) * 175;
            return (
              <g key={z.key}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.4" opacity="0.5" />
                <text
                  x={gx}
                  y={gy}
                  fontSize="14"
                  fill="#C9A84C"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity="0.9"
                >
                  {z.glyph}
                </text>
              </g>
            );
          })}
          <g transform="translate(200 200)">
            <circle r="40" fill="none" stroke="#E8C97A" strokeWidth="0.6" opacity="0.6" />
            <circle r="3" fill="#E8C97A" />
          </g>
        </svg>
      </div>

      {/* inner planets — faster, counter-rotating */}
      <div className="absolute inset-[18%] [animation:orbit_40s_linear_infinite_reverse]">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          {INNER_PLANETS.map((g, i) => {
            const angle = (i / 7) * Math.PI * 2;
            const x = 200 + Math.cos(angle) * 130;
            const y = 200 + Math.sin(angle) * 130;
            return (
              <g key={g}>
                <circle cx={x} cy={y} r="14" fill="#0A0A0F" stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="0.5" />
                <text x={x} y={y + 5} fontSize="14" fill="#E8C97A" textAnchor="middle">
                  {g}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* center motif */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="label-caps text-[var(--gold)]/80">Anno Stellarum</p>
          <p className="font-display gold-text mt-2 text-6xl">XII</p>
        </div>
      </div>
    </div>
  );
}
