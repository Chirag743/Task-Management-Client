import { NavLink, Outlet } from 'react-router-dom'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/tasks', label: 'Tasks' },
  { to: '/dashboard/my-profile', label: 'My Profile' },
]

function DashboardLayout() {
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="border border-slate-300 bg-white p-4 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">TaskFlow</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Clean task boards for steady daily work.
          </p>
        </div>

        <nav className="mt-4 flex flex-col gap-2" aria-label="Dashboard navigation">
          {dashboardLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'border px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-white',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Status</p>
          <p className="mt-1">All boards synced. No overdue items.</p>
        </div>
      </aside>

      <section className="border border-slate-300 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Dashboard
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Overview, task list, and profile settings.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default DashboardLayout
