function DashboardProfilePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Profile details and workspace identity shown in a simple, familiar layout.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="border border-slate-200 bg-slate-50 p-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center border border-slate-300 bg-white text-2xl font-semibold text-slate-700">
            T
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">TaskFlow User</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Member</p>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-sm text-slate-900">TaskFlow User</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm text-slate-900">user@example.com</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-1 text-sm text-slate-900">Workspace Member</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</p>
              <p className="mt-1 text-sm text-slate-900">August 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardProfilePage
