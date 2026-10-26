import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { catalogList, CATEGORY_LABEL } from '../catalog'
import type { Category } from '../catalog/schema'
import { PartViewport } from '../workbench/canvas/PartViewport'
import { Card, Chip } from '../ui/Card'
import { Button } from '../ui/Button'
import { fmtInr, fmtUsd } from '../shared/format'

export function PartsPage() {
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [q, setQ] = useState('')
  const cats = useMemo(() => Array.from(new Set(catalogList.map((c) => c.category))), [])
  const list = useMemo(
    () => catalogList.filter((c) => (cat === 'all' || c.category === cat) && (!q || `${c.name} ${c.tags.join(' ')} ${c.summary ?? ''}`.toLowerCase().includes(q.toLowerCase()))),
    [cat, q],
  )
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[34px]">Parts</h1>
          <p className="mt-1 max-w-xl text-[15px] text-ink-2">The hardware library. Every card is the part's real 3D body, built from its dimensions. The SARAS v1 parts are here; common swaps and your own parts arrive in M3 and M8.</p>
        </div>
        <Button variant="primary" disabled title="Arrives in M8">+ Add a part</Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search parts…"
          className="h-9 w-56 rounded-ctl border border-line bg-bg-elev px-3 text-[14px] outline-none placeholder:text-ink-3 focus:border-line-strong"
          aria-label="Search parts"
        />
        <button type="button" onClick={() => setCat('all')} className={`rounded-full px-3 py-1 text-[13px] ${cat === 'all' ? 'bg-ink text-bg' : 'bg-bg-sunken text-ink-2 hover:text-ink'}`}>All</button>
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-3 py-1 text-[13px] ${cat === c ? 'bg-ink text-bg' : 'bg-bg-sunken text-ink-2 hover:text-ink'}`}>{CATEGORY_LABEL[c]}</button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((c) => (
          <li key={c.id}>
            <Card className="group h-full overflow-hidden">
              <Link to={`/parts/${c.id}`} className="block no-underline">
                <PartViewport component={c} className="aspect-[4/3] w-full" />
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/parts/${c.id}`} className="text-[15px] font-medium leading-snug text-ink no-underline group-hover:text-accent">{c.shortName ?? c.name}</Link>
                  <Chip>{CATEGORY_LABEL[c.category]}</Chip>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] text-ink-2">{c.summary}</p>
                <div className="mt-3 flex items-center justify-between font-mono text-[12px] text-ink-3">
                  <span>{c.body.size.map((n) => Math.round(n)).join('×')} mm</span>
                  <span>{c.price ? `${fmtUsd(c.price.usd ?? 0)} · ${fmtInr(c.price.inr ?? 0)}` : ''}</span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="py-10 text-center text-ink-3">No parts match.</p>}
    </div>
  )
}
