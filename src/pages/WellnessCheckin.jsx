import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WellnessCheckin.css'

const MOODS = [
  { emoji: '😄', label: 'Great',   value: 5 },
  { emoji: '🙂', label: 'Good',    value: 4 },
  { emoji: '😐', label: 'Okay',    value: 3 },
  { emoji: '😔', label: 'Low',     value: 2 },
  { emoji: '😞', label: 'Bad',     value: 1 },
]

const STRESS = ['Low', 'Medium', 'High']
const FOCUS  = ['Excellent', 'Good', 'Fair', 'Poor']

function getLifestyleScore(entry) {
  let score = 0
  // Mood (0–25)
  score += ((entry.mood || 3) / 5) * 25
  // Sleep (0–25): 7–8h = full, less/more = partial
  const sleep = parseFloat(entry.sleep) || 6
  const sleepScore = sleep >= 7 && sleep <= 9 ? 25 : sleep >= 6 ? 18 : sleep >= 5 ? 10 : 5
  score += sleepScore
  // Stress (0–25): Low=25, Medium=15, High=5
  const stressMap = { Low: 25, Medium: 15, High: 5 }
  score += stressMap[entry.stress] || 15
  // Focus (0–25)
  const focusMap = { Excellent: 25, Good: 18, Fair: 10, Poor: 5 }
  score += focusMap[entry.focus] || 10
  return Math.round(score)
}

export default function WellnessCheckin() {
  const { user, updateProfile } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({ mood: 3, stress: 'Low', sleep: '7', focus: 'Good', note: '' })
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState([])
  const [alreadyToday, setAlreadyToday] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`wellness_${user?.email}`) || '[]')
    setHistory(stored)
    const todayEntry = stored.find(e => e.date === today)
    if (todayEntry) { setForm(todayEntry); setAlreadyToday(true) }
  }, [user])

  const handleSave = () => {
    const entry = { ...form, date: today, lifestyleScore: getLifestyleScore(form) }
    const stored = JSON.parse(localStorage.getItem(`wellness_${user?.email}`) || '[]')
    const updated = [...stored.filter(e => e.date !== today), entry]
    localStorage.setItem(`wellness_${user?.email}`, JSON.stringify(updated))
    setHistory(updated)
    setAlreadyToday(true)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const last7 = history.slice(-7)
  const avgScore = last7.length ? Math.round(last7.reduce((s, e) => s + (e.lifestyleScore || 0), 0) / last7.length) : null

  const scoreColor = (s) => s >= 75 ? '#28a745' : s >= 50 ? '#ffc107' : '#dc3545'
  const scoreLabel = (s) => s >= 75 ? 'Good' : s >= 50 ? 'Fair' : 'Needs Attention'

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <header className="page-header">
            <h1>💚 Daily Wellness Check-in</h1>
            <p>Track how you feel today — takes 30 seconds</p>
          </header>

          <div className="wellness-grid">
            {/* Check-in Form */}
            <div className="card checkin-card">
              <div className="card-title">
                Today's Check-in
                <span className="date-badge">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>

              {/* Mood */}
              <div className="field-group">
                <label>How are you feeling?</label>
                <div className="mood-row">
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      className={`mood-btn ${form.mood === m.value ? 'selected' : ''}`}
                      onClick={() => setForm(f => ({ ...f, mood: m.value }))}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span className="mood-label">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep */}
              <div className="field-group">
                <label>Hours of sleep last night</label>
                <div className="sleep-row">
                  {['4', '5', '6', '7', '8', '9+'].map(h => (
                    <button
                      key={h}
                      className={`sleep-btn ${form.sleep === h ? 'selected' : ''}`}
                      onClick={() => setForm(f => ({ ...f, sleep: h }))}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress */}
              <div className="field-group">
                <label>Stress level today</label>
                <div className="option-row">
                  {STRESS.map(s => (
                    <button
                      key={s}
                      className={`option-btn ${form.stress === s ? 'selected' : ''} stress-${s.toLowerCase()}`}
                      onClick={() => setForm(f => ({ ...f, stress: s }))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus */}
              <div className="field-group">
                <label>Focus & concentration</label>
                <div className="option-row">
                  {FOCUS.map(f => (
                    <button
                      key={f}
                      className={`option-btn ${form.focus === f ? 'selected' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, focus: f }))}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="field-group">
                <label>Quick note (optional)</label>
                <textarea
                  className="wellness-note"
                  placeholder="Anything on your mind today?"
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  rows={2}
                />
              </div>

              {saved && <div className="save-notice">✓ Check-in saved!</div>}

              <button className="save-btn-primary" onClick={handleSave}>
                {alreadyToday ? '✓ Update Check-in' : 'Save Check-in'}
              </button>
            </div>

            {/* Right panel */}
            <div className="wellness-right">
              {/* Today's score */}
              {alreadyToday && (
                <div className="card score-card">
                  <div className="card-title">Today's Wellness Score</div>
                  <div className="big-score" style={{ color: scoreColor(form.lifestyleScore || getLifestyleScore(form)) }}>
                    {form.lifestyleScore || getLifestyleScore(form)}
                    <span>/100</span>
                  </div>
                  <div className="score-label-badge" style={{ background: scoreColor(form.lifestyleScore || getLifestyleScore(form)) + '22', color: scoreColor(form.lifestyleScore || getLifestyleScore(form)) }}>
                    {scoreLabel(form.lifestyleScore || getLifestyleScore(form))}
                  </div>
                </div>
              )}

              {/* 7-day average */}
              {avgScore !== null && (
                <div className="card">
                  <div className="card-title">7-Day Average</div>
                  <div className="avg-row">
                    <span className="avg-score" style={{ color: scoreColor(avgScore) }}>{avgScore}</span>
                    <span className="avg-label">/ 100 wellness score</span>
                  </div>
                  <div className="mini-chart">
                    {last7.map((e, i) => (
                      <div key={i} className="mini-bar-col">
                        <div className="mini-bar" style={{ height: `${e.lifestyleScore || 0}%`, background: scoreColor(e.lifestyleScore || 0) }} />
                        <span className="mini-date">{new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0,2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips based on today */}
              <div className="card tips-card">
                <div className="card-title">💡 Today's Tips</div>
                <ul className="tips-list">
                  {form.stress === 'High' && <li>🧘 Try 5 minutes of deep breathing to reduce cortisol levels</li>}
                  {parseFloat(form.sleep) < 7 && <li>😴 Aim for 7–8 hours tonight — sleep directly impacts memory</li>}
                  {form.mood <= 2 && <li>🚶 A 10-minute walk can significantly improve mood and focus</li>}
                  {form.focus === 'Poor' || form.focus === 'Fair' ? <li>💧 Dehydration reduces focus — drink a glass of water now</li> : null}
                  <li>🧠 Regular check-ins help identify patterns in your cognitive health</li>
                </ul>
              </div>
            </div>
          </div>

          {/* History */}
          {history.length > 1 && (
            <div className="card history-section">
              <div className="card-title">Recent Check-ins</div>
              <div className="wellness-history">
                {[...history].reverse().slice(0, 7).map((e, i) => (
                  <div key={i} className="history-row">
                    <span className="h-date">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="h-mood">{MOODS.find(m => m.value === e.mood)?.emoji || '😐'}</span>
                    <span className="h-sleep">😴 {e.sleep}h</span>
                    <span className="h-stress" style={{ color: e.stress === 'High' ? '#dc3545' : e.stress === 'Medium' ? '#ffc107' : '#28a745' }}>{e.stress} stress</span>
                    <span className="h-score" style={{ color: scoreColor(e.lifestyleScore || 0) }}>{e.lifestyleScore || 0}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
