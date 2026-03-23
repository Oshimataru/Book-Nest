import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyBooks, sendExchangeRequest } from '../services/api';

const Exchange = () => {
    const { bookId } = useParams();
    const navigate   = useNavigate();

    const [myBooks,       setMyBooks]       = useState([]);
    const [selectedBook,  setSelectedBook]  = useState('');
    const [message,       setMessage]       = useState('');
    const [loading,       setLoading]       = useState(true);
    const [sending,       setSending]       = useState(false);
    const [error,         setError]         = useState('');

    useEffect(() => { fetchMyBooks(); }, []);

    const fetchMyBooks = async () => {
        try { const res = await getMyBooks(); setMyBooks(res.data); }
        catch { setError('Failed to load your books.'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async () => {
        if (!selectedBook) { setError('Please select a book to offer.'); return; }
        setSending(true); setError('');
        try { await sendExchangeRequest(bookId, selectedBook, message); navigate('/my-exchanges'); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
        finally { setSending(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .xc*{box-sizing:border-box;margin:0;padding:0;}
                .xc{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;display:flex;align-items:flex-start;justify-content:center;padding:48px 24px 80px;}
                .xc-box{width:100%;max-width:600px;}

                .xc-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'Inter',sans-serif;font-size:13px;color:rgba(26,22,16,0.38);cursor:pointer;padding:0;margin-bottom:24px;transition:color 0.15s;}
                .xc-back:hover{color:#a07828;}

                .xc-title{font-family:'Fraunces',serif;font-size:clamp(24px,4vw,36px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;margin-bottom:6px;}
                .xc-title span{color:#a07828;font-style:italic;font-weight:400;}
                .xc-sub{font-size:13px;font-weight:300;color:rgba(26,22,16,0.4);margin-bottom:28px;}

                .xc-err{padding:11px 14px;border:1px solid rgba(180,60,50,0.2);border-radius:4px;background:rgba(200,60,50,0.05);color:rgba(180,60,50,0.8);font-size:13px;font-weight:300;margin-bottom:20px;}

                .xc-loading{text-align:center;padding:60px 0;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .xc-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:xcB 1.2s ease-in-out infinite;}
                .xc-dot:nth-child(2){animation-delay:0.15s;}.xc-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes xcB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                /* Empty state */
                .xc-empty{text-align:center;padding:40px 20px;border:1px solid rgba(160,120,40,0.12);background:#faf7f2;}
                .xc-empty p{font-size:14px;font-weight:300;color:rgba(26,22,16,0.4);margin-bottom:16px;}
                .xc-add-btn{padding:10px 22px;background:#a07828;color:#fff;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:background 0.15s;}
                .xc-add-btn:hover{background:#b5892e;}

                /* Section label */
                .xc-sec{font-size:10.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(160,120,40,0.45);margin-bottom:12px;}

                /* Book selection grid */
                .xc-grid{display:flex;flex-direction:column;gap:1px;border:1px solid rgba(160,120,40,0.12);margin-bottom:20px;}
                .xc-book-card{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#faf7f2;cursor:pointer;transition:background 0.15s;position:relative;border-bottom:1px solid rgba(160,120,40,0.08);}
                .xc-book-card:last-child{border-bottom:none;}
                .xc-book-card:hover{background:#f7f3ee;}
                .xc-book-card.sel{background:rgba(160,120,40,0.07);border-left:2px solid #a07828;}
                .xc-book-card.sel{padding-left:14px;}

                .xc-book-img{width:44px;height:56px;border-radius:2px;overflow:hidden;background:#ede8e0;flex-shrink:0;border:1px solid rgba(160,120,40,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;color:rgba(160,120,40,0.2);}
                .xc-book-img img{width:100%;height:100%;object-fit:cover;}
                .xc-book-info{flex:1;min-width:0;}
                .xc-book-title{font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:#1a1610;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                .xc-book-author{font-size:12px;font-weight:300;color:rgba(26,22,16,0.38);}
                .xc-check{width:18px;height:18px;border-radius:50%;background:#a07828;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:#fff;}
                .xc-uncheck{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(160,120,40,0.2);flex-shrink:0;}

                /* Message */
                .xc-msg-wrap{margin-bottom:24px;}
                .xc-textarea{width:100%;padding:10px 13px;background:#faf7f2;border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:#1a1610;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:300;outline:none;resize:vertical;min-height:80px;line-height:1.6;transition:border-color 0.15s,background 0.15s;}
                .xc-textarea::placeholder{color:rgba(26,22,16,0.2);}
                .xc-textarea:focus{border-color:rgba(160,120,40,0.4);background:#f7f3ee;}

                /* Actions */
                .xc-actions{display:flex;gap:10px;}
                .xc-btn-back{padding:12px 20px;background:transparent;border:1px solid rgba(160,120,40,0.22);border-radius:4px;color:rgba(26,22,16,0.5);font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:border-color 0.15s,color 0.15s;}
                .xc-btn-back:hover{border-color:rgba(160,120,40,0.4);color:rgba(26,22,16,0.8);}
                .xc-btn-send{flex:1;padding:12px;background:#a07828;color:#fff;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;transition:background 0.15s,transform 0.15s;}
                .xc-btn-send:hover:not(:disabled){background:#b5892e;transform:translateY(-1px);}
                .xc-btn-send:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

                @media(max-width:480px){.xc{padding:32px 16px 60px;}.xc-actions{flex-direction:column;}.xc-btn-back{order:2;}.xc-btn-send{order:1;}}
            `}</style>

            <div className="xc">
                <div className="xc-box">
                    <button className="xc-back" onClick={() => navigate(-1)}>← Back</button>

                    <h1 className="xc-title">Request <span>Exchange</span></h1>
                    <p className="xc-sub">Select one of your books to offer in exchange.</p>

                    {error && <div className="xc-err">{error}</div>}

                    {loading ? (
                        <div className="xc-loading"><span className="xc-dot"/><span className="xc-dot"/><span className="xc-dot"/></div>
                    ) : myBooks.length === 0 ? (
                        <div className="xc-empty">
                            <p>You don't have any books to offer yet.</p>
                            <button className="xc-add-btn" onClick={() => navigate('/add-book')}>+ Post a Book First</button>
                        </div>
                    ) : (
                        <>
                            <p className="xc-sec">Choose a book to offer</p>
                            <div className="xc-grid">
                                {myBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`xc-book-card${selectedBook == book.id ? ' sel' : ''}`}
                                        onClick={() => setSelectedBook(book.id)}
                                    >
                                        <div className="xc-book-img">
                                            {book.imageUrl
                                                ? <img src={book.imageUrl} alt={book.title} />
                                                : '📚'}
                                        </div>
                                        <div className="xc-book-info">
                                            <div className="xc-book-title">{book.title}</div>
                                            <div className="xc-book-author">by {book.author}</div>
                                        </div>
                                        {selectedBook == book.id
                                            ? <div className="xc-check">✓</div>
                                            : <div className="xc-uncheck"/>
                                        }
                                    </div>
                                ))}
                            </div>

                            <div className="xc-msg-wrap">
                                <p className="xc-sec">Message to seller <span style={{textTransform:'none',letterSpacing:0,fontSize:'11px',color:'rgba(26,22,16,0.3)',fontWeight:300}}>(optional)</span></p>
                                <textarea
                                    className="xc-textarea"
                                    placeholder="Tell the seller why you want to exchange…"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <div className="xc-actions">
                                <button className="xc-btn-back" onClick={() => navigate(-1)}>← Back</button>
                                <button className="xc-btn-send" onClick={handleSubmit} disabled={sending}>
                                    {sending ? 'Sending…' : '🔄 Send Exchange Request'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Exchange;