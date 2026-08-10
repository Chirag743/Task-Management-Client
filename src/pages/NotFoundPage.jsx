import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-md border border-slate-300 bg-white p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-600">The page you are looking for does not exist.</p>
      <Link
        className="mt-5 inline-block border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        to="/"
      >
        Go Home
      </Link>
    </section>
  )
}

export default NotFoundPage
