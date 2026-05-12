import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WellnessCheckin.css'
import './Journal.css'

const PROMPTS = [
  'How did you feel mentally today?',
  'What was the most challenging part of your day?',
  'What are you grateful for today?',
  'Did you notice any memory or focus issues today?',
  'What helped you feel calm or focused today?',
  'Describe your energy levels throughout the day.',
  'What would you do differently tomorrow?',
]

export default function Journal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [text, setText] = useState('')
  const [mood, setMood] = useState(3)
  const [prompt, setPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`journal_${user?.email}`) || '[]')
    setEntries(stored)
  }, [user])

  const MOODS = ['😞', '😔', '😐', '🙂', '😄']

  const handleSave = () => {
    if (!text.trim()) return
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: text.trim(),
      mood,
      prompt,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem(`journal_${user?.email}`, JSON.stringify(updated))
    setText('')
    setMood(3)
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(`journal_${user?.email}`, JSON.stringify(updated))
  }

  const filtered = entries.filter(e =>
    e.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <header className="page-header">
            <h1>📖 Personal Journal</h1>
            <p>Reflect on your day — journaling improves self-awareness and emotional regulation</p>
          </header>

          <div className="journal-layout">
            {/* Write entry */}
            <div className="card journal-write-card">
              <div className="card-title">New Entry</div>

              <div className="journal-prompt">
                <span className="prompt-label">💭 Today's prompt</span>
                <p className="prompt-text">"{prompt}"</p>
                <button className="prompt-refresh" onClick={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}>
                  ↻ New prompt
                </button>
              </div>

              <div className="field-group">
                <label>How are you feeling?</label>
                <div className="journal-mood-row">
                  {MOODS.map((emoji, i) => (
                    <button
                      key={i}
                      className={`journal-mood-btn ${mood === i + 1 ? 'selected' : ''}`}
                      onClick={() => setMood(i + 1)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="journal-textarea"
                placeholder="Write freely — this is your private space..."
                value={text}
                onChange={e => setText(e.target.value)}
                rows={6}
              />

              <div className="journal-footer">
                <span className="char-count">{text.length} characters</span>
                {saved && <span className="save-flash">✓ Entry saved</span>}
                <button className="save-btn-primary journal-save-btn" onClick={handleSave} disabled={!text.trim()}>
                  Save Entry
                </button>
              </div>
            </div>

            {/* Stats sidebar */}
            <div className="journal-sidebar">
              <div className="card">
                <div className="card-title">Journal Stats</div>
                <div className="journal-stats">
                  <div className="j-stat">
                    <span className="j-stat-num">{entries.length}</span>
                    <span className="j-stat-label">Total Entries</span>
                  </div>
                  <div className="j-stat">
                    <span className="j-stat-num">
                      {entries.length > 0 ? MOODS[Math.round(entries.slice(0,7).reduce((s,e) => s + e.mood, 0) / Math.min(entries.length, 7)) - 1] : '—'}
                    </span>
                    <span className="j-stat-label">Avg Mood (7d)</span>
                  </div>
                  <div className="j-stat">
                    <span className="j-stat-num">
                      {entries.length > 0 ? Math.round(entries.reduce((s,e) => s + e.text.length, 0) / entries.length) : 0}
                    </span>
                    <span className="j-stat-label">Avg Entry Length</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-title">💡 Why Journal?</div>
                <ul className="tips-list">
                  <li>🧠 Journaling reduces cognitive load by externalizing thoughts</li>
                  <li>😌 Writing about stress reduces cortisol levels</li>
                  <li>📈 Tracking mood helps identify patterns in cognitive performance</li>
                  <li>🔍 Reviewing entries helps spot early signs of memory changes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Past entries */}
          {entries.length > 0 && (
            <div className="card">
              <div className="card-title">
                Past Entries
                <input
                  className="journal-search"
                  placeholder="Search entries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="entries-list">
                {filtered.map(entry => (
                  <div key={entry.id} className="entry-item">
                    <div className="entry-header" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                      <span className="entry-mood">{MOODS[entry.mood - 1]}</span>
                      <div className="entry-meta">
                        <span className="entry-date">
                          {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="entry-preview">
                          {expandedId === entry.id ? '' : entry.text.slice(0, 80) + (entry.text.length > 80 ? '...' : '')}
                        </span>
                      </div>
                      <div className="entry-actions">
                        <span className="entry-toggle">{expandedId === entry.id ? '▲' : '▼'}</span>
                        <button className="entry-delete" onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id) }}>🗑</button>
                      </div>
                    </div>
                    {expandedId === entry.id && (
                      <div className="entry-body">
                        {entry.prompt && <p className="entry-prompt-ref">💭 "{entry.prompt}"</p>}
                        <p className="entry-text">{entry.text}</p>
                      </div>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && <p className="no-results">No entries match your search.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
