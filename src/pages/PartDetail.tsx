import { Link, useParams } from 'react-router'
import { catalog, CATEGORY_LABEL } from '../catalog'
import { useLab } from '../designs/store'
import { PartViewport } from '../workbench/canvas/PartViewport'
import { Callout, Card, Chip } from '../ui/Card'
import { fmtInr, fmtMass, fmtMm, fmtUsd } from '../shared/format'
import { NotFoundPage } from './NotFound'

export function PartDetailPage() {
  const { partId = '' } = useParams()
  const c = catalog[partId]
  const design = useLab((s) => s.design)
  if (!c) return <NotFoundPage />
  const usedIn = design.build.placements.filter((p) => p.componentId === c.id)

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
      <nav className="mb-4 text-[13px] text-ink-3" aria-label="Breadcrumb">
        <Link to="/parts" className="text-ink-3 no-underline hover:text-ink">Parts</Link> <span className="mx-1">/</span> {CATEGORY_LABEL[c.category]}
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
        <div>
          <PartViewport component={c} interactive className="h-[52vh] min-h-[380px] overflow-hidden rounded-hero border border-line shadow-float" />
          <p className="mt-2 text-[13px] text-ink-3">Drag to rotate, scroll to zoom. Pin markers and the footprint toggle arrive in M4.</p>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip>{CATEGORY_LABEL[c.category]}</Chip>
            {c.role && <Chip tone="info">{c.role}</Chip>}
            {c.assumed && <Chip tone="warn">assumed model</Chip>}
          </div>
          <h1 className="mt-2 text-[32px] leading-tight">{c.name}</h1>
          <p className="mt-3 text-[15px] text-ink-2">{c.summary}</p>

          <Card className="mt-5 p-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
              <dt className="text-ink-3">Size</dt><dd className="font-mono">{c.body.size.map(fmtMm).join(' × ')}</dd>
              <dt className="text-ink-3">Mass</dt><dd className="font-mono">{c.massG != null ? fmtMass(c.massG) : '—'}</dd>
              <dt className="text-ink-3">Price</dt><dd className="font-mono">{c.price ? `${fmtUsd(c.price.usd ?? 0)} · ${fmtInr(c.price.inr ?? 0)}` : '—'}{c.price && <span className="ml-2 text-[12px] text-ink-3">updated {c.price.updated}</span>}</dd>
              {c.power?.supplyV && (<><dt className="text-ink-3">Supply</dt><dd className="font-mono">{c.power.supplyV.min}–{c.power.supplyV.max} V</dd></>)}
              {c.power?.typicalA != null && (<><dt className="text-ink-3">Draw</dt><dd className="font-mono">{c.power.typicalA} A typ{c.power.maxA ? ` · ${c.power.maxA} A max` : ''}</dd></>)}
              {c.power?.providesV != null && (<><dt className="text-ink-3">Provides</dt><dd className="font-mono">{c.power.providesV} V · up to {c.power.providesMaxA} A{c.power.capacityWh ? ` · ${c.power.capacityWh} Wh` : ''}</dd></>)}
              <dt className="text-ink-3">Tags</dt><dd className="flex flex-wrap gap-1">{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</dd>
            </dl>
          </Card>

          {c.gotchas.length > 0 && (
            <Callout kind="build" title="Known gotchas">
              <ul className="list-disc space-y-1 pl-4">{c.gotchas.map((g) => <li key={g}>{g}</li>)}</ul>
            </Callout>
          )}

          <h2 className="mt-8 text-[18px]">Used in {design.name}</h2>
          {usedIn.length === 0 ? (
            <p className="mt-1 text-[14px] text-ink-3">Not placed in the current design.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-[14px]">
              {usedIn.map((p) => (
                <li key={p.instanceId} className="flex items-center justify-between rounded-ctl bg-bg-sunken px-3 py-1.5">
                  <span>{p.label}</span>
                  <Link to="/workbench" className="text-[13px] text-accent no-underline" onClick={() => useLab.getState().requestFocus(p.instanceId)}>Show in Workbench →</Link>
                </li>
              ))}
            </ul>
          )}
          {c.assumed && (
            <Callout kind="warning" title="Assumed">
              The videos do not name the exact model, so dimensions and ratings here are typical values. Verify against the unit you own; the part page will carry a datasheet link in M3.
            </Callout>
          )}
        </div>
      </div>
    </div>
  )
}
