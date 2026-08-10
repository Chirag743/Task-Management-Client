function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          A simple overview of your task workspace. Keep priorities clear and move through the day with less noise.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">08</p>
          <p className="mt-1 text-sm text-slate-600">Tasks on the current list</p>
        </article>

        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Done</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">14</p>
          <p className="mt-1 text-sm text-slate-600">Completed this week</p>
        </article>

        <article className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">03</p>
          <p className="mt-1 text-sm text-slate-600">Priority items waiting</p>
        </article>
      </div>

      <div className="border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">This Week</h2>
        <div className="mt-4 space-y-3">
          {['Review backlog', 'Update task priorities', 'Close finished items'].map((item) => (
            <div key={item} className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span>{item}</span>
              <span className="text-slate-500">Pending</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHomePage
