// import { getBookById, placeOrder, createPaymentOrder, verifyPayment, updateOrderStatus } from '../services/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import { getBookById, placeOrder, createPaymentOrder,
         updateOrderStatus, createDelivery } from '../services/api';


const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await getBookById(id);
            setBook(res.data);
        } catch (err) {
            setError('Book not found!');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!address.trim()) {
            setError('Please enter your address!');
            return;
        }
        setPlacing(true);
        setError('');

        try {
            // Load Razorpay script
            const loaded = await loadRazorpay();
            if (!loaded) {
                setError('Razorpay failed to load!');
                return;
            }

            // Create order on backend
            const orderRes = await createPaymentOrder(book.price);
            const { orderId, amount, keyId } = orderRes.data;

            // Open Razorpay popup
            const options = {
                key: keyId,
                amount: amount * 100,
                currency: 'INR',
                name: 'BookNest',
                description: `Payment for ${book.title}`,
                order_id: orderId,
               handler: async (response) => {
    try {
        // Place order after payment
       // Place order after payment
const orderRes = await placeOrder(id, book.type, address);
await updateOrderStatus(orderRes.data.id, 'CONFIRMED');

// Create delivery tracking
await createDelivery(orderRes.data.id);

navigate('/my-orders');

    } catch (err) {
        setError(err.response?.data || 'Something went wrong!');
    }
},
                prefill: {
                    name: 'BookNest User',
                },
                theme: {
                    color: '#238636'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!book) return <div className="loading">Book not found!</div>;

    return (
        <div className="checkout-container">
            <div className="checkout-box">
                <h2>Confirm Order 🛒</h2>

                {error && <div className="error-msg">{error}</div>}

                <div className="checkout-book">
                    <div className="checkout-book-image">
                        {book.imageUrl ? (
                            <img src={book.imageUrl} alt={book.title} />
                        ) : (
                            <div className="no-image-small">📚</div>
                        )}
                    </div>
                    <div className="checkout-book-info">
                        <h3>{book.title}</h3>
                        <p>by {book.author}</p>
                        <p className="checkout-type">{book.type}</p>
                        <p className="checkout-price">₹{book.price}</p>
                    </div>
                </div>

                <div className="checkout-divider" />

                <div className="checkout-summary">
                    <div className="summary-row">
                        <span>Book Price</span>
                        <span>₹{book.price}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span className="free">FREE</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{book.price}</span>
                    </div>
                </div>

                <div className="checkout-divider" />

                <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea
                        placeholder="Enter your full address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="3"
                    />
                </div>

                <div className="checkout-actions">
                    <button className="back-btn"
                        onClick={() => navigate(`/books/${id}`)}>
                        ← Back
                    </button>
                    <button className="order-btn"
                        onClick={handlePayment}
                        disabled={placing}>
                        {placing ? 'Processing...' : '💳 Pay ₹' + book.price}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;