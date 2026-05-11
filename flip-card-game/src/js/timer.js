import { formatTime } from './storage.js'

export class GameTimer {
  constructor() {
    this.startTime = 0
    this.elapsedTime = 0
    this.timerInterval = null
    this.isRunning = false
  }

  start() {
    if (this.isRunning) return
    
    this.startTime = Date.now() - this.elapsedTime * 1000
    this.isRunning = true
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      this.onTick?.(this.elapsedTime)
    }, 1000)
  }

  stop() {
    if (!this.isRunning) return
    
    this.isRunning = false
    clearInterval(this.timerInterval)
    this.timerInterval = null
  }

  reset() {
    this.stop()
    this.elapsedTime = 0
    this.onTick?.(0)
  }

  getTime() {
    return this.elapsedTime
  }

  onTick(callback) {
    this.onTick = callback
  }
}

export class GameScore {
  constructor() {
    this.moves = 0
    this.matchedPairs = 0
    this.totalPairs = 0
  }

  init(totalPairs) {
    this.moves = 0
    this.matchedPairs = 0
    this.totalPairs = totalPairs
    this.onUpdate?.(this.moves, this.matchedPairs)
  }

  addMove() {
    this.moves++
    this.onUpdate?.(this.moves, this.matchedPairs)
  }

  addMatch() {
    this.matchedPairs++
    this.onUpdate?.(this.moves, this.matchedPairs)
  }

  isComplete() {
    return this.matchedPairs === this.totalPairs
  }

  getStats() {
    return {
      moves: this.moves,
      matchedPairs: this.matchedPairs,
      totalPairs: this.totalPairs
    }
  }

  onUpdate(callback) {
    this.onUpdate = callback
  }
}
