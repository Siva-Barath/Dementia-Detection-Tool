import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MemoryGame, { calculateScore } from '../components/MemoryGame'
import { getRandomWords, getDistractorWords, ANIMALS } from '../utils/wordPool'
import { calculateMemoryScore, calculateVerbalScore, calculateReactionScore, calculateFinalScore } from '../utils/scoring'
import './Assessment.css'

function Assessment() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  // Memory
  const [memoryWords] = useState(getRandomWords(5))
  const [showWords, setShowWords] = useState(false)
  const [memoryTimer, setMemoryTimer] = useState(10)
  const [memoryStarted, setMemoryStarted] = useState(false)
  const [distractionAnswer, setDistractionAnswer] = useState('')
  const [mathProblem] = useState({
    a: Math.floor(Math.random() * 20) + 5,
    b: Math.floor(Math.random() * 20) + 5
  })
  const [recallWords, setRecallWords] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [memoryResult, setMemoryResult] = useState(null)

  // Verbal
  const [verbalWords, setVerbalWords] = useState('')
  const [verbalTimer, setVerbalTimer] = useState(15)
  const [verbalStarted, setVerbalStarted] = useState(false)
  const [verbalResult, setVerbalResult] = useState(null)

  // Reaction
  const [reactionTrials, setReactionTrials] = useState([])
  const [currentTrial, setCurrentTrial] = useState(0)
  const [reactionPhase, setReactionPhase] = useState('idle')
  const [reactionTimer, setReactionTimer] = useState(3)
  const [showReactionTarget, setShowReactionTarget] = useState(false)
  const [targetPosition, setTargetPosition] = useState({ x: 200, y: 150 })
  const [reactionResult, setReactionResult] = useState(null)
  const [earlyClickWarning, setEarlyClickWarning] = useState(false)
  const [earlyClickPenalties, setEarlyClickPenalties] = useState(0)

  const reactionAreaRef  = useRef(null)
  const missTimerRef     = useRef(null)
  const reactionStartRef = useRef(null)
  const circleClickedRef = useRef(false)

  // Matching Game
  const [matchingResult, setMatchingResult] = useState(null)

  // Final
  const [finalResult, setFinalResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Memory timer
  useEffect(() => {
    if (showWords && memoryTimer > 0) {
      const t = setTimeout(() => setMemoryTimer(memoryTimer - 1), 1000)
      return () => clearTimeout(t)
    }
    if (memoryTimer === 0 && showWords) {
      setShowWords(false)
      setCurrentStep(2)
    }
  }, [showWords, memoryTimer])

  // Verbal timer
  useEffect(() => {
    if (verbalStarted && verbalTimer > 0) {
      const t = setTimeout(() => setVerbalTimer(verbalTimer - 1), 1000)
      return () => clearTimeout(t)
    }
    if (verbalTimer === 0 && verbalStarted) {
      const result = calculateVerbalScore(verbalWords, ANIMALS)
      setVerbalResult(result)
      setVerbalStarted(false)
    }
  }, [verbalStarted, verbalTimer, verbalWords])

  // Reaction countdown
  useEffect(() => {
    if (reactionPhase !== 'countdown') return
    if (reactionTimer > 0) {
      const t = setTimeout(() => setReactionTimer(prev => prev - 1), 1000)
      return () => clearTimeout(t)
    }
    setReactionPhase('waiting')
  }, [reactionPhase, reactionTimer])

  // Reaction: waiting → show circle
  useEffect(() => {
    if (reactionPhase !== 'waiting') return
    const delay = Math.random() * 1500 + 800
    const t = setTimeout(() => {
      const circleSize      = 80
      const containerWidth  = reactionAreaRef.current ? reactionAreaRef.current.offsetWidth : 700
      const containerHeight = 300

      setTargetPosition({
        x: Math.max(0, Math.random() * (containerWidth - circleSize)),
        y: Math.max(0, Math.random() * (containerHeight - circleSize))
      })

      circleClickedRef.current = false
      setShowReactionTarget(true)

      // Single rAF — timer starts after circle is rendered
      requestAnimationFrame(() => {
        reactionStartRef.current = performance.now()
        setReactionPhase('visible')
      })

      // Auto-miss at 2200ms
      missTimerRef.current = setTimeout(() => {
        if (circleClickedRef.current) return
        setShowReactionTarget(false)
        setReactionPhase('idle')
        setReactionTrials(prev => {
          const newTrials = [...prev, 9999]
          if (newTrials.length >= 5) {
            setReactionResult(calculateReactionScore(newTrials, earlyClickPenalties))
            setReactionPhase('done')
          } else {
            setTimeout(() => startNextTrial(newTrials.length + 1), 600)
          }
          return newTrials
        })
      }, 2200)
    }, delay)
    return () => clearTimeout(t)
  }, [reactionPhase])

  // Build recall word list
  useEffect(() => {
    if (currentStep === 3 && recallWords.length === 0) {
      const distractors = getDistractorWords(memoryWords, 7)
      setRecallWords([...memoryWords, ...distractors].sort(() => Math.random() - 0.5))
    }
  }, [currentStep, memoryWords, recallWords.length])

  // Memory handlers
  const handleStartMemory = () => {
    setShowWords(true)
    setMemoryStarted(true)
    setMemoryTimer(10)
  }

  const toggleWordSelection = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word))
    } else if (selectedWords.length < 5) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRecallSubmit = () => {
    const distractionCorrect = parseInt(distractionAnswer.trim(), 10) === (mathProblem.a + mathProblem.b)
    setMemoryResult(calculateMemoryScore(selectedWords, memoryWords, distractionCorrect))
    setCurrentStep(4)
  }

  // Verbal handlers
  const handleStartVerbal = () => {
    setVerbalStarted(true)
    setVerbalTimer(15)
  }

  const handleVerbalNext = () => {
    if (verbalStarted) {
      const result = calculateVerbalScore(verbalWords, ANIMALS)
      setVerbalResult(result)
      setVerbalStarted(false)
    }
    setCurrentStep(5)
  }

  // Reaction helpers
  const startNextTrial = (trialNumber) => {
    setCurrentTrial(trialNumber)
    setShowReactionTarget(false)
    reactionStartRef.current = null
    setReactionTimer(3)
    setReactionPhase('countdown')
  }

  const handleStartReaction = () => startNextTrial(1)

  const handleReactionAreaClick = () => {
    if (reactionPhase === 'waiting' || reactionPhase === 'countdown') {
      setEarlyClickWarning(true)
      setEarlyClickPenalties(prev => prev + 1)
      setTimeout(() => setEarlyClickWarning(false), 1500)
    }
  }

  // onMouseDown for faster capture; ignore < 120ms (not humanly possible)
  const handleCircleMouseDown = (e) => {
    e.stopPropagation()
    if (reactionPhase !== 'visible' || !reactionStartRef.current) return
    if (circleClickedRef.current) return

    const raw = performance.now() - reactionStartRef.current

    // Ignore impossibly fast clicks (< 120ms)
    if (raw < 120) return

    circleClickedRef.current = true

    if (missTimerRef.current) {
      clearTimeout(missTimerRef.current)
      missTimerRef.current = null
    }

    reactionStartRef.current = null
    setShowReactionTarget(false)
    setReactionPhase('idle')

    setReactionTrials(prev => {
      const newTrials = [...prev, raw]
      if (newTrials.length < 5) {
        setTimeout(() => startNextTrial(newTrials.length + 1), 1000)
      } else {
        setReactionResult(calculateReactionScore(newTrials, earlyClickPenalties))
        setReactionPhase('done')
      }
      return newTrials
    })
  }

  // Matching Game handler
  const handleMatchingComplete = (gameResult) => {
    setMatchingResult(gameResult)
    const final = calculateFinalScore(
      memoryResult   || { totalScore: 0 },
      verbalResult   || { totalScore: 0 },
      reactionResult || { totalScore: 0 },
      gameResult
    )
    setFinalResult(final)
    setCurrentStep(7)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => navigate('/results', { state: { finalResult } }), 2000)
  }

  const progress  = (memoryTimer / 10) * 100
  const wordCount = verbalWords.trim().split(/\s+/).filter(w => w.length > 0).length
  const fmtMs     = (ms) => ms === 9999 ? 'Missed' : `${Math.round(ms)}ms`

  return (
    <>
      <Navbar />
      <div className="assessment-page">
        <div className="assessment-container">

          <header className="assessment-header">
            <h1>Cognisense Cognitive Health Assessment</h1>
            <p>Complete tasks below to evaluate your cognitive function with Cognisense.</p>
            <div className="header-divider"></div>
          </header>

          <div className="step-indicator">
            {[['Memory',1,3],['Cognitive',4,5],['Matching',6,6],['Results',7,7]].map(([label, start, end], i) => (
              <>
                {i > 0 && <div key={`line-${i}`} className="step-line"></div>}
                <div key={label} className={`step ${currentStep >= start ? 'active' : ''} ${currentStep > end ? 'completed' : ''}`}>
                  <div className="step-number">{i + 1}</div>
                  <div className="step-label">{label}</div>
                </div>
              </>
            ))}
          </div>

          {/* STEP 1 — Word Encoding */}
          {currentStep === 1 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Word Encoding</h2>
                  <span className="step-badge">Memory — Part 1/3</span>
                </div>
                <p className="test-instructions">Memorize these words carefully. You will be asked to recognize them later.</p>
                {!memoryStarted && <button className="start-btn" onClick={handleStartMemory}>Start Memory Test</button>}
                {showWords && (
                  <div className="memory-words">
                    <div className="circular-timer">
                      <svg className="timer-svg" viewBox="0 0 100 100">
                        <circle className="timer-bg" cx="50" cy="50" r="45" />
                        <circle className="timer-progress" cx="50" cy="50" r="45"
                          style={{ strokeDashoffset: 283 - (283 * progress) / 100 }} />
                      </svg>
                      <div className="timer-text">{memoryTimer}s</div>
                    </div>
                    <div className="words-grid">
                      {memoryWords.map((word, i) => (
                        <span key={i} className="word-item" style={{ animationDelay: `${i * 0.1}s` }}>{word}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STEP 2 — Distraction */}
          {currentStep === 2 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Distraction Task</h2>
                  <span className="step-badge">Memory — Part 2/3</span>
                </div>
                <p className="test-instructions">Solve this math problem before continuing.</p>
                <div className="distraction-task">
                  <div className="math-problem"><h3>{mathProblem.a} + {mathProblem.b} = ?</h3></div>
                  <input type="number" className="recall-input" placeholder="Enter your answer"
                    value={distractionAnswer} onChange={(e) => setDistractionAnswer(e.target.value)} />
                </div>
                <div className="step-actions">
                  <button className="next-btn" onClick={() => setCurrentStep(3)} disabled={!distractionAnswer}>Continue →</button>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 — Recognition */}
          {currentStep === 3 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Recognition Test</h2>
                  <span className="step-badge">Memory — Part 3/3</span>
                </div>
                <p className="test-instructions">Select exactly 5 words you saw earlier.</p>
                <div className="recognition-grid">
                  {recallWords.map((word, i) => (
                    <button key={i}
                      className={`recognition-word ${selectedWords.includes(word) ? 'selected' : ''}`}
                      onClick={() => toggleWordSelection(word)}>
                      {word}
                    </button>
                  ))}
                </div>
                <div className="selection-count">Selected: {selectedWords.length} / 5</div>
                <div className="step-actions">
                  <button className="next-btn" onClick={handleRecallSubmit} disabled={selectedWords.length !== 5}>
                    Submit Selection →
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* STEP 4 — Verbal Fluency */}
          {currentStep === 4 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Verbal Fluency Test</h2>
                  <span className="step-badge">Cognitive Test</span>
                </div>
                <p className="test-instructions">Type as many animal names as you can in 15 seconds. Separate with spaces.</p>
                {!verbalStarted && !verbalResult && (
                  <button className="start-btn" onClick={handleStartVerbal}>Start Verbal Test</button>
                )}
                {verbalStarted && (
                  <div className="verbal-test">
                    <div className="timer-display">{verbalTimer}s remaining</div>
                    <div className="word-counter">Words typed: {wordCount}</div>
                    <textarea className="verbal-input" placeholder="dog cat elephant tiger..."
                      value={verbalWords} onChange={(e) => setVerbalWords(e.target.value)} autoFocus />
                  </div>
                )}
                {verbalResult && (
                  <div className="step-actions">
                    <button className="next-btn" onClick={handleVerbalNext}>Continue →</button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STEP 5 — Reaction */}
          {currentStep === 5 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Reaction Time Test</h2>
                  <span className="step-badge">Trial {currentTrial}/5</span>
                </div>
                <p className="test-instructions">
                  Press the green circle as quickly as possible when it appears.
                  <strong> Do not click before it appears</strong> — early clicks will be penalised.
                </p>

                {earlyClickPenalties > 0 && (
                  <p className="early-penalty-notice">⚠️ Early click penalties: <strong>{earlyClickPenalties}</strong></p>
                )}

                {reactionPhase === 'idle' && reactionTrials.length === 0 && (
                  <button className="start-btn" onClick={handleStartReaction}>Start Reaction Test</button>
                )}

                {(reactionPhase === 'countdown' || reactionPhase === 'waiting' || reactionPhase === 'visible') && (
                  <div className="reaction-area" ref={reactionAreaRef} onClick={handleReactionAreaClick}>
                    {reactionPhase === 'countdown' && (
                      <div className="reaction-wait">Get Ready... {reactionTimer}</div>
                    )}
                    {reactionPhase === 'waiting' && (
                      <div className="reaction-wait">Wait for it...</div>
                    )}
                    {reactionPhase === 'visible' && showReactionTarget && (
                      <div
                        className="reaction-target"
                        onMouseDown={handleCircleMouseDown}
                        onTouchStart={handleCircleMouseDown}
                        style={{ left: `${targetPosition.x}px`, top: `${targetPosition.y}px` }}
                      />
                    )}
                    {earlyClickWarning && (
                      <div className="early-warning">⚠️ Too early! Wait for the circle.</div>
                    )}
                  </div>
                )}

                {reactionTrials.length > 0 && reactionTrials.length < 5 && reactionPhase === 'idle' && (
                  <div className="trial-progress">Completed {reactionTrials.length}/5 trials...</div>
                )}

                {reactionPhase === 'done' && reactionResult && (
                  <div className="step-actions">
                    <button className="next-btn" onClick={() => setCurrentStep(6)}>Continue →</button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STEP 6 — Memory Matching Game */}
          {currentStep === 6 && (
            <section className="test-section step-content">
              <div className="test-card">
                <div className="card-header">
                  <h2>Memory Matching Game</h2>
                  <span className="step-badge">Visual Memory</span>
                </div>
                <p className="test-instructions">Flip cards to find all matching pairs. Complete as quickly and accurately as possible.</p>
                <MemoryGame onComplete={handleMatchingComplete} />
              </div>
            </section>
          )}

          {/* STEP 7 — Results */}
          {currentStep === 7 && finalResult && (
            <section className="test-section step-content">
              <div className="test-card review-card">
                <div className="card-header">
                  <h2>Cognitive Screening Report</h2>
                  <span className="step-badge">Assessment Complete</span>
                </div>

                <div className="score-summary">
                  <div className="score-circle">
                    <svg viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                      <circle cx="100" cy="100" r="90" fill="none"
                        stroke={finalResult.riskClass === 'low' ? '#28a745' : finalResult.riskClass === 'moderate' ? '#ffc107' : '#dc3545'}
                        strokeWidth="20" strokeDasharray="565"
                        strokeDashoffset={565 - (565 * finalResult.cognitiveIndex) / 100}
                        transform="rotate(-90 100 100)" />
                    </svg>
                    <div className="score-text">
                      <h3>{finalResult.cognitiveIndex}</h3>
                      <p>/ 100</p>
                    </div>
                  </div>
                  <div className="risk-assessment">
                    <h3>Assessment Level</h3>
                    <p className={`risk-level ${finalResult.riskClass}`}>{finalResult.risk}</p>
                    <p className="score-verify">
                      {finalResult.breakdown.memory} + {finalResult.breakdown.fluency} + {finalResult.breakdown.reaction} + {finalResult.breakdown.matching} = {finalResult.cognitiveIndex}
                    </p>
                  </div>
                </div>

                <div className="interpretation-section">
                  <p>{finalResult.interpretation}</p>
                </div>

                <div className="domain-analysis">
                  <h3>Domain Analysis</h3>

                  <div className="domain-card">
                    <h4>Memory Function</h4>
                    <div className="domain-details">
                      <p><strong>Encoding Words:</strong> <span className="word-list">{memoryResult.originalWords?.join(', ')}</span></p>
                      <p><strong>User Selected:</strong> <span className="word-list">{selectedWords.join(', ')}</span></p>
                      <p><strong>Correct:</strong> {memoryResult.correct} &nbsp;|&nbsp; <strong>Incorrect:</strong> {memoryResult.falsePositives}</p>
                      <p><strong>Recognition Score:</strong> ({memoryResult.correct} × 5) − ({memoryResult.falsePositives} × 2.5) = {memoryResult.recognitionScore}</p>
                      <p><strong>Distraction:</strong> {mathProblem.a} + {mathProblem.b} = {mathProblem.a + mathProblem.b} &nbsp;|&nbsp; Your answer: {distractionAnswer} &nbsp;|&nbsp; {memoryResult.distractionCorrect ? '✓ Correct (+5)' : '✗ Incorrect (+0)'}</p>
                      <div className="domain-score">
                        <span>Domain Score:</span>
                        <div className="score-bar"><div style={{ width: `${(memoryResult.totalScore / 30) * 100}%` }} /></div>
                        <span>{memoryResult.totalScore}/30</span>
                      </div>
                    </div>
                  </div>

                  <div className="domain-card">
                    <h4>Verbal Fluency</h4>
                    <div className="domain-details">
                      <p><strong>Words Typed:</strong> <span className="word-list">{verbalWords}</span></p>
                      <p><strong>Valid Unique Animals:</strong> {verbalResult.valid} &nbsp;|&nbsp; <strong>Duplicates:</strong> {verbalResult.duplicates} &nbsp;|&nbsp; <strong>Invalid:</strong> {verbalResult.total - verbalResult.unique}</p>
                      {verbalResult.validWords?.length > 0 && (
                        <p><strong>Accepted:</strong> <span className="word-list accepted">{verbalResult.validWords.join(', ')}</span></p>
                      )}
                      <div className="domain-score">
                        <span>Domain Score:</span>
                        <div className="score-bar"><div style={{ width: `${(verbalResult.totalScore / 20) * 100}%` }} /></div>
                        <span>{verbalResult.totalScore}/20</span>
                      </div>
                    </div>
                  </div>

                  <div className="domain-card">
                    <h4>Reaction Speed</h4>
                    <div className="domain-details">
                      <div className="trials-grid">
                        {reactionTrials.map((t, i) => (
                          <span key={i} className={`trial-chip ${t === 9999 ? 'missed' : ''}`}>
                            Trial {i + 1}: {fmtMs(t)}
                          </span>
                        ))}
                      </div>
                      <p><strong>Hybrid Score (60% best + 40% avg):</strong> {reactionResult.hybrid}ms</p>
                      <p><strong>Fastest:</strong> {reactionResult.fastest}ms &nbsp;|&nbsp; <strong>Average:</strong> {reactionResult.average}ms &nbsp;|&nbsp; <strong>Missed:</strong> {reactionResult.missedTrials}</p>
                      {earlyClickPenalties > 0 && (
                        <p><strong>Early Click Penalties:</strong> {earlyClickPenalties}</p>
                      )}
                      <p><strong>Valid Trials:</strong> {reactionResult.validTrials}/{reactionResult.trials}</p>
                      <div className="domain-score">
                        <span>Domain Score:</span>
                        <div className="score-bar"><div style={{ width: `${(reactionResult.totalScore / 20) * 100}%` }} /></div>
                        <span>{reactionResult.totalScore}/20</span>
                      </div>
                    </div>
                  </div>

                  <div className="domain-card">
                    <h4>Memory Matching Game</h4>
                    <div className="domain-details">
                      {matchingResult && (
                        <>
                          <p><strong>Matches:</strong> {matchingResult.matches}/{matchingResult.totalPairs} &nbsp;|&nbsp; <strong>Total Clicks:</strong> {matchingResult.totalClicks}</p>
                          <p><strong>Accuracy:</strong> {matchingResult.accuracy}% &nbsp;|&nbsp; <strong>Efficiency:</strong> {matchingResult.efficiency}%</p>
                          <p><strong>Mistakes:</strong> {matchingResult.mistakes} &nbsp;|&nbsp; <strong>Time:</strong> {matchingResult.timeElapsed}s</p>
                          <p><strong>Time Bonus:</strong> +{matchingResult.timeBonus} &nbsp;|&nbsp; <strong>Mistake Penalty:</strong> -{matchingResult.mistakePenalty}</p>
                        </>
                      )}
                      <div className="domain-score">
                        <span>Domain Score:</span>
                        <div className="score-bar"><div style={{ width: `${(finalResult.breakdown.matching / 30) * 100}%` }} /></div>
                        <span>{finalResult.breakdown.matching}/30</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recommendation">
                  <h3>Clinical Recommendation</h3>
                  <p>
                    {finalResult.cognitiveIndex >= 85
                      ? 'Outstanding cognitive performance. Continue maintaining healthy lifestyle habits and regular assessments.'
                      : finalResult.cognitiveIndex >= 70
                      ? 'Good cognitive performance within expected ranges. Light targeted exercises in weaker domains can further improve your score.'
                      : finalResult.cognitiveIndex >= 50
                      ? 'Moderate cognitive concerns detected. Consulting a healthcare provider for clinical evaluation is recommended.'
                      : 'Notable cognitive concerns across multiple domains. Consulting a neurologist for formal clinical assessment is strongly recommended.'}
                  </p>
                </div>

                <div className="step-actions">
                  <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <><span className="btn-spinner" /> Generating Report...</> : 'Download Detailed Report'}
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Generating comprehensive cognitive report...</p>
        </div>
      )}
      <Footer />
    </>
  )
}

export default Assessment
