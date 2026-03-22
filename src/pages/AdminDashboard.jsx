import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getAdminAnalytics, getAdminUsers, deleteAdminUser,
    getAdminBooks, deleteAdminBook, getAdminOrders
} from '../services/api';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('analytics');
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [analyticsRes, usersRes, booksRes, ordersRes] = await Promise.all([
                getAdminAnalytics(),
                getAdminUsers(),
                getAdminBooks(),
                getAdminOrders()
            ]);
            setAnalytics(analyticsRes.data);
            setUsers(usersRes.data);
            setBooks(booksRes.data);
            setOrders(ordersRes.data);
        } catch (err) {
            setError('Failed to load admin data!');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
            try {
                await deleteAdminUser(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                setError(err.response?.data || 'Something went wrong!');
            }
        }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Delete this book?')) {
            try {
                await deleteAdminBook(id);
                setBooks(books.filter(b => b.id !== id));
            } catch (err) {
                setError(err.response?.data || 'Something went wrong!');
            }
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    const bookStatusData = {
        labels: ['Available', 'Sold', 'Rented', 'Exchanged'],
        datasets: [{
            data: [
                analytics?.availableBooks || 0,
                analytics?.soldBooks || 0,
                0, 0
            ],
            backgroundColor: ['#238636', '#58a6ff', '#e3b341', '#bc8cff'],
            borderWidth: 0
        }]
    };

    const orderStatusData = {
        labels: ['Pending', 'Delivered', 'Others'],
        datasets: [{
            label: 'Orders',
            data: [
                analytics?.pendingOrders || 0,
                analytics?.deliveredOrders || 0,
                (analytics?.totalOrders || 0) -
                (analytics?.pendingOrders || 0) -
                (analytics?.deliveredOrders || 0)
            ],
            backgroundColor: ['#e3b341', '#238636', '#58a6ff'],
            borderRadius: 8,
        }]
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>🛡️ Admin Dashboard</h2>
                <div className="admin-tabs">
                    {['analytics', 'users', 'books', 'orders'].map(t => (
                        <button key={t}
                            className={`tab-btn ${tab === t ? 'active' : ''}`}
                            onClick={() => setTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {/* Analytics Tab */}
            {tab === 'analytics' && analytics && (
                <div className="analytics-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-value">{analytics.totalUsers}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div className="stat-value">{analytics.totalBooks}</div>
                            <div className="stat-label">Total Books</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-value">{analytics.totalOrders}</div>
                            <div className="stat-label">Total Orders</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-value">
                                ₹{analytics.totalRevenue?.toFixed(0)}
                            </div>
                            <div className="stat-label">Total Revenue</div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Book Status</h3>
                            <div className="chart-wrapper">
                                <Doughnut data={bookStatusData}
                                    options={{ plugins: {
                                        legend: { labels: { color: '#c9d1d9' }}
                                    }}}
                                />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Order Status</h3>
                            <div className="chart-wrapper">
                                <Bar data={orderStatusData}
                                    options={{
                                        plugins: {
                                            legend: { display: false }
                                        },
                                        scales: {
                                            x: { ticks: { color: '#8b949e' },
                                                 grid: { color: '#30363d' }},
                                            y: { ticks: { color: '#8b949e' },
                                                 grid: { color: '#30363d' }}
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
                <div className="admin-table-container">
                    <h3>All Users ({users.length})</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Points</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.points}</td>
                                    <td>
                                        <span className={`role-badge 
                                            ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'ADMIN' && (
                                            <button className="delete-btn-sm"
                                                onClick={() => handleDeleteUser(u.id)}>
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Books Tab */}
            {tab === 'books' && (
                <div className="admin-table-container">
                    <h3>All Books ({books.length})</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Seller</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{b.title}</td>
                                    <td>{b.author}</td>
                                    <td>{b.type}</td>
                                    <td>₹{b.price}</td>
                                    <td>{b.status}</td>
                                    <td>{b.seller?.name}</td>
                                    <td>
                                        <button className="delete-btn-sm"
                                            onClick={() => handleDeleteBook(b.id)}>
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
                <div className="admin-table-container">
                    <h3>All Orders ({orders.length})</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Buyer</th>
                                <th>Book</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td>#{o.id}</td>
                                    <td>{o.buyer?.name}</td>
                                    <td>{o.book?.title}</td>
                                    <td>{o.type}</td>
                                    <td>₹{o.amount}</td>
                                    <td>
                                        <span className={`status-badge 
                                            status-${o.status?.toLowerCase()}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;