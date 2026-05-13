import { useReading } from '../context/ReadingContext';

export default function StatsPanel() {
  const { getTotalStats } = useReading();
  const stats = getTotalStats();

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h > 0) {
      return `${h} 小时 ${m} 分钟`;
    }
    return `${m} 分钟`;
  };

  return (
    <div className="stats-panel">
      <h3>阅读统计</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPages}</div>
          <div className="stat-label">总阅读页数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDuration(stats.totalDuration)}</div>
          <div className="stat-label">总阅读时长</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalBooks}</div>
          <div className="stat-label">已读完书籍</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgSpeed}</div>
          <div className="stat-label">平均速度 (页/小时)</div>
        </div>
      </div>
    </div>
  );
}
