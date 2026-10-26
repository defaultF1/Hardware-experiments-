import { Link } from 'react-router'
import { useLab } from '../designs/store'
import { Viewport } from '../workbench/canvas/Viewport'
import { Card, Chip, SectionTitle } from '../ui/Card'
import { Button } from '../ui/Button'

export function DesignsPage() {
  const designs = useLab((s) => s.designs)
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[34px]">Designs</h1>
          <p className="mt-1 max-w-xl text-[15px] text-ink-2">Every design is a line of versions. Duplicate one, change it, test it, compare it with the original.</p>
        </div>
        <Button variant="primary" disabled title="Arrives in M2">+ New design</Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((d) => (
          <Card key={d.id} className="overflow-hidden">
            <Link to={`/workbench/${d.id}`} className="block no-underline">
              <Viewport build={d.build} mode="thumbnail" className="aspect-[4/3]" label={`${d.name} thumbnail`} />
            </Link>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Link to={`/workbench/${d.id}`} className="text-[17px] font-medium text-ink no-underline hover:text-accent">{d.name}</Link>
                <Chip tone="accent">{d.versionLabel}</Chip>
              </div>
              <p className="mt-1 text-[13px] text-ink-2">{d.note}</p>
              <div className="mt-3 flex gap-2 text-[12px]">
                <Link to={`/workbench/${d.id}`} className="rounded-ctl border border-line px-2.5 py-1 no-underline hover:border-line-strong">Open</Link>
                <button type="button" disabled className="rounded-ctl border border-line px-2.5 py-1 opacity-50" title="M2">Duplicate</button>
                <button type="button" disabled className="rounded-ctl border border-line px-2.5 py-1 opacity-50" title="M6">Compare</button>
              </div>
            </div>
          </Card>
        ))}
        <Card className="flex min-h-[260px] flex-col items-center justify-center border-dashed p-6 text-center text-[14px] text-ink-3">
          <div className="font-display text-[20px] text-ink-2">Coming next</div>
          <p className="mt-2 max-w-xs">M2 adds versions, duplicate, import/export and a LiPo variant. M6 adds side-by-side 3D compare with a parts, mass and power diff.</p>
        </Card>
      </div>
      <section className="mt-14">
        <SectionTitle eyebrow="Roadmap" title="What a design will hold" />
        <div className="prose text-[15px] text-ink-2">
          <p>Chassis parameters or imported STL meshes, part placements, wires, assumptions, and a version note. Autosave keeps a working copy; “Save as version” snapshots it. Test runs and photos attach to the version they were made against.</p>
        </div>
      </section>
    </div>
  )
}
