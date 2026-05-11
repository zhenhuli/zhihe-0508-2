import { Game } from './modules/Game.js'
import { ScoreManager } from './modules/ScoreManager.js'
import { ThemeManager } from './modules/ThemeManager.js'
import { Keyboard } from './modules/Keyboard.js'
import { Storage } from './modules/Storage.js'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas')
  const difficultySelect = document.getElementById('difficulty')
  const themeSelect = document.getElementById('theme')
  const startBtn = document.getElementById('startBtn')
  const pauseBtn = document.getElementById('pauseBtn')
  const restartBtn = document.getElementById('restartBtn')

  const dpadUp = document.getElementById('dpadUp')
  const dpadDown = document.getElementById('dpadDown')
  const dpadLeft = document.getElementById('dpadLeft')
  const dpadRight = document.getElementById('dpadRight')
  const dpadCenter = document.getElementById('dpadCenter')

  const storage = new Storage()
  const scoreManager = new ScoreManager()
  const themeManager = new ThemeManager()
  const game = new Game(canvas, scoreManager, themeManager)
  const keyboard = new Keyboard(game)

  difficultySelect.value = storage.getDifficulty()
  themeSelect.value = themeManager.getThemeName()

  difficultySelect.addEventListener('change', (e) => {
    const difficulty = e.target.value
    game.setDifficulty(difficulty)
    storage.saveDifficulty(difficulty)
  })

  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value
    themeManager.setTheme(theme)
    game.render()
  })

  startBtn.addEventListener('click', () => {
    game.start()
  })

  pauseBtn.addEventListener('click', () => {
    if (game.isRunning && !game.isPaused) {
      game.pause()
    } else if (game.isPaused) {
      game.start()
    }
  })

  restartBtn.addEventListener('click', () => {
    game.restart()
    game.render()
  })

  dpadUp.addEventListener('click', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 0, y: -1 })
  })

  dpadDown.addEventListener('click', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 0, y: 1 })
  })

  dpadLeft.addEventListener('click', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: -1, y: 0 })
  })

  dpadRight.addEventListener('click', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 1, y: 0 })
  })

  dpadCenter.addEventListener('click', (e) => {
    e.preventDefault()
    if (!game.isRunning) {
      game.start()
    } else if (game.isPaused) {
      game.start()
    } else {
      game.pause()
    }
  })

  dpadUp.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 0, y: -1 })
  })

  dpadDown.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 0, y: 1 })
  })

  dpadLeft.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: -1, y: 0 })
  })

  dpadRight.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.handleKeyDown({ x: 1, y: 0 })
  })

  dpadCenter.addEventListener('touchstart', (e) => {
    e.preventDefault()
    if (!game.isRunning) {
      game.start()
    } else if (game.isPaused) {
      game.start()
    } else {
      game.pause()
    }
  })

  let touchStartX = 0
  let touchStartY = 0
  canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  })

  canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    const minSwipeDistance = 30

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          game.handleKeyDown({ x: 1, y: 0 })
        } else {
          game.handleKeyDown({ x: -1, y: 0 })
        }
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          game.handleKeyDown({ x: 0, y: 1 })
        } else {
          game.handleKeyDown({ x: 0, y: -1 })
        }
      }
    }
  })

  const resizeCanvas = () => {
    const headerHeight = 80
    const controlsHeight = 80
    const infoHeight = 40
    const buttonsHeight = 50
    const dpadHeight = 180
    const totalNonCanvasHeight = headerHeight + controlsHeight + infoHeight + buttonsHeight + dpadHeight + 60

    const maxCanvasHeight = window.innerHeight - totalNonCanvasHeight
    const maxCanvasWidth = window.innerWidth - 24
    const maxCanvasSize = Math.min(maxCanvasHeight, maxCanvasWidth, 400)

    canvas.style.width = Math.max(200, maxCanvasSize) + 'px'
    canvas.style.height = Math.max(200, maxCanvasSize) + 'px'
  }

  const preventDefault = (e) => {
    e.preventDefault()
  }

  const preventBodyScroll = () => {
    document.body.addEventListener('touchmove', preventDefault, { passive: false })
  }

  const allowBodyScroll = () => {
    document.body.removeEventListener('touchmove', preventDefault)
  }

  preventBodyScroll()

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

  game.render()
})