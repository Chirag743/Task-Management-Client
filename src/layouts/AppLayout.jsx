import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'Signup' },
]

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="border border-slate-300 bg-white px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">TaskFlow</p>
              <p className="text-xs text-slate-500">Simple task management workspace</p>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white'
                  : 'border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100'
              }
            >
              {label}
            </NavLink>
          ))}
            </nav>
          </div>
        </header>

        <main className="mt-4 border border-slate-300 bg-white p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
