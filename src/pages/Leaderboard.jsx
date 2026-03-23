import { useState, useEffect } from 'react';
import { getLeaderboard, getGamificationProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab,     setTab]     = useState('leaderboard');

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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .lb*{box-sizing:border-box;margin:0;padding:0;}
                .lb{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;padding:48px 32px 80px;}
                .lb-wrap{max-width:720px;margin:0 auto;}

                .lb-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:32px;}
                .lb-title{font-family:'Fraunces',serif;font-size:clamp(26px,4vw,40px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;}
                .lb-title span{color:#a07828;font-style:italic;font-weight:400;}
                .lb-tabs{display:flex;border:1px solid rgba(160,120,40,0.18);border-radius:4px;overflow:hidden;}
                .lb-tab{padding:8px 18px;background:transparent;border:none;font-family:'Inter',sans-serif;font-size:13px;color:rgba(26,22,16,0.45);cursor:pointer;transition:background 0.15s,color 0.15s;white-space:nowrap;}
                .lb-tab:first-child{border-right:1px solid rgba(160,120,40,0.18);}
                .lb-tab.act{background:#a07828;color:#fff;font-weight:500;}
                .lb-tab:not(.act):hover{background:rgba(160,120,40,0.06);color:rgba(26,22,16,0.75);}

                .lb-loading{text-align:center;padding:80px 0;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .lb-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:lbB 1.2s ease-in-out infinite;}
                .lb-dot:nth-child(2){animation-delay:0.15s;}.lb-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes lbB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                /* Podium */
                .lb-podium{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin-bottom:2px;padding:28px 20px;background:#faf7f2;border:1px solid rgba(160,120,40,0.12);border-bottom:none;}
                .lb-pod{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;max-width:160px;}
                .lb-pod-avatar{width:48px;height:48px;border-radius:4px;background:#a07828;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#fff;}
                .lb-pod-1 .lb-pod-avatar{width:58px;height:58px;font-size:24px;}
                .lb-pod-rank{font-size:20px;line-height:1;}
                .lb-pod-1 .lb-pod-rank{font-size:26px;}
                .lb-pod-name{font-size:12px;font-weight:500;color:#1a1610;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
                .lb-pod-pts{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:#a07828;}
                .lb-pod-1 .lb-pod-pts{font-size:18px;}
                .lb-pod-bar{width:100%;border-radius:2px 2px 0 0;}
                .lb-pod-1 .lb-pod-bar{height:60px;background:rgba(160,120,40,0.18);}
                .lb-pod-2 .lb-pod-bar{height:44px;background:rgba(160,120,40,0.1);}
                .lb-pod-3 .lb-pod-bar{height:30px;background:rgba(160,120,40,0.07);}

                /* Full list */
                .lb-list{border:1px solid rgba(160,120,40,0.12);display:flex;flex-direction:column;gap:0;margin-bottom:24px;}
                .lb-row{display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid rgba(160,120,40,0.07);background:#faf7f2;transition:background 0.15s;}
                .lb-row:last-child{border-bottom:none;}
                .lb-row:hover{background:#f7f3ee;}
                .lb-row.me{background:rgba(160,120,40,0.06);}
                .lb-row-rank{font-size:14px;width:28px;text-align:center;flex-shrink:0;color:rgba(26,22,16,0.4);font-weight:500;}
                .lb-row-rank.top{font-size:18px;color:unset;}
                .lb-row-av{width:32px;height:32px;border-radius:3px;background:#a07828;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:#fff;flex-shrink:0;}
                .lb-row-name{flex:1;font-size:14px;font-weight:400;color:#1a1610;}
                .lb-you{font-size:10px;font-weight:500;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;background:rgba(160,120,40,0.1);border:1px solid rgba(160,120,40,0.22);border-radius:2px;color:#a07828;}
                .lb-row-pts{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:#a07828;white-space:nowrap;}

                /* Profile tab */
                .lb-points-card{padding:28px;background:#faf7f2;border:1px solid rgba(160,120,40,0.12);border-bottom:none;text-align:center;}
                .lb-pts-big{font-family:'Fraunces',serif;font-size:52px;font-weight:600;color:#a07828;line-height:1;margin-bottom:6px;}
                .lb-pts-label{font-size:12px;font-weight:300;color:rgba(26,22,16,0.38);letter-spacing:1px;text-transform:uppercase;}

                .lb-section{border:1px solid rgba(160,120,40,0.12);border-bottom:none;background:#faf7f2;}
                .lb-section:last-of-type{border-bottom:1px solid rgba(160,120,40,0.12);}
                .lb-section-head{padding:14px 18px;border-bottom:1px solid rgba(160,120,40,0.08);font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:#1a1610;letter-spacing:-0.2px;}

                .lb-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1px;}
                .lb-badge{padding:18px 14px;text-align:center;border-right:1px solid rgba(160,120,40,0.08);border-bottom:1px solid rgba(160,120,40,0.08);}
                .lb-badge-icon{font-size:26px;margin-bottom:6px;}
                .lb-badge-name{font-size:13px;font-weight:500;color:#1a1610;margin-bottom:3px;}
                .lb-badge-desc{font-size:11px;font-weight:300;color:rgba(26,22,16,0.4);line-height:1.4;}
                .lb-no{padding:18px;font-size:13px;font-weight:300;color:rgba(26,22,16,0.3);}

                .lb-history{display:flex;flex-direction:column;}
                .lb-h-item{display:flex;justify-content:space-between;align-items:center;padding:11px 18px;border-bottom:1px solid rgba(160,120,40,0.07);}
                .lb-h-item:last-child{border-bottom:none;}
                .lb-h-reason{font-size:13px;font-weight:300;color:rgba(26,22,16,0.6);}
                .lb-h-pts{font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:#a07828;}

                /* Earn section */
                .lb-earn{border:1px solid rgba(160,120,40,0.12);background:#faf7f2;margin-top:24px;}
                .lb-earn-head{padding:14px 18px;border-bottom:1px solid rgba(160,120,40,0.08);font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:#1a1610;letter-spacing:-0.2px;}
                .lb-earn-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;}
                .lb-earn-item{padding:20px 16px;text-align:center;border-right:1px solid rgba(160,120,40,0.08);}
                .lb-earn-item:last-child{border-right:none;}
                .lb-earn-icon{font-size:20px;margin-bottom:8px;}
                .lb-earn-desc{font-size:12px;font-weight:300;color:rgba(26,22,16,0.45);margin-bottom:5px;}
                .lb-earn-pts{font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:#a07828;}

                @media(max-width:580px){
                    .lb{padding:32px 16px 60px;}
                    .lb-earn-grid{grid-template-columns:repeat(2,1fr);}
                    .lb-earn-item:nth-child(2){border-right:none;}
                    .lb-earn-item{border-bottom:1px solid rgba(160,120,40,0.08);}
                    .lb-earn-item:nth-child(3),.lb-earn-item:nth-child(4){border-bottom:none;}
                }
            `}</style>

            <div className="lb">
                <div className="lb-wrap">
                    <div className="lb-header">
                        <h1 className="lb-title">Leader<span>board</span></h1>
                        <div className="lb-tabs">
                            <button className={`lb-tab${tab==='leaderboard'?' act':''}`} onClick={() => setTab('leaderboard')}>🏆 Leaderboard</button>
                            {user && <button className={`lb-tab${tab==='profile'?' act':''}`} onClick={() => setTab('profile')}>⭐ My Points</button>}
                        </div>
                    </div>

                    {loading ? (
                        <div className="lb-loading"><span className="lb-dot"/><span className="lb-dot"/><span className="lb-dot"/></div>
                    ) : tab === 'leaderboard' ? (
                        <>
                            {/* Podium */}
                            {leaders.length >= 3 && (
                                <div className="lb-podium">
                                    {[1, 0, 2].map(i => leaders[i] && (
                                        <div key={leaders[i].id} className={`lb-pod lb-pod-${i === 0 ? 1 : i === 1 ? 2 : 3}`}>
                                            <div className="lb-pod-rank">{rankLabel(i)}</div>
                                            <div className="lb-pod-avatar">{leaders[i].name?.charAt(0).toUpperCase()}</div>
                                            <div className="lb-pod-name">{leaders[i].name}</div>
                                            <div className="lb-pod-pts">{leaders[i].points} pts</div>
                                            <div className="lb-pod-bar"/>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Full list */}
                            <div className="lb-list">
                                {leaders.map((leader, i) => (
                                    <div key={leader.id} className={`lb-row${leader.email === user?.email ? ' me' : ''}`}>
                                        <span className={`lb-row-rank${i < 3 ? ' top' : ''}`}>{rankLabel(i)}</span>
                                        <div className="lb-row-av">{leader.name?.charAt(0).toUpperCase()}</div>
                                        <span className="lb-row-name">{leader.name}</span>
                                        {leader.email === user?.email && <span className="lb-you">You</span>}
                                        <span className="lb-row-pts">{leader.points} pts</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : profile && (
                        <>
                            <div className="lb-points-card">
                                <div className="lb-pts-big">{profile.totalPoints}</div>
                                <div className="lb-pts-label">Total Points</div>
                            </div>

                            <div className="lb-section">
                                <div className="lb-section-head">My Badges</div>
                                {!profile.badges?.length ? (
                                    <div className="lb-no">No badges yet. Keep earning points!</div>
                                ) : (
                                    <div className="lb-badges">
                                        {profile.badges.map(b => (
                                            <div key={b.id} className="lb-badge">
                                                <div className="lb-badge-icon">{b.badgeIcon}</div>
                                                <div className="lb-badge-name">{b.badgeName}</div>
                                                <div className="lb-badge-desc">{b.badgeDescription}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lb-section">
                                <div className="lb-section-head">Points History</div>
                                {!profile.pointsHistory?.length ? (
                                    <div className="lb-no">No history yet.</div>
                                ) : (
                                    <div className="lb-history">
                                        {profile.pointsHistory.map(h => (
                                            <div key={h.id} className="lb-h-item">
                                                <span className="lb-h-reason">{h.reason}</span>
                                                <span className="lb-h-pts">+{h.points} pts</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Earn points */}
                    <div className="lb-earn">
                        <div className="lb-earn-head">How to earn points</div>
                        <div className="lb-earn-grid">
                            {[['📚','List a book','+5 pts'],['🛒','Place an order','+10 pts'],['⭐','Write a review','+5 pts'],['🔄','Complete exchange','+15 pts']].map(([icon,desc,pts]) => (
                                <div key={desc} className="lb-earn-item">
                                    <div className="lb-earn-icon">{icon}</div>
                                    <div className="lb-earn-desc">{desc}</div>
                                    <div className="lb-earn-pts">{pts}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;