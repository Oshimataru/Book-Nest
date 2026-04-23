import { useState, useEffect } from 'react';
import { getLeaderboard, getGamificationProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('leaderboard');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const leaderRes = await getLeaderboard();
            setLeaders(leaderRes.data);
            if (user) { const p = await getGamificationProfile(); setProfile(p.data); }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const rankLabel = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                
                .lb-container {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    padding: 60px 20px;
                }

                .lb-wrap { max-width: 800px; margin: 0 auto; }

                .lb-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    border-bottom: 1px solid rgba(255, 193, 7, 0.1);
                    padding-bottom: 20px;
                }

                .lb-title {
                    font-family: 'Fraunces', serif;
                    font-size: 32px;
                    color: #ffffff;
                }

                .lb-title span { color: #ffc107; font-style: italic; }

                .lb-tabs {
                    display: flex;
                    background: #111;
                    padding: 4px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .lb-tab {
                    padding: 8px 16px;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 13px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: 0.2s;
                }

                .lb-tab.act {
                    background: #ffc107;
                    color: #000;
                    font-weight: 600;
                }

                /* Podium Style */
                .lb-podium {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    background: linear-gradient(to bottom, #0a0a0a, #000);
                    padding: 40px 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 193, 7, 0.1);
                }

                .lb-pod {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .lb-pod-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Fraunces', serif;
                    font-size: 20px;
                    color: #ffc107;
                    margin-bottom: 10px;
                }

                .lb-pod-1 .lb-pod-avatar { width: 70px; height: 70px; font-size: 28px; border-color: #ffc107; }

                .lb-pod-name { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
                .lb-pod-pts { font-family: 'Fraunces', serif; color: #ffc107; font-size: 16px; }

                /* List Style */
                .lb-list { display: flex; flex-direction: column; gap: 10px; }

                .lb-row {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    background: #0a0a0a;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: 0.2s;
                }

                .lb-row:hover { border-color: rgba(255, 193, 7, 0.3); background: #0f0f0f; }
                .lb-row.me { border-color: #ffc107; background: rgba(255, 193, 7, 0.02); }

                .lb-row-rank { width: 40px; color: rgba(255, 255, 255, 0.3); font-weight: 600; }
                .lb-row-av { width: 35px; height: 35px; background: #1a1a1a; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #ffc107; font-family: 'Fraunces', serif; }
                .lb-row-name { flex: 1; font-size: 15px; }
                .lb-row-pts { font-family: 'Fraunces', serif; color: #ffc107; font-weight: 600; }

                /* Stats Cards */
                .lb-stats-hero {
                    text-align: center;
                    padding: 40px;
                    background: #0a0a0a;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                    margin-bottom: 20px;
                }

                .lb-pts-big { font-family: 'Fraunces', serif; font-size: 64px; color: #ffc107; line-height: 1; }

                .lb-section { margin-top: 30px; }
                .lb-section-title { font-family: 'Fraunces', serif; font-size: 20px; margin-bottom: 15px; color: #ffc107; }

                .lb-badges { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; }
                .lb-badge { background: #0a0a0a; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.05); }

                .lb-earn-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 40px; }
                .lb-earn-card { padding: 20px; background: #0a0a0a; border-radius: 12px; border: 1px solid rgba(255, 193, 7, 0.1); text-align: center; }
            `}</style>

            <div className="lb-container">
                <div className="lb-wrap">
                    <div className="lb-header">
                        <h1 className="lb-title">The <span>Elite</span></h1>
                        <div className="lb-tabs">
                            <button className={`lb-tab${tab === 'leaderboard' ? ' act' : ''}`} onClick={() => setTab('leaderboard')}>Ranking</button>
                            {user && <button className={`lb-tab${tab === 'profile' ? ' act' : ''}`} onClick={() => setTab('profile')}>My Status</button>}
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#ffc107', padding: '100px' }}>Loading...</div>
                    ) : tab === 'leaderboard' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Podium */}
                            {leaders.length >= 3 && (
                                <div className="lb-podium">
                                    {[1, 0, 2].map(i => leaders[i] && (
                                        <div key={leaders[i].id} className={`lb-pod lb-pod-${i === 0 ? 1 : i === 1 ? 2 : 3}`}>
                                            <div style={{ fontSize: i === 0 ? '30px' : '20px', marginBottom: '10px' }}>{rankLabel(i)}</div>
                                            <div className="lb-pod-avatar">{leaders[i].name?.charAt(0).toUpperCase()}</div>
                                            <div className="lb-pod-name">{leaders[i].name}</div>
                                            <div className="lb-pod-pts">{leaders[i].points} pts</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* List */}
                            <div className="lb-list">
                                {leaders.map((leader, i) => (
                                    <div key={leader.id} className={`lb-row${leader.email === user?.email ? ' me' : ''}`}>
                                        <span className="lb-row-rank">{rankLabel(i)}</span>
                                        <div className="lb-row-av">{leader.name?.charAt(0).toUpperCase()}</div>
                                        <span className="lb-row-name">{leader.name}</span>
                                        <span className="lb-row-pts">{leader.points} PTS</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : profile && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="lb-stats-hero">
                                <div className="lb-pts-big">{profile.totalPoints}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Accumulated Prestige</div>
                            </div>

                            <div className="lb-section">
                                <h3 className="lb-section-title">Achievements</h3>
                                {!profile.badges?.length ? (
                                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>No badges earned yet.</p>
                                ) : (
                                    <div className="lb-badges">
                                        {profile.badges.map(b => (
                                            <div key={b.id} className="lb-badge">
                                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{b.badgeIcon}</div>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{b.badgeName}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lb-earn-grid">
                                {[['📚', 'List', '+5'], ['🛒', 'Order', '+10'], ['⭐', 'Review', '+5']].map(([icon, label, pts]) => (
                                    <div key={label} className="lb-earn-card">
                                        <div style={{ fontSize: '20px' }}>{icon}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '5px 0' }}>{label}</div>
                                        <div style={{ color: '#ffc107', fontWeight: 'bold' }}>{pts}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;