export class Storage {
  constructor() {
    this.key = 'snake_game_high_score'
    this.themeKey = 'snake_game_theme'
    this.difficultyKey = 'snake_game_difficulty'
  }

  getHighScore() {
    try {
      const stored = localStorage.getItem(this.key)
      return stored ? parseInt(stored, 10) : 0
    } catch (e) {
      console.error('Failed to get high score:', e)
      return 0
    }
  }

  saveHighScore(score) {
    try {
      localStorage.setItem(this.key, score.toString())
    } catch (e) {
      console.error('Failed to save high score:', e)
    }
  }

  getTheme() {
    try {
      const stored = localStorage.getItem(this.themeKey)
      return stored || 'classic'
    } catch (e) {
      console.error('Failed to get theme:', e)
      return 'classic'
    }
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.themeKey, theme)
    } catch (e) {
      console.error('Failed to save theme:', e)
    }
  }

  getDifficulty() {
    try {
      const stored = localStorage.getItem(this.difficultyKey)
      return stored || 'medium'
    } catch (e) {
      console.error('Failed to get difficulty:', e)
      return 'medium'
    }
  }

  saveDifficulty(difficulty) {
    try {
      localStorage.setItem(this.difficultyKey, difficulty)
    } catch (e) {
      console.error('Failed to save difficulty:', e)
    }
  }
}