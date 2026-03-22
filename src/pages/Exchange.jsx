import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyBooks, sendExchangeRequest } from '../services/api';
import '../styles/Exchange.css';

const Exchange = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [myBooks, setMyBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const res = await getMyBooks();
            setMyBooks(res.data);
        } catch (err) {
            setError('Failed to load your books!');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedBook) {
            setError('Please select a book to offer!');
            return;
        }
        setSending(true);
        setError('');
        try {
            await sendExchangeRequest(bookId, selectedBook, message);
            navigate('/my-exchanges');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="exchange-container">
            <div className="exchange-box">
                <h2>Request Exchange 🔄</h2>
                <p className="exchange-subtitle">
                    Select one of your books to offer in exchange!
                </p>

                {error && <div className="error-msg">{error}</div>}

                {myBooks.length === 0 ? (
                    <div className="no-books-msg">
                        <p>You don't have any books to offer! 😔</p>
                        <button onClick={() => navigate('/add-book')}
                            className="add-book-btn">
                            + Post a Book First
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="books-select-grid">
                            {myBooks.map((book) => (
                                <div key={book.id}
                                    className={`book-select-card 
                                        ${selectedBook == book.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedBook(book.id)}>
                                    <div className="select-image">
                                        {book.imageUrl ? (
                                            <img src={book.imageUrl} alt={book.title} />
                                        ) : (
                                            <span>📚</span>
                                        )}
                                    </div>
                                    <div className="select-info">
                                        <h4>{book.title}</h4>
                                        <p>{book.author}</p>
                                    </div>
                                    {selectedBook == book.id && (
                                        <div className="selected-check">✅</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Message to Seller (optional)</label>
                            <textarea
                                placeholder="Tell the seller why you want to exchange..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="3"
                            />
                        </div>

                        <div className="exchange-actions">
                            <button className="back-btn"
                                onClick={() => navigate(-1)}>
                                ← Back
                            </button>
                            <button className="send-btn"
                                onClick={handleSubmit}
                                disabled={sending}>
                                {sending ? 'Sending...' : '🔄 Send Exchange Request'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Exchange;