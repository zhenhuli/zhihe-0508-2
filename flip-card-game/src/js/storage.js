const STORAGE_KEY = 'flip-card-game-best-scores'

export function getBestScores() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function getBestScore(level) {
  const scores = getBestScores()
  return scores[level] || null
}

export function saveBestScore(level, time, moves) {
  const scores = getBestScores()
  const current = scores[level]
  
  if (!current || 
      time < current.time || 
      (time === current.time && moves < current.moves)) {
    scores[level] = { time, moves, date: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
    return true
  }
  
  return false
}

export function clearBestScores() {
  localStorage.removeItem(STORAGE_KEY)
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
