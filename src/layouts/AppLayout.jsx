import { NavLink, Outlet } from 'react-router-dom'
import {
  btnGhost,
  btnPrimary,
  btnSecondary,
  kicker,
  panel,
  panelBody,
} from '../utils/tailwindClasses'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/login', label: 'Sign in' },
  { to: '/signup', label: 'Register' },
]

function AppLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-8">
        <header className={panel}>
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-xl font-semibold tracking-tight text-ink">TaskFlow</p>
              <p className="text-sm text-ink-muted">Personal task management</p>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
              {links.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? `${btnPrimary} no-underline` : `${btnSecondary} no-underline`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                className={`${btnGhost} hidden sm:inline-flex`}
                onClick={() => window.location.assign('/dashboard')}
              >
                Open workspace →
              </button>
            </nav>
          </div>
        </header>

        <main className={`${panel} mt-4 flex-1`}>
          <div className={panelBody}>
            <Outlet />
          </div>
        </main>

        <footer className={`${kicker} mt-6 text-center`}>TaskFlow — a straightforward place to plan and finish work.</footer>
      </div>
    </div>
  )
}

export default AppLayout
