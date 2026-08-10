function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Access</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Login</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to view your boards, tasks, and activity.</p>

      <form className="mt-6 space-y-4" aria-label="Login form">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="button"
          className="w-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Login
        </button>
      </form>
    </section>
  )
}

export default LoginPage
