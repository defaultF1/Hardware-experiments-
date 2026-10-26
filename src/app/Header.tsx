import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router'
import { useLab } from '../designs/store'
import { Logo } from '../ui/Logo'

const NAV = [
  { to: '/', label: 'Lab', end: true },
  { to: '/workbench', label: 'Workbench' },
  { to: '/designs', label: 'Designs' },
  { to: '/parts', label: 'Parts' },
  { to: '/tutorial', label: 'Tutorial' },
  { to: '/docs', label: 'Docs' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const design = useLab((s) => s.design)
  const openPalette = useLab((s) => s.setPaletteOpen)
  const onWorkbench = location.pathname.startsWith('/workbench')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <header
      className={`sticky top-0 z-30 h-16 border-b border-line transition-colors ${scrolled || onWorkbench ? 'header-scrolled' : 'bg-bg'}`}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-ink no-underline" aria-label="SARAS Lab home">
          <Logo className="h-7 w-7" />
          <span className="font-display text-[20px] font-semibold tracking-tight">SARAS Lab</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative rounded-ctl px-3 py-2 text-[15px] font-medium no-underline transition-colors hover:text-ink ${
                  isActive ? 'text-ink after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-accent' : 'text-ink-2'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {onWorkbench && (
            <span className="hidden items-center gap-2 rounded-full border border-line bg-bg-elev px-3 py-1 text-[13px] text-ink-2 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-pass" aria-hidden />
              {design.name}
              <span className="text-ink-3">· {design.versionLabel}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => openPalette(true)}
            className="inline-flex h-9 items-center gap-2 rounded-ctl border border-line bg-bg-elev px-3 text-[13px] text-ink-2 hover:border-line-strong hover:text-ink"
            aria-label="Search (command palette)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <a
            href="https://github.com/defaultF1/Hardware-experiments-"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-ctl border border-line bg-bg-elev text-ink-2 hover:border-line-strong hover:text-ink"
            aria-label="GitHub repository"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-ctl border border-line bg-bg-elev text-ink-2 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-ink/20" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 border-l border-line bg-bg-elev p-5 shadow-float">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button type="button" className="rounded-ctl border border-line px-2 py-1 text-sm" onClick={() => setOpen(false)}>Close</button>
            </div>
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `rounded-ctl px-3 py-3 text-[17px] no-underline ${isActive ? 'bg-bg-sunken text-ink' : 'text-ink-2'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
