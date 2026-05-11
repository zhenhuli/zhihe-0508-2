import { Snake } from './Snake.js'
import { Food } from './Food.js'

export class Game {
  constructor(canvas, scoreManager, themeManager) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.scoreManager = scoreManager
    this.themeManager = themeManager
    
    this.gridSize = 20
    this.width = canvas.width
    this.height = canvas.height
    
    this.snake = new Snake(this.width, this.height, this.gridSize)
    this.food = new Food(this.width, this.height, this.gridSize)
    
    this.isRunning = false
    this.isPaused = false
    this.gameLoop = null
    this.speed = 150
    
    this.difficulties = {
      easy: 200,
      medium: 150,
      hard: 80
    }
  }

  setDifficulty(level) {
    if (this.difficulties[level]) {
      this.speed = this.difficulties[level]
    }
  }

  start() {
    if (this.isRunning && !this.isPaused) return
    
    if (!this.isRunning) {
      this.reset()
    }
    
    this.isRunning = true
    this.isPaused = false
    this.scoreManager.setStatus('游戏中...')
    this.run()
  }

  pause() {
    if (!this.isRunning) return
    
    this.isPaused = true
    this.scoreManager.setStatus('游戏暂停')
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }
  }

  reset() {
    this.snake.reset()
    this.food.generate(this.snake.getSegments())
    this.scoreManager.resetScore()
    this.scoreManager.updateScoreDisplay()
  }

  restart() {
    this.pause()
    this.reset()
    this.scoreManager.setStatus('按空格键开始游戏')
  }

  run() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
    }
    
    this.gameLoop = setInterval(() => {
      if (!this.isPaused) {
        this.update()
        this.render()
      }
    }, this.speed)
  }

  update() {
    this.snake.move()
    
    if (this.snake.checkCollision()) {
      this.gameOver()
      return
    }
    
    const head = this.snake.getHead()
    const foodPos = this.food.getPosition()
    
    if (head.x === foodPos.x && head.y === foodPos.y) {
      this.snake.grow()
      this.scoreManager.addScore(10)
      this.food.generate(this.snake.getSegments())
    }
  }

  render() {
    const theme = this.themeManager.getCurrentTheme()
    
    this.ctx.fillStyle = theme.background
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.ctx.strokeStyle = theme.grid
    this.ctx.lineWidth = 0.5
    for (let x = 0; x <= this.width; x += this.gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.height)
      this.ctx.stroke()
    }
    for (let y = 0; y <= this.height; y += this.gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.width, y)
      this.ctx.stroke()
    }
    
    const foodPos = this.food.getPosition()
    this.ctx.fillStyle = theme.food
    this.ctx.beginPath()
    this.ctx.arc(
      foodPos.x * this.gridSize + this.gridSize / 2,
      foodPos.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    )
    this.ctx.fill()
    
    const segments = this.snake.getSegments()
    segments.forEach((segment, index) => {
      const isHead = index === 0
      this.ctx.fillStyle = isHead ? theme.snakeHead : theme.snakeBody
      
      this.ctx.beginPath()
      this.ctx.roundRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2,
        isHead ? 5 : 3
      )
      this.ctx.fill()
      
      if (isHead) {
        this.ctx.fillStyle = theme.snakeEyes
        const eyeSize = 3
        const eyeOffset = 5
        
        const eye1X = segment.x * this.gridSize + eyeOffset
        const eye1Y = segment.y * this.gridSize + eyeOffset
        const eye2X = segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize
        const eye2Y = segment.y * this.gridSize + eyeOffset
        
        this.ctx.beginPath()
        this.ctx.arc(eye1X + eyeSize / 2, eye1Y + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2)
        this.ctx.fill()
        
        this.ctx.beginPath()
        this.ctx.arc(eye2X + eyeSize / 2, eye2Y + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2)
        this.ctx.fill()
      }
    })
  }

  gameOver() {
    this.isRunning = false
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }
    
    this.scoreManager.checkHighScore()
    this.scoreManager.setStatus('游戏结束！')
  }

  handleKeyDown(direction) {
    if (!this.isRunning || this.isPaused) return
    this.snake.setDirection(direction.x, direction.y)
  }

  isGameRunning() {
    return this.isRunning && !this.isPaused
  }
}