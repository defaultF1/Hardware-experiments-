import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { CommandPalette } from './CommandPalette'
import { PersistentCanvas } from '../workbench/canvas/PersistentCanvas'
import { useLab } from '../designs/store'

export function RootLayout() {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const fullBleed = location.pathname.startsWith('/workbench')
  const setReduceMotion = useLab((s) => s.setReduceMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduceMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [setReduceMotion])

  useEffect(() => {
    if (!fullBleed) window.scrollTo({ top: 0 })
  }, [location.pathname, fullBleed])

  return (
    <div ref={containerRef} className="relative flex min-h-full flex-col">
      <Header />
      <main className={fullBleed ? 'flex min-h-0 flex-1 flex-col' : 'flex-1'}>
        <Outlet />
      </main>
      {!fullBleed && <Footer />}
      <CommandPalette />
      <PersistentCanvas eventSource={containerRef} />
    </div>
  )
}
