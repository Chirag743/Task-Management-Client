

import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import ClassicLoader from '../../components/ClassicLoader'

const initialProjectForm = {
  name: '',
  description: '',
}

const initialTaskForm = {
  title: '',
  description: '',
  status: 'pending',
}

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

function DashboardProjectsPage() {
  const [projects, setProjects] = useState([])
  const [projectForm, setProjectForm] = useState(initialProjectForm)
  const [editingProjectId, setEditingProjectId] = useState(null)
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
    loadProjects()
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
  }

  const handleDeleteProject = async (projectId) => {
    const shouldDelete = window.confirm('Delete this project?')

    if (!shouldDelete) {
      return
    }

    try {
      await api.delete(`/api/project/${projectId}`)
      setProjects((current) => current.filter((project) => project._id !== projectId))
      if (editingProjectId === projectId) {
        resetProjectForm()
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
      setError('Task title is required before adding to project.')
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
    const shouldDelete = window.confirm('Delete this task from the project?')

    if (!shouldDelete) {
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

  const formatStatus = (status) => statusLabels[status] || 'Pending'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Manage projects and attach project-specific tasks in a classic workspace layout.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalProjects}</p>
        </article>
        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Tasks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalTasks}</p>
        </article>
        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.completedTasks}</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <section className="border border-slate-200 bg-white p-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {editingProjectId ? 'Edit Project' : 'Create Project'}
            </h2>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleProjectSubmit}>
            <div>
              <label htmlFor="project-name" className="mb-1 block text-sm font-medium text-slate-700">
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={projectForm.name}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                placeholder="Website revamp"
              />
            </div>

            <div>
              <label htmlFor="project-description" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="project-description"
                rows="4"
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, description: event.target.value }))
                }
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                placeholder="Describe this project"
              />
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSubmittingProject}
                className="flex items-center justify-center border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {isSubmittingProject ? (
                  <ClassicLoader />
                ) : editingProjectId ? (
                  'Update Project'
                ) : (
                  'Create Project'
                )}
              </button>

              {editingProjectId ? (
                <button
                  type="button"
                  onClick={resetProjectForm}
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project List</h2>
            <button
              type="button"
              onClick={loadProjects}
              className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="px-4 py-8 text-sm text-slate-600">
              <ClassicLoader />
            </div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-8 text-sm text-slate-600">
              No projects yet. Create your first project using the form.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {projects.map((project) => {
                const taskForm = getTaskForm(project._id)
                const editingTaskId = getEditingTaskId(project._id)
                const projectTasks = project.tasks || []

                return (
                  <article key={project._id} className="space-y-4 px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-slate-900">{project.name}</p>
                        <p className="max-w-2xl text-sm leading-6 text-slate-600">{project.description}</p>
                        <p className="text-xs text-slate-500">{projectTasks.length} task(s) in this project</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditProject(project)}
                          className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project._id)}
                          className="border border-slate-800 bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {editingTaskId ? 'Edit Project Task' : 'Add Task To Project'}
                      </p>

                      <form
                        className="mt-3 grid gap-2 md:grid-cols-[1.2fr_1fr_160px_auto]"
                        onSubmit={(event) => handleSaveProjectTask(event, project._id)}
                      >
                        <input
                          type="text"
                          value={taskForm.title}
                          onChange={(event) => updateTaskForm(project._id, { title: event.target.value })}
                          className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                          placeholder="Task title"
                        />
                        <input
                          type="text"
                          value={taskForm.description}
                          onChange={(event) =>
                            updateTaskForm(project._id, { description: event.target.value })
                          }
                          className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                          placeholder="Task description"
                        />
                        <select
                          value={taskForm.status}
                          onChange={(event) => updateTaskForm(project._id, { status: event.target.value })}
                          className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          type="submit"
                          disabled={submittingTaskProjectId === project._id}
                          className="flex items-center justify-center border border-slate-800 bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600"
                        >
                          {submittingTaskProjectId === project._id ? (
                            <ClassicLoader />
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
                          onClick={() => resetProjectTaskForm(project._id)}
                          className="mt-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Cancel Task Edit
                        </button>
                      ) : null}
                    </div>

                    <div className="overflow-x-auto border border-slate-200 bg-white">
                      <div className="min-w-[640px]">
                        <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_1fr] border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <span>Task</span>
                          <span>Description</span>
                          <span>Status</span>
                          <span>Actions</span>
                        </div>

                        {projectTasks.length === 0 ? (
                          <p className="px-3 py-4 text-sm text-slate-600">No tasks added to this project yet.</p>
                        ) : (
                          <div className="divide-y divide-slate-200">
                            {projectTasks.map((task) => (
                              <div
                                key={task._id}
                                className="grid grid-cols-[1.2fr_1.2fr_0.8fr_1fr] px-3 py-3 text-sm text-slate-700"
                              >
                                <span className="font-medium text-slate-900">{task.title}</span>
                                <span className="pr-3 text-slate-600">{task.description || '-'}</span>
                                <span>
                                  <span className="inline-flex border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                                    {formatStatus(task.status)}
                                  </span>
                                </span>
                                <span className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditProjectTask(project._id, task)}
                                    className="border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    disabled={deletingTaskKey === `${project._id}:${task._id}`}
                                    onClick={() => handleDeleteProjectTask(project._id, task._id)}
                                    className="border border-slate-800 bg-slate-800 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600"
                                  >
                                    {deletingTaskKey === `${project._id}:${task._id}` ? 'Deleting...' : 'Delete'}
                                  </button>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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