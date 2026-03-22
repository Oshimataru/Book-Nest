import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookReviews, addReview, deleteReview } from '../services/api';
import '../styles/Reviews.css';

const Reviews = ({ bookId, sellerId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [hover, setHover] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [bookId]);

    const fetchReviews = async () => {
        try {
            const res = await getBookReviews(bookId);
            setReviews(res.data.reviews);
            setAvgRating(res.data.averageRating);
            setTotalReviews(res.data.totalReviews);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Please write a comment!');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await addReview(bookId, rating, comment);
            setComment('');
            setRating(5);
            fetchReviews();
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteReview(id);
            fetchReviews();
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const renderStars = (count) => {
        return '⭐'.repeat(count) + '☆'.repeat(5 - count);
    };

    if (loading) return <div className="loading">Loading reviews...</div>;

    return (
        <div className="reviews-section">
            {/* Rating Summary */}
            <div className="reviews-summary">
                <div className="avg-rating">
                    <span className="avg-number">{avgRating}</span>
                    <span className="avg-stars">{renderStars(Math.round(avgRating))}</span>
                    <span className="avg-count">{totalReviews} reviews</span>
                </div>
            </div>

            {/* Add Review Form */}
            {user && user.email !== sellerId && (
                <div className="add-review">
                    <h4>Write a Review</h4>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="star-select">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Write your review here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                        />
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet! Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-user">
                                    <span className="review-avatar">
                                        {review.user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <div>
                                        <p className="review-name">{review.user?.name}</p>
                                        <p className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="review-right">
                                    <span className="review-stars">
                                        {renderStars(review.rating)}
                                    </span>
                                    {user?.email === review.user?.email && (
                                        <button className="delete-review-btn"
                                            onClick={() => handleDelete(review.id)}>
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;