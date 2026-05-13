import { useState } from 'react';
import { useReading } from '../context/ReadingContext';

export default function AddBookForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const { addBook } = useReading();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && totalPages) {
      addBook({ title, author, totalPages });
      setTitle('');
      setAuthor('');
      setTotalPages('');
      onClose?.();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>添加新书</h2>
        <form onSubmit={handleSubmit} className="add-book-form">
          <div className="form-group">
            <label>书名 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入书名"
              required
            />
          </div>
          <div className="form-group">
            <label>作者</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="请输入作者"
            />
          </div>
          <div className="form-group">
            <label>总页数 *</label>
            <input
              type="number"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              placeholder="请输入总页数"
              min="1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
