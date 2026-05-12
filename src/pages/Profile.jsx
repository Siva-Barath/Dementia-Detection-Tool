import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AIInsights from '../components/AIInsights'
import './Profile.css'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [latestScore, setLatestScore] = useState(() => {
    const h = user?.assessmentHistory || []
    if (h.length === 0) return null
    const last = h[h.length - 1]
    // Build AIInsights-compatible shape
    return {
      cognitiveScore: last.score,
      memory:   last.breakdown?.memory,
      fluency:  last.breakdown?.fluency,
      reaction: last.breakdown?.reaction,
      matching: last.breakdown?.matching,
      score:    last.score,
      risk:     last.risk,
    }
  })
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || ''
  })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const history = user?.assessmentHistory || []

  // Trend: compare last two scores
  const trend = (() => {
    if (history.length < 2) return null
    const delta = history[history.length - 1].score - history[history.length - 2].score
    if (delta > 0) return { icon: '📈', text: `+${delta} pts since last test`, cls: 'trend-up' }
    if (delta < 0) return { icon: '📉', text: `${delta} pts since last test`, cls: 'trend-down' }
    return { icon: '➡️', text: 'No change since last test', cls: 'trend-stable' }
  })()

  // Next test nudge
  const nextTestMsg = (() => {
    if (!history.length) return 'Take your first assessment to start tracking cognitive health'
    const last = new Date(history[history.length - 1].date)
    const due = new Date(last.getTime() + 3 * 24 * 60 * 60 * 1000)
    const diffDays = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'You are ready for your next assessment'
    return `Next assessment recommended in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
  })()

  const getRiskColor = (risk) => {
    if (risk === 'Within Expected Range') return '#28a745'
    if (risk === 'Mild Concern') return '#ffc107'
    if (risk === 'Moderate Concern') return '#fd7e14'
    return '#dc3545'
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">

          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h1>{user?.name}</h1>
              <p>{user?.email}</p>
              <p className="profile-joined">Member since {new Date(user?.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} at Cognisense</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>

          <div className="profile-grid">

            {/* Cognitive Summary */}
            <div className="cognitive-summary-card">
              <h3>🧠 Cognitive Health Status</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Latest Score</span>
                  <span className="stat-value">{latestScore?.score ?? '--'} / 100</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Risk Level</span>
                  <span className="stat-value">{latestScore?.risk ?? 'No data'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tests Taken</span>
                  <span className="stat-value">{history.length}</span>
                </div>
                {trend && (
                  <div className="stat-item">
                    <span className="stat-label">Progress</span>
                    <span className={`stat-value profile-trend-${trend.cls}`}>{trend.icon} {trend.text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="ai-insights-container">
              <AIInsights userData={latestScore} />
            </div>

            {/* Personal Info */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Personal Information</h3>
                {!editing && (
                  <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
                )}
              </div>

              {saved && <div className="save-notice">✓ Profile updated successfully</div>}

              {!editing ? (
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user?.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age</span>
                    <span className="info-value">{user?.age} years</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{user?.gender}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user?.phone || '—'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" value={form.age} onChange={e => set('age', e.target.value)} min="18" max="120" />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="edit-actions">
                    <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    <button type="submit" className="save-btn">Save Changes</button>
                  </div>
                </form>
              )}
            </div>

            {/* Stats Summary */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Assessment Summary</h3>
              </div>
              <div className="stats-grid">
                <div className="stat-box">
                  <h4>{history.length}</h4>
                  <p>Tests Taken</p>
                </div>
                <div className="stat-box">
                  <h4>
                    {history.length > 0
                      ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
                      : '—'}
                  </h4>
                  <p>Avg Score</p>
                </div>
                <div className="stat-box">
                  <h4>
                    {history.length > 0
                      ? Math.max(...history.map(h => h.score))
                      : '—'}
                  </h4>
                  <p>Best Score</p>
                </div>
                <div className="stat-box">
                  <h4>
                    {history.length > 0
                      ? new Date(history[history.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'}
                  </h4>
                  <p>Last Test</p>
                </div>
              </div>

              <button className="take-test-btn" onClick={() => navigate('/test')}>
                Take New Assessment
              </button>
            </div>
          </div>

          {/* Assessment History */}
          <div className="profile-card history-card">
            <div className="profile-card-header">
              <h3>Assessment History</h3>
            </div>
            {history.length === 0 ? (
              <div className="empty-history">
                <p>No assessments taken yet.</p>
                <button className="take-test-btn" onClick={() => navigate('/test')}>
                  Take Your First Assessment
                </button>
              </div>
            ) : (
              <div className="history-table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Cognitive Index</th>
                      <th>Memory</th>
                      <th>Fluency</th>
                      <th>Reaction</th>
                      <th>Matching</th>
                      <th>Assessment Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((h, i) => (
                      <tr key={i}>
                        <td>{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td><strong>{h.score}/100</strong></td>
                        <td>{h.breakdown?.memory ?? '—'}/30</td>
                        <td>{h.breakdown?.fluency ?? '—'}/20</td>
                        <td>{h.breakdown?.reaction ?? '—'}/20</td>
                        <td>{h.breakdown?.matching ?? '—'}/30</td>
                        <td>
                          <span className="risk-badge" style={{ color: getRiskColor(h.risk) }}>
                            {h.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Next Step Nudge */}
          <div className="profile-next-step">
            <span className="profile-next-icon">🎯</span>
            <div className="profile-next-content">
              <strong>Your Next Step</strong>
              <p>{nextTestMsg}</p>
            </div>
            <button className="take-test-btn profile-next-btn" onClick={() => navigate('/test')}>
              {history.length === 0 ? 'Start Assessment' : 'Take New Assessment'} →
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
