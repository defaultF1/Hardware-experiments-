import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 rounded-ctl font-medium no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50 select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-[#a04a26] border border-transparent',
  secondary: 'bg-bg-elev text-ink border border-line hover:border-line-strong',
  ghost: 'bg-transparent text-ink-2 hover:text-ink hover:bg-bg-sunken border border-transparent',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
}

export function cls(variant: Variant = 'secondary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={cls(variant, size, className)} {...props} />
}

export function ButtonLink({
  to,
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
}: {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={cls(variant, size, className)}>
      {children}
    </Link>
  )
}
