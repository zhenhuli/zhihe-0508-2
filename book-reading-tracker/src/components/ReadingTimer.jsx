import { useState, useEffect } from 'react';
import { useReading } from '../context/ReadingContext';

export default function ReadingTimer() {
  const { currentBook, isReading, currentSession, endReading } = useReading();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [endPage, setEndPage] = useState(currentBook?.currentPage || 0);

  useEffect(() => {
    if (!isReading || !currentSession) return;

    const interval = setInterval(() => {
      const elapsed = (new Date() - new Date(currentSession.startTime)) / 1000;
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isReading, currentSession]);

  useEffect(() => {
    if (currentBook) {
      setEndPage(currentBook.currentPage);
    }
  }, [currentBook]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndReading = () => {
    if (endPage >= currentBook.currentPage && endPage <= currentBook.totalPages) {
      endReading(endPage);
    }
  };

  if (!isReading || !currentBook) return null;

  return (
    <div className="reading-timer">
      <div className="timer-header">
        <h2>正在阅读</h2>
        <h3>{currentBook.title}</h3>
      </div>
      
      <div className="timer-display">
        <div className="time">{formatTime(elapsedTime)}</div>
        <p className="timer-label">阅读时长</p>
      </div>

      <div className="page-input-section">
        <p className="current-page-info">当前页数: {currentBook.currentPage} / {currentBook.totalPages}</p>
        <div className="end-page-input">
          <label>读到第</label>
          <input
            type="number"
            value={endPage}
            onChange={(e) => setEndPage(parseInt(e.target.value) || 0)}
            min={currentBook.currentPage}
            max={currentBook.totalPages}
          />
          <span>页</span>
        </div>
      </div>

      <button 
        onClick={handleEndReading}
        className="btn btn-primary btn-end-reading"
        disabled={endPage < currentBook.currentPage || endPage > currentBook.totalPages}
      >
        结束阅读
      </button>
    </div>
  );
}
