import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import {
  alertError,
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
  kicker,
  labelClass,
  loaderClass,
  loaderCompactClass,
  panel,
  panelBody,
  panelHeader,
  statusBadgeClass,
  statusColorClasses,
  statusLabels,
  tableHead,
  tableRow,
} from '../../utils/tailwindClasses'

const initialFormState = {
  title: '',
  description: '',
  status: 'pending',
}

const filterOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

function DashboardTasksPage() {
  const [tasks, setTasks] = useState([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = async (filter = statusFilter) => {
    setIsLoading(true)
    setError('')

    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await api.get('/api/task', { params })
      setTasks(Array.isArray(response.data) ? response.data : [])
    } catch (fetchError) {
      setError('Unable to load tasks. Please try again.')
      console.error('Error loading tasks:', fetchError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchTasks = async () => {
      setIsLoading(true)
      setError('')

      try {
        const params = statusFilter !== 'all' ? { status: statusFilter } : {}
        const response = await api.get('/api/task', { params })
        if (isMounted) {
          setTasks(Array.isArray(response.data) ? response.data : [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load tasks. Please try again.')
        }
        console.error('Error loading tasks:', fetchError)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchTasks()

    return () => {
      isMounted = false
    }
  }, [statusFilter])

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return tasks
    }

    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query),
    )
  }, [tasks, searchQuery])

  const counts = useMemo(() => {
    const pending = tasks.filter((task) => task.status === 'pending').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const completed = tasks.filter((task) => task.status === 'completed').length

    return { pending, inProgress, completed, total: tasks.length }
  }, [tasks])

  const resetForm = () => {
    setFormState(initialFormState)
    setEditingTaskId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formState.title.trim()) {
      setError('Task title is required.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (editingTaskId) {
        const response = await api.put(`/api/task/${editingTaskId}`, formState)
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task._id === editingTaskId ? response.data : task)),
        )
      } else {
        const response = await api.post('/api/task', formState)
        setTasks((currentTasks) => [response.data, ...currentTasks])
      }

      resetForm()
    } catch (submitError) {
      setError('Unable to save this task. Please try again.')
      console.error('Error saving task:', submitError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (task) => {
    setEditingTaskId(task._id)
    setFormState({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task permanently?')) {
      return
    }

    try {
      await api.delete(`/api/task/${taskId}`)
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId))
      if (editingTaskId === taskId) {
        resetForm()
      }
    } catch (deleteError) {
      setError('Unable to delete this task. Please try again.')
      console.error('Error deleting task:', deleteError)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return '—'
    }

    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-rule-light pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={kicker}>Tasks</p>
          <h1 className="mt-1 text-[1.75rem] text-ink sm:text-[2rem]">Task list</h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
            Add, edit, and filter your personal tasks.
          </p>
        </div>
        <button type="button" className={btnSecondary} onClick={() => loadTasks(statusFilter)}>
          Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: counts.total },
          { label: 'Pending', value: counts.pending },
          { label: 'In progress', value: counts.inProgress },
          { label: 'Completed', value: counts.completed },
        ].map((stat) => (
          <article key={stat.label} className={`${panel} p-4`}>
            <p className={kicker}>{stat.label}</p>
            <p className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight text-ink">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              {editingTaskId ? 'Edit task' : 'New task'}
            </h2>
          </div>
          <form className={`${panelBody} space-y-4`} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="task-title" className={labelClass}>
                Title
              </label>
              <input
                id="task-title"
                type="text"
                className={inputClass}
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label htmlFor="task-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="task-description"
                rows={4}
                className={`${inputClass} resize-y`}
                value={formState.description}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Optional details"
              />
            </div>

            <div>
              <label htmlFor="task-status" className={labelClass}>
                Status
              </label>
              <select
                id="task-status"
                className={inputClass}
                value={formState.status}
                onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {error ? (
              <p className={alertError} role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <button type="submit" disabled={isSubmitting} className={btnPrimary}>
                {isSubmitting ? (
                  <span className={loaderCompactClass} aria-label="Loading" />
                ) : editingTaskId ? (
                  'Save changes'
                ) : (
                  'Add task'
                )}
              </button>
              {editingTaskId ? (
                <button type="button" className={btnSecondary} onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className={panel}>
          <div className={`${panelHeader} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">All tasks</h2>
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                className={`${inputClass} w-full sm:w-44`}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks…"
                aria-label="Search tasks"
              />
              <select
                className={`${inputClass} w-full sm:w-40`}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className={`${tableHead} grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr]`}>
                <span>Title</span>
                <span>Description</span>
                <span>Status</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              {isLoading ? (
                <div className="px-5 py-10">
                  <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted" aria-label="Loading">
                    <span className={loaderClass} />
                    <span>Loading…</span>
                  </span>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="font-serif text-lg text-ink">No tasks found</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter.'
                      : 'Add a task using the form on the left.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id} className={`${tableRow} grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr]`}>
                    <p className="font-medium text-ink">{task.title}</p>
                    <p className="pr-3 leading-relaxed">{task.description || '—'}</p>
                    <div>
                      <span
                        className={`${statusBadgeClass} ${statusColorClasses[task.status] || statusColorClasses.pending}`}
                      >
                        {statusLabels[task.status] || 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-faint">{formatDate(task.createdAt)}</p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={btnSecondary} onClick={() => handleEdit(task)}>
                        Edit
                      </button>
                      <button type="button" className={btnDanger} onClick={() => handleDelete(task._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardTasksPage
