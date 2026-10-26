import { ButtonLink } from '../ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[700px] px-4 pt-20 text-center sm:px-6">
      <div className="font-display text-[64px] text-ink-3">404</div>
      <h1 className="text-[28px]">Nothing on this bench.</h1>
      <p className="mt-2 text-ink-2">The page you asked for doesn't exist.</p>
      <div className="mt-6"><ButtonLink to="/" variant="primary">Back to the Lab</ButtonLink></div>
    </div>
  )
}
