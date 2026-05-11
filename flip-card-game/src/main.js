import './css/style.css'
import { FlipCardGame } from './js/game-logic.js'
import { LEVELS, THEMES } from './js/levels.js'
import { getBestScores, formatTime } from './js/storage.js'

function createGameUI() {
  const app = document.getElementById('app')
  
  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>🎴 翻牌记忆游戏</h1>
        <button class="rules-btn" id="rules-btn" title="游戏规则">
          <span class="rules-icon">?</span>
          <span class="rules-text">游戏规则</span>
        </button>
      </div>
      
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">用时</span>
          <span class="stat-value" id="timer">00:00</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">步数</span>
          <span class="stat-value" id="moves">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">进度</span>
          <span class="stat-value" id="progress">0/0</span>
        </div>
      </div>
      
      <div class="controls">
        <div class="control-group">
          <label class="control-label">难度</label>
          <select class="select-control" id="level-select">
            ${Object.entries(LEVELS).map(([key, value]) => 
              `<option value="${key}">${value.name} - ${value.description}</option>`
            ).join('')}
          </select>
        </div>
        
        <div class="control-group">
          <label class="control-label">主题</label>
          <select class="select-control" id="theme-select">
            ${Object.entries(THEMES).map(([key, value]) => 
              `<option value="${key}">${value.icon} ${value.name}</option>`
            ).join('')}
          </select>
        </div>
        
        <div class="control-group">
          <label class="control-label">&nbsp;</label>
          <button class="btn btn-primary" id="start-btn">开始游戏</button>
        </div>
      </div>
      
      <div class="game-area">
        <div class="card-grid" id="card-container"></div>
      </div>
      
      <div class="best-scores" id="best-scores">
        <h3 class="best-scores-title">🏆 最佳成绩</h3>
        <div class="best-scores-list" id="best-scores-list"></div>
      </div>
    </div>
    
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal">
        <div class="modal-icon">🎉</div>
        <h2>恭喜通关！</h2>
        <div class="new-record" id="new-record" style="display: none;">✨ 新纪录！</div>
        <div class="modal-stats">
          <div class="modal-stat">
            <span class="modal-stat-value" id="final-time">00:00</span>
            <span class="modal-stat-label">用时</span>
          </div>
          <div class="modal-stat">
            <span class="modal-stat-value" id="final-moves">0</span>
            <span class="modal-stat-label">步数</span>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn btn-primary" id="play-again-btn">再玩一次</button>
          <button class="btn btn-secondary" id="close-modal-btn">关闭</button>
        </div>
      </div>
    </div>
    
    <div class="modal-overlay rules-overlay" id="rules-overlay">
      <div class="modal rules-modal">
        <button class="modal-close" id="rules-close">&times;</button>
        <div class="modal-icon">📖</div>
        <h2>游戏规则</h2>
        <div class="rules-content">
          <div class="rule-item">
            <div class="rule-number">1</div>
            <div class="rule-text">选择难度级别和主题风格</div>
          </div>
          <div class="rule-item">
            <div class="rule-number">2</div>
            <div class="rule-text">点击「开始游戏」开始新的一局</div>
          </div>
          <div class="rule-item">
            <div class="rule-number">3</div>
            <div class="rule-text">每次翻开两张卡牌，记住它们的位置</div>
          </div>
          <div class="rule-item">
            <div class="rule-number">4</div>
            <div class="rule-text">如果两张卡牌相同则配对成功</div>
          </div>
          <div class="rule-item">
            <div class="rule-number">5</div>
            <div class="rule-text">如果不同则卡牌会翻回去，继续尝试</div>
          </div>
          <div class="rule-item">
            <div class="rule-number">6</div>
            <div class="rule-text">匹配所有卡牌即可通关！</div>
          </div>
        </div>
        <div class="rules-tips">
          <p class="tips-title">💡 小提示</p>
          <p>尽量用最少的步数和最短的时间完成游戏，刷新你的最佳记录！</p>
        </div>
        <div class="modal-buttons">
          <button class="btn btn-primary" id="rules-ok-btn">知道了</button>
        </div>
      </div>
    </div>
  `
}

function updateBestScores() {
  const scoresList = document.getElementById('best-scores-list')
  const scores = getBestScores()
  
  scoresList.innerHTML = Object.entries(LEVELS).map(([key, level]) => {
    const score = scores[key]
    if (score) {
      return `
        <div class="best-score-item">
          <div class="best-score-level">${level.name}</div>
          <div class="best-score-time">${formatTime(score.time)}</div>
          <div class="best-score-moves">${score.moves} 步</div>
        </div>
      `
    }
    return `
      <div class="best-score-item">
        <div class="best-score-level">${level.name}</div>
        <div class="best-score-time no-score">暂无记录</div>
        <div class="best-score-moves">&nbsp;</div>
      </div>
    `
  }).join('')
}

function showModal(result) {
  const overlay = document.getElementById('modal-overlay')
  const finalTime = document.getElementById('final-time')
  const finalMoves = document.getElementById('final-moves')
  const newRecord = document.getElementById('new-record')
  
  finalTime.textContent = formatTime(result.time)
  finalMoves.textContent = result.moves
  newRecord.style.display = result.isNewRecord ? 'block' : 'none'
  
  overlay.classList.add('show')
}

function hideModal() {
  const overlay = document.getElementById('modal-overlay')
  overlay.classList.remove('show')
}

function showRules() {
  const overlay = document.getElementById('rules-overlay')
  overlay.classList.add('show')
}

function hideRules() {
  const overlay = document.getElementById('rules-overlay')
  overlay.classList.remove('show')
}

function updateProgress(score) {
  const progress = document.getElementById('progress')
  progress.textContent = `${score.matchedPairs}/${score.totalPairs}`
}

function initGame() {
  createGameUI()
  
  const cardContainer = document.getElementById('card-container')
  const timerElement = document.getElementById('timer')
  const movesElement = document.getElementById('moves')
  const levelSelect = document.getElementById('level-select')
  const themeSelect = document.getElementById('theme-select')
  const startBtn = document.getElementById('start-btn')
  const playAgainBtn = document.getElementById('play-again-btn')
  const closeModalBtn = document.getElementById('close-modal-btn')
  const rulesBtn = document.getElementById('rules-btn')
  const rulesClose = document.getElementById('rules-close')
  const rulesOkBtn = document.getElementById('rules-ok-btn')
  
  const game = new FlipCardGame({
    container: cardContainer,
    timerElement,
    movesElement,
    onComplete: (result) => {
      showModal(result)
      updateBestScores()
    }
  })
  
  game.score.onUpdate((moves, matched) => {
    updateProgress(game.score.getStats())
  })
  
  startBtn.addEventListener('click', () => {
    game.setLevel(levelSelect.value)
    game.setTheme(themeSelect.value)
    game.start()
  })
  
  playAgainBtn.addEventListener('click', () => {
    hideModal()
    game.setLevel(levelSelect.value)
    game.setTheme(themeSelect.value)
    game.start()
  })
  
  closeModalBtn.addEventListener('click', hideModal)
  
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      hideModal()
    }
  })
  
  rulesBtn.addEventListener('click', showRules)
  rulesClose.addEventListener('click', hideRules)
  rulesOkBtn.addEventListener('click', hideRules)
  
  document.getElementById('rules-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'rules-overlay') {
      hideRules()
    }
  })
  
  updateBestScores()
  game.start()
}

document.addEventListener('DOMContentLoaded', initGame)
