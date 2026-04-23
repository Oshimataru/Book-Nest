import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllClubs, createClub, joinClub } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const BookClubs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clubs,      setClubs]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [error,      setError]      = useState('');
    const [formData,   setFormData]   = useState({ name: '', description: '', currentBook: '' });

    useEffect(() => { fetchClubs(); }, []);

    const fetchClubs = async () => {
        try { const res = await getAllClubs(); setClubs(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await createClub(formData.name, formData.description, formData.currentBook);
            setShowCreate(false);
            setFormData({ name: '', description: '', currentBook: '' });
            navigate(`/clubs/${res.data.id}`);
        } catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const handleJoin = async (id) => {
        try { await joinClub(id); navigate(`/clubs/${id}`); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const isMember = (club) => club.members?.some(m => m.email === user?.email);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .cl*{box-sizing:border-box;margin:0;padding:0;}
                .cl{min-height:100vh;background:#000000;font-family:'Inter',sans-serif;color:#ffffff;padding:48px 32px 80px;}

                .cl-header{max-width:1100px;margin:0 auto 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
                .cl-title{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,42px);font-weight:600;color:#ffffff;letter-spacing:-0.5px;line-height:1;}
                .cl-title span{color:#ffc107;font-style:italic;font-weight:400;}
                
                .cl-create-btn{padding:12px 24px;background:#ffc107;color:#000;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;text-transform:uppercase;letter-spacing:1px;}
                .cl-create-btn:hover{background:#ffdb70;transform:translateY(-2px);box-shadow:0 4px 15px rgba(255,193,7,0.3);}

                .cl-err{max-width:1100px;margin:0 auto 20px;padding:14px;border:1px solid rgba(255,82,82,0.3);border-radius:8px;background:rgba(255,82,82,0.05);color:#ff5252;font-size:13px;}

                .cl-form-wrap{max-width:1100px;margin:0 auto 32px;border:1px solid rgba(255,193,7,0.2);border-radius:12px;background:#0a0a0a;overflow:hidden;}
                .cl-form-header{padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
                .cl-form-title{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:#ffc107;}
                .cl-form-close{background:none;border:none;font-size:24px;color:rgba(255,255,255,0.3);cursor:pointer;transition:color 0.15s;}
                .cl-form-close:hover{color:#ffffff;}
                
                .cl-form{padding:24px;display:flex;flex-direction:column;gap:16px;}
                .cl-input,.cl-textarea{padding:12px 16px;background:#111;border:1px solid rgba(255,193,7,0.1);border-radius:6px;color:#fff;font-family:'Inter',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s;}
                .cl-input:focus,.cl-textarea:focus{border-color:#ffc107;}
                .cl-textarea{resize:vertical;min-height:100px;}
                
                .cl-form-actions{display:flex;gap:12px;justify-content:flex-end;}
                .cl-cancel{padding:10px 20px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:rgba(255,255,255,0.5);cursor:pointer;font-size:13px;}
                .cl-submit{padding:10px 22px;background:#ffc107;border:none;border-radius:4px;color:#000;font-weight:600;cursor:pointer;font-size:13px;}

                .cl-loading{text-align:center;padding:100px 0;}
                .cl-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffc107;margin:0 4px;animation:clB 1.2s ease-in-out infinite;}
                @keyframes clB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                .cl-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;}

                .cl-card{background:#0a0a0a;padding:28px;border:1px solid rgba(255,255,255,0.05);border-radius:12px;display:flex;flex-direction:column;gap:12px;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);position:relative;overflow:hidden;}
                .cl-card:hover{border-color:rgba(255,193,7,0.3);transform:translateY(-4px);background:#111;}

                .cl-card-name{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.4px;}
                .cl-card-desc{font-size:14px;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
                
                .cl-card-book{font-size:12px;font-weight:500;color:#ffc107;padding:6px 12px;background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);border-radius:4px;width:fit-content;display:flex;align-items:center;gap:6px;}

                .cl-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);}
                .cl-members{font-size:12px;font-weight:400;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1px;}
                
                .cl-view{padding:8px 16px;background:transparent;border:1px solid rgba(255,193,7,0.3);border-radius:4px;color:#ffc107;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
                .cl-view:hover{background:rgba(255,193,7,0.1);border-color:#ffc107;}
                
                .cl-join{padding:8px 18px;background:#ffc107;border:none;border-radius:4px;color:#000;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
                .cl-join:hover{background:#ffdb70;}
                
                .cl-joined{font-size:11px;font-weight:600;color:#03dac5;padding:5px 12px;background:rgba(3,218,197,0.1);border:1px solid rgba(3,218,197,0.3);border-radius:4px;text-transform:uppercase;}

                @media(max-width:640px){.cl{padding:40px 20px;}.cl-grid{grid-template-columns:1fr;}}
            `}</style>

            <div className="cl">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cl-header"
                >
                    <h1 className="cl-title">Book <span>Clubs</span></h1>
                    {user && (
                        <button className="cl-create-btn" onClick={() => setShowCreate(o => !o)}>
                            + Create Club
                        </button>
                    )}
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="cl-err"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCreate && (
                        <motion.div 
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="cl-form-wrap"
                        >
                            <div className="cl-form-header">
                                <span className="cl-form-title">Launch New Club</span>
                                <button className="cl-form-close" onClick={() => setShowCreate(false)}>×</button>
                            </div>
                            <form className="cl-form" onSubmit={handleCreate}>
                                <input className="cl-input" type="text" placeholder="Club Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required />
                                <textarea className="cl-textarea" placeholder="What is this club about?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required />
                                <input className="cl-input" type="text" placeholder="Current Reading (e.g. The Great Gatsby)"
                                    value={formData.currentBook}
                                    onChange={e => setFormData({ ...formData, currentBook: e.target.value })} />
                                <div className="cl-form-actions">
                                    <button type="button" className="cl-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="cl-submit">Establish Club</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="cl-loading">
                        <span className="cl-dot"/><span className="cl-dot"/><span className="cl-dot"/>
                    </div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.08 } }
                        }}
                        className="cl-grid"
                    >
                        {clubs.map(club => (
                            <motion.div 
                                key={club.id} 
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="cl-card"
                            >
                                <div style={{ marginBottom: '12px' }}>
                                    <BookIcon />
                                </div>
                                <div className="cl-card-name">{club.name}</div>
                                <div className="cl-card-desc">{club.description}</div>
                                {club.currentBook && (
                                    <div className="cl-card-book">
                                        <span>📖</span> {club.currentBook}
                                    </div>
                                )}
                                <div className="cl-card-footer">
                                    <span className="cl-members">{club.members?.length || 0} Members</span>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button className="cl-view" onClick={() => navigate(`/clubs/${club.id}`)}>View</button>
                                        {isMember(club)
                                            ? <span className="cl-joined">Joined</span>
                                            : <button className="cl-join" onClick={() => handleJoin(club.id)}>Join</button>
                                        }
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default BookClubs;