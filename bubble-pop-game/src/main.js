import './style.css'

const BUBBLE_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8'
]

const LEVELS = [
  { rows: 8, cols: 8, colors: 4, targetScore: 500, name: '简单' },
  { rows: 10, cols: 10, colors: 5, targetScore: 1000, name: '普通' },
  { rows: 12, cols: 12, colors: 6, targetScore: 2000, name: '困难' },
  { rows: 14, cols: 14, colors: 7, targetScore: 4000, name: '专家' }
]

class BubblePopGame {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.grid = []
    this.rows = 8
    this.cols = 8
    this.bubbleSize = 40
    this.score = 0
    this.currentLevel = 0
    this.targetScore = 500
    this.colorsCount = 4
    this.gameOver = false
    this.isAnimating = false
    
    this.init()
  }

  init() {
    this.setupUI()
    this.setupCanvas()
    this.initGrid()
    this.bindEvents()
    this.render()
    this.checkAndShowRules()
  }

  setupUI() {
    const app = document.querySelector('#app')
    app.innerHTML = `
      <h1>🎈 泡泡消除小游戏</h1>
      <div class="game-info">
        <div class="info-item">关卡: <span id="level">${this.currentLevel + 1} (${LEVELS[this.currentLevel].name})</span></div>
        <div class="info-item">分数: <span id="score">${this.score}</span></div>
        <div class="info-item">目标: <span id="target">${this.targetScore}</span></div>
      </div>
      <canvas id="gameCanvas"></canvas>
      <div class="controls">
        <button id="restartBtn">重新开始</button>
        <button id="rulesBtn">游戏规则</button>
        <button id="nextLevelBtn" class="hidden">下一关</button>
      </div>
      <div id="gameOverModal" class="game-over hidden">
        <div class="game-over-content">
          <h2 id="modalTitle">游戏结束</h2>
          <p id="modalMessage">最终得分: <span id="finalScore">0</span></p>
          <button id="playAgainBtn">再玩一次</button>
        </div>
      </div>
      <div id="rulesModal" class="rules-modal hidden">
        <div class="rules-content">
          <h2>📖 游戏规则</h2>
          <ul>
            <li>点击任意泡泡，消除与其相邻的所有同色泡泡</li>
            <li>至少需要2个相连的同色泡泡才能消除</li>
            <li>消除后上方的泡泡会自动下落填补空缺</li>
            <li>消除的泡泡越多，获得的分数越高（分数 = 数量² × 10）</li>
            <li>达到目标分数即可进入下一关</li>
            <li>没有可消除的泡泡时游戏结束</li>
          </ul>
          <button id="closeRulesBtn">知道了，开始游戏！</button>
        </div>
      </div>
    `
  }

  setupCanvas() {
    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')
    
    const level = LEVELS[this.currentLevel]
    this.rows = level.rows
    this.cols = level.cols
    this.colorsCount = level.colors
    this.targetScore = level.targetScore
    
    this.canvas.width = this.cols * this.bubbleSize
    this.canvas.height = this.rows * this.bubbleSize
  }

  initGrid() {
    this.grid = []
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = []
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = {
          color: BUBBLE_COLORS[Math.floor(Math.random() * this.colorsCount)],
          popped: false
        }
      }
    }
  }

  bindEvents() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e))
    
    const restartBtn = document.getElementById('restartBtn')
    if (restartBtn) restartBtn.addEventListener('click', () => this.restart())
    
    const rulesBtn = document.getElementById('rulesBtn')
    if (rulesBtn) rulesBtn.addEventListener('click', () => this.showRules())
    
    const closeRulesBtn = document.getElementById('closeRulesBtn')
    if (closeRulesBtn) closeRulesBtn.addEventListener('click', () => this.closeRules())
    
    const nextLevelBtn = document.getElementById('nextLevelBtn')
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', () => this.nextLevel())
    
    const playAgainBtn = document.getElementById('playAgainBtn')
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        const gameOverModal = document.getElementById('gameOverModal')
        if (gameOverModal) gameOverModal.classList.add('hidden')
        this.restart()
      })
    }
  }

  checkAndShowRules() {
    const hasSeenRules = localStorage.getItem('bubblePopRulesSeen')
    if (!hasSeenRules) {
      this.showRules()
    }
  }

  showRules() {
    const rulesModal = document.getElementById('rulesModal')
    if (rulesModal) rulesModal.classList.remove('hidden')
  }

  closeRules() {
    const rulesModal = document.getElementById('rulesModal')
    if (rulesModal) rulesModal.classList.add('hidden')
    localStorage.setItem('bubblePopRulesSeen', 'true')
  }

  handleClick(e) {
    if (this.gameOver || this.isAnimating) return

    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const col = Math.floor(x / this.bubbleSize)
    const row = Math.floor(y / this.bubbleSize)

    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      const connected = this.findConnected(row, col)
      if (connected.length >= 2) {
        this.popBubbles(connected)
      }
    }
  }

  findConnected(startRow, startCol) {
    const color = this.grid[startRow][startCol].color
    const visited = new Set()
    const connected = []
    
    const queue = [[startRow, startCol]]
    visited.add(`${startRow},${startCol}`)

    while (queue.length > 0) {
      const [row, col] = queue.shift()
      connected.push({ row, col })

      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc
        const key = `${newRow},${newCol}`

        if (
          newRow >= 0 && newRow < this.rows &&
          newCol >= 0 && newCol < this.cols &&
          !visited.has(key) &&
          !this.grid[newRow][newCol].popped &&
          this.grid[newRow][newCol].color === color
        ) {
          visited.add(key)
          queue.push([newRow, newCol])
        }
      }
    }

    return connected
  }

  async popBubbles(bubbles) {
    this.isAnimating = true
    
    const points = bubbles.length * bubbles.length * 10
    this.score += points
    this.updateUI()

    for (const { row, col } of bubbles) {
      this.grid[row][col].popped = true
    }
    
    this.render()
    await this.delay(200)

    await this.dropBubbles()
    this.checkLevelComplete()
    
    this.isAnimating = false
  }

  async dropBubbles() {
    let dropped = true
    while (dropped) {
      dropped = false
      
      for (let col = 0; col < this.cols; col++) {
        for (let row = this.rows - 1; row > 0; row--) {
          if (this.grid[row][col].popped && !this.grid[row - 1][col].popped) {
            this.grid[row][col] = { ...this.grid[row - 1][col] }
            this.grid[row - 1][col] = { color: null, popped: true }
            dropped = true
          }
        }
      }
      
      if (dropped) {
        this.render()
        await this.delay(50)
      }
    }
  }

  checkLevelComplete() {
    if (this.score >= this.targetScore) {
      if (this.currentLevel < LEVELS.length - 1) {
        const nextLevelBtn = document.getElementById('nextLevelBtn')
        if (nextLevelBtn) nextLevelBtn.classList.remove('hidden')
        this.showModal('恭喜过关！', `你获得了 ${this.score} 分！`)
      } else {
        this.gameOver = true
        this.showModal('🎉 恭喜通关！', `你完成了所有关卡！最终得分: ${this.score}`)
      }
    } else {
      let hasMoves = false
      for (let row = 0; row < this.rows && !hasMoves; row++) {
        for (let col = 0; col < this.cols && !hasMoves; col++) {
          if (!this.grid[row][col].popped) {
            const connected = this.findConnected(row, col)
            if (connected.length >= 2) {
              hasMoves = true
            }
          }
        }
      }

      if (!hasMoves) {
        this.gameOver = true
        this.showModal('游戏结束', `没有可消除的泡泡了！得分: ${this.score}`)
      }
    }
  }

  showModal(title, message) {
    const modalTitle = document.getElementById('modalTitle')
    const modalMessage = document.getElementById('modalMessage')
    const finalScore = document.getElementById('finalScore')
    const gameOverModal = document.getElementById('gameOverModal')
    
    if (modalTitle) modalTitle.textContent = title
    if (modalMessage) modalMessage.textContent = message
    if (finalScore) finalScore.textContent = this.score
    if (gameOverModal) gameOverModal.classList.remove('hidden')
  }

  nextLevel() {
    const nextLevelBtn = document.getElementById('nextLevelBtn')
    const gameOverModal = document.getElementById('gameOverModal')
    
    if (nextLevelBtn) nextLevelBtn.classList.add('hidden')
    if (gameOverModal) gameOverModal.classList.add('hidden')
    
    this.currentLevel++
    this.score = 0
    this.gameOver = false
    
    this.setupCanvas()
    this.initGrid()
    this.updateUI()
    this.render()
  }

  restart() {
    this.currentLevel = 0
    this.score = 0
    this.gameOver = false
    
    const nextLevelBtn = document.getElementById('nextLevelBtn')
    if (nextLevelBtn) nextLevelBtn.classList.add('hidden')
    
    this.setupCanvas()
    this.initGrid()
    this.updateUI()
    this.render()
  }

  updateUI() {
    const scoreEl = document.getElementById('score')
    const levelEl = document.getElementById('level')
    const targetEl = document.getElementById('target')
    
    if (scoreEl) scoreEl.textContent = this.score
    if (levelEl) levelEl.textContent = `${this.currentLevel + 1} (${LEVELS[this.currentLevel].name})`
    if (targetEl) targetEl.textContent = this.targetScore
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const bubble = this.grid[row][col]
        if (!bubble.popped && bubble.color) {
          this.drawBubble(col, row, bubble.color)
        }
      }
    }
  }

  drawBubble(col, row, color) {
    const x = col * this.bubbleSize + this.bubbleSize / 2
    const y = row * this.bubbleSize + this.bubbleSize / 2
    const radius = this.bubbleSize / 2 - 2

    const gradient = this.ctx.createRadialGradient(
      x - radius / 3, y - radius / 3, 0,
      x, y, radius
    )
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.3, color)
    gradient.addColorStop(1, this.darkenColor(color, 30))

    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fillStyle = gradient
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(x - radius / 3, y - radius / 3, radius / 4, 0, Math.PI * 2)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    this.ctx.fill()
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max((num >> 16) - amt, 0)
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0)
    const B = Math.max((num & 0x0000FF) - amt, 0)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

new BubblePopGame()
