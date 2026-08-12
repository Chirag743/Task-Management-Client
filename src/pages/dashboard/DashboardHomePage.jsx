import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import ClassicLoader from '../../components/ClassicLoader'

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

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

  const recentTasks = tasks.slice(0, 4)
  const recentProjects = projects.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          A live overview of your workspace with current task and project activity.
        </p>
      </div>

      {isLoading ? (
        <div className="border border-slate-200 bg-white p-6 text-sm text-slate-600">
          <ClassicLoader />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tasks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalTasks}</p>
          <p className="mt-1 text-sm text-slate-600">Total personal tasks</p>
        </article>

        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.pendingTasks}</p>
          <p className="mt-1 text-sm text-slate-600">Waiting to be started</p>
        </article>

        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalProjects}</p>
          <p className="mt-1 text-sm text-slate-600">Active project spaces</p>
        </article>

        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Tasks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalProjectTasks}</p>
          <p className="mt-1 text-sm text-slate-600">Tasks inside projects</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Tasks</h2>
          </div>

          {recentTasks.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-600">No tasks yet.</p>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentTasks.map((task) => (
                <div key={task._id} className="grid gap-2 px-4 py-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-center">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{task.description || 'No description provided.'}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-flex border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                      {statusLabels[task.status] || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Projects</h2>
          </div>

          {recentProjects.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-600">No projects yet.</p>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentProjects.map((project) => (
                <div key={project._id} className="px-4 py-4">
                  <p className="font-medium text-slate-900">{project.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {project.tasks?.length || 0} task(s) attached
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardHomePage
