import { useReading } from '../context/ReadingContext';

export default function BookDetail({ bookId, onClose }) {
  const { books, readingSessions, getReadingSpeed } = useReading();
  const book = books.find(b => b.id === bookId);
  
  if (!book) return null;

  const sessions = readingSessions
    .filter(s => s.bookId === bookId)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  
  const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const readingSpeed = getReadingSpeed(bookId);
  const progress = (book.currentPage / book.totalPages) * 100;

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h > 0) {
      return `${h}小时${m}分钟`;
    }
    return `${m}分钟`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal book-detail-modal">
        <div className="modal-header">
          <h2>{book.title}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        {book.author && <p className="book-author">{book.author}</p>}
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="progress-text">
            阅读进度: {book.currentPage} / {book.totalPages} 页 ({progress.toFixed(0)}%)
          </p>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{totalPages}</span>
            <span className="stat-label">总阅读页数</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatDuration(totalDuration)}</span>
            <span className="stat-label">总阅读时长</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{readingSpeed}</span>
            <span className="stat-label">阅读速度(页/小时)</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{sessions.length}</span>
            <span className="stat-label">阅读次数</span>
          </div>
        </div>

        <div className="reading-history">
          <h3>阅读历史</h3>
          {sessions.length === 0 ? (
            <p className="empty-history">暂无阅读记录</p>
          ) : (
            <div className="history-list">
              {sessions.map(session => (
                <div key={session.id} className="history-item">
                  <div className="history-date">{formatDate(session.startTime)}</div>
                  <div className="history-stats">
                    <span className="history-pages">📖 {session.pagesRead} 页</span>
                    <span className="history-duration">⏱️ {formatDuration(session.duration)}</span>
                    <span className="history-range">第 {session.startPage} - {session.endPage} 页</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-secondary" onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}
