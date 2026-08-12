import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  alertError,
  kicker,
  loaderClass,
  panel,
  panelHeader,
  statusBadgeClass,
  statusColorClasses,
  statusLabels,
} from '../../utils/tailwindClasses'

function DashboardHomePage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          api.get('/api/task'),
          api.get('/api/project'),
        ])

        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : [])
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : [])
      } catch (fetchError) {
        setError('Unable to load dashboard data. Please refresh the page.')
        console.error('Error loading dashboard data:', fetchError)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const summary = useMemo(() => {
    const pendingTasks = tasks.filter((task) => task.status === 'pending').length
    const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length
    const completedTasks = tasks.filter((task) => task.status === 'completed').length
    const totalProjectTasks = projects.reduce(
      (total, project) => total + (project.tasks?.length || 0),
      0,
    )

    return {
      totalTasks: tasks.length,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      totalProjects: projects.length,
      totalProjectTasks,
    }
  }, [tasks, projects])

  const recentTasks = tasks.slice(0, 5)
  const recentProjects = projects.slice(0, 4)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-rule-light pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={kicker}>Overview</p>
          <h1 className="mt-1 text-[1.75rem] text-ink sm:text-[2rem]">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
            A summary of your tasks and projects at a glance.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className={`${panel} p-8`}>
          <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted" aria-label="Loading">
            <span className={loaderClass} />
            <span>Loading…</span>
          </span>
        </div>
      ) : null}

      {!isLoading && error ? (
        <p className={alertError} role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total tasks', value: summary.totalTasks, note: 'Personal task list' },
              { label: 'Pending', value: summary.pendingTasks, note: 'Not yet started' },
              { label: 'Projects', value: summary.totalProjects, note: 'Active workspaces' },
              { label: 'Project tasks', value: summary.totalProjectTasks, note: 'Tasks within projects' },
            ].map((stat) => (
              <article key={stat.label} className={`${panel} p-4`}>
                <p className={kicker}>{stat.label}</p>
                <p className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{stat.note}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <section className={panel}>
              <div className={`${panelHeader} flex items-center justify-between`}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Recent tasks</h2>
                <Link
                  to="/dashboard/tasks"
                  className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="font-serif text-lg text-ink">No tasks yet</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                    Create your first task from the Tasks page.
                  </p>
                </div>
              ) : (
                <div>
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex flex-col gap-2 border-b border-rule-light px-5 py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-ink">{task.title}</p>
                        <p className="mt-1 text-sm text-ink-muted">{task.description || 'No description.'}</p>
                      </div>
                      <span
                        className={`${statusBadgeClass} ${statusColorClasses[task.status] || statusColorClasses.pending}`}
                      >
                        {statusLabels[task.status] || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={panel}>
              <div className={`${panelHeader} flex items-center justify-between`}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Projects</h2>
                <Link
                  to="/dashboard/projects"
                  className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                  Manage
                </Link>
              </div>

              {recentProjects.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="font-serif text-lg text-ink">No projects yet</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                    Organize related tasks into projects.
                  </p>
                </div>
              ) : (
                <div>
                  {recentProjects.map((project) => (
                    <div
                      key={project._id}
                      className="border-b border-rule-light px-5 py-4 last:border-b-0"
                    >
                      <p className="font-medium text-ink">{project.name}</p>
                      <p className="mt-1 text-sm text-ink-muted">{project.description}</p>
                      <p className="mt-2 text-xs text-ink-faint">{project.tasks?.length || 0} task(s)</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default DashboardHomePage
