import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getClubById, getDiscussions, postDiscussion, leaveClub } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClubDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [club,        setClub]        = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [message,     setMessage]     = useState('');
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState('');

    useEffect(() => { fetchClub(); fetchDiscussions(); }, [id]);

    const fetchClub = async () => {
        try { const res = await getClubById(id); setClub(res.data); }
        catch { setError('Club not found.'); }
        finally { setLoading(false); }
    };

    const fetchDiscussions = async () => {
        try { const res = await getDiscussions(id); setDiscussions(res.data); }
        catch (err) { console.error(err); }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try { await postDiscussion(id, message); setMessage(''); fetchDiscussions(); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const handleLeave = async () => {
        try { await leaveClub(id); navigate('/clubs'); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const fmt = (d) => new Date(d).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .cd*{box-sizing:border-box;margin:0;padding:0;}
                .cd{min-height:100vh;background:#000000;font-family:'Inter',sans-serif;color:#ffffff;padding:40px 24px 80px;}
                .cd-wrap{max-width:1100px;margin:0 auto;}

                .cd-back{display:inline-flex;align-items:center;gap:8px;background:none;border:none;font-size:13px;font-weight:500;color:rgba(255,255,255,0.4);cursor:pointer;margin-bottom:32px;transition:all 0.2s;}
                .cd-back:hover{color:#ffc107;transform:translateX(-4px);}

                .cd-loading{text-align:center;padding:100px 0;}
                .cd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffc107;margin:0 4px;animation:cdB 1.2s ease-in-out infinite;}
                @keyframes cdB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                .cd-err{padding:14px 20px;border-radius:8px;background:rgba(255,82,82,0.1);border:1px solid rgba(255,82,82,0.2);color:#ff5252;font-size:13px;margin-bottom:24px;}

                /* Header Section */
                .cd-hero{background:#0a0a0a;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:32px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start;gap:24px;}
                .cd-club-name{font-family:'Fraunces',serif;font-size:36px;font-weight:600;color:#ffffff;margin-bottom:8px;letter-spacing:-0.5px;}
                .cd-club-desc{font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;max-width:600px;margin-bottom:16px;}
                .cd-reading{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#ffc107;padding:8px 16px;background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);border-radius:6px;font-weight:500;}
                
                .cd-leave{padding:10px 18px;background:transparent;border:1px solid rgba(255,82,82,0.3);border-radius:6px;color:#ff5252;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
                .cd-leave:hover{background:rgba(255,82,82,0.1);border-color:#ff5252;}

                /* Dashboard Layout */
                .cd-grid{display:grid;grid-template-columns:280px 1fr;gap:24px;}

                /* Sidebar/Members */
                .cd-sidebar{background:#0a0a0a;border:1px solid rgba(255,255,255,0.05);border-radius:12px;height:fit-content;overflow:hidden;}
                .cd-section-label{padding:16px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.3);border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);}
                .cd-member-item{display:flex;align-items:center;gap:12px;padding:12px 20px;transition:background 0.2s;}
                .cd-member-item:hover{background:rgba(255,193,7,0.03);}
                .cd-member-av{width:32px;height:32px;border-radius:8px;background:#ffc107;color:#000;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;font-size:14px;}
                .cd-member-name{font-size:14px;color:rgba(255,255,255,0.8);font-weight:400;}
                .cd-admin-tag{font-size:9px;background:rgba(255,193,7,0.1);color:#ffc107;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:auto;}

                /* Chat/Discussions Area */
                .cd-main{background:#0a0a0a;border:1px solid rgba(255,255,255,0.05);border-radius:12px;display:flex;flex-direction:column;min-height:600px;}
                .cd-chat-window{flex:1;padding:24px;overflow-y:auto;max-height:600px;display:flex;flex-direction:column;gap:20px;}
                .cd-msg-bubble{display:flex;gap:14px;max-width:85%;}
                .cd-msg-bubble.is-me{align-self:flex-end;flex-direction:row-reverse;}
                
                .cd-msg-av{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;flex-shrink:0;}
                .cd-msg-av.is-me{background:#ffc107;color:#000;}
                
                .cd-msg-content{display:flex;flex-direction:column;gap:4px;}
                .cd-msg-info{font-size:12px;color:rgba(255,255,255,0.3);display:flex;gap:8px;align-items:baseline;}
                .cd-msg-info b{color:rgba(255,255,255,0.7);font-weight:500;}
                .cd-msg-text{background:#111;padding:12px 16px;border-radius:0 12px 12px 12px;color:rgba(255,255,255,0.9);font-size:14px;line-height:1.5;border:1px solid rgba(255,255,255,0.03);}
                .cd-msg-bubble.is-me .cd-msg-text{background:rgba(255,193,7,0.05);border-color:rgba(255,193,7,0.2);border-radius:12px 0 12px 12px;color:#ffffff;}

                /* Input Area */
                .cd-input-area{padding:20px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.05);}
                .cd-form{display:flex;gap:12px;background:#000;padding:6px;border-radius:10px;border:1px solid rgba(255,193,7,0.2);transition:border-color 0.2s;}
                .cd-form:focus-within{border-color:#ffc107;}
                .cd-input{flex:1;background:transparent;border:none;padding:12px 16px;color:#fff;font-family:'Inter',sans-serif;outline:none;font-size:14px;}
                .cd-send-btn{background:#ffc107;color:#000;border:none;border-radius:8px;padding:0 20px;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.2s;}
                .cd-send-btn:hover{background:#ffdb70;}

                @media(max-width:850px){
                    .cd-grid{grid-template-columns:1fr;}
                    .cd-sidebar{display:none;}
                    .cd-hero{flex-direction:column;padding:24px;}
                }
            `}</style>

            <div className="cd">
                <div className="cd-wrap">
                    <button className="cd-back" onClick={() => navigate('/clubs')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Library
                    </button>

                    {loading ? (
                        <div className="cd-loading"><span className="cd-dot"/><span className="cd-dot"/><span className="cd-dot"/></div>
                    ) : !club ? (
                        <div className="cd-err">The requested club could not be found.</div>
                    ) : (() => {
                        const isMember = club.members?.some(m => m.email === user?.email);
                        return (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                {error && <div className="cd-err">{error}</div>}

                                <div className="cd-hero">
                                    <div className="cd-hero-left">
                                        <h1 className="cd-club-name">{club.name}</h1>
                                        <p className="cd-club-desc">{club.description}</p>
                                        {club.currentBook && (
                                            <div className="cd-reading">
                                                <span>📖</span> Reading: {club.currentBook}
                                            </div>
                                        )}
                                    </div>
                                    {isMember && (
                                        <button className="cd-leave" onClick={handleLeave}>Leave Club</button>
                                    )}
                                </div>

                                <div className="cd-grid">
                                    {/* Members Sidebar */}
                                    <div className="cd-sidebar">
                                        <div className="cd-section-label">Members ({club.members?.length || 0})</div>
                                        {club.members?.map(m => (
                                            <div key={m.id} className="cd-member-item">
                                                <div className="cd-member-av">{m.name?.charAt(0)}</div>
                                                <span className="cd-member-name">{m.name}</span>
                                                {m.id === club.creator?.id && <span className="cd-admin-tag">Admin</span>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Discussion Main */}
                                    <div className="cd-main">
                                        <div className="cd-section-label">Discussion Thread</div>
                                        <div className="cd-chat-window">
                                            {discussions.length === 0 ? (
                                                <div style={{textAlign:'center', padding:'40px', color:'rgba(255,255,255,0.2)', fontSize:'14px'}}>
                                                    No messages yet. Be the first to start the conversation.
                                                </div>
                                            ) : discussions.map(disc => {
                                                const isMe = disc.user?.email === user?.email;
                                                return (
                                                    <div key={disc.id} className={`cd-msg-bubble ${isMe ? 'is-me' : ''}`}>
                                                        <div className={`cd-msg-av ${isMe ? 'is-me' : ''}`}>
                                                            {disc.user?.name?.charAt(0)}
                                                        </div>
                                                        <div className="cd-msg-content">
                                                            <div className="cd-msg-info">
                                                                {!isMe && <b>{disc.user?.name}</b>}
                                                                <span>{fmt(disc.createdAt)}</span>
                                                            </div>
                                                            <div className="cd-msg-text">{disc.message}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {isMember && (
                                            <div className="cd-input-area">
                                                <form className="cd-form" onSubmit={handlePost}>
                                                    <input
                                                        className="cd-input"
                                                        type="text"
                                                        placeholder="Share your thoughts..."
                                                        value={message}
                                                        onChange={e => setMessage(e.target.value)}
                                                    />
                                                    <button type="submit" className="cd-send-btn">Send</button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>
            </div>
        </>
    );
};

export default ClubDetail;