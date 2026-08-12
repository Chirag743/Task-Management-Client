import { Link } from 'react-router-dom'
import { btnPrimary, kicker } from '../utils/tailwindClasses'

function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-md py-8 text-center">
      <p className={kicker}>404</p>
      <h1 className="mt-2 text-[1.75rem] text-ink">Page not found</h1>
      <p className="mt-3 text-sm text-ink-muted">
        The address you entered does not match any page in this application.
      </p>
      <Link to="/" className={`${btnPrimary} mt-6 inline-flex no-underline`}>
        Return home
      </Link>
    </section>
  )
}

export default NotFoundPage
