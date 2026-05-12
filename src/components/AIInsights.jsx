import { useState, useEffect } from 'react'
import './AIInsights.css'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY

function getLabel(score, max) {
  const p = (score / max) * 100
  if (p >= 85) return { text: 'Excellent', cls: 'tag-excellent' }
  if (p >= 70) return { text: 'Good', cls: 'tag-good' }
  if (p >= 50) return { text: 'Average', cls: 'tag-average' }
  return { text: 'Needs Work', cls: 'tag-poor' }
}

function getRiskMeter(score) {
  if (score >= 80) return { label: 'LOW RISK', color: '#28a745', bg: '#d4edda', pct: 20 }
  if (score >= 65) return { label: 'MILD CONCERN', color: '#ffc107', bg: '#fff3cd', pct: 50 }
  if (score >= 50) return { label: 'MODERATE CONCERN', color: '#fd7e14', bg: '#fde8d0', pct: 70 }
  return { label: 'ELEVATED CONCERN', color: '#dc3545', bg: '#f8d7da', pct: 90 }
}

function buildFallback(d) {
  const overall = d.cognitiveScore >= 85 ? 'strong' : d.cognitiveScore >= 70 ? 'good' : d.cognitiveScore >= 50 ? 'moderate' : 'below expected'
  const strengths = []
  const weaknesses = []
  const recs = []

  // Memory
  if (d.memory >= 24)      strengths.push('Memory recall is excellent — strong word retention and recognition')
  else if (d.memory >= 18) strengths.push('Memory recall is good — above average retention')
  else if (d.memory < 15)  { weaknesses.push('Memory recall needs improvement — word retention is below expected range'); recs.push('Practice daily word-recall exercises and maintain a consistent sleep schedule') }
  else                     weaknesses.push('Memory recall is slightly below optimal — minor improvement possible')

  // Fluency
  if (d.fluency >= 16)      strengths.push('Verbal fluency is strong — language processing speed is fast')
  else if (d.fluency >= 12) strengths.push('Verbal fluency is adequate — within normal range')
  else if (d.fluency < 10)  { weaknesses.push('Verbal fluency is below average — word-finding speed is slower than expected'); recs.push('Read aloud for 10 minutes daily and practice naming objects around you') }
  else                      weaknesses.push('Verbal fluency is slightly below optimal')

  // Reaction
  if (d.reaction >= 16)      strengths.push('Reaction speed is fast — processing speed is well above average')
  else if (d.reaction >= 12) strengths.push('Reaction speed is within healthy range')
  else if (d.reaction < 10)  { weaknesses.push('Reaction speed is slower than optimal — processing speed needs attention'); recs.push('Play 5-minute daily reaction games to sharpen neural processing speed') }
  else                       weaknesses.push('Reaction speed is slightly lower than memory and fluency — still within range')

  // Matching
  if (d.matching >= 24)      strengths.push('Visual memory is excellent — strong spatial recall and concentration')
  else if (d.matching >= 18) strengths.push('Visual memory is good — above average pattern recognition')
  else if (d.matching < 15)  { weaknesses.push('Visual memory needs attention — spatial recall is below expected range'); recs.push('Use visualization techniques and practice memory card games regularly') }
  else                       weaknesses.push('Visual memory is slightly below optimal')

  // Ensure at least one of each
  if (strengths.length === 0) strengths.push('Completed all four cognitive assessment domains')
  if (weaknesses.length === 0) {
    // Find the relatively weakest domain even if all are good
    const domains = [
      { name: 'Reaction speed', pct: (d.reaction / 20) * 100 },
      { name: 'Verbal fluency', pct: (d.fluency / 20) * 100 },
      { name: 'Memory recall',  pct: (d.memory / 30) * 100 },
      { name: 'Visual memory',  pct: (d.matching / 30) * 100 },
    ].sort((a, b) => a.pct - b.pct)
    weaknesses.push(`${domains[0].name} is the relatively weakest domain (${Math.round(domains[0].pct)}%) — still within healthy range but has the most room for improvement`)
  }
  if (recs.length === 0) recs.push('Maintain current healthy habits, ensure 7–8 hours of sleep, and take regular assessments to track trends')

  const prediction = d.cognitiveScore >= 85
    ? 'If you maintain current habits, cognitive health is expected to remain stable or continue improving.'
    : d.cognitiveScore >= 70
    ? 'With light targeted exercises in weaker domains, you can expect measurable improvement within 4–6 weeks.'
    : d.cognitiveScore >= 50
    ? 'Focused cognitive training in weak areas can lead to significant improvement. Consider professional guidance.'
    : 'Professional evaluation is recommended alongside focused cognitive training for meaningful improvement.'

  return { summary: `Your overall cognitive performance is ${overall} (${d.cognitiveScore}/100). ${strengths.length > 1 ? 'Multiple domains are performing well.' : 'Some domains require targeted attention.'}`, strengths, weaknesses, recommendations: recs, prediction }
}

export default function AIInsights({ userData }) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userData?.cognitiveScore != null) generateInsight()
  }, [userData])

  const generateInsight = async () => {
    if (!userData) return
    setLoading(true)
    setInsight(null)
    try {
      const prompt = `You are a cognitive health analyst. Analyze this assessment data and respond ONLY with valid JSON (no markdown, no code blocks):
{
  "summary": "2-sentence plain-English summary of overall performance",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"] or ["No significant weaknesses detected"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2"],
  "prediction": "1-sentence prediction of future cognitive health if current habits continue"
}

Data:
- Overall Score: ${userData.cognitiveScore}/100
- Memory: ${userData.memory}/30
- Verbal Fluency: ${userData.fluency}/20
- Reaction Speed: ${userData.reaction}/20
- Visual Memory (Matching): ${userData.matching}/30`

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 600 } })
        }
      )
      const data = await res.json()
      let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      raw = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(raw)
      setInsight(parsed)
    } catch {
      setInsight(buildFallback(userData))
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return (
      <div className="ai-insights empty-insights">
        <div className="ai-insights-header"><span className="ai-icon">🤖</span><h3>AI Health Insights</h3></div>
        <p className="no-data-msg">Complete an assessment to unlock personalized AI insights about your cognitive health.</p>
      </div>
    )
  }

  const risk = getRiskMeter(userData.cognitiveScore)
  const domains = [
    { label: 'Memory', score: userData.memory, max: 30 },
    { label: 'Fluency', score: userData.fluency, max: 20 },
    { label: 'Reaction', score: userData.reaction, max: 20 },
    { label: 'Matching', score: userData.matching, max: 30 },
  ]

  return (
    <div className="ai-insights">
      <div className="ai-insights-header">
        <span className="ai-icon">🤖</span>
        <h3>AI Health Insights</h3>
        <button className="refresh-btn" onClick={generateInsight} disabled={loading} title="Refresh insights">↻</button>
      </div>

      {/* Risk Meter */}
      <div className="risk-meter" style={{ background: risk.bg, borderColor: risk.color }}>
        <div className="risk-meter-label" style={{ color: risk.color }}>
          <span className="risk-dot" style={{ background: risk.color }} />
          {risk.label}
        </div>
        <div className="risk-bar-track">
          <div className="risk-bar-fill" style={{ width: `${risk.pct}%`, background: risk.color }} />
        </div>
      </div>

      {/* Domain Tags */}
      <div className="domain-tags">
        {domains.map(d => {
          const lbl = getLabel(d.score, d.max)
          return (
            <div key={d.label} className="domain-tag">
              <span className="domain-tag-name">{d.label}</span>
              <span className={`domain-tag-badge ${lbl.cls}`}>{lbl.text}</span>
              <span className="domain-tag-score">{d.score}/{d.max}</span>
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="insight-loading">
          <div className="insight-spinner" />
          <span>Analyzing your cognitive data with AI...</span>
        </div>
      )}

      {insight && !loading && (
        <div className="insight-body">
          <div className="insight-block summary-block">
            <p>{insight.summary}</p>
          </div>

          <div className="insight-columns">
            <div className="insight-block strengths-block">
              <h4>✅ Strengths</h4>
              <ul>{insight.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="insight-block weaknesses-block">
              <h4>⚠️ Areas to Improve</h4>
              <ul>{insight.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          </div>

          <div className="insight-block recs-block">
            <h4>🎯 Recommendations</h4>
            <ul>{insight.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>

          <div className="insight-block prediction-block">
            <h4>📈 Prediction</h4>
            <p>{insight.prediction}</p>
          </div>
        </div>
      )}
    </div>
  )
}
