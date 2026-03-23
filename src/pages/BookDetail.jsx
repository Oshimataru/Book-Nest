import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Reviews from '../components/Reviews';

const typeColor = { SELL: '#a07828', RENT: '#4a7fa5', EXCHANGE: '#7a68a8' };

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user }  = useAuth();

    const [book,    setBook]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => { fetchBook(); }, [id]);

    const fetchBook = async () => {
        try { const res = await getBookById(id); setBook(res.data); }
        catch { setError('Book not found.'); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this book?')) return;
        try { await deleteBook(id); navigate('/books'); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .bd*{box-sizing:border-box;margin:0;padding:0;}
                .bd{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;padding:48px 32px 80px;}
                .bd-wrap{max-width:960px;margin:0 auto;}

                /* Back link */
                .bd-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'Inter',sans-serif;font-size:13px;color:rgba(26,22,16,0.38);cursor:pointer;padding:0;margin-bottom:28px;transition:color 0.15s;}
                .bd-back:hover{color:#a07828;}

                /* States */
                .bd-loading{text-align:center;padding:80px 0;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .bd-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:bdB 1.2s ease-in-out infinite;}
                .bd-dot:nth-child(2){animation-delay:0.15s;}.bd-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes bdB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}
                .bd-err{padding:14px 18px;border:1px solid rgba(180,60,50,0.2);border-radius:4px;background:rgba(200,60,50,0.05);color:rgba(180,60,50,0.8);font-size:13px;font-weight:300;}

                /* Main card */
                .bd-card{display:grid;grid-template-columns:300px 1fr;gap:0;border:1px solid rgba(160,120,40,0.12);background:#faf7f2;margin-bottom:1px;}

                /* Image panel */
                .bd-img-panel{border-right:1px solid rgba(160,120,40,0.1);position:relative;}
                .bd-img{width:100%;aspect-ratio:3/4;overflow:hidden;background:#ede8e0;}
                .bd-img img{width:100%;height:100%;object-fit:cover;}
                .bd-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;color:rgba(160,120,40,0.18);background:repeating-linear-gradient(45deg,rgba(160,120,40,0.03),rgba(160,120,40,0.03) 1px,transparent 1px,transparent 12px);}
                .bd-type-badge{position:absolute;top:14px;left:14px;padding:4px 10px;border-radius:2px;font-size:10px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#fff;}

                /* Info panel */
                .bd-info{padding:28px 32px;display:flex;flex-direction:column;gap:0;}
                .bd-book-title{font-family:'Fraunces',serif;font-size:clamp(22px,3vw,32px);font-weight:600;color:#1a1610;line-height:1.15;letter-spacing:-0.5px;margin-bottom:6px;}
                .bd-author{font-size:14px;font-weight:300;color:rgba(26,22,16,0.42);margin-bottom:20px;}

                /* Meta rows */
                .bd-meta{display:flex;flex-direction:column;gap:0;margin-bottom:20px;border:1px solid rgba(160,120,40,0.1);border-radius:4px;overflow:hidden;}
                .bd-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid rgba(160,120,40,0.08);}
                .bd-row:last-child{border-bottom:none;}
                .bd-row-label{font-size:12px;font-weight:400;color:rgba(26,22,16,0.38);}
                .bd-row-value{font-size:13px;font-weight:400;color:rgba(26,22,16,0.75);}
                .bd-price{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#a07828;}
                .bd-price-exchange{font-size:13px;font-weight:400;font-family:'Inter',sans-serif;color:rgba(160,120,40,0.6);}

                /* Description */
                .bd-section-label{font-size:10.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(160,120,40,0.45);margin-bottom:8px;}
                .bd-desc{font-size:14px;font-weight:300;color:rgba(26,22,16,0.6);line-height:1.7;margin-bottom:20px;}

                /* Seller */
                .bd-seller{padding:14px;background:rgba(160,120,40,0.04);border:1px solid rgba(160,120,40,0.1);border-radius:4px;margin-bottom:24px;}
                .bd-seller-name{font-size:14px;font-weight:500;color:#1a1610;margin-bottom:3px;}
                .bd-seller-email{font-size:12px;font-weight:300;color:rgba(26,22,16,0.38);}

                /* Actions */
                .bd-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;}
                .bd-btn-primary{padding:11px 24px;background:#a07828;color:#fff;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:background 0.15s,transform 0.15s;}
                .bd-btn-primary:hover{background:#b5892e;transform:translateY(-1px);}
                .bd-btn-edit{padding:11px 20px;background:transparent;border:1px solid rgba(160,120,40,0.25);border-radius:4px;color:#a07828;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:background 0.15s,border-color 0.15s;}
                .bd-btn-edit:hover{background:rgba(160,120,40,0.07);border-color:rgba(160,120,40,0.45);}
                .bd-btn-del{padding:11px 20px;background:transparent;border:1px solid rgba(180,60,50,0.2);border-radius:4px;color:rgba(180,60,50,0.65);font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:background 0.15s,border-color 0.15s,color 0.15s;}
                .bd-btn-del:hover{background:rgba(200,60,50,0.05);border-color:rgba(180,60,50,0.4);color:rgba(180,60,50,0.9);}

                /* Reviews section */
                .bd-reviews{border:1px solid rgba(160,120,40,0.12);border-top:none;background:#faf7f2;padding:28px 32px;}
                .bd-reviews-title{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#1a1610;letter-spacing:-0.3px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(160,120,40,0.1);}
                .bd-reviews-title span{color:#a07828;font-style:italic;font-weight:400;}

                @media(max-width:700px){
                    .bd{padding:32px 16px 60px;}
                    .bd-card{grid-template-columns:1fr;}
                    .bd-img-panel{border-right:none;border-bottom:1px solid rgba(160,120,40,0.1);}
                    .bd-img{aspect-ratio:4/3;}
                    .bd-info{padding:20px;}
                    .bd-reviews{padding:20px;}
                }
            `}</style>

            <div className="bd">
                <div className="bd-wrap">
                    <button className="bd-back" onClick={() => navigate('/books')}>← Back to books</button>

                    {loading ? (
                        <div className="bd-loading"><span className="bd-dot"/><span className="bd-dot"/><span className="bd-dot"/></div>
                    ) : error ? (
                        <div className="bd-err">{error}</div>
                    ) : book && (() => {
                        const isOwner = user?.email === book.seller?.email;
                        return (
                            <>
                                <div className="bd-card">
                                    {/* Image */}
                                    <div className="bd-img-panel">
                                        <div className="bd-img">
                                            {book.imageUrl
                                                ? <img src={book.imageUrl} alt={book.title} />
                                                : <div className="bd-noimg">📚</div>
                                            }
                                        </div>
                                        <span className="bd-type-badge" style={{ background: typeColor[book.type] || '#a07828' }}>
                                            {book.type}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="bd-info">
                                        <div className="bd-book-title">{book.title}</div>
                                        <div className="bd-author">by {book.author}</div>

                                        <div className="bd-meta">
                                            <div className="bd-row">
                                                <span className="bd-row-label">Genre</span>
                                                <span className="bd-row-value">{book.genre}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Condition</span>
                                                <span className="bd-row-value">{book.condition}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Location</span>
                                                <span className="bd-row-value">{book.location}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Price</span>
                                                {book.type === 'EXCHANGE'
                                                    ? <span className="bd-price-exchange">Free Exchange</span>
                                                    : <span className="bd-price">₹{book.price}</span>
                                                }
                                            </div>
                                            {book.rentPrice && (
                                                <div className="bd-row">
                                                    <span className="bd-row-label">Rent Price</span>
                                                    <span className="bd-row-value">₹{book.rentPrice}/day</span>
                                                </div>
                                            )}
                                        </div>

                                        {book.description && <>
                                            <div className="bd-section-label">Description</div>
                                            <p className="bd-desc">{book.description}</p>
                                        </>}

                                        <div className="bd-section-label">Seller</div>
                                        <div className="bd-seller">
                                            <div className="bd-seller-name">👤 {book.seller?.name}</div>
                                            <div className="bd-seller-email">{book.seller?.email}</div>
                                        </div>

                                        <div className="bd-actions">
                                            {!isOwner && (
                                                book.type === 'EXCHANGE'
                                                    ? <button className="bd-btn-primary" onClick={() => navigate(`/exchange/${book.id}`)}>🔄 Request Exchange</button>
                                                    : <button className="bd-btn-primary" onClick={() => navigate(`/checkout/${book.id}`)}>
                                                        {book.type === 'SELL' ? '🛒 Buy Now' : '📅 Rent Now'}
                                                      </button>
                                            )}
                                            {isOwner && <>
                                                <button className="bd-btn-edit" onClick={() => navigate(`/edit-book/${book.id}`)}>✏️ Edit</button>
                                                <button className="bd-btn-del"  onClick={handleDelete}>🗑️ Delete</button>
                                            </>}
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="bd-reviews">
                                    <div className="bd-reviews-title">Reviews & <span>Ratings</span></div>
                                    <Reviews bookId={book.id} sellerId={book.seller?.email} />
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
};

export default BookDetail;