import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useLab } from '../designs/store'
import { catalog, CATEGORY_LABEL } from '../catalog'
import { computeBom } from '../designs/bom'
import type { Placement, Tier } from '../designs/types'
import { Viewport } from '../workbench/canvas/Viewport'
import { ViewportToolbar } from '../workbench/panels/ViewportToolbar'
import { Chip } from '../ui/Card'
import { fmtInr, fmtMass, fmtMm, fmtUsd } from '../shared/format'

const TIER_LABEL: Record<Tier, string> = { head: 'Head', tier2: 'Tier 2', base: 'Base', free: 'Loose' }
const TIER_ORDER: Tier[] = ['head', 'tier2', 'base', 'free']
type Tab = 'bom' | 'wiring' | 'checks' | 'test'

export function WorkbenchPage() {
  const { designId } = useParams()
  const design = useLab((s) => s.design)
  const selectedId = useLab((s) => s.selectedId)
  const setSelected = useLab((s) => s.setSelected)
  const requestFocus = useLab((s) => s.requestFocus)
  const setAutoOrbit = useLab((s) => s.setAutoOrbit)
  const [tab, setTab] = useState<Tab>('bom')
  const [panelOpen, setPanelOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const bom = useMemo(() => computeBom(design.build, catalog), [design])

  useEffect(() => setAutoOrbit(false), [setAutoOrbit])

  const grouped = useMemo(() => {
    const m = new Map<Tier, Placement[]>()
    for (const p of design.build.placements) m.set(p.tier, [...(m.get(p.tier) ?? []), p])
    return TIER_ORDER.filter((t) => m.has(t)).map((t) => [t, m.get(t)!] as const)
  }, [design])

  const selected = design.build.placements.find((p) => p.instanceId === selectedId) ?? null
  const selectedComponent = selected ? catalog[selected.componentId] : null

  return (
    <div className="flex h-[calc(100dvh-64px)] min-h-[560px] flex-col">
      <div className="flex min-h-0 flex-1">
        {/* parts drawer */}
        <aside className={`hidden shrink-0 flex-col border-r border-line bg-bg-elev lg:flex ${drawerOpen ? 'w-64' : 'w-10'}`}>
          <div className="flex h-10 items-center justify-between border-b border-line px-2">
            {drawerOpen && <span className="px-1 text-[12px] font-semibold uppercase tracking-wider text-ink-3">In this design</span>}
            <button type="button" className="rounded-ctl px-1.5 text-ink-3 hover:text-ink" onClick={() => setDrawerOpen((v) => !v)} aria-label={drawerOpen ? 'Collapse parts' : 'Expand parts'}>
              {drawerOpen ? '‹' : '›'}
            </button>
          </div>
          {drawerOpen && (
            <div className="min-h-0 flex-1 overflow-auto p-2">
              {grouped.map(([tier, items]) => (
                <div key={tier} className="mb-3">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{TIER_LABEL[tier]}</div>
                  <ul>
                    {items.map((p) => {
                      const c = catalog[p.componentId]
                      const active = p.instanceId === selectedId
                      return (
                        <li key={p.instanceId}>
                          <button
                            type="button"
                            onClick={() => (active ? requestFocus(p.instanceId) : setSelected(p.instanceId))}
                            onDoubleClick={() => requestFocus(p.instanceId)}
                            className={`flex w-full items-center gap-2 rounded-ctl px-2 py-1.5 text-left text-[13px] ${active ? 'bg-[#f6e9e1] text-accent' : 'text-ink-2 hover:bg-bg-sunken hover:text-ink'}`}
                            title="Click to select, click again to fly to it"
                          >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c?.body.color }} aria-hidden />
                            <span className="truncate">{p.label ?? c?.shortName ?? p.componentId}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              <div className="mt-2 rounded-card border border-dashed border-line-strong p-3 text-[12px] text-ink-3">
                Drag-to-place from the catalog, move/rotate/snap and the chassis sliders arrive in M2.
              </div>
            </div>
          )}
        </aside>

        {/* viewport */}
        <div className="relative min-w-0 flex-1">
          <Viewport build={design.build} className="h-full w-full" overlay={<ViewportToolbar compact />} label={`${design.name} in the Workbench`} />
          {designId && designId !== design.id && (
            <div className="lab-overlay left-3 top-14 rounded-ctl border border-warn/40 bg-[#f8f0dc] px-3 py-1.5 text-[12px] text-ink-2">
              No design called “{designId}” yet. Showing {design.name}.
            </div>
          )}
        </div>

        {/* inspector */}
        <aside className="hidden w-72 shrink-0 flex-col border-l border-line bg-bg-elev xl:flex">
          <div className="flex h-10 items-center border-b border-line px-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Inspector</div>
          <div className="min-h-0 flex-1 overflow-auto p-4 text-[13px]">
            {selected && selectedComponent ? (
              <>
                <div className="text-[16px] font-medium text-ink">{selected.label ?? selectedComponent.name}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Chip>{CATEGORY_LABEL[selectedComponent.category]}</Chip>
                  <Chip>{TIER_LABEL[selected.tier]}</Chip>
                  {selectedComponent.assumed && <Chip tone="warn">assumed</Chip>}
                </div>
                <p className="mt-3 text-ink-2">{selectedComponent.summary}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[12px]">
                  <dt className="text-ink-3">size</dt><dd>{selectedComponent.body.size.map(fmtMm).join(' × ')}</dd>
                  <dt className="text-ink-3">mass</dt><dd>{selectedComponent.massG != null ? fmtMass(selectedComponent.massG) : '—'}</dd>
                  <dt className="text-ink-3">price</dt><dd>{selectedComponent.price ? `${fmtUsd(selectedComponent.price.usd ?? 0)} · ${fmtInr(selectedComponent.price.inr ?? 0)}` : '—'}</dd>
                  <dt className="text-ink-3">position</dt><dd>{selected.position.map((n) => Math.round(n)).join(', ')} mm</dd>
                  <dt className="text-ink-3">rotation</dt><dd>{selected.rotation.join(', ')}°{selected.mirrored ? ' · mirrored' : ''}</dd>
                  {selectedComponent.power?.typicalA != null && (<><dt className="text-ink-3">draw</dt><dd>{selectedComponent.power.typicalA} A typ{selectedComponent.power.maxA ? ` · ${selectedComponent.power.maxA} A max` : ''}</dd></>)}
                  {selectedComponent.power?.providesV != null && (<><dt className="text-ink-3">supplies</dt><dd>{selectedComponent.power.providesV} V · {selectedComponent.power.providesMaxA} A</dd></>)}
                </dl>
                {selectedComponent.gotchas.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Gotchas</div>
                    <ul className="list-disc space-y-1 pl-4 text-ink-2">
                      {selectedComponent.gotchas.map((g) => <li key={g}>{g}</li>)}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => requestFocus(selected.instanceId)} className="rounded-ctl border border-line px-2.5 py-1 text-[12px] hover:border-line-strong">Fly to</button>
                  <Link to={`/parts/${selectedComponent.id}`} className="rounded-ctl border border-line px-2.5 py-1 text-[12px] no-underline hover:border-line-strong">Part page</Link>
                  <button type="button" onClick={() => setSelected(null)} className="ml-auto rounded-ctl px-2 py-1 text-[12px] text-ink-3 hover:text-ink">Clear</button>
                </div>
              </>
            ) : (
              <div className="text-ink-3">
                <p>Click a part in the 3D view or in the list to inspect it. Double-click to fly to it.</p>
                <p className="mt-3">Pins, wiring and checks for the selected part arrive in M4.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* bottom panel */}
      <div className={`shrink-0 border-t border-line bg-bg-elev ${panelOpen ? 'h-56' : 'h-10'}`}>
        <div className="flex h-10 items-center gap-1 overflow-x-auto whitespace-nowrap border-b border-line px-2">
          {(['bom', 'wiring', 'checks', 'test'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setPanelOpen(true) }}
              className={`rounded-ctl px-3 py-1 text-[13px] font-medium ${tab === t && panelOpen ? 'bg-bg-sunken text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              {t === 'bom' ? 'BOM' : t === 'wiring' ? 'Wiring table' : t === 'checks' ? 'Checks' : 'Test console'}
              {t !== 'bom' && <span className="ml-1.5 text-[11px] text-ink-3">{t === 'test' ? 'M5' : 'M4'}</span>}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[12px] text-ink-3 sm:inline">{bom.partCount} parts · {fmtMass(bom.totalMassG)} · {fmtUsd(bom.totalUsd)} · {fmtInr(bom.totalInr)}</span>
          <button type="button" className="ml-2 rounded-ctl px-2 text-ink-3 hover:text-ink" onClick={() => setPanelOpen((v) => !v)} aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}>
            {panelOpen ? '▾' : '▴'}
          </button>
        </div>
        {panelOpen && (
          <div className="h-[calc(100%-2.5rem)] overflow-auto">
            {tab === 'bom' && (
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-bg-elev text-left text-[11px] uppercase tracking-wider text-ink-3">
                  <tr><th className="px-4 py-2 font-semibold">Part</th><th className="px-2 py-2 text-right font-semibold">Qty</th><th className="px-2 py-2 text-right font-semibold">Unit</th><th className="px-2 py-2 text-right font-semibold">Total</th><th className="px-2 py-2 text-right font-semibold">INR</th><th className="px-4 py-2 text-right font-semibold">Mass</th></tr>
                </thead>
                <tbody>
                  {bom.lines.map((l) => (
                    <tr key={l.componentId} className="border-t border-line">
                      <td className="px-4 py-1.5">{l.name}{l.assumed && <span className="ml-2 text-[11px] text-warn">assumed</span>}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{l.qty}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{fmtUsd(l.unitUsd)}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{fmtUsd(l.totalUsd)}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{fmtInr(l.totalInr)}</td>
                      <td className="px-4 py-1.5 text-right font-mono">{fmtMass(l.massG)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-line-strong font-medium">
                    <td className="px-4 py-2">Total (chassis print, standoffs and wire not included)</td>
                    <td className="px-2 py-2 text-right font-mono">{bom.partCount}</td>
                    <td />
                    <td className="px-2 py-2 text-right font-mono">{fmtUsd(bom.totalUsd)}</td>
                    <td className="px-2 py-2 text-right font-mono">{fmtInr(bom.totalInr)}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMass(bom.totalMassG)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {tab !== 'bom' && (
              <div className="p-6 text-[14px] text-ink-2">
                {tab === 'wiring' && 'The wiring table lists every connection (from, pin, to, pin, net, colour, length) and is editable. It arrives with the wire tool in M4.'}
                {tab === 'checks' && 'Checks run the 30 rules from the plan (power rails, polarity, GPIO conflicts, clearance, centre of mass) and highlight failing parts in 3D. M4.'}
                {tab === 'test' && 'The test console drives the robot with keys or a gamepad, pings the ultrasonic sensors against virtual obstacles and meters the power rails. M5.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
