import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLab } from '../designs/store'
import { catalogList } from '../catalog'

const ROUTES = [
  ['/', 'Lab', 'Home bench with the current design'],
  ['/workbench', 'Workbench', 'Full 3D workbench'],
  ['/designs', 'Designs', 'All designs and versions'],
  ['/parts', 'Parts', 'Hardware library'],
  ['/tutorial', 'Tutorial', 'Hardware and software tracks'],
  ['/docs', 'Docs', '3D controls, shortcuts, data format'],
  ['/about', 'About', 'Credits and licenses'],
] as const

export function CommandPalette() {
  const open = useLab((s) => s.paletteOpen)
  const setOpen = useLab((s) => s.setPaletteOpen)
  const requestFocus = useLab((s) => s.requestFocus)
  const design = useLab((s) => s.design)
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!useLab.getState().paletteOpen)
      } else if (e.key === 'Escape' && useLab.getState().paletteOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const pages = ROUTES.map(([to, title, hint]) => ({ kind: 'Page', title, hint, run: () => navigate(to) }))
    const parts = catalogList.map((c) => ({ kind: 'Part', title: c.name, hint: c.summary ?? c.category, run: () => navigate(`/parts/${c.id}`) }))
    const placed = design.build.placements.map((p) => ({
      kind: 'In design',
      title: p.label ?? p.instanceId,
      hint: 'Focus in the Workbench',
      run: () => {
        navigate('/workbench')
        setTimeout(() => requestFocus(p.instanceId), 150)
      },
    }))
    const all = [...pages, ...placed, ...parts]
    if (!needle) return all.slice(0, 12)
    return all.filter((i) => `${i.title} ${i.hint} ${i.kind}`.toLowerCase().includes(needle)).slice(0, 14)
  }, [q, navigate, design, requestFocus])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" className="absolute inset-0 bg-ink/25" aria-label="Close search" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-card border border-line bg-bg-elev shadow-float">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0) }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
            if (e.key === 'Enter' && items[active]) { items[active].run(); setOpen(false) }
          }}
          placeholder="Jump to a page, a part, or a part in the current design…"
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-ink-3"
        />
        <ul className="max-h-[50vh] overflow-auto py-2">
          {items.length === 0 && <li className="px-4 py-3 text-[14px] text-ink-3">Nothing matches.</li>}
          {items.map((it, i) => (
            <li key={`${it.kind}-${it.title}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => { it.run(); setOpen(false) }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left ${i === active ? 'bg-bg-sunken' : ''}`}
              >
                <span className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{it.kind}</span>
                <span className="truncate text-[14px] text-ink">{it.title}</span>
                <span className="ml-auto truncate pl-3 text-[12px] text-ink-3">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[12px] text-ink-3">
          <span><kbd>↑</kbd> <kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
