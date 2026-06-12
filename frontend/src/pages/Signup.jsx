import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSignup } from '../hooks/useSignup'
import { GoogleLogin } from '@react-oauth/google'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isLoading, error } = useSignup()
  const { googleLogin, isLoading: googleIsLoading, error: googleError } = useGoogleAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">🎯</span>
          <h1 className="auth-title">Focusly</h1>
          <p className="auth-subtitle">Create your account and start focusing.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              googleLogin(credentialResponse.credential)
            }}
            onError={() => {
              console.error('Signup Failed')
            }}
          />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#888', fontSize: '14px' }}>OR</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email address</label>
            <input
              id="signup-email"
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
              id="signup-password"
              type="password"
              placeholder="Min 8 chars, uppercase, number & symbol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {googleError && <div className="auth-error">{googleError}</div>}

          <button
            id="signup-submit"
            type="submit"
            className="auth-btn"
            disabled={isLoading || googleIsLoading}
          >
            {isLoading || googleIsLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
