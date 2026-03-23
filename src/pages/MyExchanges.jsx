import { useState, useEffect } from 'react';
import { getSentRequests, getReceivedRequests, acceptExchange, rejectExchange } from '../services/api';

const statusStyle = {
    PENDING:  { bg: 'rgba(160,120,40,0.1)',  color: '#a07828',           border: 'rgba(160,120,40,0.25)'  },
    ACCEPTED: { bg: 'rgba(80,140,80,0.1)',   color: '#4a8c4a',           border: 'rgba(80,140,80,0.25)'   },
    REJECTED: { bg: 'rgba(180,60,50,0.08)',  color: 'rgba(180,60,50,0.75)', border: 'rgba(180,60,50,0.2)' },
};

const MyExchanges = () => {
    const [sent,     setSent]     = useState([]);
    const [received, setReceived] = useState([]);
    const [tab,      setTab]      = useState('received');
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [s, r] = await Promise.all([getSentRequests(), getReceivedRequests()]);
            setSent(s.data); setReceived(r.data);
        } catch { setError('Failed to load exchanges.'); }
        finally { setLoading(false); }
    };

    const handleAccept = async (id) => {
        try { await acceptExchange(id); fetchAll(); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const handleReject = async (id) => {
        try { await rejectExchange(id); fetchAll(); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const list = tab === 'sent' ? sent : received;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .ex*{box-sizing:border-box;margin:0;padding:0;}
                .ex{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;padding:48px 32px 80px;}

                .ex-header{max-width:820px;margin:0 auto 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
                .ex-title{font-family:'Fraunces',serif;font-size:clamp(26px,4vw,40px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;}
                .ex-title span{color:#a07828;font-style:italic;font-weight:400;}

                .ex-tabs{display:flex;border:1px solid rgba(160,120,40,0.18);border-radius:4px;overflow:hidden;}
                .ex-tab{padding:8px 18px;background:transparent;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:400;color:rgba(26,22,16,0.45);cursor:pointer;transition:background 0.15s,color 0.15s;white-space:nowrap;}
                .ex-tab:first-child{border-right:1px solid rgba(160,120,40,0.18);}
                .ex-tab.act{background:#a07828;color:#fff;font-weight:500;}
                .ex-tab:not(.act):hover{background:rgba(160,120,40,0.06);color:rgba(26,22,16,0.75);}

                .ex-err{max-width:820px;margin:0 auto 20px;padding:12px 16px;border:1px solid rgba(180,60,50,0.2);border-radius:4px;background:rgba(200,60,50,0.05);color:rgba(180,60,50,0.8);font-size:13px;font-weight:300;}

                .ex-loading,.ex-empty{max-width:820px;margin:80px auto;text-align:center;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .ex-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:exB 1.2s ease-in-out infinite;}
                .ex-dot:nth-child(2){animation-delay:0.15s;}.ex-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes exB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                .ex-list{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:1px;border:1px solid rgba(160,120,40,0.1);}

                .ex-card{background:#f7f3ee;padding:20px 24px;border-bottom:1px solid rgba(160,120,40,0.08);transition:background 0.15s;}
                .ex-card:last-child{border-bottom:none;}
                .ex-card:hover{background:#faf7f2;}

                /* Books swap row */
                .ex-books{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(160,120,40,0.07);}
                .ex-book{flex:1;display:flex;gap:12px;align-items:flex-start;min-width:0;}
                .ex-book-img{width:48px;height:62px;border-radius:2px;overflow:hidden;background:#ede8e0;flex-shrink:0;border:1px solid rgba(160,120,40,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;color:rgba(160,120,40,0.2);}
                .ex-book-img img{width:100%;height:100%;object-fit:cover;}
                .ex-book-info{flex:1;min-width:0;}
                .ex-book-label{font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(160,120,40,0.5);margin-bottom:3px;}
                .ex-book-title{font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:#1a1610;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                .ex-book-author{font-size:12px;font-weight:300;color:rgba(26,22,16,0.38);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

                .ex-arrow{font-size:14px;color:rgba(160,120,40,0.35);flex-shrink:0;padding:0 4px;}

                /* Message */
                .ex-msg{font-size:13px;font-weight:300;color:rgba(26,22,16,0.45);font-style:italic;margin-bottom:14px;padding:10px 14px;background:rgba(160,120,40,0.04);border-left:2px solid rgba(160,120,40,0.2);border-radius:0 4px 4px 0;}

                /* Footer */
                .ex-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
                .ex-status{display:inline-block;padding:3px 10px;border-radius:2px;font-size:11px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;border:1px solid;}
                .ex-btns{display:flex;gap:8px;}
                .ex-accept{padding:8px 16px;background:#a07828;border:none;border-radius:4px;color:#fff;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;cursor:pointer;transition:background 0.15s;}
                .ex-accept:hover{background:#b5892e;}
                .ex-reject{padding:8px 16px;background:transparent;border:1px solid rgba(180,60,50,0.22);border-radius:4px;color:rgba(180,60,50,0.65);font-family:'Inter',sans-serif;font-size:12.5px;cursor:pointer;transition:background 0.15s,border-color 0.15s,color 0.15s;}
                .ex-reject:hover{background:rgba(200,60,50,0.05);border-color:rgba(180,60,50,0.4);color:rgba(180,60,50,0.9);}

                @media(max-width:580px){
                    .ex{padding:32px 16px 60px;}
                    .ex-card{padding:16px;}
                    .ex-books{flex-direction:column;align-items:stretch;}
                    .ex-arrow{transform:rotate(90deg);text-align:center;}
                }
            `}</style>

            <div className="ex">
                <div className="ex-header">
                    <h1 className="ex-title">My <span>Exchanges</span></h1>
                    <div className="ex-tabs">
                        <button className={`ex-tab${tab==='received'?' act':''}`} onClick={() => setTab('received')}>
                            Received ({received.length})
                        </button>
                        <button className={`ex-tab${tab==='sent'?' act':''}`} onClick={() => setTab('sent')}>
                            Sent ({sent.length})
                        </button>
                    </div>
                </div>

                {error && <div className="ex-err">{error}</div>}

                {loading ? (
                    <div className="ex-loading"><span className="ex-dot"/><span className="ex-dot"/><span className="ex-dot"/></div>
                ) : list.length === 0 ? (
                    <div className="ex-empty">No exchange requests yet.</div>
                ) : (
                    <div className="ex-list">
                        {list.map(req => {
                            const s = statusStyle[req.status] || statusStyle.PENDING;
                            return (
                                <div key={req.id} className="ex-card">
                                    {/* Books */}
                                    <div className="ex-books">
                                        <div className="ex-book">
                                            <div className="ex-book-img">
                                                {req.offeredBook?.imageUrl
                                                    ? <img src={req.offeredBook.imageUrl} alt={req.offeredBook.title} />
                                                    : '📚'}
                                            </div>
                                            <div className="ex-book-info">
                                                <div className="ex-book-label">Offered</div>
                                                <div className="ex-book-title">{req.offeredBook?.title}</div>
                                                <div className="ex-book-author">{req.offeredBook?.author}</div>
                                            </div>
                                        </div>

                                        <div className="ex-arrow">⇄</div>

                                        <div className="ex-book">
                                            <div className="ex-book-img">
                                                {req.requestedBook?.imageUrl
                                                    ? <img src={req.requestedBook.imageUrl} alt={req.requestedBook.title} />
                                                    : '📚'}
                                            </div>
                                            <div className="ex-book-info">
                                                <div className="ex-book-label">Requested</div>
                                                <div className="ex-book-title">{req.requestedBook?.title}</div>
                                                <div className="ex-book-author">{req.requestedBook?.author}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {req.message && <div className="ex-msg">"{req.message}"</div>}

                                    {/* Footer */}
                                    <div className="ex-footer">
                                        <span className="ex-status" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                            {req.status}
                                        </span>
                                        {tab === 'received' && req.status === 'PENDING' && (
                                            <div className="ex-btns">
                                                <button className="ex-accept" onClick={() => handleAccept(req.id)}>Accept</button>
                                                <button className="ex-reject" onClick={() => handleReject(req.id)}>Reject</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyExchanges;