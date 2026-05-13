import { createContext, useContext, useState, useEffect } from 'react';

const ReadingContext = createContext();

export function ReadingProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [readingSessions, setReadingSessions] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    const savedSessions = localStorage.getItem('readingSessions');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedSessions) setReadingSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('readingSessions', JSON.stringify(readingSessions));
  }, [readingSessions]);

  const addBook = (book) => {
    const newBook = {
      id: Date.now(),
      ...book,
      currentPage: 0,
      totalPages: parseInt(book.totalPages),
      createdAt: new Date().toISOString()
    };
    setBooks(prev => [...prev, newBook]);
  };

  const startReading = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    setCurrentBook(book);
    setIsReading(true);
    setCurrentSession({
      bookId,
      startTime: new Date().toISOString(),
      startPage: book.currentPage
    });
  };

  const endReading = (endPage) => {
    if (!currentSession) return;

    const endTime = new Date().toISOString();
    const duration = (new Date(endTime) - new Date(currentSession.startTime)) / 1000 / 60;
    const pagesRead = endPage - currentSession.startPage;

    const session = {
      id: Date.now(),
      bookId: currentSession.bookId,
      startTime: currentSession.startTime,
      endTime,
      duration,
      startPage: currentSession.startPage,
      endPage,
      pagesRead,
      date: new Date().toISOString().split('T')[0]
    };

    setReadingSessions(prev => [...prev, session]);
    
    setBooks(prev => prev.map(book => 
      book.id === currentSession.bookId 
        ? { ...book, currentPage: endPage }
        : book
    ));

    setIsReading(false);
    setCurrentSession(null);
    setCurrentBook(null);
  };

  const getReadingSpeed = (bookId) => {
    const bookSessions = readingSessions.filter(s => s.bookId === bookId && s.duration > 0 && s.pagesRead > 0);
    if (bookSessions.length === 0) return 0;
    
    const totalPages = bookSessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalMinutes = bookSessions.reduce((sum, s) => sum + s.duration, 0);
    
    return totalMinutes > 0 ? Math.round(totalPages / (totalMinutes / 60)) : 0;
  };

  const getCalendarData = () => {
    const calendar = {};
    readingSessions.forEach(session => {
      const date = session.date;
      if (!calendar[date]) {
        calendar[date] = { pages: 0, duration: 0 };
      }
      calendar[date].pages += session.pagesRead;
      calendar[date].duration += session.duration;
    });
    return calendar;
  };

  const getTotalStats = () => {
    const totalPages = readingSessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalDuration = readingSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalBooks = books.filter(b => b.currentPage >= b.totalPages).length;
    const avgSpeed = totalDuration > 0 ? Math.round(totalPages / (totalDuration / 60)) : 0;
    
    return { totalPages, totalDuration, totalBooks, avgSpeed };
  };

  return (
    <ReadingContext.Provider value={{
      books,
      readingSessions,
      currentBook,
      isReading,
      currentSession,
      addBook,
      startReading,
      endReading,
      getReadingSpeed,
      getCalendarData,
      getTotalStats,
      setBooks,
      setReadingSessions
    }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  return useContext(ReadingContext);
}
