import { useState, useEffect } from 'react';
import { getSentRequests, getReceivedRequests, acceptExchange, rejectExchange } from '../services/api';

const statusStyle = {
    PENDING:  { bg: 'rgba(255,193,7,0.1)',   color: '#FFC107', border: 'rgba(255,193,7,0.3)'   },
    ACCEPTED: { bg: 'rgba(46,204,113,0.1)',  color: '#2ecc71', border: 'rgba(46,204,113,0.3)'  },
    REJECTED: { bg: 'rgba(231,76,60,0.1)',   color: '#e74c3c', border: 'rgba(231,76,60,0.3)'   },
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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,700;1,400&display=swap');

                .ex * { box-sizing: border-box; margin: 0; padding: 0; }
                .ex {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    padding: 48px 32px 80px;
                }

                @keyframes exSlideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes exGlowPulse {
                    0%,100% { box-shadow: 0 0 5px rgba(255,193,7,0.15); }
                    50%     { box-shadow: 0 0 20px rgba(255,193,7,0.35); }
                }
                @keyframes exCardIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes exDot {
                    0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
                    40%         { transform: scale(1);   opacity: 1;   }
                }

                .ex-container { max-width: 860px; margin: 0 auto; animation: exSlideIn 0.55s ease-out; }

                /* ── Header ── */
                .ex-header {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px; margin-bottom: 32px;
                }
                .ex-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(28px, 4vw, 40px);
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    line-height: 1;
                }
                .ex-title span {
                    color: #FFC107;
                    font-style: italic;
                    font-weight: 400;
                    text-shadow: 0 0 12px rgba(255,193,7,0.25);
                }

                /* ── Tabs ── */
                .ex-tabs {
                    display: flex;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 5px;
                    gap: 4px;
                }
                .ex-tab {
                    padding: 9px 20px;
                    border: none;
                    background: transparent;
                    color: #666;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: background 0.2s, color 0.2s;
                    white-space: nowrap;
                }
                .ex-tab.act     { background: #FFC107; color: #000; }
                .ex-tab:not(.act):hover { background: #1a1a1a; color: #ccc; }

                .ex-tab-count {
                    display: inline-block;
                    background: rgba(255,193,7,0.15);
                    color: #FFC107;
                    border-radius: 20px;
                    font-size: 11px;
                    padding: 1px 7px;
                    margin-left: 5px;
                    font-weight: 600;
                }
                .ex-tab.act .ex-tab-count { background: rgba(0,0,0,0.2); color: #000; }

                /* ── Error ── */
                .ex-err {
                    max-width: 860px; margin: 0 auto 20px;
                    padding: 12px 16px;
                    border: 1px solid rgba(231,76,60,0.3);
                    border-radius: 10px;
                    background: rgba(231,76,60,0.08);
                    color: #e74c3c;
                    font-size: 13px;
                }

                /* ── Loading / Empty ── */
                .ex-loading {
                    display: flex; justify-content: center; align-items: center;
                    gap: 8px; padding: 100px 0;
                }
                .ex-dot {
                    width: 10px; height: 10px;
                    background: #FFC107; border-radius: 50%;
                    animation: exDot 1.2s ease-in-out infinite;
                }
                .ex-dot:nth-child(2) { animation-delay: 0.15s; }
                .ex-dot:nth-child(3) { animation-delay: 0.30s; }

                .ex-empty {
                    text-align: center; padding: 100px 0;
                    color: #444; font-size: 14px; font-weight: 300; letter-spacing: 0.3px;
                }

                /* ── List & Cards ── */
                .ex-list { display: flex; flex-direction: column; gap: 12px; }

                .ex-card {
                    background: #0a0a0a;
                    border: 1px solid #1a1a1a;
                    border-radius: 15px;
                    padding: 22px 24px;
                    transition: border-color 0.2s, transform 0.2s;
                    animation: exCardIn 0.35s ease-out both;
                }
                .ex-card:hover {
                    border-color: rgba(255,193,7,0.25);
                    transform: translateY(-3px);
                    animation: exCardIn 0.35s ease-out both, exGlowPulse 2s infinite;
                }

                /* ── Books row ── */
                .ex-books {
                    display: flex; align-items: center; gap: 14px;
                    margin-bottom: 16px; padding-bottom: 16px;
                    border-bottom: 1px solid #1a1a1a;
                }
                .ex-book { flex: 1; display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
                .ex-book-img {
                    width: 50px; height: 64px;
                    border-radius: 6px; overflow: hidden;
                    background: #111; border: 1px solid #222;
                    flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px;
                }
                .ex-book-img img { width: 100%; height: 100%; object-fit: cover; }
                .ex-book-info { flex: 1; min-width: 0; }
                .ex-book-label {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: rgba(255,193,7,0.45); margin-bottom: 4px;
                }
                .ex-book-title {
                    font-family: 'Fraunces', serif;
                    font-size: 14px; font-weight: 700; color: #f0f0f0;
                    line-height: 1.25;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .ex-book-author {
                    font-size: 12px; font-weight: 300; color: #555; margin-top: 2px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }

                .ex-arrow { font-size: 16px; color: rgba(255,193,7,0.3); flex-shrink: 0; padding: 0 4px; }

                /* ── Message ── */
                .ex-msg {
                    font-size: 13px; font-weight: 300; color: #666; font-style: italic;
                    margin-bottom: 16px; padding: 10px 14px;
                    background: rgba(255,193,7,0.04);
                    border-left: 2px solid rgba(255,193,7,0.2);
                    border-radius: 0 6px 6px 0;
                }

                /* ── Footer ── */
                .ex-footer {
                    display: flex; align-items: center;
                    justify-content: space-between; flex-wrap: wrap; gap: 10px;
                }
                .ex-status {
                    display: inline-block;
                    padding: 4px 11px;
                    border-radius: 6px;
                    font-size: 11px; font-weight: 600;
                    letter-spacing: 0.5px; text-transform: uppercase;
                    border: 1px solid transparent;
                }
                .ex-btns { display: flex; gap: 8px; }
                .ex-accept {
                    padding: 8px 18px;
                    background: #FFC107; border: none; border-radius: 8px;
                    color: #000;
                    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                }
                .ex-accept:hover  { background: #ffd54f; transform: scale(1.03); }
                .ex-accept:active { transform: scale(0.97); }
                .ex-reject {
                    padding: 8px 18px;
                    background: transparent;
                    border: 1px solid rgba(231,76,60,0.25);
                    border-radius: 8px;
                    color: rgba(231,76,60,0.65);
                    font-family: 'Inter', sans-serif; font-size: 12.5px;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s, color 0.15s;
                }
                .ex-reject:hover {
                    background: rgba(231,76,60,0.08);
                    border-color: rgba(231,76,60,0.5);
                    color: #e74c3c;
                }

                @media(max-width: 580px) {
                    .ex { padding: 28px 14px 60px; }
                    .ex-card { padding: 16px; }
                    .ex-books { flex-direction: column; align-items: stretch; }
                    .ex-arrow { transform: rotate(90deg); text-align: center; }
                }
            `}</style>

            <div className="ex">
                <div className="ex-container">
                    <div className="ex-header">
                        <h1 className="ex-title">My <span>Exchanges</span></h1>
                        <div className="ex-tabs">
                            <button
                                className={`ex-tab${tab === 'received' ? ' act' : ''}`}
                                onClick={() => setTab('received')}
                            >
                                Received <span className="ex-tab-count">{received.length}</span>
                            </button>
                            <button
                                className={`ex-tab${tab === 'sent' ? ' act' : ''}`}
                                onClick={() => setTab('sent')}
                            >
                                Sent <span className="ex-tab-count">{sent.length}</span>
                            </button>
                        </div>
                    </div>

                    {error && <div className="ex-err">{error}</div>}

                    {loading ? (
                        <div className="ex-loading">
                            <span className="ex-dot" />
                            <span className="ex-dot" />
                            <span className="ex-dot" />
                        </div>
                    ) : list.length === 0 ? (
                        <div className="ex-empty">No exchange requests yet.</div>
                    ) : (
                        <div className="ex-list">
                            {list.map((req, idx) => {
                                const s = statusStyle[req.status] || statusStyle.PENDING;
                                return (
                                    <div
                                        key={req.id}
                                        className="ex-card"
                                        style={{ animationDelay: `${idx * 0.07}s` }}
                                    >
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
                                        {req.message && (
                                            <div className="ex-msg">"{req.message}"</div>
                                        )}

                                        {/* Footer */}
                                        <div className="ex-footer">
                                            <span
                                                className="ex-status"
                                                style={{ background: s.bg, color: s.color, borderColor: s.border }}
                                            >
                                                {req.status}
                                            </span>
                                            {tab === 'received' && req.status === 'PENDING' && (
                                                <div className="ex-btns">
                                                    <button className="ex-accept" onClick={() => handleAccept(req.id)}>Accept</button>
                                                    <button className="ex-reject" onClick={() => handleReject(req.id)}>Decline</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyExchanges;