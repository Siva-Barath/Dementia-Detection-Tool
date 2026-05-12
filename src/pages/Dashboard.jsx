import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AIInsights from '../components/AIInsights'
import PDFReport from '../components/PDFReport'
import './Dashboard.css'

function getScoreLabel(score) {
  if (score >= 85) return { text: 'Excellent', color: '#28a745' }
  if (score >= 70) return { text: 'Good',      color: '#4a6cf7' }
  if (score >= 50) return { text: 'Average',   color: '#ffc107' }
  return { text: 'Needs Work', color: '#dc3545' }
}

function getDomainStatus(score, max) {
  const p = (score / max) * 100
  if (p >= 85) return { text: 'Excellent', color: '#28a745' }
  if (p >= 70) return { text: 'Good',      color: '#4a6cf7' }
  if (p >= 50) return { text: 'Average',   color: '#ffc107' }
  return { text: 'Needs Work', color: '#dc3545' }
}

function getReactionLabel(hybrid) {
  if (!hybrid) return { text: 'N/A', color: '#999', desc: '' }
  if (hybrid <= 400)  return { text: 'Excellent',    color: '#28a745', desc: 'Exceptional processing speed — top tier performance' }
  if (hybrid <= 600)  return { text: 'Excellent',    color: '#28a745', desc: 'Very fast reaction — well above average' }
  if (hybrid <= 800)  return { text: 'Good',         color: '#4a6cf7', desc: 'Above average reaction speed — healthy range' }
  if (hybrid <= 900)  return { text: 'Good',         color: '#4a6cf7', desc: 'Within healthy reaction range' }
  if (hybrid <= 1000) return { text: 'Average',      color: '#ffc107', desc: 'Normal reaction speed for most adults' }
  if (hybrid <= 1200) return { text: 'Average',      color: '#ffc107', desc: 'Slightly slower than optimal — within normal range' }
  if (hybrid <= 1400) return { text: 'Below Average',color: '#fd7e14', desc: 'Slower than typical — consider reaction training' }
  return { text: 'Needs Improvement', color: '#dc3545', desc: 'Significantly slower — professional evaluation may help' }
}

const DOMAIN_MAX = { memory: 30, fluency: 20, reaction: 20, matching: 30 }

export default function Dashboard() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [latest, setLatest] = useState(null)
  const [trend, setTrend] = useState('stable')
  const [riskFactors, setRiskFactors] = useState([])

  useEffect(() => {
    if (!user) return
    try {
      const h = user.assessmentHistory || []
      setHistory(h)
      if (h.length > 0) {
        setLatest(h[h.length - 1])
        if (h.length >= 3) {
          const s = h.slice(-3).map(x => x.score)
          if (s[2] > s[1] && s[1] > s[0]) setTrend('improving')
          else if (s[2] < s[1] && s[1] < s[0]) setTrend('declining')
          else setTrend('stable')
        }
      }
      const rf = JSON.parse(localStorage.getItem(`riskFactors_${user.email}`) || '{}')
      setRiskFactors(Object.entries(rf))
    } catch (e) { console.error(e) }
  }, [user])

  const currentScore = latest?.score ?? null
  const scoreLabel = currentScore != null ? getScoreLabel(currentScore) : null

  const trendInfo = {
    improving: { icon: '📈', text: 'Improving',  color: '#28a745' },
    declining:  { icon: '📉', text: 'Declining',  color: '#dc3545' },
    stable:     { icon: '➡️', text: 'Stable',     color: '#6c757d' },
  }[trend]

  const confidence = (() => {
    if (history.length === 0) return 0
    if (history.length === 1) return 60
    if (history.length === 2) return 75
    const scores = history.map(h => h.score)
    const v = Math.max(...scores) - Math.min(...scores)
    return v <= 10 ? 90 : v <= 20 ? 85 : 80
  })()

  const consistency = (() => {
    if (history.length < 2) return 'Need 2+ tests'
    const s = history.slice(-3).map(h => h.score)
    const avg = s.reduce((a, b) => a + b, 0) / s.length
    const v = s.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / s.length
    return v < 25 ? 'High' : v < 100 ? 'Medium' : 'Low'
  })()

  // Score comparison: current vs previous
  const prevScore = history.length >= 2 ? history[history.length - 2].score : null
  const scoreDelta = prevScore != null ? (latest?.score ?? 0) - prevScore : null

  // Next test nudge: suggest 3 days after last test
  const nextTestDue = (() => {
    if (!latest) return null
    const last = new Date(latest.date)
    const due = new Date(last.getTime() + 3 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'Ready for your next assessment'
    return `Next assessment recommended in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
  })()

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="dashboard-page">
          <div className="dashboard-container">
            <div className="auth-required">
              <div className="auth-icon">🔒</div>
              <h2>Sign In Required</h2>
              <p>You need to be logged in to view your cognitive dashboard.</p>
              <Link to="/login" className="auth-btn">Sign In</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-container">

          <header className="dashboard-header">
            <h1>Cognitive Dashboard</h1>
            <p>Your complete cognitive health overview</p>
          </header>

          {/* ── TOP METRICS ── */}
          <section className="metrics-row">
            <div className="metric-card main-score">
              <div className="metric-label">Cognitive Index</div>
              <div className="metric-value" style={{ color: scoreLabel?.color ?? '#333' }}>
                {currentScore ?? '--'}
                {currentScore && <span className="metric-max">/100</span>}
              </div>
              {scoreLabel && (
                <div className="metric-badge" style={{ background: scoreLabel.color + '22', color: scoreLabel.color }}>
                  {scoreLabel.text}
                </div>
              )}
              {!currentScore && <p className="no-data-hint">Take an assessment to see your score</p>}
            </div>

            <div className="metric-card">
              <div className="metric-label">Trend</div>
              <div className="metric-value" style={{ color: trendInfo.color }}>{trendInfo.icon}</div>
              <div className="metric-badge" style={{ background: trendInfo.color + '22', color: trendInfo.color }}>{trendInfo.text}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Confidence</div>
              <div className="metric-value">{confidence}%</div>
              <div className="confidence-bar-wrap">
                <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Consistency</div>
              <div className="metric-value" style={{ fontSize: history.length < 2 ? '1rem' : undefined }}>{consistency}</div>
              <div className="metric-sub">{history.length} test{history.length !== 1 ? 's' : ''} taken</div>
            </div>
          </section>

          {/* ── SCORE COMPARISON ── */}
          {scoreDelta !== null && (
            <section className="comparison-bar">
              <div className="comp-item">
                <span className="comp-label">Previous Score</span>
                <span className="comp-val">{prevScore}<span className="comp-max">/100</span></span>
              </div>
              <div className="comp-arrow">{scoreDelta > 0 ? '→' : '→'}</div>
              <div className="comp-item">
                <span className="comp-label">Current Score</span>
                <span className="comp-val" style={{ color: scoreLabel?.color }}>{latest?.score}<span className="comp-max">/100</span></span>
              </div>
              <div className={`comp-delta ${scoreDelta > 0 ? 'delta-up' : scoreDelta < 0 ? 'delta-down' : 'delta-same'}`}>
                {scoreDelta > 0 ? `↑ +${scoreDelta}` : scoreDelta < 0 ? `↓ ${scoreDelta}` : '→ No change'}
                <span className="comp-delta-label">
                  {scoreDelta > 0 ? 'improvement since last test' : scoreDelta < 0 ? 'decline since last test' : 'since last test'}
                </span>
              </div>
            </section>
          )}

          {/* ── DOMAIN BREAKDOWN ── */}
          {latest?.breakdown && (
            <section className="section-block">
              <h2 className="section-title">Domain Performance</h2>
              <div className="domains-grid">
                {Object.entries(latest.breakdown).map(([domain, score]) => {
                  const max = DOMAIN_MAX[domain] ?? 30
                  const st = getDomainStatus(score, max)
                  const pct = Math.round((score / max) * 100)
                  return (
                    <div key={domain} className="domain-card">
                      <div className="domain-top">
                        <span className="domain-name">{domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
                        <span className="domain-badge" style={{ background: st.color + '22', color: st.color }}>{st.text}</span>
                      </div>
                      <div className="domain-score-row">
                        <span className="domain-score-num">{score}</span>
                        <span className="domain-score-max">/ {max}</span>
                      </div>
                      <div className="domain-bar-track">
                        <div className="domain-bar-fill" style={{ width: `${pct}%`, background: st.color }} />
                      </div>
                      <div className="domain-pct">{pct}%</div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── REACTION ANALYSIS ── */}
          {latest?.breakdown && (
            <section className="section-block reaction-section">
              <h2 className="section-title">⚡ Reaction Speed Analysis</h2>
              <div className="reaction-grid">
                <div className="reaction-main">
                  {(() => {
                    const reactionScore = latest.breakdown.reaction
                    // Estimate hybrid ms from score (reverse mapping for display)
                    const hybridEstimates = { 20: 380, 18: 500, 16: 700, 14: 850, 12: 950, 10: 1100, 7: 1250, 5: 1450, 3: 1700 }
                    const closestScore = Object.keys(hybridEstimates).reduce((a, b) =>
                      Math.abs(b - reactionScore) < Math.abs(a - reactionScore) ? b : a
                    )
                    const estMs = hybridEstimates[closestScore]
                    const rl = getReactionLabel(estMs)
                    const pct = Math.round((reactionScore / 20) * 100)
                    return (
                      <>
                        <div className="reaction-score-display">
                          <div className="reaction-score-num" style={{ color: rl.color }}>{reactionScore}<span>/20</span></div>
                          <div className="reaction-label-badge" style={{ background: rl.color + '22', color: rl.color }}>{rl.text}</div>
                        </div>
                        <div className="reaction-bar-track">
                          <div className="reaction-bar-fill" style={{ width: `${pct}%`, background: rl.color }} />
                        </div>
                        <p className="reaction-desc">{rl.desc}</p>
                      </>
                    )
                  })()}
                </div>

                <div className="reaction-benchmarks">
                  <h4>Speed Benchmarks</h4>
                  {[
                    { range: '< 400 ms',    label: 'Excellent',     color: '#28a745' },
                    { range: '400–800 ms',  label: 'Good',          color: '#4a6cf7' },
                    { range: '800–1200 ms', label: 'Average',       color: '#ffc107' },
                    { range: '> 1200 ms',   label: 'Needs Work',    color: '#dc3545' },
                  ].map(b => (
                    <div key={b.range} className="benchmark-row">
                      <span className="bench-dot" style={{ background: b.color }} />
                      <span className="bench-range">{b.range}</span>
                      <span className="bench-label" style={{ color: b.color }}>{b.label}</span>
                    </div>
                  ))}
                </div>

                <div className="reaction-tips">
                  <h4>💡 How to Improve</h4>
                  <ul>
                    <li>Play 5-minute daily reaction games (tap-the-target apps)</li>
                    <li>Reduce screen fatigue — take regular eye breaks</li>
                    <li>Ensure 7–8 hours of quality sleep nightly</li>
                    <li>Regular aerobic exercise improves neural processing speed</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ── AI INSIGHTS ── */}
          <section className="section-block">
            <h2 className="section-title">🤖 AI Health Insights</h2>
            <AIInsights userData={latest?.breakdown ? {
              cognitiveScore: latest.score,
              memory:   latest.breakdown.memory,
              fluency:  latest.breakdown.fluency,
              reaction: latest.breakdown.reaction,
              matching: latest.breakdown.matching,
            } : null} />
          </section>

          {/* ── HISTORY CHART ── */}
          {history.length > 0 && (
            <section className="section-block">
              <h2 className="section-title">Assessment History</h2>
              <div className="history-chart-card">
                <div className="chart-bars">
                  {history.slice(-7).map((a, i) => {
                    const lbl = getScoreLabel(a.score)
                    return (
                      <div key={i} className="chart-col">
                        <div className="chart-bar-wrap">
                          <div className="chart-bar-score">{a.score}</div>
                          <div className="chart-bar-fill" style={{ height: `${a.score}%`, background: lbl.color }} />
                        </div>
                        <div className="chart-bar-date">
                          {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {history.length >= 2 && (
                  <div className="history-trend-note" style={{ color: trendInfo.color }}>
                    {trendInfo.icon} Your scores are {trendInfo.text.toLowerCase()} over time
                  </div>
                )}
              </div>
              <div className="history-actions">
                <Link to="/test" className="action-btn primary">Take New Test</Link>
                <Link to="/profile" className="action-btn secondary">Full History</Link>
              </div>
            </section>
          )}

          {/* ── RISK FACTORS ── */}
          {riskFactors.length > 0 && (
            <section className="section-block">
              <h2 className="section-title">Lifestyle Risk Factors</h2>
              <div className="risk-grid">
                {riskFactors.map(([factor, level]) => (
                  <div key={factor} className="risk-item">
                    <span className="risk-name">{factor.charAt(0).toUpperCase() + factor.slice(1)}</span>
                    <span className={`risk-badge-pill ${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── PDF REPORT ── */}
          {currentScore && (
            <section className="section-block">
              <PDFReport
                assessmentData={{ ...latest, cognitiveIndex: latest.score }}
                userData={user}
              />
            </section>
          )}

          {/* ── DECLINING WARNING ── */}
          {trend === 'declining' && (
            <section className="warning-banner">
              <span className="warning-icon">⚠️</span>
              <div>
                <strong>Declining Trend Detected</strong>
                <p>Your cognitive score has declined over the last few assessments. Consider consulting a healthcare professional.</p>
              </div>
            </section>
          )}

          {/* ── NEXT STEP NUDGE ── */}
          {nextTestDue && (
            <section className="next-step-card">
              <div className="next-step-icon">🎯</div>
              <div className="next-step-content">
                <strong>Your Next Step</strong>
                <p>{nextTestDue} — consistent testing improves prediction accuracy and helps track cognitive trends over time.</p>
              </div>
              <Link to="/test" className="next-step-btn">Take Assessment →</Link>
            </section>
          )}

          {/* ── QUICK ACTIONS ── */}}
          <section className="section-block">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {[
                { icon: '🧠', title: 'Take Assessment', desc: 'Complete cognitive test', to: '/test' },
                { icon: '🤖', title: 'AI Assistant',    desc: 'Get health advice',       to: '/chatbot' },
                { icon: '⚠️', title: 'Risk Assessment', desc: 'Evaluate lifestyle risk', to: '/risk-assessment' },
                { icon: '👤', title: 'View Profile',    desc: 'Track your progress',     to: '/profile' },
              ].map(({ icon, title, desc, to }) => (
                <Link key={to} to={to} className="quick-action-card">
                  <div className="qa-icon">{icon}</div>
                  <div className="qa-title">{title}</div>
                  <div className="qa-desc">{desc}</div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  )
}
