import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-card border border-line bg-bg-elev ${className}`} {...props} />
}

export function Chip({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: 'neutral' | 'pass' | 'warn' | 'fail' | 'info' | 'accent'
  className?: string
  children: React.ReactNode
}) {
  const tones = {
    neutral: 'bg-bg-sunken text-ink-2',
    pass: 'bg-[#e4e9dc] text-pass',
    warn: 'bg-[#f3e6c9] text-[#8a5f12]',
    fail: 'bg-[#f0d6d0] text-fail',
    info: 'bg-[#d9e4ec] text-info',
    accent: 'bg-[#f1d9cb] text-accent',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function SectionTitle({ eyebrow, title, hint }: { eyebrow?: string; title: string; hint?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        {eyebrow && <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">{eyebrow}</div>}
        <h2 className="text-[22px]">{title}</h2>
      </div>
      {hint && <div className="text-[13px] text-ink-3">{hint}</div>}
    </div>
  )
}

export function Callout({ kind = 'note', title, children }: { kind?: 'note' | 'warning' | 'build'; title?: string; children: React.ReactNode }) {
  const styles = {
    note: 'border-info/30 bg-[#eef3f6]',
    warning: 'border-warn/40 bg-[#f8f0dc]',
    build: 'border-accent/30 bg-[#f6e9e1]',
  }
  const labels = { note: 'Note', warning: 'Warning', build: 'From the real build' }
  return (
    <div className={`my-4 rounded-card border p-4 text-[14px] ${styles[kind]}`}>
      <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-ink-2">{title ?? labels[kind]}</div>
      <div className="text-ink-2">{children}</div>
    </div>
  )
}
