import { Board } from './Board.js';
import { Renderer } from './Renderer.js';
import { Keyboard } from './Keyboard.js';
import { ScoreManager, DIFFICULTY_CONFIG } from './ScoreManager.js';
import { getRandomTetromino, rotateMatrix } from './Pieces.js';
import { HistoryManager } from './HistoryManager.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.nextCanvas = document.getElementById('nextPieceCanvas');
    this.scoreEl = document.getElementById('score');
    this.levelEl = document.getElementById('level');
    this.linesEl = document.getElementById('lines');
    this.highScoreEl = document.getElementById('highScore');
    this.statusEl = document.getElementById('status');
    this.difficultySelect = document.getElementById('difficulty');
    this.historyListEl = document.getElementById('historyList');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

    this.board = new Board();
    this.renderer = new Renderer(this.canvas, this.nextCanvas);
    this.scoreManager = new ScoreManager(this.difficultySelect.value);
    this.historyManager = new HistoryManager(10);
    this.keyboard = new Keyboard(this);

    this.currentPiece = null;
    this.nextPiece = null;
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.dropInterval = 1000;
    this.lastDropTime = 0;
    this.animationId = null;

    this.setupButtons();
    this.renderHistory();
    this.updateUI();
    this.render();
  }

  setupButtons() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('restartBtn').addEventListener('click', () => this.restart());

    document.getElementById('mobileRotate').addEventListener('click', () => this.rotate());
    document.getElementById('mobileLeft').addEventListener('click', () => this.moveLeft());
    document.getElementById('mobileRight').addEventListener('click', () => this.moveRight());
    document.getElementById('mobileDown').addEventListener('click', () => this.moveDown());

    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
  }

  start() {
    if (this.isRunning && !this.isGameOver) return;
    
    const selectedDifficulty = this.difficultySelect.value;
    this.scoreManager.setDifficulty(selectedDifficulty);
    this.difficultySelect.disabled = true;
    
    this.isGameOver = false;
    this.isRunning = true;
    this.isPaused = false;
    this.board.reset();
    this.scoreManager.reset();
    this.currentPiece = getRandomTetromino();
    this.nextPiece = getRandomTetromino();
    this.dropInterval = this.scoreManager.getDropInterval();
    this.lastDropTime = performance.now();
    
    this.statusEl.textContent = '游戏进行中';
    this.updateUI();
    this.gameLoop();
  }

  restart() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.difficultySelect.disabled = false;
    this.start();
  }

  togglePause() {
    if (!this.isRunning || this.isGameOver) return;
    
    this.isPaused = !this.isPaused;
    this.statusEl.textContent = this.isPaused ? '游戏暂停' : '游戏进行中';
    
    if (!this.isPaused) {
      this.lastDropTime = performance.now();
      this.gameLoop();
    }
  }

  gameLoop(currentTime = performance.now()) {
    if (this.isPaused || this.isGameOver) return;

    if (currentTime - this.lastDropTime > this.dropInterval) {
      this.drop();
      this.lastDropTime = currentTime;
    }

    this.render();
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  drop() {
    if (this.canMoveDown()) {
      this.currentPiece.y++;
    } else {
      this.lockPiece();
    }
  }

  canMoveDown() {
    const piece = { ...this.currentPiece, y: this.currentPiece.y + 1 };
    return this.board.isValidPosition(piece);
  }

  lockPiece() {
    this.board.placePiece(this.currentPiece);
    const linesCleared = this.board.clearLines();
    
    if (linesCleared > 0) {
      this.scoreManager.addLines(linesCleared);
      this.dropInterval = this.scoreManager.getDropInterval();
    }

    this.currentPiece = this.nextPiece;
    this.nextPiece = getRandomTetromino();

    if (!this.board.isValidPosition(this.currentPiece)) {
      this.gameOver();
    }

    this.updateUI();
  }

  gameOver() {
    this.isGameOver = true;
    this.isRunning = false;
    this.difficultySelect.disabled = false;
    
    this.historyManager.addRecord({
      score: this.scoreManager.score,
      level: this.scoreManager.level,
      lines: this.scoreManager.lines,
      difficulty: this.scoreManager.difficulty,
      difficultyName: DIFFICULTY_CONFIG[this.scoreManager.difficulty].name
    });
    
    this.renderHistory();
    this.statusEl.textContent = '游戏结束！按重新开始继续';
  }

  moveLeft() {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    
    const piece = { ...this.currentPiece, x: this.currentPiece.x - 1 };
    if (this.board.isValidPosition(piece)) {
      this.currentPiece.x--;
      this.render();
    }
  }

  moveRight() {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    
    const piece = { ...this.currentPiece, x: this.currentPiece.x + 1 };
    if (this.board.isValidPosition(piece)) {
      this.currentPiece.x++;
      this.render();
    }
  }

  moveDown() {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    
    if (this.canMoveDown()) {
      this.currentPiece.y++;
      this.scoreManager.addSoftDrop();
      this.lastDropTime = performance.now();
      this.updateUI();
      this.render();
    }
  }

  rotate() {
    if (!this.isRunning || this.isPaused || this.isGameOver) return;
    
    const rotatedShape = rotateMatrix(this.currentPiece.shape);
    const piece = { ...this.currentPiece, shape: rotatedShape };
    
    if (this.board.isValidPosition(piece)) {
      this.currentPiece.shape = rotatedShape;
    } else {
      const kicks = [-1, 1, -2, 2];
      for (const kick of kicks) {
        const kickedPiece = { ...piece, x: piece.x + kick };
        if (this.board.isValidPosition(kickedPiece)) {
          this.currentPiece.shape = rotatedShape;
          this.currentPiece.x += kick;
          break;
        }
      }
    }
    
    this.render();
  }

  updateUI() {
    this.scoreEl.textContent = this.scoreManager.score;
    this.levelEl.textContent = this.scoreManager.level;
    this.linesEl.textContent = this.scoreManager.lines;
    this.highScoreEl.textContent = this.scoreManager.highScore;
  }

  render() {
    this.renderer.render(this.board, this.currentPiece, this.nextPiece);
  }

  renderHistory() {
    const records = this.historyManager.getRecords();
    
    if (records.length === 0) {
      this.historyListEl.innerHTML = '<div class="no-history">暂无记录</div>';
      return;
    }

    const html = records.map(record => `
      <div class="history-item">
        <div class="history-item-score">${record.score}</div>
        <div class="history-item-info">
          <span class="history-item-difficulty">${record.difficultyName}</span>
          <span class="history-item-meta">关卡 ${record.level} · ${record.lines}行</span>
        </div>
      </div>
    `).join('');

    this.historyListEl.innerHTML = html;
  }

  clearHistory() {
    if (confirm('确定要清除所有历史记录吗？')) {
      this.historyManager.clearHistory();
      this.renderHistory();
    }
  }
}
