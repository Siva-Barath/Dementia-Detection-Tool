import { useState, useEffect, useRef } from 'react'
import './MemoryGame.css'

const CARD_SYMBOLS = ['🧠', '🔬', '💊', '🩺', '🧬', '🏥', '💉', '🩻']

function shuffle(arr) {
  return [...arr, ...arr]
    .map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v)
}

function MemoryGame({ onComplete }) {
  const [cards, setCards] = useState(() =>
    shuffle(CARD_SYMBOLS).map((symbol, i) => ({
      id: i, symbol, flipped: false, matched: false
    }))
  )
  const [selected, setSelected] = useState([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [matches, setMatches] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [locked, setLocked] = useState(false)
  const timerRef = useRef(null)
  const totalPairs = CARD_SYMBOLS.length

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (matches === totalPairs) {
      clearInterval(timerRef.current)
      setGameOver(true)
      const score = calculateScore(matches, totalPairs, totalClicks, mistakes, timeElapsed)
      setTimeout(() => onComplete(score), 800)
    }
  }, [matches])

  const handleCardClick = (card) => {
    if (locked || card.flipped || card.matched || !gameStarted) return

    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c)
    setCards(newCards)
    setTotalClicks(t => t + 1)

    const newSelected = [...selected, card]
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setLocked(true)
      const [a, b] = newSelected

      if (a.symbol === b.symbol) {
        setCards(prev => prev.map(c =>
          c.symbol === a.symbol ? { ...c, matched: true } : c
        ))
        setMatches(m => m + 1)
        setSelected([])
        setLocked(false)
      } else {
        setMistakes(m => m + 1)
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ))
          setSelected([])
          setLocked(false)
        }, 900)
      }
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="memory-game">
      {!gameStarted ? (
        <div className="game-intro">
          <p className="game-desc">
            Flip cards to find matching pairs. Complete all {totalPairs} pairs as quickly and accurately as possible.
          </p>
          <button className="start-btn" onClick={() => setGameStarted(true)}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-stats">
            <span>⏱ {formatTime(timeElapsed)}</span>
            <span>✅ {matches}/{totalPairs} pairs</span>
            <span>🖱 {totalClicks} clicks</span>
            <span>❌ {mistakes} mistakes</span>
          </div>

          <div className="cards-grid">
            {cards.map(card => (
              <div
                key={card.id}
                className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">{card.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function calculateScore(matches, totalPairs, totalClicks, mistakes, timeElapsed) {
  const accuracy = totalPairs > 0 ? matches / totalPairs : 0
  const efficiency = totalClicks > 0 ? matches / totalClicks : 0

  // Base score from accuracy (max 15)
  const accuracyScore = accuracy * 15

  // Efficiency score — generous tiers, memory games naturally have low efficiency
  let efficiencyScore = 0
  const effPct = efficiency * 100
  if (effPct >= 60) efficiencyScore = 10
  else if (effPct >= 40) efficiencyScore = 8
  else if (effPct >= 25) efficiencyScore = 7
  else if (effPct >= 15) efficiencyScore = 5
  else efficiencyScore = 3

  // Time bonus — extended windows
  let timeBonus = 0
  if (timeElapsed <= 45) timeBonus = 5
  else if (timeElapsed <= 70) timeBonus = 3
  else if (timeElapsed <= 100) timeBonus = 2
  else if (timeElapsed <= 140) timeBonus = 1

  // Mistake penalty — first 8 mistakes free, then 0.2 per mistake, capped at 4
  const mistakePenalty = mistakes <= 8 ? 0 : Math.min((mistakes - 8) * 0.2, 4)

  // Completion bonus
  const completionBonus = matches === totalPairs ? 5 : 0

  const totalScore = Math.max(0, Math.min(30,
    Math.round((accuracyScore + efficiencyScore + timeBonus + completionBonus - mistakePenalty) * 10) / 10
  ))

  return {
    matches, totalPairs, totalClicks, mistakes, timeElapsed,
    accuracy: Math.round(accuracy * 100),
    efficiency: Math.round(effPct),
    accuracyScore: Math.round(accuracyScore * 10) / 10,
    efficiencyScore,
    timeBonus,
    completionBonus,
    mistakePenalty,
    totalScore,
    maxScore: 30
  }
}

export default MemoryGame
