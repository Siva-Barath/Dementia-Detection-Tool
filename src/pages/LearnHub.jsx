import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WellnessCheckin.css'
import './LearnHub.css'

const ARTICLES = [
  {
    id: 1, category: 'Sleep', icon: '😴', color: '#4a6cf7',
    title: 'How Sleep Affects Memory & Cognition',
    summary: 'Sleep is when your brain consolidates memories and clears toxic waste. Chronic sleep deprivation is one of the strongest modifiable risk factors for dementia.',
    content: [
      'During deep sleep (NREM stage 3), the brain replays and consolidates memories from the day — transferring them from short-term to long-term storage.',
      'The glymphatic system — your brain\'s waste-clearance mechanism — is 10x more active during sleep. It flushes out amyloid-beta, a protein linked to Alzheimer\'s disease.',
      'Even one night of poor sleep (< 6 hours) measurably impairs working memory, attention, and reaction time the next day.',
      'Chronic sleep deprivation (< 7 hours/night for years) is associated with a 30–40% increased risk of cognitive decline.',
      '✅ Target: 7–9 hours of consistent sleep. Keep a fixed wake time even on weekends.',
    ]
  },
  {
    id: 2, category: 'Stress', icon: '🧘', color: '#fd7e14',
    title: 'Why Chronic Stress Slows Your Thinking',
    summary: 'Cortisol — the stress hormone — physically shrinks the hippocampus (your memory center) over time. Managing stress is one of the most powerful things you can do for brain health.',
    content: [
      'The hippocampus — critical for forming new memories — has a high density of cortisol receptors. Chronic stress causes it to physically shrink.',
      'Acute stress temporarily improves focus (fight-or-flight). But chronic stress impairs prefrontal cortex function — reducing decision-making, attention, and emotional regulation.',
      'Stress-induced inflammation is now considered a key driver of neurodegeneration.',
      'Mindfulness meditation for just 8 weeks has been shown to increase gray matter density in the hippocampus.',
      '✅ Practice: 5 minutes of deep breathing daily, regular exercise, and social connection all reduce cortisol.',
    ]
  },
  {
    id: 3, category: 'Nutrition', icon: '🥦', color: '#28a745',
    title: 'Brain Foods for Better Focus & Memory',
    summary: 'Your brain is 60% fat and consumes 20% of your body\'s energy. What you eat directly determines how well it functions.',
    content: [
      'Omega-3 fatty acids (found in fatty fish, walnuts, flaxseed) are essential for building brain cell membranes and reducing neuroinflammation.',
      'Blueberries contain anthocyanins that cross the blood-brain barrier and improve memory and learning.',
      'Leafy greens (spinach, kale) are rich in folate, vitamin K, and lutein — all linked to slower cognitive decline.',
      'The MIND diet (Mediterranean + DASH) has been shown to reduce Alzheimer\'s risk by up to 53% in strict followers.',
      'Ultra-processed foods and high sugar intake are associated with accelerated brain aging and reduced hippocampal volume.',
      '✅ Eat: fatty fish 2x/week, daily leafy greens, berries, nuts, olive oil. Limit: sugar, processed foods, alcohol.',
    ]
  },
  {
    id: 4, category: 'Exercise', icon: '🏃', color: '#17a2b8',
    title: 'Exercise: The Most Powerful Brain Drug',
    summary: 'Aerobic exercise increases BDNF — brain-derived neurotrophic factor — which literally grows new brain cells. It\'s the single most evidence-backed intervention for cognitive health.',
    content: [
      'BDNF (brain-derived neurotrophic factor) is released during aerobic exercise. It promotes neurogenesis — the growth of new neurons — especially in the hippocampus.',
      'Regular exercisers have a hippocampus that is 2% larger than sedentary individuals — equivalent to reversing 1–2 years of age-related shrinkage.',
      'Even a single 20-minute walk improves executive function and memory for up to 2 hours afterward.',
      'Exercise reduces amyloid-beta accumulation, improves cerebral blood flow, and reduces neuroinflammation.',
      '✅ Target: 150 minutes of moderate aerobic exercise per week (brisk walking counts). Add resistance training 2x/week.',
    ]
  },
  {
    id: 5, category: 'Screen Time', icon: '📵', color: '#8B0000',
    title: 'Screen Time & Cognitive Health',
    summary: 'Excessive screen time disrupts sleep, reduces attention span, and is associated with structural changes in the developing brain.',
    content: [
      'Blue light from screens suppresses melatonin production — delaying sleep onset by up to 90 minutes when used within 2 hours of bedtime.',
      'Constant notifications fragment attention. Research shows it takes an average of 23 minutes to fully regain focus after an interruption.',
      'Heavy social media use is associated with reduced gray matter in the anterior cingulate cortex — a region involved in impulse control and decision-making.',
      'The "digital dementia" hypothesis suggests that over-reliance on devices for memory (GPS, reminders) may reduce the brain\'s own memory capacity over time.',
      '✅ Limit: < 4 hours recreational screen time daily. No screens 1 hour before bed. Use grayscale mode to reduce compulsive checking.',
    ]
  },
  {
    id: 6, category: 'Social', icon: '👥', color: '#6f42c1',
    title: 'Social Connection & Brain Health',
    summary: 'Loneliness is as damaging to health as smoking 15 cigarettes a day. Strong social connections are one of the most powerful predictors of cognitive longevity.',
    content: [
      'Social interaction activates multiple brain regions simultaneously — making it one of the most cognitively demanding activities.',
      'Loneliness increases cortisol, disrupts sleep, and is associated with a 64% increased risk of developing dementia.',
      'People with strong social networks have larger hippocampal volumes and better memory performance in old age.',
      'Even brief positive social interactions (5–10 minutes) improve working memory and executive function.',
      '✅ Prioritize: regular face-to-face interaction, joining clubs or groups, volunteering, and maintaining close friendships.',
    ]
  },
]

const WHEN_TO_SEE_DOCTOR = [
  { icon: '🔁', symptom: 'Asking the same questions repeatedly within a short time' },
  { icon: '🗺️', symptom: 'Getting lost in familiar places or forgetting well-known routes' },
  { icon: '📅', symptom: 'Losing track of dates, seasons, or the passage of time' },
  { icon: '💬', symptom: 'Difficulty finding words mid-sentence or following conversations' },
  { icon: '🧾', symptom: 'Trouble managing finances, bills, or following instructions' },
  { icon: '😤', symptom: 'Sudden personality changes, increased anxiety, or withdrawal from activities' },
  { icon: '🔑', symptom: 'Misplacing items frequently and being unable to retrace steps' },
  { icon: '🍳', symptom: 'Difficulty completing familiar tasks like cooking or driving' },
]

export default function LearnHub() {
  const [open, setOpen] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...new Set(ARTICLES.map(a => a.category))]
  const filtered = activeCategory === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory)

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container" style={{ maxWidth: 1100 }}>
          <header className="page-header">
            <h1>📖 Cognitive Health Learning Hub</h1>
            <p>Evidence-based articles on brain health, memory, and cognitive wellness</p>
          </header>

          {/* Category filter */}
          <div className="category-filter">
            {categories.map(c => (
              <button
                key={c}
                className={`cat-btn ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="articles-grid">
            {filtered.map(article => (
              <div key={article.id} className="article-card" onClick={() => setOpen(open === article.id ? null : article.id)}>
                <div className="article-header">
                  <div className="article-icon" style={{ background: article.color + '20', color: article.color }}>
                    {article.icon}
                  </div>
                  <div className="article-meta">
                    <span className="article-category" style={{ color: article.color }}>{article.category}</span>
                    <h3 className="article-title">{article.title}</h3>
                  </div>
                  <span className="article-toggle">{open === article.id ? '▲' : '▼'}</span>
                </div>
                <p className="article-summary">{article.summary}</p>
                {open === article.id && (
                  <div className="article-content">
                    {article.content.map((para, i) => (
                      <p key={i} className={para.startsWith('✅') ? 'takeaway' : ''}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* When to see a doctor */}
          <div className="card doctor-section">
            <div className="card-title" style={{ color: '#dc3545' }}>
              ⚕️ When to Consult a Doctor
            </div>
            <p className="doctor-intro">
              Occasional forgetfulness is normal. But certain patterns may indicate something that warrants professional evaluation. If you or someone you know experiences any of the following regularly, consult a neurologist or GP:
            </p>
            <div className="symptoms-grid">
              {WHEN_TO_SEE_DOCTOR.map(({ icon, symptom }) => (
                <div key={symptom} className="symptom-item">
                  <span className="symptom-icon">{icon}</span>
                  <span className="symptom-text">{symptom}</span>
                </div>
              ))}
            </div>
            <div className="doctor-cta">
              <div className="doctor-cta-inner">
                <strong>🏥 Find Professional Help</strong>
                <p>If you have concerns about cognitive health, contact your primary care physician, a neurologist, or a memory clinic. Early evaluation leads to better outcomes.</p>
                <div className="helpline-row">
                  <div className="helpline-item">
                    <strong>Alzheimer's Association Helpline</strong>
                    <span>1-800-272-3900 (24/7)</span>
                  </div>
                  <div className="helpline-item">
                    <strong>Dementia Support Line (UK)</strong>
                    <span>0333 150 3456</span>
                  </div>
                  <div className="helpline-item">
                    <strong>iCall Mental Health (India)</strong>
                    <span>9152987821</span>
                  </div>
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
