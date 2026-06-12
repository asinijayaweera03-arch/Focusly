import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { GoogleLogin } from '@react-oauth/google'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()
  const { googleLogin, isLoading: googleIsLoading, error: googleError } = useGoogleAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">🎯</span>
          <h1 className="auth-title">Focusly</h1>
          <p className="auth-subtitle">Welcome back! Sign in to continue.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              googleLogin(credentialResponse.credential)
            }}
            onError={() => {
              console.error('Login Failed')
            }}
          />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#888', fontSize: '14px' }}>OR</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {googleError && <div className="auth-error">{googleError}</div>}

          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={isLoading || googleIsLoading}
          >
            {isLoading || googleIsLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
