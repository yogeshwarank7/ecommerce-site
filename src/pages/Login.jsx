import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../slices/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Prevent space key press
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
    if (e.key === 'Enter') {
      if (isSignUp) handleSignUp()
      else handleLogin()
    }
  }

  // Remove spaces from input
  const handleUsernameChange = (e) => {
    const value = e.target.value.replace(/\s/g, '')
    setUsername(value)
    setError('')
    setSuccess('')
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/\s/g, '')
    setPassword(value)
    setError('')
    setSuccess('')
  }

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    // Retrieve users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('yoki_users') || '[]')
    
    // Check default or saved users
    const matchedUser = savedUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )

    if ((username.toLowerCase() === 'yogesh' && password === 'yogesh123') || matchedUser) {
      const displayName = matchedUser ? matchedUser.username : 'Yogesh Kumar'
      dispatch(login({ username: displayName }))
      navigate('/')
    } else {
      setError('Invalid Username or Password')
    }
  }

  const handleSignUp = () => {
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    // Retrieve current users
    const savedUsers = JSON.parse(localStorage.getItem('yoki_users') || '[]')

    // Check if username is taken
    const exists = savedUsers.some(u => u.username.toLowerCase() === username.toLowerCase())
    if (exists || username.toLowerCase() === 'yogesh') {
      setError('Username is already registered')
      return
    }

    // Save new user
    savedUsers.push({ username, password })
    localStorage.setItem('yoki_users', JSON.stringify(savedUsers))

    setSuccess('Account created successfully! Please sign in.')
    setError('')
    
    // setIsSignUp(false) // Switch back to Sign In
    // setPassword('') // Clear password field

     const SavedUsers = JSON.parse(localStorage.getItem('yoki_users') || '[]')
    
    // Check default or saved users
    const MatchedUser = SavedUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )

    if ((username.toLowerCase() === 'yogesh' && password === 'yogesh123') || MatchedUser) {
      const displayName = MatchedUser ? MatchedUser.username : 'Yogesh Kumar'
      dispatch(login({ username: displayName }))
      navigate('/')
    }

  }

  const toggleMode = (signUp) => {
    setIsSignUp(signUp)
    setUsername('')
    setPassword('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        
        {/* Brand Logo & Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-slate-800 dark:text-white">Y</span>
            <span className="text-blue-600 dark:text-blue-400">o</span>
            <span className="text-slate-800 dark:text-white">ki</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium tracking-wide">
            India's Premium Shopping Destination
          </p>
        </div>

        {/* Auth Container Card - Plain Normal, Clean styling */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
            <button
              onClick={() => toggleMode(false)}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${
                !isSignUp
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode(true)}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${
                isSignUp
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
            {isSignUp ? 'New User Registration' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 dark:text-slate-400 text-xs mb-6">
            {isSignUp ? 'Enter a name and password to get started' : 'Sign in to access your dashboard'}
          </p>

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                Username / Name
              </label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter username (no spaces)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password (no spaces)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow hover:shadow-blue-500/10 mt-4 active:scale-95"
            >
              {isSignUp ? 'Register & Save login →' : 'Sign In →'}
            </button>
          </div>

          {/* Credentials Info block */}
          {!isSignUp && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider font-bold">
                Default Credentials
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 text-center mt-1 font-semibold">
                Username: <span className="font-mono">yogesh</span> · Password: <span className="font-mono">yogesh123</span>
              </p>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Or create a new account using the "Create Account" tab above!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
