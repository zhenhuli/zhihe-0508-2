export class HistoryManager {
  constructor(maxRecords = 10) {
    this.maxRecords = maxRecords;
    this.storageKey = 'tetris_history';
    this.records = this.loadRecords();
  }

  loadRecords() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveRecords() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.records));
    } catch {
    }
  }

  addRecord(record) {
    const newRecord = {
      id: Date.now(),
      score: record.score,
      level: record.level,
      lines: record.lines,
      difficulty: record.difficulty,
      difficultyName: record.difficultyName,
      date: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.records.unshift(newRecord);
    
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(0, this.maxRecords);
    }

    this.saveRecords();
    return newRecord;
  }

  getRecords() {
    return [...this.records];
  }

  getTopRecords(count = 5) {
    return [...this.records]
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  clearHistory() {
    this.records = [];
    this.saveRecords();
  }

  isNewHighScore(score) {
    if (this.records.length === 0) return score > 0;
    return score > Math.max(...this.records.map(r => r.score));
  }
}
