import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import {
  alertError,
  alertSuccess,
  btnPrimary,
  inputClass,
  kicker,
  labelClass,
  loaderClass,
  loaderCompactClass,
  panel,
  panelBody,
  panelHeader,
} from '../../utils/tailwindClasses'

function DashboardProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await api.get('/api/user/profile')
        const user = response.data?.user || {}

        setProfile({
          name: user.name || '',
          email: user.email || '',
        })
      } catch (fetchError) {
        setError('Unable to load profile. Please sign in again.')
        console.error('Error loading profile:', fetchError)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const initials = useMemo(() => {
    const name = profile.name.trim()
    if (!name) {
      return '?'
    }

    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [profile.name])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!profile.name.trim() || !profile.email.trim()) {
      setError('Name and email are required.')
      return
    }

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api.put('/api/user/profile', profile)
      const user = response.data?.user || {}

      setProfile({
        name: user.name || profile.name,
        email: user.email || profile.email,
      })
      setMessage('Profile saved successfully.')
    } catch (saveError) {
      setError('Unable to update profile. Please try again.')
      console.error('Error updating profile:', saveError)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-rule-light pb-6">
        <p className={kicker}>Account</p>
        <h1 className="mt-1 text-[1.75rem] text-ink sm:text-[2rem]">Profile</h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
          Your name and email used across the workspace.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <aside className={`${panel} p-5 text-center`}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-rule bg-paper-dark font-serif text-2xl font-semibold text-ink-muted">
            {isLoading ? '…' : initials}
          </div>
          <p className="mt-4 font-medium text-ink">{profile.name || '—'}</p>
          <p className="mt-1 text-sm text-ink-muted">{profile.email || '—'}</p>
          <p className={`${kicker} mt-4`}>Member</p>
        </aside>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Account details</h2>
          </div>

          {isLoading ? (
            <div className={`${panelBody} flex min-h-[200px] items-center justify-center`}>
              <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted" aria-label="Loading">
                <span className={loaderClass} />
                <span>Loading…</span>
              </span>
            </div>
          ) : (
            <form className={`${panelBody} space-y-5`} onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    className={inputClass}
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="profile-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    className={inputClass}
                    value={profile.email}
                    onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-5 border-t border-rule-light pt-5 sm:grid-cols-2">
                <div>
                  <p className={kicker}>Role</p>
                  <p className="mt-1 text-sm text-ink">Workspace member</p>
                </div>
                <div>
                  <p className={kicker}>Status</p>
                  <p className="mt-1 text-sm text-ink">Active</p>
                </div>
              </div>

              {error ? (
                <p className={alertError} role="alert">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className={alertSuccess} role="status">
                  {message}
                </p>
              ) : null}

              <button type="submit" disabled={isSaving} className={btnPrimary}>
                {isSaving ? <span className={loaderCompactClass} aria-label="Loading" /> : 'Save changes'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardProfilePage
