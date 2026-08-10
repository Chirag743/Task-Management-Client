import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import ClassicLoader from '../../components/ClassicLoader'

const initialFormState = {
  title: '',
  description: '',
  status: 'pending',
}

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

function DashboardTasksPage() {
  const [tasks, setTasks] = useState([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/api/task')
      setTasks(Array.isArray(response.data) ? response.data : [])
    } catch (fetchError) {
      setError('Unable to load tasks. Please try again.')
      console.error('Error loading tasks:', fetchError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

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
  }

  const handleDelete = async (taskId) => {
    const shouldDelete = window.confirm('Delete this task?')

    if (!shouldDelete) {
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

  const formatStatus = (status) => statusLabels[status] || 'Pending'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Create, update, and track your work using a simple, classic task board.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Total', value: counts.total },
          { label: 'Pending', value: counts.pending },
          { label: 'In Progress', value: counts.inProgress },
          { label: 'Completed', value: counts.completed },
        ].map((item) => (
          <article key={item.label} className="border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <section className="border border-slate-200 bg-white p-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {editingTaskId ? 'Edit Task' : 'Add Task'}
            </h2>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="task-description"
                rows="4"
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                placeholder="Add task details"
              />
            </div>

            <div>
              <label htmlFor="task-status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="task-status"
                value={formState.status}
                onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {isSubmitting ? <ClassicLoader /> : editingTaskId ? 'Update Task' : 'Add Task'}
              </button>

              {editingTaskId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Task List</h2>
            <button
              type="button"
              onClick={loadTasks}
              className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Title</span>
                <span>Description</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {isLoading ? (
                <div className="px-4 py-8 text-sm text-slate-600">
                  <ClassicLoader />
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-4 py-8 text-sm text-slate-600">
                  No tasks yet. Add one from the form on the left.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="grid grid-cols-[1.4fr_1.2fr_0.8fr_1fr] items-start px-4 py-4 text-sm text-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500">ID: {task._id}</p>
                      </div>
                      <p className="pr-4 leading-6 text-slate-600">
                        {task.description || 'No description provided.'}
                      </p>
                      <div>
                        <span className="inline-flex border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                          {formatStatus(task.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(task)}
                          className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task._id)}
                          className="border border-slate-800 bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardTasksPage
