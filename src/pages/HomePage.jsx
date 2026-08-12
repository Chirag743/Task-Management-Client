import { Link } from 'react-router-dom'
import { btnPrimary, btnSecondary, kicker } from '../utils/tailwindClasses'

function HomePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className={kicker}>Welcome</p>
        <h1 className="mt-2 text-[2rem] leading-tight text-ink sm:text-[2.5rem]">
          A quiet place to manage your tasks
        </h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink-muted">
          TaskFlow is a simple workspace for planning daily work, tracking progress,
          and closing out tasks without clutter or distraction.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/signup" className={`${btnPrimary} no-underline`}>
            Create account
          </Link>
          <Link to="/login" className={`${btnSecondary} no-underline`}>
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            step: '01',
            title: 'Plan',
            text: 'Write down what needs doing. Set a status and keep descriptions brief.',
          },
          {
            step: '02',
            title: 'Track',
            text: 'Move tasks from pending to in progress as you work through your list.',
          },
          {
            step: '03',
            title: 'Complete',
            text: 'Mark items done and keep your workspace current at the end of each day.',
          },
        ].map((item) => (
          <article key={item.step} className="border border-rule-light bg-paper-dark p-5">
            <p className={kicker}>{item.step}</p>
            <h2 className="mt-2 text-lg text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="border border-rule bg-paper-dark p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-ink">Ready to begin?</p>
            <p className="mt-1 text-sm text-ink-muted">
              Sign in to access your dashboard, tasks, and projects.
            </p>
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => window.location.assign('/dashboard')}
          >
            Go to dashboard
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
