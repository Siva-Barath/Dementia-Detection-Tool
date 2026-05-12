import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WellnessCheckin.css'
import './HabitTracker.css'

const HABITS = [
  { key: 'sleep',    icon: '😴', label: 'Sleep 7+ hours',       target: 1 },
  { key: 'water',    icon: '💧', label: 'Drink 8 glasses water', target: 1 },
  { key: 'exercise', icon: '🏃', label: 'Exercise / walk',       target: 1 },
  { key: 'screen',   icon: '📵', label: 'Screen time < 4 hours', target: 1 },
  { key: 'reading',  icon: '📖', label: 'Read for 15 minutes',   target: 1 },
  { key: 'meditate', icon: '🧘', label: 'Mindfulness / breathing',target: 1 },
  { key: 'noAlcohol',icon: '🚫', label: 'No alcohol / smoking',  target: 1 },
  { key: 'social',   icon: '👥', label: 'Social interaction',    target: 1 },
]

export default function HabitTracker() {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [log, setLog] = useState({})       // { date: { key: bool } }
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`habits_${user?.email}`) || '{}')
    setLog(stored)
  }, [user])

  const todayLog = log[today] || {}

  const toggle = (key) => {
    const updated = { ...log, [today]: { ...todayLog, [key]: !todayLog[key] } }
    setLog(updated)
    localStorage.setItem(`habits_${user?.email}`, JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  const todayCount = HABITS.filter(h => todayLog[h.key]).length
  const todayPct   = Math.round((todayCount / HABITS.length) * 100)

  // Last 7 days streak data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const dayLog = log[key] || {}
    const count = HABITS.filter(h => dayLog[h.key]).length
    return { date: key, count, label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,2) }
  })

  // Streak: consecutive days with 4+ habits
  let streak = 0
  for (let i = last7.length - 2; i >= 0; i--) {
    if (last7[i].count >= 4) streak++
    else break
  }

  const streakColor = streak >= 5 ? '#28a745' : streak >= 3 ? '#ffc107' : '#8B0000'

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <header className="page-header">
            <h1>📅 Habit Tracker</h1>
            <p>Build daily habits that protect and strengthen your cognitive health</p>
          </header>

          <div className="habit-top-row">
            {/* Today's progress */}
            <div className="card habit-progress-card">
              <div className="card-title">Today's Progress</div>
              <div className="habit-ring-wrap">
                <svg viewBox="0 0 100 100" className="habit-ring">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke={todayPct >= 75 ? '#28a745' : todayPct >= 50 ? '#ffc107' : '#8B0000'}
                    strokeWidth="10"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * todayPct) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="habit-ring-text">
                  <span className="ring-count">{todayCount}</span>
                  <span className="ring-total">/ {HABITS.length}</span>
                </div>
              </div>
              <p className="habit-progress-label">
                {todayPct >= 75 ? '🔥 Excellent day!' : todayPct >= 50 ? '👍 Good progress' : '💪 Keep going!'}
              </p>
            </div>

            {/* Streak */}
            <div className="card streak-card">
              <div className="card-title">Current Streak</div>
              <div className="streak-num" style={{ color: streakColor }}>{streak}</div>
              <div className="streak-label">consecutive days (4+ habits)</div>
              <div className="week-dots">
                {last7.map((d, i) => (
                  <div key={i} className="week-dot-col">
                    <div className="week-dot" style={{ background: d.count >= 4 ? '#28a745' : d.count >= 2 ? '#ffc107' : 'var(--border)' }} />
                    <span className="week-dot-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day chart */}
            <div className="card">
              <div className="card-title">7-Day Overview</div>
              <div className="mini-chart" style={{ height: '80px' }}>
                {last7.map((d, i) => (
                  <div key={i} className="mini-bar-col">
                    <div className="mini-bar" style={{
                      height: `${(d.count / HABITS.length) * 100}%`,
                      background: d.count >= 6 ? '#28a745' : d.count >= 4 ? '#4a6cf7' : d.count >= 2 ? '#ffc107' : '#e9ecef'
                    }} />
                    <span className="mini-date">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Habit checklist */}
          <div className="card">
            <div className="card-title">
              Today's Habits
              {saved && <span className="saved-flash">✓ Saved</span>}
            </div>
            <div className="habits-grid">
              {HABITS.map(h => (
                <button
                  key={h.key}
                  className={`habit-item ${todayLog[h.key] ? 'done' : ''}`}
                  onClick={() => toggle(h.key)}
                >
                  <span className="habit-icon">{h.icon}</span>
                  <span className="habit-label">{h.label}</span>
                  <span className="habit-check">{todayLog[h.key] ? '✓' : '○'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Why these habits matter */}
          <div className="card">
            <div className="card-title">🧠 Why These Habits Matter</div>
            <div className="habit-why-grid">
              {[
                { icon: '😴', title: 'Sleep', desc: 'Sleep consolidates memories and clears brain waste. Less than 7 hours impairs cognitive function.' },
                { icon: '💧', title: 'Hydration', desc: 'Even mild dehydration reduces focus, memory, and processing speed by up to 20%.' },
                { icon: '🏃', title: 'Exercise', desc: 'Physical activity increases BDNF — a protein that promotes brain cell growth and connectivity.' },
                { icon: '📵', title: 'Screen Time', desc: 'Excessive screen time disrupts sleep cycles and reduces attention span over time.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="why-card">
                  <span className="why-icon">{icon}</span>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
