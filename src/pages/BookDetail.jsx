import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Reviews from '../components/Reviews';
import '../styles/BookDetail.css';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await getBookById(id);
            setBook(res.data);
        } catch (err) {
            setError('Book not found!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(id);
                navigate('/books');
            } catch (err) {
                setError(err.response?.data || 'Something went wrong!');
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-msg">{error}</div>;
    if (!book) return null;

    const isOwner = user?.email === book.seller?.email;

    return (
        <div className="bookdetail-container">
            {/* Top Section - Book Info */}
            <div className="bookdetail-box">
                <div className="bookdetail-image">
                    {book.imageUrl ? (
                        <img src={book.imageUrl} alt={book.title} />
                    ) : (
                        <div className="no-image-large">📚</div>
                    )}
                </div>

                <div className="bookdetail-info">
                    <span className={`book-type ${book.type.toLowerCase()}`}>
                        {book.type}
                    </span>

                    <h1>{book.title}</h1>
                    <p className="detail-author">by {book.author}</p>

                    <div className="detail-row">
                        <span>📚 Genre</span>
                        <span>{book.genre}</span>
                    </div>
                    <div className="detail-row">
                        <span>⭐ Condition</span>
                        <span>{book.condition}</span>
                    </div>
                    <div className="detail-row">
                        <span>📍 Location</span>
                        <span>{book.location}</span>
                    </div>
                    <div className="detail-row">
                        <span>💰 Price</span>
                        <span className="detail-price">
                            {book.type === 'EXCHANGE' ? '🔄 Free Exchange' : `₹${book.price}`}
                        </span>
                    </div>
                    {book.rentPrice && (
                        <div className="detail-row">
                            <span>🔄 Rent Price</span>
                            <span>₹{book.rentPrice}/day</span>
                        </div>
                    )}

                    <div className="detail-description">
                        <h3>Description</h3>
                        <p>{book.description}</p>
                    </div>

                    <div className="detail-seller">
                        <h3>Seller</h3>
                        <p>👤 {book.seller?.name}</p>
                        <p>📧 {book.seller?.email}</p>
                    </div>

                    <div className="detail-actions">
                        {!isOwner && (
                            <>
                                {book.type === 'EXCHANGE' ? (
                                    <button className="buy-btn"
                                        onClick={() => navigate(`/exchange/${book.id}`)}>
                                        🔄 Request Exchange
                                    </button>
                                ) : (
                                    <button className="buy-btn"
                                        onClick={() => navigate(`/checkout/${book.id}`)}>
                                        {book.type === 'SELL' ? '🛒 Buy Now' : '📅 Rent Now'}
                                    </button>
                                )}
                            </>
                        )}
                        {isOwner && (
                            <>
                                <button className="edit-btn"
                                    onClick={() => navigate(`/edit-book/${book.id}`)}>
                                    ✏️ Edit
                                </button>
                                <button className="delete-btn"
                                    onClick={handleDelete}>
                                    🗑️ Delete
                                </button>
                            </>
                        )}
                        <button className="back-btn"
                            onClick={() => navigate('/books')}>
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Reviews */}
            <div className="bookdetail-reviews">
                <h2>Reviews & Ratings ⭐</h2>
                <Reviews bookId={book.id} sellerId={book.seller?.email} />
            </div>
        </div>
    );
};

export default BookDetail;