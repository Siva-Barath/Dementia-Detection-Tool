import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.age || !form.gender) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (parseInt(form.age) < 18 || parseInt(form.age) > 120) {
      setError('Please enter a valid age (18–120).')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('neurocare_users') || '[]')
      if (users.find(u => u.email === form.email)) {
        setError('An account with this email already exists.')
        setLoading(false)
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        password: form.password,
        age: parseInt(form.age),
        gender: form.gender,
        phone: form.phone,
        joinedAt: new Date().toISOString(),
        assessmentHistory: []
      }

      users.push(newUser)
      localStorage.setItem('neurocare_users', JSON.stringify(users))

      const { password, ...safeUser } = newUser
      login(safeUser)
      navigate('/')
      setLoading(false)
    }, 600)
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <Link to="/" className="auth-brand"><h1>Cognisense</h1></Link>
        </div>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start your cognitive health journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age <span className="required">*</span></label>
              <input type="number" placeholder="e.g. 45" min="18" max="120"
                value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gender <span className="required">*</span></label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number (optional)</label>
            <input type="tel" placeholder="+1 234 567 8900"
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password <span className="required">*</span></label>
              <input type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password <span className="required">*</span></label>
              <input type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            </div>
          </div>

          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
