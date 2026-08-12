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

function SignupPage() {
  const [name, setName] = useState('')
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
      const response = await api.post('/api/user/signup', { name, email, password })

      if (response.status === 201) {
        navigate('/login')
      }
    } catch (submitError) {
      const message =
        submitError.response?.data?.message || 'Unable to create account. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <p className={kicker}>Get started</p>
      <h1 className="mt-1 text-[1.75rem] text-ink">Create an account</h1>
      <p className="mt-2 text-sm text-ink-muted">
        A few details and you can start managing tasks right away.
      </p>

      <form className="mt-8 space-y-5" aria-label="Signup form" onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="signup-name" className={labelClass}>
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClass}>
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className={labelClass}>
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error ? (
          <p className={alertError} role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isLoading} className={`${btnPrimary} w-full`}>
          {isLoading ? <span className={loaderCompactClass} aria-label="Loading" /> : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-accent underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  )
}

export default SignupPage
