# NeuroCare — AI-Powered Cognitive Health Platform

> Early detection of cognitive decline through clinically-inspired assessments, AI-driven insights, and personalized health tracking.

---

## What is NeuroCare?

NeuroCare is a browser-based cognitive health platform that helps users monitor early signs of cognitive decline through a structured 4-domain assessment. It combines clinically-inspired test methodology with Google Gemini AI to generate personalized insights, track trends over time, and provide actionable recommendations — all without any medical equipment.

**This is not a medical diagnostic tool.** Results are for informational and screening purposes only. Always consult a qualified healthcare professional for clinical evaluation.

---

## Live Features

### 🧠 Cognitive Assessment (`/test`)
A 7-step wizard that evaluates four cognitive domains totalling **100 points**:

| Step | Domain | Task | Max Score |
|------|--------|------|-----------|
| 1 | Memory — Encoding | Memorize 5 words in 10 seconds | — |
| 2 | Memory — Distraction | Solve a math problem (interference task) | — |
| 3 | Memory — Recognition | Identify the 5 original words from a 12-word mixed list | 30 pts |
| 4 | Verbal Fluency | Name as many animals as possible in 15 seconds | 20 pts |
| 5 | Reaction Speed | Click a target circle across 5 timed trials | 20 pts |
| 6 | Visual Memory | Flip cards to find all 8 matching pairs | 30 pts |
| 7 | Results | Full domain breakdown + cognitive index | — |

**Scoring intelligence:**
- Memory uses recognition scoring: `(correct × 5) − (false positives × 2.5)` + 5 bonus for distraction task
- Verbal fluency uses fuzzy matching + Levenshtein distance to accept near-correct animal names (e.g. "elefant" → elephant)
- Reaction uses a hybrid score: `(best × 0.6) + (average × 0.4)` with penalties for missed trials and early clicks
- Matching game scores accuracy, efficiency, time bonus, and mistake penalty

**Cognitive Index labels:**
| Score | Label |
|-------|-------|
| 85–100 | Excellent |
| 70–84 | Good |
| 65–69 | Within Expected Range |
| 50–64 | Mild Concern |
| 35–49 | Moderate Concern |
| 0–34 | Elevated Concern |

---

### 📊 Cognitive Dashboard (`/dashboard`)
Your complete performance overview after taking assessments:

- **4 metric cards** — Cognitive Index with label, Trend (improving/stable/declining), Assessment Confidence %, Consistency rating
- **Score Comparison** — Previous vs current score with delta indicator (↑ improvement / ↓ decline)
- **Domain Performance** — 4 cards with score, percentage bar, and Excellent/Good/Average/Needs Work badge
- **⚡ Reaction Speed Analysis** — Deep dive into processing speed with speed benchmarks, label, progress bar, and improvement tips
- **🤖 AI Health Insights** — Gemini AI-generated structured analysis (see below)
- **Assessment History Chart** — Bar chart of last 7 tests with trend note
- **Lifestyle Risk Factors** — Pulled from Risk Assessment page
- **🎯 Next Step Nudge** — Tells you when your next assessment is recommended (3-day cadence)
- **PDF Report Download** — Generates a comprehensive text report

---

### 🤖 AI Health Insights (powered by Google Gemini)
Available on Dashboard and Profile pages. Generates a structured analysis from your cognitive scores:

- **Summary** — 2-sentence plain-English overview of overall performance
- **✅ Strengths** — Specific domains performing well with context
- **⚠️ Areas to Improve** — Specific weak domains with explanation (never generic — always identifies the relatively weakest domain even if all scores are good)
- **🎯 Recommendations** — Actionable, specific exercises and habits
- **📈 Prediction** — What to expect if current habits continue
- **Risk Meter** — Color-coded LOW / MILD / MODERATE / ELEVATED bar
- **Domain Tags** — Per-domain Excellent/Good/Average/Needs Work badges

Falls back to intelligent local analysis if the API is unavailable.

---

### 👤 Profile (`/profile`)
User overview and history — distinct from the Dashboard's performance focus:

- **Header** — Avatar, name, email, member since date
- **Cognitive Health Status** — Latest score, risk level, tests taken, progress trend vs previous test
- **AI Health Insights** — Full structured AI analysis (same component as Dashboard)
- **Personal Information** — Editable name, age, gender, phone
- **Assessment Summary** — Tests taken, average score, best score, last test date
- **Assessment History Table** — Full history with all domain scores and risk level per test
- **🎯 Next Step Nudge** — Personalized message on when to take the next assessment

---

### 🤖 CogniAI Chatbot (`/chatbot`)
A full-page conversational AI assistant powered by Google Gemini 2.5 Flash, specialized in:

- Dementia and Alzheimer's disease information
- Cognitive health, memory, and brain health questions
- Caregiver support and practical advice
- Symptom awareness and risk factor education

A floating **ChatBot widget** (`ChatBot.jsx`) is also available site-wide via the Navbar for quick access without leaving the current page.

Always includes a disclaimer that responses are not medical advice.

---

### ⚠️ Risk Factor Assessment (`/risk-assessment`)
A lifestyle questionnaire that evaluates dementia risk factors:

- Age group, family history of dementia
- Sleep quality, stress level
- Alcohol/smoking habits, exercise frequency, diet quality

Calculates an overall risk score (Low / Moderate / High) and saves to the dashboard.

---

### 💚 Daily Wellness Check-in (`/wellness`) ⭐ New
A quick daily self-assessment (30 seconds) tracking:

- **Mood** — 5-point emoji scale
- **Sleep** — Hours slept last night (4h–9h+)
- **Stress** — Low / Medium / High
- **Focus & Concentration** — Excellent / Good / Fair / Poor
- **Optional note** — Free-text field

Calculates a **Lifestyle Score (0–100)** per day. Shows today's score, 7-day average, a mini bar chart, and contextual tips based on current entries. History stored per user.

---

### 📅 Habit Tracker (`/habits`) ⭐ New
Daily habit checklist with 8 brain-health habits:

- Sleep 7+ hours, Drink 8 glasses water, Exercise/walk, Screen time < 4 hours
- Read 15 minutes, Mindfulness/breathing, No alcohol/smoking, Social interaction

Features:
- **Progress ring** — Visual circle showing today's completion %
- **Streak counter** — Consecutive days with 4+ habits completed
- **7-day overview** — Mini bar chart of weekly habit completion
- **Why These Habits Matter** — Evidence-based explanations for each habit category

---

### 🎯 Goal Setting (`/goals`) ⭐ New
Set and track personal health goals:

- **8 preset goals** — Sleep, exercise, screen time, hydration, reading, meditation, alcohol-free days, cognitive assessments
- **Custom goals** — Create goals with a custom title, numeric target, and unit (days/sessions/times/hours)
- **Progress tracking** — +1 increment button per goal with progress bar and percentage
- **Completed goals** — Separate section for achieved goals with celebration indicator

---

### 📖 Personal Journal (`/journal`) ⭐ New
A private reflective journaling tool:

- **Daily prompts** — 7 rotating cognitive/emotional reflection prompts with a refresh button
- **Mood logging** — 5-emoji mood selector per entry
- **Entry history** — Searchable, expandable past entries with delete option
- **Journal stats** — Total entries, 7-day average mood, average entry length

---

### 📖 Learning Hub (`/learn`) ⭐ New
Evidence-based educational content on brain health:

- **6 articles** covering Sleep, Stress, Nutrition, Exercise, Screen Time, and Social Connection
- Category filter to browse by topic
- Expandable article cards with full content and actionable takeaways
- **When to See a Doctor** section — 8 warning signs with helpline numbers (US, UK, India)

---

### 🔐 Authentication (`/login`, `/signup`)
- Local authentication using `localStorage` (no backend required)
- Signup collects name, email, age, gender, phone, password
- Passwords validated (min 6 chars, confirmation match)
- Session persists across browser refreshes
- Protected routes: Assessment, Results, Profile, Wellness, Habits, Goals, Journal require login

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM v6 |
| AI | Google Gemini 2.5 Flash API |
| Styling | CSS3 (custom, no UI library) |
| State | React Context API + localStorage |
| Theme | Dark/Light mode via ThemeContext |
| Font | Poppins (Google Fonts) |

---

## Project Structure

```
src/
├── components/
│   ├── AIInsights.jsx      # Structured AI insight component (Dashboard + Profile)
│   ├── AIInsights.css
│   ├── ChatBot.jsx         # Floating chatbot widget (site-wide, in Navbar)
│   ├── ChatBot.css
│   ├── Features.jsx        # Landing page feature cards
│   ├── Features.css
│   ├── Hero.jsx            # Landing page hero section
│   ├── Hero.css
│   ├── MemoryGame.jsx      # Card flip matching game (Step 6 of assessment)
│   ├── MemoryGame.css
│   ├── Navbar.jsx          # Responsive navbar with user dropdown + chat widget
│   ├── Navbar.css
│   ├── PDFReport.jsx       # Report generator + download
│   ├── PDFReport.css
│   ├── Footer.jsx
│   └── Footer.css
├── context/
│   ├── AuthContext.jsx     # Auth state (user, login, logout, updateProfile)
│   └── ThemeContext.jsx    # Dark/light theme toggle + persistence
├── pages/
│   ├── Home.jsx            # Landing page with personalized status banner
│   ├── Home.css
│   ├── Assessment.jsx      # 7-step cognitive test wizard
│   ├── Assessment.css
│   ├── Results.jsx         # Post-assessment results + save to history
│   ├── Results.css
│   ├── Dashboard.jsx       # Performance dashboard + reaction analysis
│   ├── Dashboard.css
│   ├── Profile.jsx         # User profile + history table
│   ├── Profile.css
│   ├── RiskAssessment.jsx  # Lifestyle risk questionnaire
│   ├── RiskAssessment.css
│   ├── ChatBotPage.jsx     # Full-page CogniAI chat interface
│   ├── ChatBotPage.css
│   ├── WellnessCheckin.jsx # Daily mood/sleep/stress/focus check-in
│   ├── WellnessCheckin.css
│   ├── HabitTracker.jsx    # Daily habit checklist + streak tracking
│   ├── HabitTracker.css
│   ├── Goals.jsx           # Goal setting + progress tracking
│   ├── Goals.css
│   ├── Journal.jsx         # Private reflective journal
│   ├── Journal.css
│   ├── LearnHub.jsx        # Educational articles on brain health
│   ├── LearnHub.css
│   ├── Test.jsx            # (legacy/alternate assessment entry)
│   ├── Test.css
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Auth.css
├── utils/
│   ├── scoring.js          # All scoring algorithms (memory, fluency, reaction, matching, final)
│   └── wordPool.js         # Word lists, animal list, helper functions
├── App.jsx                 # Routes + ProtectedRoute wrapper
├── main.jsx
└── index.css
```

---

## Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | Home | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/chatbot` | CogniAI Chat | No |
| `/dashboard` | Dashboard | No |
| `/risk-assessment` | Risk Assessment | No |
| `/learn` | Learning Hub | No |
| `/test` | Cognitive Assessment | ✅ Yes |
| `/results` | Results | ✅ Yes |
| `/profile` | Profile | ✅ Yes |
| `/wellness` | Wellness Check-in | ✅ Yes |
| `/habits` | Habit Tracker | ✅ Yes |
| `/goals` | Goal Setting | ✅ Yes |
| `/journal` | Personal Journal | ✅ Yes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#8B0000` | Buttons, accents, borders |
| Excellent | `#28a745` | High scores, low risk |
| Good | `#4a6cf7` | Above-average scores |
| Average | `#ffc107` | Mid-range scores |
| Concern | `#fd7e14` | Moderate risk |
| High Risk | `#dc3545` | Low scores, elevated concern |
| Dark BG | `#1a1a2e` | Hero, banners, dark cards |
| Light BG | `#f4f6fb` | Page backgrounds |

---

## Page Roles (Differentiated)

| Page | Purpose | Key Differentiator |
|------|---------|-------------------|
| Home | Landing + personalized snapshot | Status banner for logged-in users |
| Assessment | Take the cognitive test | 7-step wizard, 4 domains |
| Results | Immediate post-test summary | Score + interpretation |
| Dashboard | Performance analysis + reaction deep-dive | Score comparison, reaction benchmarks, history chart |
| Profile | User overview + full history | Editable info, history table, next-step nudge |
| CogniAI | Full-page conversational health assistant | Gemini-powered chat |
| Risk Assessment | Lifestyle risk evaluation | Questionnaire → risk score |
| Wellness Check-in | Daily mood/sleep/stress tracking | Lifestyle score + 7-day trend |
| Habit Tracker | Daily brain-health habits | Streak counter + progress ring |
| Goal Setting | Personal health goal management | Preset + custom goals with progress |
| Journal | Private reflective journaling | Mood logging + searchable history |
| Learning Hub | Brain health education | Evidence-based articles + doctor warning signs |

---

## Scoring Architecture

```
Assessment Result (100 pts total)
├── Memory Domain          /30
│   ├── Recognition Score  = (correct × 5) − (false positives × 2.5)
│   └── Distraction Bonus  = +5 if math answer correct
├── Verbal Fluency         /20
│   └── Valid unique animals (fuzzy + stem matching)
│       ≤3 → 5pts | ≤6 → 10pts | ≤9 → 15pts | 10+ → 20pts
├── Reaction Speed         /20
│   ├── Hybrid = (best × 0.6) + (average × 0.4)
│   ├── ≤400ms → 20 | ≤600ms → 18 | ≤800ms → 16 | ≤900ms → 14
│   ├── ≤1000ms → 12 | ≤1200ms → 10 | ≤1400ms → 7 | ≤1600ms → 5
│   └── Penalties: −2 per miss, −1 per early click
└── Visual Memory (Matching) /30
    ├── Accuracy score (max 15)
    ├── Efficiency score (max 10)
    ├── Time bonus (max 5)
    └── Mistake penalty (−0.3 per mistake after first 5)
```

---

## Known Limitations

- **No real backend** — all data stored in `localStorage`. Clearing browser data removes all history.
- **API key exposed** — the Gemini API key is hardcoded in the frontend. For production, proxy through a backend.
- **PDF download** — currently generates a `.txt` file. A real PDF library (e.g. `jsPDF`) would improve this.
- **Single device** — assessment history does not sync across devices.

---

## Disclaimer

NeuroCare is an educational and informational tool. It is **not a medical device** and does not provide clinical diagnoses. Results should not be used as a substitute for professional medical evaluation. If you have concerns about cognitive health, please consult a qualified healthcare professional or neurologist.

---

© 2024 NeuroCare. All rights reserved.