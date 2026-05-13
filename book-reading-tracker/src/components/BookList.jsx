import { useReading } from '../context/ReadingContext';

export default function BookList({ onStartReading, onViewDetails }) {
  const { books, getReadingSpeed, isReading } = useReading();

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>还没有添加书籍</p>
        <p className="hint">点击右上角 + 添加你的第一本书</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map(book => {
        const progress = (book.currentPage / book.totalPages) * 100;
        const readingSpeed = getReadingSpeed(book.id);
        const isCompleted = book.currentPage >= book.totalPages;

        return (
          <div 
            key={book.id} 
            className={`book-card ${isCompleted ? 'completed' : ''}`}
          >
            <div className="book-info">
              <h3>{book.title}</h3>
              {book.author && <p className="author">{book.author}</p>}
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="book-stats">
                <span>{book.currentPage} / {book.totalPages} 页</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              {readingSpeed > 0 && (
                <p className="reading-speed">阅读速度: {readingSpeed} 页/小时</p>
              )}
            </div>
            <div className="book-actions">
              {!isCompleted && (
                <button 
                  className="btn btn-small btn-primary"
                  onClick={() => onStartReading(book.id)}
                  disabled={isReading}
                >
                  开始阅读
                </button>
              )}
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onViewDetails(book.id)}
              >
                查看详情
              </button>
            </div>
            {isCompleted && <span className="completed-badge">已读完</span>}
          </div>
        );
      })}
    </div>
  );
}
