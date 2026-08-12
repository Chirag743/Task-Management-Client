import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import {
  alertError,
  btnDanger,
  btnGhost,
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

const initialProjectForm = {
  name: '',
  description: '',
}

const initialTaskForm = {
  title: '',
  description: '',
  status: 'pending',
}

function DashboardProjectsPage() {
  const [projects, setProjects] = useState([])
  const [projectForm, setProjectForm] = useState(initialProjectForm)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [expandedProjectId, setExpandedProjectId] = useState(null)
  const [taskFormsByProject, setTaskFormsByProject] = useState({})
  const [editingTaskIdsByProject, setEditingTaskIdsByProject] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingProject, setIsSubmittingProject] = useState(false)
  const [submittingTaskProjectId, setSubmittingTaskProjectId] = useState('')
  const [deletingTaskKey, setDeletingTaskKey] = useState('')
  const [error, setError] = useState('')

  const loadProjects = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/api/project')
      setProjects(Array.isArray(response.data) ? response.data : [])
    } catch (fetchError) {
      setError('Unable to load projects. Please try again.')
      console.error('Error loading projects:', fetchError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchProjects = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await api.get('/api/project')
        if (isMounted) {
          setProjects(Array.isArray(response.data) ? response.data : [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load projects. Please try again.')
        }
        console.error('Error loading projects:', fetchError)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
    }
  }, [])

  const summary = useMemo(() => {
    const totalProjects = projects.length
    const totalTasks = projects.reduce((sum, project) => sum + (project.tasks?.length || 0), 0)
    const completedTasks = projects.reduce(
      (sum, project) =>
        sum + (project.tasks || []).filter((task) => task.status === 'completed').length,
      0,
    )

    return { totalProjects, totalTasks, completedTasks }
  }, [projects])

  const getTaskForm = (projectId) => taskFormsByProject[projectId] || initialTaskForm

  const getEditingTaskId = (projectId) => editingTaskIdsByProject[projectId] || null

  const updateTaskForm = (projectId, changes) => {
    setTaskFormsByProject((current) => ({
      ...current,
      [projectId]: {
        ...getTaskForm(projectId),
        ...changes,
      },
    }))
  }

  const resetProjectTaskForm = (projectId) => {
    setTaskFormsByProject((current) => ({
      ...current,
      [projectId]: initialTaskForm,
    }))

    setEditingTaskIdsByProject((current) => ({
      ...current,
      [projectId]: null,
    }))
  }

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm)
    setEditingProjectId(null)
  }

  const handleProjectSubmit = async (event) => {
    event.preventDefault()

    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      setError('Project name and description are required.')
      return
    }

    setIsSubmittingProject(true)
    setError('')

    try {
      if (editingProjectId) {
        const response = await api.put(`/api/project/${editingProjectId}`, projectForm)
        setProjects((current) =>
          current.map((project) => (project._id === editingProjectId ? response.data : project)),
        )
      } else {
        const response = await api.post('/api/project', projectForm)
        setProjects((current) => [response.data, ...current])
      }

      resetProjectForm()
    } catch (submitError) {
      setError('Unable to save project. Please try again.')
      console.error('Error saving project:', submitError)
    } finally {
      setIsSubmittingProject(false)
    }
  }

  const handleEditProject = (project) => {
    setEditingProjectId(project._id)
    setProjectForm({
      name: project.name || '',
      description: project.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project and all its tasks?')) {
      return
    }

    try {
      await api.delete(`/api/project/${projectId}`)
      setProjects((current) => current.filter((project) => project._id !== projectId))
      if (editingProjectId === projectId) {
        resetProjectForm()
      }
      if (expandedProjectId === projectId) {
        setExpandedProjectId(null)
      }
    } catch (deleteError) {
      setError('Unable to delete project. Please try again.')
      console.error('Error deleting project:', deleteError)
    }
  }

  const handleSaveProjectTask = async (event, projectId) => {
    event.preventDefault()
    const form = getTaskForm(projectId)
    const editingTaskId = getEditingTaskId(projectId)

    if (!form.title.trim()) {
      setError('Task title is required.')
      return
    }

    setSubmittingTaskProjectId(projectId)
    setError('')

    try {
      if (editingTaskId) {
        const response = await api.put(`/api/project/${projectId}/task/${editingTaskId}`, form)
        const updatedTask = response.data
        setProjects((current) =>
          current.map((project) =>
            project._id === projectId
              ? {
                  ...project,
                  tasks: (project.tasks || []).map((task) =>
                    task._id === editingTaskId ? updatedTask : task,
                  ),
                }
              : project,
          ),
        )
      } else {
        const response = await api.post(`/api/project/${projectId}/task`, form)
        const createdTask = response.data
        setProjects((current) =>
          current.map((project) =>
            project._id === projectId
              ? { ...project, tasks: [...(project.tasks || []), createdTask] }
              : project,
          ),
        )
      }

      resetProjectTaskForm(projectId)
    } catch (createTaskError) {
      setError('Unable to save project task. Please try again.')
      console.error('Error saving project task:', createTaskError)
    } finally {
      setSubmittingTaskProjectId('')
    }
  }

  const handleEditProjectTask = (projectId, task) => {
    setExpandedProjectId(projectId)
    updateTaskForm(projectId, {
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
    })

    setEditingTaskIdsByProject((current) => ({
      ...current,
      [projectId]: task._id,
    }))
  }

  const handleDeleteProjectTask = async (projectId, taskId) => {
    if (!window.confirm('Remove this task from the project?')) {
      return
    }

    const taskKey = `${projectId}:${taskId}`
    setDeletingTaskKey(taskKey)
    setError('')

    try {
      await api.delete(`/api/project/${projectId}/task/${taskId}`)
      setProjects((current) =>
        current.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: (project.tasks || []).filter((task) => task._id !== taskId),
              }
            : project,
        ),
      )

      if (getEditingTaskId(projectId) === taskId) {
        resetProjectTaskForm(projectId)
      }
    } catch (deleteTaskError) {
      setError('Unable to delete project task. Please try again.')
      console.error('Error deleting project task:', deleteTaskError)
    } finally {
      setDeletingTaskKey('')
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-rule-light pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={kicker}>Projects</p>
          <h1 className="mt-1 text-[1.75rem] text-ink sm:text-[2rem]">Project workspace</h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
            Group related tasks under named projects.
          </p>
        </div>
        <button type="button" className={btnSecondary} onClick={loadProjects}>
          Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Projects', value: summary.totalProjects },
          { label: 'Tasks', value: summary.totalTasks },
          { label: 'Completed', value: summary.completedTasks },
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
              {editingProjectId ? 'Edit project' : 'New project'}
            </h2>
          </div>

          <form className={`${panelBody} space-y-4`} onSubmit={handleProjectSubmit}>
            <div>
              <label htmlFor="project-name" className={labelClass}>
                Name
              </label>
              <input
                id="project-name"
                type="text"
                className={inputClass}
                value={projectForm.name}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="e.g. Website redesign"
              />
            </div>

            <div>
              <label htmlFor="project-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="project-description"
                rows={4}
                className={`${inputClass} resize-y`}
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="What is this project about?"
              />
            </div>

            {error ? (
              <p className={alertError} role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <button type="submit" disabled={isSubmittingProject} className={btnPrimary}>
                {isSubmittingProject ? (
                  <span className={loaderCompactClass} aria-label="Loading" />
                ) : editingProjectId ? (
                  'Save changes'
                ) : (
                  'Create project'
                )}
              </button>
              {editingProjectId ? (
                <button type="button" className={btnSecondary} onClick={resetProjectForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Your projects</h2>
          </div>

          {isLoading ? (
            <div className="px-5 py-10">
              <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted" aria-label="Loading">
                <span className={loaderClass} />
                <span>Loading…</span>
              </span>
            </div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-serif text-lg text-ink">No projects yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                Create a project using the form on the left.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-rule-light">
              {projects.map((project) => {
                const taskForm = getTaskForm(project._id)
                const editingTaskId = getEditingTaskId(project._id)
                const projectTasks = project.tasks || []
                const isExpanded = expandedProjectId === project._id

                return (
                  <article key={project._id} className="px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-ink">{project.name}</p>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">
                          {project.description}
                        </p>
                        <p className="mt-2 text-xs text-ink-faint">{projectTasks.length} task(s)</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={btnSecondary}
                          onClick={() => setExpandedProjectId(isExpanded ? null : project._id)}
                        >
                          {isExpanded ? 'Collapse' : 'Manage tasks'}
                        </button>
                        <button type="button" className={btnSecondary} onClick={() => handleEditProject(project)}>
                          Edit
                        </button>
                        <button type="button" className={btnDanger} onClick={() => handleDeleteProject(project._id)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="mt-5 border border-rule-light bg-paper-dark p-4">
                        <p className={kicker}>{editingTaskId ? 'Edit task' : 'Add task to project'}</p>

                        <form
                          className="mt-3 grid gap-2 md:grid-cols-[1.1fr_1fr_140px_auto]"
                          onSubmit={(event) => handleSaveProjectTask(event, project._id)}
                        >
                          <input
                            type="text"
                            className={inputClass}
                            value={taskForm.title}
                            onChange={(event) => updateTaskForm(project._id, { title: event.target.value })}
                            placeholder="Task title"
                            aria-label="Task title"
                          />
                          <input
                            type="text"
                            className={inputClass}
                            value={taskForm.description}
                            onChange={(event) =>
                              updateTaskForm(project._id, { description: event.target.value })
                            }
                            placeholder="Description"
                            aria-label="Task description"
                          />
                          <select
                            className={inputClass}
                            value={taskForm.status}
                            onChange={(event) => updateTaskForm(project._id, { status: event.target.value })}
                            aria-label="Task status"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            type="submit"
                            disabled={submittingTaskProjectId === project._id}
                            className={btnPrimary}
                          >
                            {submittingTaskProjectId === project._id ? (
                              <span className={loaderCompactClass} aria-label="Loading" />
                            ) : editingTaskId ? (
                              'Update'
                            ) : (
                              'Add'
                            )}
                          </button>
                        </form>

                        {editingTaskId ? (
                          <button
                            type="button"
                            className={`${btnGhost} mt-2`}
                            onClick={() => resetProjectTaskForm(project._id)}
                          >
                            Cancel edit
                          </button>
                        ) : null}

                        <div className="mt-4 overflow-x-auto border border-rule bg-surface">
                          <div className="min-w-[600px]">
                            <div className={`${tableHead} grid-cols-[1fr_1fr_0.7fr_0.9fr]`}>
                              <span>Task</span>
                              <span>Description</span>
                              <span>Status</span>
                              <span>Actions</span>
                            </div>

                            {projectTasks.length === 0 ? (
                              <p className="px-4 py-5 text-sm text-ink-muted">No tasks in this project yet.</p>
                            ) : (
                              projectTasks.map((task) => (
                                <div key={task._id} className={`${tableRow} grid-cols-[1fr_1fr_0.7fr_0.9fr]`}>
                                  <span className="font-medium text-ink">{task.title}</span>
                                  <span>{task.description || '—'}</span>
                                  <span>
                                    <span
                                      className={`${statusBadgeClass} ${statusColorClasses[task.status] || statusColorClasses.pending}`}
                                    >
                                      {statusLabels[task.status] || 'Pending'}
                                    </span>
                                  </span>
                                  <span className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      className={btnSecondary}
                                      onClick={() => handleEditProjectTask(project._id, task)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className={btnDanger}
                                      disabled={deletingTaskKey === `${project._id}:${task._id}`}
                                      onClick={() => handleDeleteProjectTask(project._id, task._id)}
                                    >
                                      {deletingTaskKey === `${project._id}:${task._id}` ? '…' : 'Delete'}
                                    </button>
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardProjectsPage
