import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBooks, deleteBook } from '../services/api';

const MyBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchMyBooks(); }, []);

    const fetchMyBooks = async () => {
        try { const res = await getMyBooks(); setBooks(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try { await deleteBook(id); fetchMyBooks(); }
        catch (err) { console.error(err); }
    };

    const typeColor = { SELL: '#d4af37', RENT: '#4a7fa5', EXCHANGE: '#7a68a8' };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');

                .mb {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    padding: 100px 32px 80px;
                }

                /* HEADER */
                .mb-header {
                    max-width: 1100px;
                    margin: 0 auto 36px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .mb-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 600;
                }
                .mb-title span {
                    color: #d4af37;
                    font-style: italic;
                }

                /* POST BUTTON */
                .mb-post-btn {
                    padding: 12px 22px;
                    background: #d4af37;
                    color: #000;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 6px 18px rgba(212, 175, 55, 0.15);
                }
                .mb-post-btn:hover {
                    background: #f1c40f;
                    transform: translateY(-2px);
                }

                /* GRID */
                .mb-grid {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 20px;
                }

                /* CARD & ANIMATIONS */
                .mb-card {
                    background: #0a0a0a;
                    border: 1px solid #1a1a1a;
                    border-radius: 10px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.3);
                    transition: all 0.25s ease;
                    position: relative;
                }

                .mb-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    border-color: #d4af37;
                    box-shadow: 0 14px 35px rgba(0,0,0,0.5);
                }

                /* IMAGE ZOOM ANIMATION */
                .mb-img {
                    width: 100%;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                    background: #121212;
                    position: relative;
                }
                .mb-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }
                .mb-card:hover .mb-img img {
                    transform: scale(1.08);
                }

                .mb-noimg {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    background: #121212;
                }

                /* BADGES */
                .mb-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 5px 10px;
                    font-size: 10px;
                    font-weight: 700;
                    color: #000;
                    border-radius: 4px;
                    z-index: 1;
                }

                .mb-status {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 5px 10px;
                    font-size: 10px;
                    border-radius: 4px;
                    z-index: 1;
                    backdrop-filter: blur(4px);
                }
                .mb-status.avail {
                    background: rgba(212, 175, 55, 0.15);
                    color: #d4af37;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                }
                .mb-status.sold {
                    background: rgba(255, 255, 255, 0.05);
                    color: #666;
                    border: 1px solid #222;
                }

                /* BODY */
                .mb-body {
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .mb-book-title {
                    font-family: 'Fraunces', serif;
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .mb-book-title:hover {
                    color: #d4af37;
                }

                .mb-author {
                    font-size: 12px;
                    color: #888;
                }

                .mb-price {
                    font-size: 16px;
                    font-weight: 600;
                    color: #d4af37;
                }
                .mb-price.ex {
                    font-size: 12px;
                    color: #7a68a8;
                }

                .mb-cond {
                    font-size: 11px;
                    color: #444;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* ACTION BUTTONS */
                .mb-actions {
                    display: flex;
                    gap: 10px;
                    padding: 12px;
                    border-top: 1px solid #1a1a1a;
                }

                .mb-edit, .mb-del {
                    flex: 1;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: transparent;
                }

                .mb-edit {
                    border: 1px solid #333;
                    color: #fff;
                }
                .mb-edit:hover {
                    background: #fff;
                    color: #000;
                    transform: translateY(-1px);
                }

                .mb-del {
                    border: 1px solid rgba(255, 69, 58, 0.3);
                    color: #ff453a;
                }
                .mb-del:hover {
                    background: #ff453a;
                    color: #fff;
                    transform: translateY(-1px);
                }

                /* EMPTY STATE */
                .mb-empty {
                    text-align: center;
                    margin-top: 80px;
                    color: #666;
                }
                .mb-empty-btn {
                    margin-top: 16px;
                    padding: 12px 20px;
                    background: transparent;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .mb-empty-btn:hover {
                    background: #d4af37;
                    color: #000;
                }

                .mb-loading {
                    text-align: center;
                    padding: 100px;
                    color: #d4af37;
                }

                @media(max-width:640px){
                    .mb{padding: 80px 16px;}
                }
            `}</style>

            <div className="mb">
                <div className="mb-header">
                    <h1 className="mb-title">My <span>Books</span></h1>
                    <button className="mb-post-btn" onClick={() => navigate('/add-book')}>+ Post New Book</button>
                </div>

                {loading ? (
                    <div className="mb-loading">Gathering your collection...</div>
                ) : books.length === 0 ? (
                    <div className="mb-empty">
                        <p>You haven't posted any books yet.</p>
                        <button className="mb-empty-btn" onClick={() => navigate('/add-book')}>Post your first book</button>
                    </div>
                ) : (
                    <div className="mb-grid">
                        {books.map(book => (
                            <div key={book.id} className="mb-card">
                                <div className="mb-img" onClick={() => navigate(`/books/${book.id}`)}>
                                    {book.imageUrl
                                        ? <img src={book.imageUrl} alt={book.title} />
                                        : <div className="mb-noimg">📚</div>
                                    }
                                    <span className="mb-badge" style={{ background: typeColor[book.type] || '#d4af37' }}>{book.type}</span>
                                    <span className={`mb-status ${book.status === 'AVAILABLE' ? 'avail' : 'sold'}`}>{book.status}</span>
                                </div>

                                <div className="mb-body">
                                    <div className="mb-book-title" onClick={() => navigate(`/books/${book.id}`)}>{book.title}</div>
                                    <div className="mb-author">by {book.author}</div>
                                    {book.type === 'EXCHANGE'
                                        ? <div className="mb-price ex">Free Exchange</div>
                                        : <div className="mb-price">₹{book.price}</div>
                                    }
                                    <div className="mb-cond">{book.condition}</div>
                                </div>

                                <div className="mb-actions">
                                    <button className="mb-edit" onClick={() => navigate(`/edit-book/${book.id}`)}>✏️ Edit</button>
                                    <button className="mb-del"  onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBooks;