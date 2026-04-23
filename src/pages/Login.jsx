import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError('');
        try {
            const res = await loginUser(formData);
            login(res.data, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Invalid email or password.');
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                
                .lg-container {
                    min-height: 100vh;
                    background: #000000; /* Full Black Background */
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                }

                .lg-box {
                    width: 100%;
                    max-width: 400px;
                    background: #0a0a0a; /* Deep charcoal box */
                    padding: 40px;
                    border: 1px solid #1a1a1a;
                    border-radius: 12px;
                    box-sizing: border-box;
                }

                .lg-brand {
                    font-family: 'Fraunces', serif;
                    font-size: 24px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 32px;
                    cursor: pointer;
                    width: fit-content;
                }
                .lg-brand span { color: #d4af37; } /* Gold accent */

                .lg-title {
                    font-family: 'Fraunces', serif;
                    font-size: 32px;
                    color: #ffffff;
                    margin-bottom: 8px;
                }
                .lg-title span { color: #d4af37; font-style: italic; font-weight: 400; }

                .lg-sub {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 28px;
                }

                .lg-err {
                    padding: 12px;
                    border-radius: 6px;
                    background: rgba(255, 69, 58, 0.1);
                    color: #ff453a;
                    font-size: 13px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(255, 69, 58, 0.2);
                }

                .lg-group {
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .lg-label {
                    font-size: 11px;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .lg-input {
                    padding: 12px 16px;
                    background: #121212;
                    border: 1px solid #222;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    width: 100%;
                    box-sizing: border-box; /* Keeps input inside the border */
                    transition: all 0.3s ease;
                }

                /* Hover & Focus Effects */
                .lg-input:hover {
                    border-color: #444;
                }
                .lg-input:focus {
                    outline: none;
                    border-color: #d4af37;
                    background: #181818;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                .lg-btn {
                    width: 100%;
                    padding: 14px;
                    background: #d4af37;
                    color: #000;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 15px;
                    margin-top: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .lg-btn:hover:not(:disabled) {
                    background: #f1c40f;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
                }

                .lg-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .lg-divider {
                    height: 1px;
                    background: #1a1a1a;
                    margin: 24px 0;
                }

                .lg-footer {
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .lg-footer a {
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: 500;
                    margin-left: 5px;
                }
                .lg-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="lg-container">
                <div className="lg-box">
                    <div className="lg-brand" onClick={() => navigate('/')}>Book<span>Nest</span></div>

                    <h1 className="lg-title">Welcome <span>back</span></h1>
                    <p className="lg-sub">Sign in to your account to continue.</p>

                    {error && <div className="lg-err">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="lg-group">
                            <label className="lg-label">Email Address</label>
                            <input className="lg-input" type="email" name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange} required />
                        </div>
                        <div className="lg-group">
                            <label className="lg-label">Password</label>
                            <input className="lg-input" type="password" name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange} required />
                        </div>
                        <button className="lg-btn" type="submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <div className="lg-divider" />
                    <p className="lg-footer">Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </>
    );
};

export default Login;