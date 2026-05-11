import { Storage } from './Storage.js'

export class ThemeManager {
  constructor() {
    this.storage = new Storage()
    this.themes = {
      classic: {
        name: '经典',
        background: '#1a1a2e',
        grid: '#2d2d44',
        snakeHead: '#4ade80',
        snakeBody: '#22c55e',
        snakeEyes: '#ffffff',
        food: '#ef4444',
        accent: '#fbbf24'
      },
      neon: {
        name: '霓虹',
        background: '#0f0f1a',
        grid: '#1a1a3a',
        snakeHead: '#00ffff',
        snakeBody: '#00ccff',
        snakeEyes: '#ff00ff',
        food: '#ff6b6b',
        accent: '#ffd93d'
      },
      nature: {
        name: '自然',
        background: '#1b2d1b',
        grid: '#2d4a2d',
        snakeHead: '#84cc16',
        snakeBody: '#65a30d',
        snakeEyes: '#ffffff',
        food: '#f97316',
        accent: '#a3e635'
      },
      ocean: {
        name: '海洋',
        background: '#0c1821',
        grid: '#1a3a4a',
        snakeHead: '#0ea5e9',
        snakeBody: '#0284c7',
        snakeEyes: '#ffffff',
        food: '#f43f5e',
        accent: '#67e8f9'
      }
    }
    this.currentTheme = this.storage.getTheme()
    this.applyTheme()
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName
      this.storage.saveTheme(themeName)
      this.applyTheme()
    }
  }

  getCurrentTheme() {
    return this.themes[this.currentTheme]
  }

  getThemeName() {
    return this.currentTheme
  }

  applyTheme() {
    const theme = this.themes[this.currentTheme]
    const root = document.documentElement
    
    root.style.setProperty('--bg-color', theme.background)
    root.style.setProperty('--grid-color', theme.grid)
    root.style.setProperty('--snake-head', theme.snakeHead)
    root.style.setProperty('--snake-body', theme.snakeBody)
    root.style.setProperty('--snake-eyes', theme.snakeEyes)
    root.style.setProperty('--food-color', theme.food)
    root.style.setProperty('--accent-color', theme.accent)
  }

  getAvailableThemes() {
    return Object.keys(this.themes)
  }
}