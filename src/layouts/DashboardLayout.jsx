import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import {
  btnSecondary,
  kicker,
  loaderClass,
  navLink,
  navLinkActive,
  panel,
  panelBody,
} from '../utils/tailwindClasses'

const dashboardLinks = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/tasks', label: 'Tasks' },
  { to: '/dashboard/projects', label: 'Projects' },
  { to: '/dashboard/my-profile', label: 'Profile' },
]

function DashboardLayout() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.get('/api/user/profile')
        setUserName(response.data?.user?.name || '')
      } catch {
        navigate('/login', { replace: true })
      } finally {
        setIsCheckingAuth(false)
      }
    }

    verifySession()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await api.post('/api/user/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      navigate('/login', { replace: true })
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted" aria-label="Loading">
          <span className={loaderClass} />
          <span>Loading…</span>
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-11 flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-5 lg:grid-cols-[220px_1fr]">
          <aside className={`${panel} flex flex-col`}>
            <div className="border-b border-rule-light px-4 py-5">
              <p className={kicker}>Workspace</p>
              <p className="mt-2 font-serif text-xl font-semibold text-ink">TaskFlow</p>
              {userName ? <p className="mt-1 text-sm text-ink-muted">{userName}</p> : null}
            </div>

            <nav className="flex flex-col py-2" aria-label="Dashboard navigation">
              {dashboardLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => (isActive ? navLinkActive : navLink)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-rule-light p-4">
              <button type="button" className={`${btnSecondary} w-full`} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </aside>

          <section className={`${panel} flex min-h-[calc(100vh-2.5rem)] flex-col`}>
            <div className={`${panelBody} flex-1`}>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
