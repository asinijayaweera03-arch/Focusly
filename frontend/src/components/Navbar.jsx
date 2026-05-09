import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Focusly 🎯</h1>
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">
                <button className="btn-nav-outline">Dashboard</button>
              </Link>
              <span className="nav-email">{user.email}</span>
              <button className="btn-logout" onClick={handleLogout} id="logout-btn">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-nav-outline" id="nav-login-btn">Log in</button>
              </Link>
              <Link to="/signup">
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