function HomePage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Welcome</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Task Management Made Clear</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Keep your day organized with a focused workflow for planning, tracking,
        and completing tasks.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Plan</h2>
          <p className="mt-2 text-sm text-slate-600">Create tasks and prioritize work for the day.</p>
        </article>
        <article className="border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Track</h2>
          <p className="mt-2 text-sm text-slate-600">Check what is in progress and what is blocked.</p>
        </article>
        <article className="border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Complete</h2>
          <p className="mt-2 text-sm text-slate-600">Mark tasks done and keep your board tidy.</p>
        </article>
      </div>
    </section>
  )
}

export default HomePage
