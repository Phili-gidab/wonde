/* Animated blueprint of a tower crane raising a G+5 building.
   Coordinate system: ground line sits at y=302, building spans x 176..344. */

const GROUND = 302
const B_LEFT = 176
const B_RIGHT = 344
const FLOORS = [302, 276, 250, 224, 198, 172, 146]
const COLUMNS = [176, 218, 260, 302, 344]
const WINDOW_X = [186, 218, 250, 282, 314]

const mastRungs = []
for (let y = 78; y < GROUND; y += 28) mastRungs.push(y)

const jibBays = []
for (let x = 76; x < 356; x += 28) jibBays.push(x)

const scaffoldRungs = []
for (let y = 170; y < GROUND; y += 22) scaffoldRungs.push(y)

export default function ConstructionScene() {
  return (
    <div className="scene">
      <svg viewBox="0 0 440 344" role="img" aria-label="በግንባታ ላይ ያለ ሕንጻ እና ክሬን">
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18212e" />
            <stop offset="100%" stopColor="#101722" />
          </linearGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f2a93b" stopOpacity="0" />
            <stop offset="50%" stopColor="#f2a93b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f2a93b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* technical frame corners */}
        <g className="s-frame">
          <path d="M6 26V6h20M414 6h20v20M434 318v20h-20M26 338H6v-20" />
        </g>

        {/* ---- crane ---- */}
        <g className="s-steel">
          {/* lattice mast */}
          <line x1="47" y1="78" x2="47" y2={GROUND} />
          <line x1="73" y1="78" x2="73" y2={GROUND} />
          {mastRungs.map((y) => (
            <g key={y}>
              <line x1="47" y1={y} x2="73" y2={y} />
              <line className="s-thin" x1="47" y1={y} x2="73" y2={y + 28} />
              <line className="s-thin" x1="73" y1={y} x2="47" y2={y + 28} />
            </g>
          ))}
          <rect x="38" y={GROUND - 6} width="44" height="8" />

          {/* cab + apex */}
          <rect x="42" y="56" width="36" height="24" />
          <path d="M60 26 L60 56" />
          <path className="s-thin" d="M60 26 L344 56 M60 26 L20 56" />

          {/* jib truss */}
          <line x1="76" y1="56" x2="356" y2="56" />
          <line x1="76" y1="68" x2="356" y2="68" />
          {jibBays.map((x) => (
            <path className="s-thin" key={x} d={`M${x} 56 L${x + 14} 68 L${x + 28} 56`} />
          ))}

          {/* counter jib + weight */}
          <line x1="16" y1="56" x2="44" y2="56" />
          <line x1="16" y1="68" x2="44" y2="68" />
          <rect className="s-fill" x="12" y="68" width="24" height="16" />
        </g>

        {/* trolley, cable and suspended load */}
        <g className="s-hook">
          <rect className="s-accent-fill" x="266" y="60" width="24" height="8" />
          <line className="s-accent" x1="278" y1="68" x2="278" y2="112" />
          <rect className="s-accent-fill" x="252" y="112" width="52" height="12" />
        </g>

        {/* ---- building: finished lower half ---- */}
        <rect className="s-body" x={B_LEFT} y="198" width={B_RIGHT - B_LEFT} height={GROUND - 198} />
        <g className="s-steel">
          {[198, 224, 250, 276].map((y) => (
            <line key={y} x1={B_LEFT} y1={y} x2={B_RIGHT} y2={y} />
          ))}
          {COLUMNS.map((x) => (
            <line key={x} x1={x} y1="198" x2={x} y2={GROUND} />
          ))}
        </g>

        {/* lit windows on the two completed floors */}
        <g className="s-glass">
          {[258, 284].map((y) =>
            WINDOW_X.map((x, i) => (
              <rect
                className="s-win"
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="20"
                height="12"
                style={{ animationDelay: `${(i + (y > 270 ? 5 : 0)) * 0.42}s` }}
              />
            )),
          )}
          {[206, 232].map((y) =>
            WINDOW_X.map((x) => (
              <rect className="s-win-off" key={`${x}-${y}`} x={x} y={y} width="20" height="12" />
            )),
          )}
        </g>

        {/* ---- building: unfinished blueprint floors ---- */}
        <g className="s-dash">
          <path d={`M${B_LEFT} 198 L${B_LEFT} 146 L${B_RIGHT} 146 L${B_RIGHT} 198`} />
          <line x1={B_LEFT} y1="172" x2={B_RIGHT} y2="172" />
          {COLUMNS.map((x) => (
            <line key={x} x1={x} y1="146" x2={x} y2="198" />
          ))}
        </g>

        {/* rebar poking above the top slab */}
        <g className="s-accent">
          {[186, 204, 232, 268, 296, 324].map((x) => (
            <line key={x} x1={x} y1="146" x2={x} y2={x % 2 === 0 ? 134 : 138} />
          ))}
        </g>

        {/* ---- scaffold tower ---- */}
        <g className="s-scaffold">
          <line x1="152" y1="170" x2="152" y2={GROUND} />
          <line x1={B_LEFT} y1="170" x2={B_LEFT} y2={GROUND} />
          {scaffoldRungs.map((y, i) => (
            <g key={y}>
              <line x1="152" y1={y} x2={B_LEFT} y2={y} />
              <line
                className="s-thin"
                x1={i % 2 ? B_LEFT : 152}
                y1={y}
                x2={i % 2 ? 152 : B_LEFT}
                y2={y + 22}
              />
            </g>
          ))}
          <line x1="144" y1="192" x2="196" y2="192" />
          <line x1="144" y1="258" x2="196" y2="258" />
        </g>

        {/* progress sweep climbing the facade */}
        <rect className="s-sweep" x={B_LEFT} y="0" width={B_RIGHT - B_LEFT} height="3" fill="url(#beam)" />

        {/* ---- ground + dimension line ---- */}
        <line className="s-ground" x1="8" y1={GROUND} x2="432" y2={GROUND} />
        <g className="s-dim">
          <line x1={B_LEFT} y1="322" x2={B_RIGHT} y2="322" />
          <line x1={B_LEFT} y1="316" x2={B_LEFT} y2="328" />
          <line x1={B_RIGHT} y1="316" x2={B_RIGHT} y2="328" />
          <rect className="s-dim-plate" x="238" y="313" width="44" height="18" />
          <text x="260" y="326">G+5</text>
        </g>
      </svg>
    </div>
  )
}
