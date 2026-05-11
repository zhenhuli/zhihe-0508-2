import { Storage } from './Storage.js'

export class ScoreManager {
  constructor() {
    this.score = 0
    this.storage = new Storage()
    this.highScore = this.storage.getHighScore()
    
    this.scoreElement = document.getElementById('score')
    this.highScoreElement = document.getElementById('highScore')
    this.statusElement = document.getElementById('status')
    
    this.updateHighScoreDisplay()
  }

  addScore(points) {
    this.score += points
    this.updateScoreDisplay()
  }

  resetScore() {
    this.score = 0
  }

  getScore() {
    return this.score
  }

  getHighScore() {
    return this.highScore
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      this.storage.saveHighScore(this.highScore)
      this.updateHighScoreDisplay()
    }
  }

  updateScoreDisplay() {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score
    }
  }

  updateHighScoreDisplay() {
    if (this.highScoreElement) {
      this.highScoreElement.textContent = this.highScore
    }
  }

  setStatus(message) {
    if (this.statusElement) {
      this.statusElement.textContent = message
    }
  }
}