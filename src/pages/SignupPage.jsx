function SignupPage() {
  return (
    <section className="mx-auto w-full max-w-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Get Started</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create an Account</h1>
      <p className="mt-2 text-sm text-slate-600">Join in a few steps and start managing your tasks today.</p>

      <form className="mt-6 space-y-4" aria-label="Signup form">
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="Create a password"
          />
        </div>

        <button
          type="button"
          className="w-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Sign Up
        </button>
      </form>
    </section>
  )
}

export default SignupPage
