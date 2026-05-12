import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

function getRiskLabel(score) {
  if (score >= 80) return { text: 'Low Risk', cls: 'status-low' }
  if (score >= 65) return { text: 'Mild Concern', cls: 'status-mild' }
  if (score >= 50) return { text: 'Moderate Concern', cls: 'status-moderate' }
  return { text: 'Elevated Concern', cls: 'status-high' }
}

function getTrend(history) {
  if (history.length < 2) return null
  const last = history[history.length - 1].score
  const prev = history[history.length - 2].score
  if (last > prev) return { icon: '📈', text: 'Improving', cls: 'trend-up' }
  if (last < prev) return { icon: '📉', text: 'Declining', cls: 'trend-down' }
  return { icon: '➡️', text: 'Stable', cls: 'trend-stable' }
}

function Home() {
  const { user } = useAuth()
  const history = user?.assessmentHistory || []
  const latest = history.length > 0 ? history[history.length - 1] : null
  const trend = getTrend(history)
  const risk = latest ? getRiskLabel(latest.score) : null

  return (
    <>
      <Navbar />
      <div className="home-page">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">🧠 AI-Powered Cognitive Screening</div>
              <h1>Cognisense</h1>
              <p className="hero-subtitle">Early detection of cognitive decline through clinically-inspired assessments and AI-driven insights</p>
              <div className="hero-actions">
                <Link to="/test" className="cta-button primary">🧠 Start Assessment</Link>
                <Link to="/chatbot" className="cta-button secondary">🤖 Talk to AI</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><span className="hs-num">4</span><span className="hs-label">Cognitive Domains</span></div>
                <div className="hero-stat-divider" />
                <div className="hero-stat"><span className="hs-num">100</span><span className="hs-label">Point Index</span></div>
                <div className="hero-stat-divider" />
                <div className="hero-stat"><span className="hs-num">AI</span><span className="hs-label">Powered Insights</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="brain-card">
                <div className="brain-icon">🧠</div>
                <div className="brain-card-label">Cognitive Health Score</div>
                <div className="brain-score-demo">
                  <div className="demo-bar"><div className="demo-fill" style={{ width: '87%', background: '#28a745' }} /><span>Memory</span></div>
                  <div className="demo-bar"><div className="demo-fill" style={{ width: '72%', background: '#4a6cf7' }} /><span>Fluency</span></div>
                  <div className="demo-bar"><div className="demo-fill" style={{ width: '90%', background: '#17a2b8' }} /><span>Reaction</span></div>
                  <div className="demo-bar"><div className="demo-fill" style={{ width: '80%', background: '#8B0000' }} /><span>Matching</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONALIZED STATUS BANNER — only if logged in */}
        {user && (
          <section className="status-banner">
            <div className="status-banner-inner">
              <div className="status-greeting">
                <span className="status-wave">👋</span>
                <div>
                  <h3>Welcome back, {user.name?.split(' ')[0]}</h3>
                  <p>{latest ? 'Here is your latest cognitive snapshot' : 'You have not taken an assessment yet'}</p>
                </div>
              </div>
              {latest ? (
                <div className="status-metrics">
                  <div className="status-metric">
                    <span className="sm-value">{latest.score}<span className="sm-max">/100</span></span>
                    <span className="sm-label">Cognitive Index</span>
                  </div>
                  <div className="status-metric">
                    <span className={`sm-value risk-val ${risk.cls}`}>{risk.text}</span>
                    <span className="sm-label">Risk Level</span>
                  </div>
                  {trend && (
                    <div className="status-metric">
                      <span className={`sm-value ${trend.cls}`}>{trend.icon} {trend.text}</span>
                      <span className="sm-label">Trend</span>
                    </div>
                  )}
                  <div className="status-actions">
                    <Link to="/test" className="status-btn primary">Take New Test</Link>
                    <Link to="/dashboard" className="status-btn secondary">View Dashboard</Link>
                  </div>
                </div>
              ) : (
                <Link to="/test" className="status-btn primary">Take Your First Assessment →</Link>
              )}
            </div>
          </section>
        )}

        <div className="home-container">

          {/* TRUST INDICATORS */}
          <section className="trust-section">
            <div className="section-heading"><h2>Why Cognisense?</h2></div>
            <p className="section-sub">Built on clinically-inspired methodology, powered by AI</p>
            <div className="trust-grid">
              {[
                { icon: '🔬', title: 'Clinically Inspired', desc: 'Assessment methodology based on established cognitive screening frameworks' },
                { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Gemini AI generates personalized insights from your cognitive data' },
                { icon: '📊', title: '4-Domain Scoring', desc: 'Memory, Verbal Fluency, Reaction Speed, and Visual Memory — 100 points total' },
                { icon: '🔒', title: 'Private & Secure', desc: 'All data stored locally on your device — nothing leaves your browser' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="trust-item">
                  <div className="trust-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="how-section">
            <div className="section-heading"><h2>How Cognisense Works</h2></div>
            <p className="section-sub">A 4-step cognitive assessment that takes under 10 minutes</p>
            <div className="steps-grid">
              {[
                { num: '01', icon: '🧠', title: 'Memory Test', desc: 'Memorize words, solve a distraction task, then identify the original words from a mixed list' },
                { num: '02', icon: '💬', title: 'Verbal Fluency', desc: 'Name as many animals as possible in 15 seconds — tests language processing speed' },
                { num: '03', icon: '⚡', title: 'Reaction Speed', desc: '5 trials of clicking a target circle — measures processing speed and attention' },
                { num: '04', icon: '🃏', title: 'Memory Matching', desc: 'Flip cards to find matching pairs — evaluates visual memory and concentration' },
              ].map(({ num, icon, title, desc }) => (
                <div key={num} className="step-card">
                  <div className="step-num">{num}</div>
                  <div className="step-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section className="features-section">
            <div className="section-heading"><h2>Everything You Need</h2></div>
            <p className="section-sub">A complete cognitive health platform in one place</p>
            <div className="features-grid">
              {[
                { icon: '🧠', title: 'Cognitive Assessment', desc: 'Comprehensive 4-domain test with 100-point cognitive index', link: '/test', cta: 'Take Test' },
                { icon: '📊', title: 'Reaction Analysis', desc: 'Detailed breakdown of your processing speed with comparison benchmarks', link: '/dashboard', cta: 'View Dashboard' },
                { icon: '📈', title: 'Progress Tracking', desc: 'Monitor cognitive trends over time with visual history charts', link: '/profile', cta: 'View Profile' },
                { icon: '🤖', title: 'CogniAI Assistant', desc: 'Ask questions about dementia, memory, and brain health anytime', link: '/chatbot', cta: 'Chat Now' },
              ].map(({ icon, title, desc, link, cta }) => (
                <div key={title} className="feature-card">
                  <div className="feature-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <Link to={link} className="feature-link">{cta} →</Link>
                </div>
              ))}
            </div>
          </section>

          {/* SCORE GUIDE */}
          <section className="score-guide-section">
            <div className="section-heading"><h2>Understanding Your Score</h2></div>
            <p className="section-sub">What your Cognitive Index means</p>
            <div className="score-guide-grid">
              {[
                { range: '80–100', label: 'Within Expected Range', color: '#28a745', bg: '#d4edda', desc: 'Strong performance across all cognitive domains. Continue healthy habits.' },
                { range: '65–79', label: 'Mild Concern', color: '#ffc107', bg: '#fff3cd', desc: 'Minor variations in some domains. Targeted exercises can help.' },
                { range: '50–64', label: 'Moderate Concern', color: '#fd7e14', bg: '#fde8d0', desc: 'Multiple domains show deviations. Clinical evaluation recommended.' },
                { range: '0–49', label: 'Elevated Concern', color: '#dc3545', bg: '#f8d7da', desc: 'Notable cognitive concerns. Professional assessment strongly advised.' },
              ].map(({ range, label, color, bg, desc }) => (
                <div key={range} className="score-guide-card" style={{ borderColor: color, background: bg }}>
                  <div className="sg-range" style={{ color }}>{range}</div>
                  <div className="sg-label" style={{ color }}>{label}</div>
                  <p className="sg-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          {!user && (
            <section className="cta-section">
              <div className="cta-inner">
                <h2>Know Your Brain Performance in 10 Minutes</h2>
                <div className="cta-value-props">
                  <span className="cta-prop"><span className="cta-prop-icon">🧠</span> Clinically-inspired 4-domain assessment</span>
                  <span className="cta-prop"><span className="cta-prop-icon">🤖</span> AI-powered personalized insights</span>
                  <span className="cta-prop"><span className="cta-prop-icon">📈</span> Track improvement over time</span>
                  <span className="cta-prop"><span className="cta-prop-icon">🔒</span> 100% private — data stays on your device</span>
                </div>
                <div className="cta-btns">
                  <Link to="/signup" className="cta-button primary">Create Free Account</Link>
                  <Link to="/test" className="cta-button secondary">Try Without Account</Link>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
