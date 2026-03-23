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
    <>
        <style>{`
            .rv {
                background:#f7f3ee;
                padding:30px 20px;
                border-radius:6px;
                font-family:'Inter',sans-serif;
                color:#1a1610;
            }

            .rv-summary { margin-bottom:25px; }

            .rv-avg {
                display:flex;
                align-items:center;
                gap:12px;
            }

            .rv-avg-number {
                font-family:'Fraunces',serif;
                font-size:32px;
                color:#a07828;
            }

            .rv-avg-count {
                font-size:13px;
                color:rgba(26,22,16,0.45);
            }

            .rv-box {
                background:#faf7f2;
                border:1px solid rgba(160,120,40,0.12);
                padding:18px;
                border-radius:4px;
                margin-bottom:20px;
            }

            .rv-title {
                font-family:'Fraunces',serif;
                margin-bottom:10px;
            }

            .rv-error {
                background:rgba(200,60,50,0.05);
                border:1px solid rgba(180,60,50,0.2);
                padding:10px;
                border-radius:4px;
                color:rgba(180,60,50,0.8);
                font-size:13px;
                margin-bottom:10px;
            }

            .rv-star {
                font-size:20px;
                cursor:pointer;
                color:rgba(160,120,40,0.2);
                transition:0.2s;
            }

            .rv-star.filled {
                color:#a07828;
            }

            .rv-textarea {
                width:100%;
                padding:10px;
                background:#f7f3ee;
                border:1px solid rgba(160,120,40,0.16);
                border-radius:4px;
                font-size:13px;
                margin-top:10px;
                outline:none;
            }

            .rv-textarea:focus {
                border-color:rgba(160,120,40,0.4);
            }

            .rv-btn {
                margin-top:12px;
                padding:10px 16px;
                background:#a07828;
                color:#fff;
                border:none;
                border-radius:4px;
                font-size:13px;
                cursor:pointer;
                transition:0.2s;
            }

            .rv-btn:hover { background:#b5892e; }

            .rv-list {
                display:flex;
                flex-direction:column;
                gap:15px;
            }

            .rv-card {
                background:#faf7f2;
                border:1px solid rgba(160,120,40,0.12);
                padding:15px;
                border-radius:4px;
            }

            .rv-header {
                display:flex;
                justify-content:space-between;
                margin-bottom:8px;
            }

            .rv-user {
                display:flex;
                gap:10px;
                align-items:center;
            }

            .rv-avatar {
                width:34px;
                height:34px;
                border-radius:50%;
                background:#a07828;
                color:#fff;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:14px;
            }

            .rv-name {
                font-size:13px;
                font-weight:500;
            }

            .rv-date {
                font-size:11px;
                color:rgba(26,22,16,0.4);
            }

            .rv-comment {
                font-size:13px;
                line-height:1.5;
            }

            .rv-delete {
                background:none;
                border:none;
                cursor:pointer;
                font-size:14px;
                color:rgba(180,60,50,0.7);
            }

            .rv-empty {
                text-align:center;
                color:rgba(26,22,16,0.4);
                font-size:13px;
            }
        `}</style>

        <div className="rv">
            {/* Summary */}
            <div className="rv-summary">
                <div className="rv-avg">
                    <span className="rv-avg-number">{avgRating}</span>
                    <span>{renderStars(Math.round(avgRating))}</span>
                    <span className="rv-avg-count">{totalReviews} reviews</span>
                </div>
            </div>

            {/* Add Review */}
            {user && user.email !== sellerId && (
                <div className="rv-box">
                    <h4 className="rv-title">Write a Review</h4>

                    {error && <div className="rv-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div>
                            {[1,2,3,4,5].map((star) => (
                                <span
                                    key={star}
                                    className={`rv-star ${star <= (hover || rating) ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea
                            className="rv-textarea"
                            placeholder="Write your review here..."
                            value={comment}
                            onChange={(e)=>setComment(e.target.value)}
                        />

                        <button className="rv-btn" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="rv-list">
                {reviews.length === 0 ? (
                    <p className="rv-empty">No reviews yet! Be the first 🚀</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="rv-card">
                            <div className="rv-header">
                                <div className="rv-user">
                                    <span className="rv-avatar">
                                        {review.user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <div>
                                        <div className="rv-name">{review.user?.name}</div>
                                        <div className="rv-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {renderStars(review.rating)}
                                    {user?.email === review.user?.email && (
                                        <button
                                            className="rv-delete"
                                            onClick={()=>handleDelete(review.id)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="rv-comment">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
);
};

export default Reviews;