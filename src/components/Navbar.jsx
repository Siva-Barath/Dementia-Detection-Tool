import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/dashboard',       label: 'Dashboard' },
  { to: '/wellness',        label: 'Wellness' },
  { to: '/habits',          label: 'Habits' },
  { to: '/goals',           label: 'Goals' },
  { to: '/journal',         label: 'Journal' },
  { to: '/learn',           label: 'Learn' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false) }

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Cognisense</Link>

        {/* Desktop nav links — only when logged in */}
        {user && (
          <div className="navbar-links">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-right">
          {/* Dark mode toggle */}
          <button className="theme-toggle" onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>

          {/* CogniAI button */}
          <button className="navbar-chat-btn" onClick={() => user ? navigate('/chatbot') : navigate('/login')}>
            🤖 CogniAI
          </button>

          {user ? (
            <div className="profile-menu" ref={dropdownRef}>
              <button className="profile-btn" onClick={() => setDropdownOpen(o => !o)}>
                <span className="avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="name">{user.name?.split(' ')[0]}</span>
                <span className={`arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <button onClick={() => { navigate('/profile'); setDropdownOpen(false) }}>👤 My Profile</button>
                  <button onClick={() => { navigate('/wellness'); setDropdownOpen(false) }}>💚 Wellness Check-in</button>
                  <button onClick={() => { navigate('/habits'); setDropdownOpen(false) }}>📅 Habit Tracker</button>
                  <button onClick={() => { navigate('/goals'); setDropdownOpen(false) }}>🎯 My Goals</button>
                  <button onClick={() => { navigate('/journal'); setDropdownOpen(false) }}>📖 Journal</button>
                  <div className="dropdown-divider" />
                  <button className="logout" onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-chat-btn">Sign In</Link>
          )}

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && user && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`mobile-link ${location.pathname === to ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
          <Link to="/chatbot" className="mobile-link">🤖 CogniAI</Link>
          <Link to="/profile" className="mobile-link">👤 Profile</Link>
          <button className="mobile-link logout-mobile" onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </nav>
  )
}
