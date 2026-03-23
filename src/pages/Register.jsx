import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await registerUser(formData);
            login(res.data, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong.');
        } finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .rg*{box-sizing:border-box;margin:0;padding:0;}
                .rg{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;padding:32px 20px;}
                .rg-box{width:100%;max-width:400px;}

                .rg-brand{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#1a1610;letter-spacing:-0.3px;margin-bottom:32px;cursor:pointer;width:fit-content;}
                .rg-brand span{color:#a07828;}

                .rg-title{font-family:'Fraunces',serif;font-size:clamp(24px,4vw,32px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;margin-bottom:6px;}
                .rg-title span{color:#a07828;font-style:italic;font-weight:400;}
                .rg-sub{font-size:13px;font-weight:300;color:rgba(26,22,16,0.4);margin-bottom:28px;}

                .rg-err{padding:11px 14px;border:1px solid rgba(180,60,50,0.2);border-radius:4px;background:rgba(200,60,50,0.05);color:rgba(180,60,50,0.8);font-size:13px;font-weight:300;margin-bottom:20px;}

                .rg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
                .rg-group{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
                .rg-group.no-mb{margin-bottom:0;}
                .rg-label{font-size:12px;font-weight:400;color:rgba(26,22,16,0.45);}
                .rg-input{padding:10px 13px;background:#faf7f2;border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:#1a1610;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:300;outline:none;transition:border-color 0.15s,background 0.15s;width:100%;}
                .rg-input::placeholder{color:rgba(26,22,16,0.2);}
                .rg-input:focus{border-color:rgba(160,120,40,0.4);background:#f7f3ee;}

                .rg-btn{width:100%;margin-top:8px;padding:12px;background:#a07828;color:#fff;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;transition:background 0.15s,transform 0.15s;}
                .rg-btn:hover:not(:disabled){background:#b5892e;transform:translateY(-1px);}
                .rg-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

                .rg-divider{height:1px;background:rgba(160,120,40,0.1);margin:22px 0;}

                .rg-footer{font-size:13px;font-weight:300;color:rgba(26,22,16,0.4);text-align:center;}
                .rg-footer a{color:#a07828;text-decoration:none;font-weight:400;transition:color 0.15s;}
                .rg-footer a:hover{color:#b5892e;}

                .rg-terms{font-size:11.5px;font-weight:300;color:rgba(26,22,16,0.28);text-align:center;margin-top:12px;line-height:1.5;}

                @media(max-width:400px){.rg-row{grid-template-columns:1fr;}}
            `}</style>

            <div className="rg">
                <div className="rg-box">
                    <div className="rg-brand" onClick={() => navigate('/')}>Book<span>Nest</span></div>

                    <h1 className="rg-title">Create <span>account</span></h1>
                    <p className="rg-sub">Join BookNest and start discovering books near you.</p>

                    {error && <div className="rg-err">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="rg-row">
                            <div className="rg-group no-mb">
                                <label className="rg-label">Full Name</label>
                                <input className="rg-input" type="text" name="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange} required />
                            </div>
                            <div className="rg-group no-mb">
                                <label className="rg-label">Phone</label>
                                <input className="rg-input" type="text" name="phone"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="rg-group" style={{marginTop:'14px'}}>
                            <label className="rg-label">Email</label>
                            <input className="rg-input" type="email" name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange} required />
                        </div>

                        <div className="rg-group">
                            <label className="rg-label">Password</label>
                            <input className="rg-input" type="password" name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange} required />
                        </div>

                        <button className="rg-btn" type="submit" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>

                        <p className="rg-terms">By registering you agree to our Terms of Use and Privacy Policy.</p>
                    </form>

                    <div className="rg-divider" />
                    <p className="rg-footer">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;