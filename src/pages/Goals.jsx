import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WellnessCheckin.css'
import './Goals.css'

const PRESET_GOALS = [
  { id: 'sleep7',    icon: '😴', title: 'Sleep 7+ hours daily',         category: 'Sleep',    target: 7,  unit: 'days' },
  { id: 'exercise3', icon: '🏃', title: 'Exercise 3x per week',          category: 'Fitness',  target: 3,  unit: 'sessions' },
  { id: 'screen4',   icon: '📵', title: 'Screen time under 4 hours',     category: 'Digital',  target: 7,  unit: 'days' },
  { id: 'water8',    icon: '💧', title: 'Drink 8 glasses of water daily', category: 'Health',   target: 7,  unit: 'days' },
  { id: 'read15',    icon: '📖', title: 'Read for 15 minutes daily',      category: 'Mental',   target: 7,  unit: 'days' },
  { id: 'meditate',  icon: '🧘', title: 'Meditate 5 minutes daily',       category: 'Mental',   target: 7,  unit: 'days' },
  { id: 'noAlcohol', icon: '🚫', title: 'Avoid alcohol for 30 days',      category: 'Health',   target: 30, unit: 'days' },
  { id: 'assess',    icon: '🧠', title: 'Take 3 cognitive assessments',   category: 'Cognition',target: 3,  unit: 'tests' },
]

export default function Goals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [customTitle, setCustomTitle] = useState('')
  const [customTarget, setCustomTarget] = useState('7')
  const [customUnit, setCustomUnit] = useState('days')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`goals_${user?.email}`) || '[]')
    setGoals(stored)
  }, [user])

  const save = (updated) => {
    setGoals(updated)
    localStorage.setItem(`goals_${user?.email}`, JSON.stringify(updated))
  }

  const addPreset = (preset) => {
    if (goals.find(g => g.id === preset.id)) return
    save([...goals, { ...preset, progress: 0, createdAt: new Date().toISOString(), completed: false }])
  }

  const addCustom = () => {
    if (!customTitle.trim()) return
    const g = {
      id: Date.now().toString(),
      icon: '🎯',
      title: customTitle.trim(),
      category: 'Custom',
      target: parseInt(customTarget) || 7,
      unit: customUnit,
      progress: 0,
      createdAt: new Date().toISOString(),
      completed: false,
    }
    save([...goals, g])
    setCustomTitle('')
    setCustomTarget('7')
  }

  const increment = (id) => {
    save(goals.map(g => {
      if (g.id !== id) return g
      const newProgress = Math.min(g.progress + 1, g.target)
      return { ...g, progress: newProgress, completed: newProgress >= g.target }
    }))
  }

  const remove = (id) => save(goals.filter(g => g.id !== id))

  const active    = goals.filter(g => !g.completed)
  const completed = goals.filter(g => g.completed)

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <header className="page-header">
            <h1>🎯 Goal Setting</h1>
            <p>Set health goals and track your progress — your brain coach</p>
          </header>

          <div className="goals-layout">
            {/* Left: active goals */}
            <div className="goals-main">
              {active.length === 0 && completed.length === 0 && (
                <div className="card empty-goals">
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎯</div>
                  <h3>No goals yet</h3>
                  <p>Add a goal from the presets or create your own</p>
                </div>
              )}

              {active.length > 0 && (
                <div className="card">
                  <div className="card-title">Active Goals ({active.length})</div>
                  <div className="goals-list">
                    {active.map(g => {
                      const pct = Math.round((g.progress / g.target) * 100)
                      return (
                        <div key={g.id} className="goal-item">
                          <span className="goal-icon">{g.icon}</span>
                          <div className="goal-body">
                            <div className="goal-top-row">
                              <span className="goal-title">{g.title}</span>
                              <span className="goal-cat">{g.category}</span>
                            </div>
                            <div className="goal-bar-track">
                              <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="goal-bottom-row">
                              <span className="goal-progress">{g.progress} / {g.target} {g.unit}</span>
                              <span className="goal-pct">{pct}%</span>
                            </div>
                          </div>
                          <div className="goal-actions">
                            <button className="goal-inc" onClick={() => increment(g.id)} title="Mark progress">+1</button>
                            <button className="goal-del" onClick={() => remove(g.id)} title="Remove">✕</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {completed.length > 0 && (
                <div className="card">
                  <div className="card-title">✅ Completed Goals ({completed.length})</div>
                  <div className="goals-list">
                    {completed.map(g => (
                      <div key={g.id} className="goal-item completed">
                        <span className="goal-icon">{g.icon}</span>
                        <div className="goal-body">
                          <span className="goal-title">{g.title}</span>
                          <div className="goal-bar-track">
                            <div className="goal-bar-fill completed-fill" style={{ width: '100%' }} />
                          </div>
                          <span className="goal-progress">{g.target} / {g.target} {g.unit} — Complete! 🎉</span>
                        </div>
                        <button className="goal-del" onClick={() => remove(g.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: add goals */}
            <div className="goals-sidebar">
              {/* Preset goals */}
              <div className="card">
                <div className="card-title">Quick Add Goals</div>
                <div className="preset-list">
                  {PRESET_GOALS.map(p => {
                    const added = goals.find(g => g.id === p.id)
                    return (
                      <button
                        key={p.id}
                        className={`preset-btn ${added ? 'added' : ''}`}
                        onClick={() => addPreset(p)}
                        disabled={!!added}
                      >
                        <span>{p.icon}</span>
                        <span className="preset-title">{p.title}</span>
                        <span className="preset-add">{added ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom goal */}
              <div className="card">
                <div className="card-title">Create Custom Goal</div>
                <div className="custom-form">
                  <input
                    className="custom-input"
                    placeholder="e.g. Walk 10,000 steps daily"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                  />
                  <div className="custom-row">
                    <input
                      className="custom-input"
                      type="number"
                      placeholder="Target"
                      value={customTarget}
                      onChange={e => setCustomTarget(e.target.value)}
                      style={{ width: '80px' }}
                    />
                    <select className="custom-input" value={customUnit} onChange={e => setCustomUnit(e.target.value)}>
                      <option value="days">days</option>
                      <option value="sessions">sessions</option>
                      <option value="times">times</option>
                      <option value="hours">hours</option>
                    </select>
                  </div>
                  <button className="save-btn-primary" onClick={addCustom}>Add Goal</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
