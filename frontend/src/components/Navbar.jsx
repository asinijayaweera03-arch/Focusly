import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <header>
      <div className="container">
        <Link to="/" onClick={closeMenu}>
          <h1>Focusly 🎯</h1>
        </Link>

        {/* Hamburger — only shows on mobile via CSS */}
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                <button className="btn-nav-outline">Dashboard</button>
              </Link>
              <span className="nav-email">{user.email}</span>
              <button
                className="btn-theme-toggle"
                onClick={() => setDark(d => !d)}
                aria-label="Toggle dark mode"
              >
                {dark ? '☀️' : '🌙'}
              </button>
              <button className="btn-logout" onClick={handleLogout} id="logout-btn">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <button className="btn-nav-outline" id="nav-login-btn">Log in</button>
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                <button className="btn-nav-primary" id="nav-signup-btn">Sign up</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar