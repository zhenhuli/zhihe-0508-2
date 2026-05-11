export class Keyboard {
  constructor(game) {
    this.game = game
    this.handlers = {}
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase()
    
    switch (key) {
      case 'arrowup':
      case 'w':
        event.preventDefault()
        this.game.handleKeyDown({ x: 0, y: -1 })
        break
      case 'arrowdown':
      case 's':
        event.preventDefault()
        this.game.handleKeyDown({ x: 0, y: 1 })
        break
      case 'arrowleft':
      case 'a':
        event.preventDefault()
        this.game.handleKeyDown({ x: -1, y: 0 })
        break
      case 'arrowright':
      case 'd':
        event.preventDefault()
        this.game.handleKeyDown({ x: 1, y: 0 })
        break
      case ' ':
        event.preventDefault()
        this.togglePause()
        break
    }
  }

  togglePause() {
    if (!this.game.isRunning) {
      this.game.start()
    } else if (this.game.isPaused) {
      this.game.start()
    } else {
      this.game.pause()
    }
  }

  destroy() {
    document.removeEventListener('keydown', (e) => this.handleKeyDown(e))
  }
}