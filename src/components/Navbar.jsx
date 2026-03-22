import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                📚 BookNest
            </div>

            <div className="navbar-links">
                <span onClick={() => navigate('/books')}>Browse</span>
                {user && (
                    <>
                        <span onClick={() => navigate('/add-book')}>+ Post Book</span>
                        <span onClick={() => navigate('/my-books')}>My Books</span>
                        <span onClick={() => navigate('/my-orders')}>My Orders</span>
                        <span onClick={() => navigate('/my-exchanges')}>My Exchanges</span>
                        <span onClick={() => navigate('/clubs')}>Book Clubs</span>
                        <span onClick={() => navigate('/leaderboard')}>🏆 Leaderboard</span>
                        {user?.role === 'ADMIN' && (
    <span onClick={() => navigate('/admin')}>🛡️ Admin</span>
)}
                    </>
                )}
            </div>

            <div className="navbar-actions">
                {user ? (
                    <>
                        <span className="navbar-user">👤 {user.name}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')}
                            className="login-btn">Login</button>
                        <button onClick={() => navigate('/register')}
                            className="register-btn">Register</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;