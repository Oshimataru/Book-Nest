import { useState, useEffect } from 'react';
import { getLeaderboard, getGamificationProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('leaderboard');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const leaderRes = await getLeaderboard();
            setLeaders(leaderRes.data);
            if (user) {
                const profileRes = await getGamificationProfile();
                setProfile(profileRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>🏆 Leaderboard & Rewards</h2>
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${tab === 'leaderboard' ? 'active' : ''}`}
                        onClick={() => setTab('leaderboard')}>
                        🏆 Leaderboard
                    </button>
                    {user && (
                        <button
                            className={`tab-btn ${tab === 'profile' ? 'active' : ''}`}
                            onClick={() => setTab('profile')}>
                            ⭐ My Points
                        </button>
                    )}
                </div>
            </div>

            {tab === 'leaderboard' && (
                <div className="leaderboard-content">
                    {/* Top 3 Podium */}
                    <div className="podium">
                        {leaders.slice(0, 3).map((leader, index) => (
                            <div key={leader.id}
                                className={`podium-item podium-${index + 1}`}>
                                <div className="podium-avatar">
                                    {leader.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="podium-rank">
                                    {getRankIcon(index)}
                                </div>
                                <div className="podium-name">{leader.name}</div>
                                <div className="podium-points">
                                    {leader.points} pts
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full List */}
                    <div className="leaderboard-list">
                        {leaders.map((leader, index) => (
                            <div key={leader.id}
                                className={`leader-row 
                                ${leader.email === user?.email ? 'highlight' : ''}`}>
                                <span className="leader-rank">
                                    {getRankIcon(index)}
                                </span>
                                <div className="leader-avatar">
                                    {leader.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="leader-name">{leader.name}</span>
                                {leader.email === user?.email && (
                                    <span className="you-badge">You</span>
                                )}
                                <span className="leader-points">
                                    ⭐ {leader.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'profile' && profile && (
                <div className="profile-content">
                    {/* Points Card */}
                    <div className="points-card">
                        <div className="points-big">
                            ⭐ {profile.totalPoints}
                        </div>
                        <div className="points-label">Total Points</div>
                    </div>

                    {/* Badges */}
                    <div className="badges-section">
                        <h3>🏅 My Badges</h3>
                        {profile.badges?.length === 0 ? (
                            <p className="no-badges">
                                No badges yet! Keep earning points! 😊
                            </p>
                        ) : (
                            <div className="badges-grid">
                                {profile.badges?.map((badge) => (
                                    <div key={badge.id} className="badge-card">
                                        <div className="badge-icon">
                                            {badge.badgeIcon}
                                        </div>
                                        <div className="badge-name">
                                            {badge.badgeName}
                                        </div>
                                        <div className="badge-desc">
                                            {badge.badgeDescription}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Points History */}
                    <div className="history-section">
                        <h3>📋 Points History</h3>
                        {profile.pointsHistory?.length === 0 ? (
                            <p className="no-history">No points history yet!</p>
                        ) : (
                            <div className="history-list">
                                {profile.pointsHistory?.map((h) => (
                                    <div key={h.id} className="history-item">
                                        <span className="history-reason">
                                            {h.reason}
                                        </span>
                                        <span className="history-points">
                                            +{h.points} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* How to earn points */}
            <div className="earn-points">
                <h3>💡 How to Earn Points</h3>
                <div className="earn-grid">
                    <div className="earn-item">
                        <span>📚</span>
                        <p>List a book</p>
                        <strong>+5 pts</strong>
                    </div>
                    <div className="earn-item">
                        <span>🛒</span>
                        <p>Place an order</p>
                        <strong>+10 pts</strong>
                    </div>
                    <div className="earn-item">
                        <span>⭐</span>
                        <p>Write a review</p>
                        <strong>+5 pts</strong>
                    </div>
                    <div className="earn-item">
                        <span>🔄</span>
                        <p>Complete exchange</p>
                        <strong>+15 pts</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;