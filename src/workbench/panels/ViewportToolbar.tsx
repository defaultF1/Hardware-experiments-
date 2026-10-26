import { useLab, type ViewPreset } from '../../designs/store'

const VIEW_LABELS: Array<[ViewPreset, string, string]> = [
  ['iso', 'Iso', '1'],
  ['top', 'Top', '2'],
  ['front', 'Front', '3'],
  ['side', 'Side', '4'],
]

export function ViewportToolbar({ compact = false }: { compact?: boolean }) {
  const explode = useLab((s) => s.explode)
  const setExplode = useLab((s) => s.setExplode)
  const toggleExplode = useLab((s) => s.toggleExplode)
  const autoOrbit = useLab((s) => s.autoOrbit)
  const setAutoOrbit = useLab((s) => s.setAutoOrbit)
  const requestView = useLab((s) => s.requestView)
  const requestReset = useLab((s) => s.requestReset)

  return (
    <>
      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-ctl border border-line bg-bg-elev/95 p-0.5 shadow-float backdrop-blur" role="group" aria-label="Camera views">
          {VIEW_LABELS.map(([id, label, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => requestView(id)}
              className="rounded-[4px] px-2.5 py-1 text-[12px] font-medium text-ink-2 hover:bg-bg-sunken hover:text-ink"
              title={`${label} view (${key})`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={requestReset}
          className="rounded-ctl border border-line bg-bg-elev/95 px-2.5 py-1 text-[12px] font-medium text-ink-2 shadow-float backdrop-blur hover:text-ink"
          title="Fit the whole robot (Home)"
        >
          Fit
        </button>
        <button
          type="button"
          onClick={() => setAutoOrbit(!autoOrbit)}
          aria-pressed={autoOrbit}
          className={`rounded-ctl border px-2.5 py-1 text-[12px] font-medium shadow-float backdrop-blur ${autoOrbit ? 'border-accent/40 bg-[#f6e9e1] text-accent' : 'border-line bg-bg-elev/95 text-ink-2 hover:text-ink'}`}
          title="Auto-orbit when idle (O)"
        >
          {autoOrbit ? 'Orbiting' : 'Orbit'}
        </button>
      </div>

      <div className={`absolute bottom-3 right-3 flex items-center gap-3 rounded-ctl border border-line bg-bg-elev/95 px-3 py-2 shadow-float backdrop-blur ${compact ? 'w-56' : 'w-72'}`}>
        <button
          type="button"
          onClick={toggleExplode}
          className="text-[12px] font-medium text-ink-2 hover:text-ink"
          title="Toggle exploded view (E)"
        >
          Explode
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={explode}
          onChange={(e) => setExplode(parseFloat(e.target.value))}
          className="lab-range"
          aria-label="Explode amount"
        />
        <span className="w-8 text-right font-mono text-[11px] text-ink-3">{Math.round(explode * 100)}%</span>
      </div>
    </>
  )
}
