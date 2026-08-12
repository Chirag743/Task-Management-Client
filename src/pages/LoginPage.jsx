import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import {
  alertError,
  btnPrimary,
  inputClass,
  kicker,
  labelClass,
  loaderCompactClass,
} from '../utils/tailwindClasses'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await api.post('/api/user/login', { email, password })

      if (response.status === 200) {
        navigate('/dashboard')
      }
    } catch (submitError) {
      const message =
        submitError.response?.data?.message || 'Unable to sign in. Check your credentials and try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <p className={kicker}>Account</p>
      <h1 className="mt-1 text-[1.75rem] text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">Enter your credentials to open your workspace.</p>

      <form className="mt-8 space-y-5" aria-label="Login form" onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className={labelClass}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? (
          <p className={alertError} role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isLoading} className={`${btnPrimary} w-full`}>
          {isLoading ? <span className={loaderCompactClass} aria-label="Loading" /> : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        No account yet?{' '}
        <Link to="/signup" className="font-medium text-accent underline-offset-2 hover:underline">
          Register here
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
