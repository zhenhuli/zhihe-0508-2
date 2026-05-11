export const DIFFICULTY_CONFIG = {
  easy: {
    name: '简单',
    baseInterval: 1200,
    minInterval: 200,
    intervalDecrease: 80,
    scoreMultiplier: 1
  },
  medium: {
    name: '中等',
    baseInterval: 1000,
    minInterval: 100,
    intervalDecrease: 100,
    scoreMultiplier: 1.5
  },
  hard: {
    name: '困难',
    baseInterval: 700,
    minInterval: 80,
    intervalDecrease: 70,
    scoreMultiplier: 2
  },
  expert: {
    name: '专家',
    baseInterval: 400,
    minInterval: 50,
    intervalDecrease: 40,
    scoreMultiplier: 3
  }
};

export class ScoreManager {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.highScore = this.loadHighScore();
    this.config = DIFFICULTY_CONFIG[this.difficulty];
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.config = DIFFICULTY_CONFIG[this.difficulty];
  }

  reset() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
  }

  addLines(linesCleared) {
    this.lines += linesCleared;
    
    const points = [0, 100, 300, 500, 800];
    this.score += Math.floor(points[linesCleared] * this.level * this.config.scoreMultiplier);
    
    const newLevel = Math.floor(this.lines / 10) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
    }
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  addSoftDrop() {
    this.score += 1;
  }

  getDropInterval() {
    const interval = this.config.baseInterval - (this.level - 1) * this.config.intervalDecrease;
    return Math.max(interval, this.config.minInterval);
  }

  loadHighScore() {
    try {
      const saved = localStorage.getItem('tetris_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem('tetris_high_score', this.highScore.toString());
    } catch {
    }
  }
}
