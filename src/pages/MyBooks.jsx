import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBooks, deleteBook } from '../services/api';
import '../styles/Books.css';

const MyBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const res = await getMyBooks();
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this book?')) {
            try {
                await deleteBook(id);
                fetchMyBooks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="books-container">
            <div className="books-header">
                <h2>My Books 📚</h2>
                <button onClick={() => navigate('/add-book')}
                    style={{ padding: '10px 20px', background: '#238636',
                        color: 'white', border: 'none', borderRadius: '8px',
                        cursor: 'pointer', fontWeight: '600' }}>
                    + Post New Book
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : books.length === 0 ? (
                <div className="no-books">
                    You haven't posted any books yet! 😔
                </div>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-card">
                            <div className="book-image"
                                onClick={() => navigate(`/books/${book.id}`)}>
                                {book.imageUrl ? (
                                    <img src={book.imageUrl} alt={book.title} />
                                ) : (
                                    <div className="no-image">📚</div>
                                )}
                            </div>
                            <div className="book-info">
                                <span className={`book-type ${book.type.toLowerCase()}`}>
                                    {book.type}
                                </span>
                                <h3>{book.title}</h3>
                                <p className="book-author">by {book.author}</p>
                              <p className="book-price">
    {book.type === 'EXCHANGE' ? '🔄 Free Exchange' : `₹${book.price}`}
</p>
                                <p className="book-condition">{book.condition}</p>
                                <span className={`book-type ${book.status === 'AVAILABLE' ? 'sell' : 'exchange'}`}>
                                    {book.status}
                                </span>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                    <button onClick={() => navigate(`/edit-book/${book.id}`)}
                                        style={{ flex: 1, padding: '8px', background: '#3d2b00',
                                            color: '#e3b341', border: '1px solid #e3b341',
                                            borderRadius: '6px', cursor: 'pointer' }}>
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(book.id)}
                                        style={{ flex: 1, padding: '8px', background: '#2d1515',
                                            color: '#f85149', border: '1px solid #f85149',
                                            borderRadius: '6px', cursor: 'pointer' }}>
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBooks;