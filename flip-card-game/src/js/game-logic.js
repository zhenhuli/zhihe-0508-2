import { CardRenderer } from './card-renderer.js'
import { GameTimer, GameScore } from './timer.js'
import { getLevelConfig } from './levels.js'
import { saveBestScore, formatTime } from './storage.js'

export class FlipCardGame {
  constructor(options) {
    this.container = options.container
    this.timerElement = options.timerElement
    this.movesElement = options.movesElement
    this.bestScoreElement = options.bestScoreElement
    this.onComplete = options.onComplete || (() => {})

    this.renderer = new CardRenderer(this.container)
    this.timer = new GameTimer()
    this.score = new GameScore()

    this.currentLevel = options.level || 'medium'
    this.currentTheme = options.theme || 'animals'
    
    this.flippedCards = []
    this.isLocked = false
    this.hasStarted = false

    this.setupCallbacks()
  }

  setupCallbacks() {
    this.timer.onTick((time) => {
      if (this.timerElement) {
        this.timerElement.textContent = formatTime(time)
      }
    })

    this.score.onUpdate((moves, matched) => {
      if (this.movesElement) {
        this.movesElement.textContent = moves
      }
    })
  }

  start() {
    const config = getLevelConfig(this.currentLevel)
    
    this.timer.reset()
    this.score.init(config.pairs)
    this.flippedCards = []
    this.isLocked = false
    this.hasStarted = false

    this.renderer.render(
      this.currentLevel, 
      this.currentTheme, 
      this.handleCardClick.bind(this)
    )
  }

  handleCardClick(index, card) {
    if (this.isLocked) return
    if (this.flippedCards.find(c => c.index === index)) return

    if (!this.hasStarted) {
      this.hasStarted = true
      this.timer.start()
    }

    this.renderer.flipCard(index, true)
    this.flippedCards.push({ index, card })

    if (this.flippedCards.length === 2) {
      this.score.addMove()
      this.checkMatch()
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards
    const isMatch = first.card.id === second.card.id

    this.isLocked = true

    if (isMatch) {
      this.handleMatch(first.index, second.index)
    } else {
      this.handleMismatch(first.index, second.index)
    }
  }

  handleMatch(firstIndex, secondIndex) {
    setTimeout(() => {
      this.renderer.setMatched(firstIndex, true)
      this.renderer.setMatched(secondIndex, true)
      this.score.addMatch()
      this.flippedCards = []
      this.isLocked = false

      if (this.score.isComplete()) {
        this.handleGameComplete()
      }
    }, 500)
  }

  handleMismatch(firstIndex, secondIndex) {
    setTimeout(() => {
      this.renderer.flipCard(firstIndex, false)
      this.renderer.flipCard(secondIndex, false)
      this.flippedCards = []
      this.isLocked = false
    }, 1000)
  }

  handleGameComplete() {
    this.timer.stop()
    const time = this.timer.getTime()
    const moves = this.score.getStats().moves
    const isNewRecord = saveBestScore(this.currentLevel, time, moves)

    this.onComplete({
      time,
      moves,
      level: this.currentLevel,
      isNewRecord
    })
  }

  setLevel(level) {
    this.currentLevel = level
  }

  setTheme(theme) {
    this.currentTheme = theme
  }

  getStats() {
    return {
      time: this.timer.getTime(),
      ...this.score.getStats(),
      level: this.currentLevel,
      theme: this.currentTheme
    }
  }
}
