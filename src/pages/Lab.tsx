import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { useLab } from '../designs/store'
import { catalog } from '../catalog'
import { computeBom } from '../designs/bom'
import { Viewport } from '../workbench/canvas/Viewport'
import { ViewportToolbar } from '../workbench/panels/ViewportToolbar'
import { Button, ButtonLink } from '../ui/Button'
import { Card, Chip } from '../ui/Card'
import { fmtInr, fmtMass, fmtUsd } from '../shared/format'

export function LabPage() {
  const design = useLab((s) => s.design)
  const designs = useLab((s) => s.designs)
  const setAutoOrbit = useLab((s) => s.setAutoOrbit)
  const toggleExplode = useLab((s) => s.toggleExplode)
  const bom = useMemo(() => computeBom(design.build, catalog), [design])

  useEffect(() => {
    if (!useLab.getState().reduceMotion) setAutoOrbit(true)
  }, [setAutoOrbit])

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(300px,1fr)]">
        <section aria-labelledby="bench-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">On the bench</div>
              <h1 id="bench-title" className="text-[34px] sm:text-[40px]">{design.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-ink-2">
              <Chip tone="accent">{design.versionLabel}</Chip>
              <span className="hidden sm:inline">{design.note}</span>
            </div>
          </div>

          <Viewport
            build={design.build}
            className="h-[62vh] min-h-[420px] overflow-hidden rounded-hero border border-line shadow-float"
            overlay={<ViewportToolbar />}
            label="SARAS v1 on the bench"
          />

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink-2">
            <Stat label="Parts" value={String(bom.partCount)} />
            <Stat label="Mass" value={fmtMass(bom.totalMassG)} />
            <Stat label="Est. cost" value={`${fmtUsd(bom.totalUsd)} · ${fmtInr(bom.totalInr)}`} />
            <Stat label="Checks" value="arrive in M4" muted />
            <Stat label="5 V rail" value="budget in M4" muted />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink to="/workbench" variant="primary" size="lg">Open Workbench</ButtonLink>
            <Button size="lg" onClick={toggleExplode}>Explode / assemble</Button>
            <Button size="lg" disabled title="Test mode arrives in M5">Test ▶</Button>
            <Button size="lg" disabled title="Assembly playback arrives in M5">Play</Button>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] text-ink-3">
            Drag to rotate, scroll or pinch to zoom, right-drag to pan. Hover a part for its name, click to select, double-click to fly to it.
            Keyboard: arrows orbit, <kbd>1</kbd>–<kbd>4</kbd> views, <kbd>E</kbd> explode, <kbd>Home</kbd> fit.
          </p>
        </section>

        <aside className="flex flex-col gap-6">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px]">My designs</h2>
              <Button size="sm" disabled title="New designs arrive in M2">+ New</Button>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {designs.map((d) => (
                <li key={d.id}>
                  <Link to={`/workbench/${d.id}`} className="group block no-underline">
                    <Viewport build={d.build} mode="thumbnail" className="aspect-square overflow-hidden rounded-card border border-line" label={`${d.name} thumbnail`} />
                    <div className="mt-2 text-[14px] font-medium text-ink group-hover:text-accent">{d.name}</div>
                    <div className="text-[12px] text-ink-3">{d.versionLabel}</div>
                  </Link>
                </li>
              ))}
              <li className="flex aspect-square items-center justify-center rounded-card border border-dashed border-line-strong text-center text-[12px] text-ink-3">
                Duplicate &amp; compare<br />arrive in M2 / M6
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <h2 className="mb-2 text-[18px]">Recent tests</h2>
            <div className="rounded-card bg-bg-sunken p-4 text-[13px] text-ink-2">
              No test runs yet. Test mode (boot, drive, sensors, power) arrives in M5 and will log here automatically.
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-2 text-[18px]">Quick actions</h2>
            <ul className="space-y-1 text-[14px]">
              <li><Link to="/parts" className="text-ink-2 no-underline hover:text-ink">Browse parts →</Link></li>
              <li><Link to="/tutorial" className="text-ink-2 no-underline hover:text-ink">Read the build plan →</Link></li>
              <li><Link to="/docs" className="text-ink-2 no-underline hover:text-ink">3D controls and shortcuts →</Link></li>
              <li><span className="text-ink-3">Import STL · add part · compare (M2+)</span></li>
            </ul>
          </Card>
        </aside>
      </div>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[22px]">What this lab does</h2>
          <span className="text-[13px] text-ink-3">Milestone status</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Pillar title="Assemble" status="live" text="Real-size parts on a parametric chassis. Orbit, explode, inspect. Drag-to-place and STL import come in M2." />
          <Pillar title="Wire & check" status="M4" text="Pin-to-pin wires that draw themselves and 30 rules that catch the real mistakes: shared power bank, reversed motors, big tyres." />
          <Pillar title="Test" status="M5" text="Boot sequence, drive with keys or a gamepad, ultrasonic pings, power meters, assembly playback." />
          <Pillar title="Compare & record" status="M6" text="Versions side by side in synced 3D, a diff of parts and power, and a notebook of test runs and photos." />
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[12px] uppercase tracking-wider text-ink-3">{label}</span>
      <span className={`font-mono text-[14px] ${muted ? 'text-ink-3' : 'text-ink'}`}>{value}</span>
    </span>
  )
}

function Pillar({ title, status, text }: { title: string; status: string; text: string }) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[18px]">{title}</h3>
        <Chip tone={status === 'live' ? 'pass' : 'neutral'}>{status === 'live' ? 'Live' : status}</Chip>
      </div>
      <p className="text-[14px] text-ink-2">{text}</p>
    </Card>
  )
}
