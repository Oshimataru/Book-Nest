import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClubById, getDiscussions,
         postDiscussion, leaveClub } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/ClubDetail.css';

const ClubDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClub();
        fetchDiscussions();
    }, [id]);

    const fetchClub = async () => {
        try {
            const res = await getClubById(id);
            setClub(res.data);
        } catch (err) {
            setError('Club not found!');
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscussions = async () => {
        try {
            const res = await getDiscussions(id);
            setDiscussions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            await postDiscussion(id, message);
            setMessage('');
            fetchDiscussions();
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const handleLeave = async () => {
        try {
            await leaveClub(id);
            navigate('/clubs');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!club) return <div className="loading">Club not found!</div>;

    const isMember = club.members?.some(m => m.email === user?.email);

    return (
        <div className="clubdetail-container">
            <div className="clubdetail-header">
                <button className="back-btn"
                    onClick={() => navigate('/clubs')}>
                    ← Back
                </button>
                <div className="club-title">
                    <h2>{club.name} 📖</h2>
                    <p>{club.description}</p>
                    {club.currentBook && (
                        <p className="reading-now">
                            📚 Currently Reading: {club.currentBook}
                        </p>
                    )}
                </div>
                <div className="club-meta">
                    <span>👥 {club.members?.length || 0} members</span>
                    {isMember && (
                        <button className="leave-btn" onClick={handleLeave}>
                            Leave Club
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="clubdetail-body">
                {/* Members */}
                <div className="members-panel">
                    <h3>Members</h3>
                    <div className="members-list">
                        {club.members?.map((member) => (
                            <div key={member.id} className="member-item">
                                <span className="member-avatar">
                                    {member.name?.charAt(0).toUpperCase()}
                                </span>
                                <span className="member-name">{member.name}</span>
                                {member.id === club.creator?.id && (
                                    <span className="creator-badge">Admin</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discussions */}
                <div className="discussions-panel">
                    <h3>Discussions 💬</h3>

                    <div className="discussions-list">
                        {discussions.length === 0 ? (
                            <p className="no-discussions">
                                No discussions yet! Start one! 😊
                            </p>
                        ) : (
                            discussions.map((disc) => (
                                <div key={disc.id} className="discussion-item">
                                    <div className="disc-avatar">
                                        {disc.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="disc-content">
                                        <div className="disc-header">
                                            <span className="disc-name">
                                                {disc.user?.name}
                                            </span>
                                            <span className="disc-time">
                                                {new Date(disc.createdAt)
                                                    .toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="disc-message">
                                            {disc.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {isMember && (
                        <form onSubmit={handlePost} className="post-discussion">
                            <input
                                type="text"
                                placeholder="Write a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit">Send</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubDetail;