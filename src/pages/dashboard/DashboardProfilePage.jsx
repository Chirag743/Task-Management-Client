import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import ClassicLoader from '../../components/ClassicLoader'

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
        setError('Unable to load profile. Please sign in again if needed.')
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
      return 'U'
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
      setMessage('Profile updated successfully.')
    } catch (saveError) {
      setError('Unable to update profile. Please try again.')
      console.error('Error updating profile:', saveError)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          View and update your account details in a simple classic profile panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="border border-slate-200 bg-slate-50 p-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center border border-slate-300 bg-white text-2xl font-semibold text-slate-700">
            {initials}
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">{profile.name || 'Loading...'}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Member</p>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-600">
              <ClassicLoader />
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="profile-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
                  <p className="mt-1 text-sm text-slate-900">Workspace Member</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Status</p>
                  <p className="mt-1 text-sm text-slate-900">Active</p>
                </div>
              </div>

              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {isSaving ? <ClassicLoader /> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardProfilePage
