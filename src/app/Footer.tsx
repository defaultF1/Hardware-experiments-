import { Link } from 'react-router'

const COLS = [
  { title: 'Build', links: [['/workbench', 'Workbench'], ['/designs', 'Designs'], ['/parts', 'Parts']] },
  { title: 'Learn', links: [['/tutorial', 'Tutorial'], ['/tutorial#troubleshooting', 'Troubleshooting'], ['/docs', 'Docs']] },
  { title: 'Project', links: [['/about', 'About'], ['https://github.com/defaultF1/Hardware-experiments-', 'GitHub'], ['/about#changelog', 'Changelog']] },
] as const

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-elev">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-xl">SARAS Lab</div>
          <p className="mt-2 max-w-xs text-[14px] text-ink-2">
            Our personal 3D robotics lab. Design it, wire it, check it, test it, then build the real one.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">{col.title}</div>
            <ul className="mt-3 space-y-2 text-[14px]">
              {col.links.map(([to, label]) => (
                <li key={label}>
                  {to.startsWith('http') ? (
                    <a href={to} target="_blank" rel="noreferrer" className="text-ink-2 no-underline hover:text-ink">{label}</a>
                  ) : (
                    <Link to={to} className="text-ink-2 no-underline hover:text-ink">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[13px] text-ink-3 sm:px-6">
          <span>Based on SARAS by Tech With Anant · Content CC BY-SA 4.0 · Code MIT</span>
          <span className="font-mono">v0.1 · M1</span>
        </div>
      </div>
    </footer>
  )
}
