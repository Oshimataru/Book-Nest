import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/api';
import '../styles/MyOrders.css';


const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getMyOrders();
            setOrders(res.data);
        } catch (err) {
            setError('Failed to load orders!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelOrder(id);
                fetchOrders();
            } catch (err) {
                setError(err.response?.data || 'Something went wrong!');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'CONFIRMED': return 'status-confirmed';
            case 'SHIPPED': return 'status-shipped';
            case 'DELIVERED': return 'status-delivered';
            case 'CANCELLED': return 'status-cancelled';
            default: return '';
        }
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h2>My Orders 📦</h2>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders yet! 😔</p>
                    <button onClick={() => navigate('/books')}
                        className="browse-btn">
                        Browse Books
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-book">
                                <div className="order-image">
                                    {order.book?.imageUrl ? (
                                        <img src={order.book.imageUrl}
                                            alt={order.book.title} />
                                    ) : (
                                        <div className="no-image-small">📚</div>
                                    )}
                                </div>
                                <div className="order-info">
                                    <h3>{order.book?.title}</h3>
                                    <p>by {order.book?.author}</p>
                                    <p className="order-type">{order.type}</p>
                                    <p className="order-amount">₹{order.amount}</p>
                                </div>
                            </div>

                            <div className="order-details">
                                <div className="order-row">
                                    <span>Order ID</span>
                                    <span># {order.id}</span>
                                </div>
                                <div className="order-row">
                                    <span>Address</span>
                                    <span>{order.address}</span>
                                </div>
                                <div className="order-row">
                                    <span>Status</span>
                                    <span className={`order-status
                                        ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                          <div className="order-buttons">
    {order.status === 'PENDING' && (
        <button className="cancel-btn"
            onClick={() => handleCancel(order.id)}>
            Cancel Order
        </button>
    )}
    <button className="track-btn"
        onClick={() => navigate(`/track/${order.id}`)}>
        📍 Track Order
    </button>
</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;