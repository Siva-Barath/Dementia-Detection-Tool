// MEMORY DOMAIN: 30 points total
export function calculateMemoryScore(selectedWords, originalWords, distractionCorrect) {
  let correct = 0, falsePositives = 0
  selectedWords.forEach(word => {
    if (originalWords.includes(word)) correct++
    else falsePositives++
  })
  let recognitionScore = Math.max(0, (correct * 5) - (falsePositives * 2.5))
  const distractionScore = distractionCorrect ? 5 : 0
  return {
    correct, falsePositives,
    total: originalWords.length, originalWords,
    recognitionScore, distractionScore, distractionCorrect,
    totalScore: recognitionScore + distractionScore,
    maxScore: 30
  }
}

// Levenshtein distance for fuzzy animal matching
function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = a[i-1] === b[j-1] ? m[i-1][j-1]
        : 1 + Math.min(m[i-1][j], m[i][j-1], m[i-1][j-1])
  return m[a.length][b.length]
}

// Strip common plural/possessive suffixes
function stem(word) {
  if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y'
  if (word.endsWith('ves') && word.length > 4) return word.slice(0, -3) + 'f'
  if (word.endsWith('ses') && word.length > 4) return word.slice(0, -2)
  if (word.endsWith('es')  && word.length > 4) return word.slice(0, -2)
  if (word.endsWith('s')   && word.length > 3) return word.slice(0, -1)
  return word
}

// VERBAL FLUENCY: 20 points total — fuzzy + stem-aware matching
export function calculateVerbalScore(words, validAnimals) {
  const wordList    = words.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0)
  const uniqueWords = [...new Set(wordList)]
  const duplicates  = wordList.length - uniqueWords.length
  const normalizedAnimals = validAnimals.map(a => a.toLowerCase())

  const validWords = uniqueWords.filter(w => {
    const ws = stem(w)
    return normalizedAnimals.some(animal => {
      const as = stem(animal)
      if (animal === w || as === ws || as === w || animal === ws) return true
      if (w.length <= 4) return false
      const threshold = w.length <= 6 ? 1 : 2
      return levenshtein(ws, as) <= threshold
    })
  })

  const validCount = validWords.length
  let score = 0
  if (validCount <= 3)  score = 5
  else if (validCount <= 6)  score = 10
  else if (validCount <= 9)  score = 15
  else score = 20

  return {
    total: wordList.length, unique: uniqueWords.length,
    valid: validCount, validWords, duplicates,
    totalScore: score, maxScore: 20
  }
}

// REACTION SPEED: 20 points total
// earlyClickPenalties: each early click = -1 from final score
export function calculateReactionScore(trials, earlyClickPenalties = 0) {
  if (trials.length === 0) {
    return { trials: 0, validTrials: 0, hybrid: 0, average: 0, fastest: 0, missedTrials: 0, totalScore: 0, maxScore: 20 }
  }

  const missedTrials = trials.filter(t => t === 9999).length
  // Ignore < 120ms (not humanly possible) and > 2500ms
  const validTrials = trials.filter(t => t >= 120 && t <= 2500)
  const working = validTrials.length >= 1 ? validTrials : trials.filter(t => t !== 9999 && t >= 120)

  if (working.length === 0) {
    return { trials: trials.length, validTrials: 0, hybrid: 0, average: 0, fastest: 0, missedTrials, totalScore: 0, maxScore: 20 }
  }

  // Skip first trial (warm-up) if enough data
  const scoringTrials = working.length > 2 ? working.slice(1) : working

  const best    = Math.min(...scoringTrials)
  const average = scoringTrials.reduce((s, t) => s + t, 0) / scoringTrials.length
  const hybrid  = (best * 0.6) + (average * 0.4)

  // Generous thresholds — browser latency + visual processing accounted for
  let base = 0
  if      (hybrid <= 500)  base = 20
  else if (hybrid <= 700)  base = 18
  else if (hybrid <= 900)  base = 16
  else if (hybrid <= 1100) base = 14
  else if (hybrid <= 1300) base = 12
  else if (hybrid <= 1500) base = 10
  else if (hybrid <= 1800) base = 8
  else if (hybrid <= 2200) base = 6
  else                     base = 4

  // Missed penalty: -1 each; early click penalty: -0 (no penalty)
  const totalScore = Math.max(0, base - (missedTrials * 1))

  return {
    trials: trials.length, validTrials: working.length, missedTrials,
    hybrid:   Math.round(hybrid),
    average:  Math.round(average),
    fastest:  Math.round(best),
    slowest:  Math.round(Math.max(...working)),
    totalScore, maxScore: 20
  }
}

// MEMORY MATCHING GAME: 30 points total
export function calculateMatchingScore(gameResult) {
  return { ...gameResult, maxScore: 30 }
}

// FINAL COGNITIVE INDEX: exact sum = 100
export function calculateFinalScore(memoryResult, verbalResult, reactionResult, matchingResult) {
  const memoryScore   = memoryResult.totalScore
  const fluencyScore  = verbalResult.totalScore
  const reactionScore = reactionResult.totalScore
  const matchingScore = matchingResult.totalScore
  const cognitiveIndex = memoryScore + fluencyScore + reactionScore + matchingScore

  let risk = 'Elevated Concern', riskClass = 'high', interpretation = ''
  if (cognitiveIndex >= 85) {
    risk = 'Excellent'; riskClass = 'low'
    interpretation = 'Outstanding cognitive performance across all assessed domains. Your results are well above expected ranges.'
  } else if (cognitiveIndex >= 70) {
    risk = 'Good'; riskClass = 'low'
    interpretation = 'Strong cognitive performance within expected ranges. Minor areas may benefit from light exercise.'
  } else if (cognitiveIndex >= 65) {
    risk = 'Within Expected Range'; riskClass = 'low'
    interpretation = 'This screening suggests cognitive performance within expected ranges for the assessed domains.'
  } else if (cognitiveIndex >= 50) {
    risk = 'Mild Concern'; riskClass = 'moderate'
    interpretation = 'This screening suggests mild variations in cognitive performance. Some domains show minor deviations from expected ranges.'
  } else if (cognitiveIndex >= 35) {
    risk = 'Moderate Concern'; riskClass = 'moderate'
    interpretation = 'This screening suggests moderate cognitive concerns across multiple domains. Further clinical evaluation is recommended.'
  } else {
    risk = 'Elevated Concern'; riskClass = 'high'
    interpretation = 'This screening suggests notable cognitive concerns. Professional clinical assessment is strongly recommended.'
  }

  console.log('=== SCORING AUDIT ===')
  console.log('Memory:', memoryScore, '/ 30')
  console.log('Fluency:', fluencyScore, '/ 20')
  console.log('Reaction:', reactionScore, '/ 20')
  console.log('Matching:', matchingScore, '/ 30')
  console.log('Total:', cognitiveIndex, '/ 100')
  console.log('Match:', memoryScore + fluencyScore + reactionScore + matchingScore === cognitiveIndex ? 'YES ✓' : 'NO ✗')

  return {
    cognitiveIndex, risk, riskClass, interpretation,
    breakdown: { memory: memoryScore, fluency: fluencyScore, reaction: reactionScore, matching: matchingScore }
  }
}
