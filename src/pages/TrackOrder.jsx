import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDelivery, createDelivery } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/TrackOrder.css';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDelivery();
    }, [orderId]);

   const fetchDelivery = async () => {
    try {
        // Always try to create first (it won't duplicate)
        const createRes = await createDelivery(orderId);
        setDelivery(createRes.data);
    } catch (err) {
        try {
            const res = await getDelivery(orderId);
            setDelivery(res.data);
        } catch (e) {
            setError('Failed to load delivery!');
        }
    } finally {
        setLoading(false);
    }
};

    const getStatusStep = (status) => {
        switch (status) {
            case 'PROCESSING': return 1;
            case 'SHIPPED': return 2;
            case 'OUT_FOR_DELIVERY': return 3;
            case 'DELIVERED': return 4;
            default: return 1;
        }
    };

    if (loading) return <div className="loading">Loading tracking...</div>;
    if (error) return <div className="loading">{error}</div>;
    if (!delivery) return null;

    const step = getStatusStep(delivery.status);
    const hasLocation = delivery.latitude && delivery.longitude;

    return (
        <div className="track-container">
            <div className="track-box">
                <div className="track-header">
                    <button className="back-btn"
                        onClick={() => navigate('/my-orders')}>
                        ← Back
                    </button>
                    <h2>Track Order 📦</h2>
                </div>

                {/* Status Steps */}
                <div className="track-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-icon">📋</div>
                        <div className="step-label">Processing</div>
                    </div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}/>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-icon">🚚</div>
                        <div className="step-label">Shipped</div>
                    </div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}/>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-icon">📍</div>
                        <div className="step-label">Out for Delivery</div>
                    </div>
                    <div className={`step-line ${step >= 4 ? 'active' : ''}`}/>
                    <div className={`step ${step >= 4 ? 'active' : ''}`}>
                        <div className="step-icon">✅</div>
                        <div className="step-label">Delivered</div>
                    </div>
                </div>

                {/* Status Info */}
                <div className="track-info">
                    <div className="track-row">
                        <span>Current Location</span>
                        <span>{delivery.currentLocation || 'Not updated yet'}</span>
                    </div>
                    <div className="track-row">
                        <span>Status</span>
                        <span className="track-status">{delivery.status}</span>
                    </div>
                    <div className="track-row">
                        <span>Message</span>
                        <span>{delivery.message || 'No updates yet'}</span>
                    </div>
                    <div className="track-row">
                        <span>Last Updated</span>
                        <span>{new Date(delivery.updatedAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* Map */}
                {hasLocation ? (
                    <div className="track-map">
                        <h3>📍 Current Location</h3>
                        <MapContainer
                            center={[delivery.latitude, delivery.longitude]}
                            zoom={13}
                            style={{ height: '350px', borderRadius: '8px' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <Marker position={[delivery.latitude, delivery.longitude]}>
                                <Popup>
                                    📦 Your book is here!<br />
                                    {delivery.currentLocation}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                ) : (
                    <div className="no-map">
                        🗺️ Location will appear here once seller ships the order!
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;