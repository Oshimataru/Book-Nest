import { useState, useEffect } from 'react';
import { getSentRequests, getReceivedRequests,
         acceptExchange, rejectExchange } from '../services/api';
import '../styles/MyExchanges.css';

const MyExchanges = () => {
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [tab, setTab] = useState('received');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [sentRes, receivedRes] = await Promise.all([
                getSentRequests(),
                getReceivedRequests()
            ]);
            setSent(sentRes.data);
            setReceived(receivedRes.data);
        } catch (err) {
            setError('Failed to load exchanges!');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await acceptExchange(id);
            fetchAll();
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectExchange(id);
            fetchAll();
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'ACCEPTED': return 'status-confirmed';
            case 'REJECTED': return 'status-cancelled';
            default: return '';
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    const list = tab === 'sent' ? sent : received;

    return (
        <div className="exchanges-container">
            <div className="exchanges-header">
                <h2>My Exchanges 🔄</h2>
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${tab === 'received' ? 'active' : ''}`}
                        onClick={() => setTab('received')}>
                        Received ({received.length})
                    </button>
                    <button
                        className={`tab-btn ${tab === 'sent' ? 'active' : ''}`}
                        onClick={() => setTab('sent')}>
                        Sent ({sent.length})
                    </button>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {list.length === 0 ? (
                <div className="no-exchanges">
                    No exchange requests yet! 😔
                </div>
            ) : (
                <div className="exchanges-list">
                    {list.map((req) => (
                        <div key={req.id} className="exchange-card">
                            <div className="exchange-books">
                                <div className="exchange-book">
                                    <div className="ex-image">
                                        {req.offeredBook?.imageUrl ? (
                                            <img src={req.offeredBook.imageUrl}
                                                alt={req.offeredBook.title} />
                                        ) : <span>📚</span>}
                                    </div>
                                    <div>
                                        <p className="ex-label">Offered</p>
                                        <h4>{req.offeredBook?.title}</h4>
                                        <p>{req.offeredBook?.author}</p>
                                    </div>
                                </div>

                                <div className="exchange-arrow">🔄</div>

                                <div className="exchange-book">
                                    <div className="ex-image">
                                        {req.requestedBook?.imageUrl ? (
                                            <img src={req.requestedBook.imageUrl}
                                                alt={req.requestedBook.title} />
                                        ) : <span>📚</span>}
                                    </div>
                                    <div>
                                        <p className="ex-label">Requested</p>
                                        <h4>{req.requestedBook?.title}</h4>
                                        <p>{req.requestedBook?.author}</p>
                                    </div>
                                </div>
                            </div>

                            {req.message && (
                                <p className="exchange-message">
                                    💬 {req.message}
                                </p>
                            )}

                            <div className="exchange-footer">
                                <span className={`order-status
                                    ${getStatusClass(req.status)}`}>
                                    {req.status}
                                </span>

                                {tab === 'received' &&
                                 req.status === 'PENDING' && (
                                    <div className="exchange-btns">
                                        <button className="accept-btn"
                                            onClick={() => handleAccept(req.id)}>
                                            ✅ Accept
                                        </button>
                                        <button className="reject-btn"
                                            onClick={() => handleReject(req.id)}>
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyExchanges;