import { useState } from 'react';
import { ReadingProvider, useReading } from './context/ReadingContext';
import AddBookForm from './components/AddBookForm';
import BookList from './components/BookList';
import ReadingTimer from './components/ReadingTimer';
import ReadingCalendar from './components/ReadingCalendar';
import StatsPanel from './components/StatsPanel';
import BookDetail from './components/BookDetail';
import './App.css';

function AppContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const { startReading, isReading } = useReading();

  const handleStartReading = (bookId) => {
    if (!isReading) {
      startReading(bookId);
    }
  };

  const handleViewDetails = (bookId) => {
    setSelectedBookId(bookId);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 阅读进度追踪器</h1>
        <button 
          className="btn-add"
          onClick={() => setShowAddForm(true)}
          disabled={isReading}
        >
          +
        </button>
      </header>

      <main className="main-content">
        {isReading ? (
          <ReadingTimer />
        ) : (
          <>
            <div className="left-panel">
              <h2>我的书籍</h2>
              <BookList 
                onStartReading={handleStartReading}
                onViewDetails={handleViewDetails}
              />
            </div>
            <div className="right-panel">
              <StatsPanel />
              <ReadingCalendar />
            </div>
          </>
        )}
      </main>

      {showAddForm && (
        <AddBookForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedBookId && (
        <BookDetail 
          bookId={selectedBookId} 
          onClose={() => setSelectedBookId(null)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ReadingProvider>
      <AppContent />
    </ReadingProvider>
  );
}

export default App;
