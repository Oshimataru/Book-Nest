import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDelivery, createDelivery } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STEPS = [
    { key: 'PROCESSING',       icon: '📋', label: 'Processing'       },
    { key: 'SHIPPED',          icon: '🚚', label: 'Shipped'          },
    { key: 'OUT_FOR_DELIVERY', icon: '📍', label: 'Out for Delivery' },
    { key: 'DELIVERED',        icon: '✓',  label: 'Delivered'        },
];

const stepIndex = (status) => STEPS.findIndex(s => s.key === status);

const statusStyle = {
    PROCESSING:       { bg: 'rgba(255,193,7,0.1)',  color: '#ffc107',      border: 'rgba(255,193,7,0.3)'  },
    SHIPPED:           { bg: 'rgba(74,158,255,0.1)', color: '#4a9eff',      border: 'rgba(74,158,255,0.3)' },
    OUT_FOR_DELIVERY: { bg: 'rgba(187,134,252,0.1)', color: '#bb86fc',      border: 'rgba(187,134,252,0.3)'},
    DELIVERED:         { bg: 'rgba(3,218,197,0.1)',  color: '#03dac5',      border: 'rgba(3,218,197,0.3)'  },
};

const fmt = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate    = useNavigate();

    const [delivery, setDelivery] = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    useEffect(() => { fetchDelivery(); }, [orderId]);

    const fetchDelivery = async () => {
        try {
            const res = await createDelivery(orderId);
            setDelivery(res.data);
        } catch {
            try { const res = await getDelivery(orderId); setDelivery(res.data); }
            catch { setError('Failed to load delivery tracking.'); }
        } finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .tk*{box-sizing:border-box;margin:0;padding:0;}
                .tk{min-height:100vh;background:#000000;font-family:'Inter',sans-serif;color:#ffffff;padding:48px 32px 80px;}
                .tk-wrap{max-width:680px;margin:0 auto;}

                .tk-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.4);cursor:pointer;padding:0;margin-bottom:24px;transition:color 0.15s;}
                .tk-back:hover{color:#ffc107;}

                .tk-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,38px);font-weight:600;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;margin-bottom:32px;}
                .tk-title span{color:#ffc107;font-style:italic;font-weight:400;}

                .tk-loading{text-align:center;padding:80px 0;}
                .tk-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffc107;margin:0 4px;animation:tkB 1.2s ease-in-out infinite;}
                .tk-dot:nth-child(2){animation-delay:0.15s;}.tk-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes tkB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}
                
                .tk-err{padding:16px;border:1px solid rgba(255,82,82,0.3);border-radius:8px;background:rgba(255,82,82,0.05);color:#ff5252;font-size:13px;text-align:center;}

                /* Stepper */
                .tk-steps{display:flex;align-items:center;padding:32px 24px;background:#0a0a0a;border:1px solid rgba(255,193,7,0.15);border-bottom:none;border-radius:12px 12px 0 0;}
                .tk-step{display:flex;flex-direction:column;align-items:center;gap:8px;flex:0 0 auto;position:relative;z-index:2;}
                .tk-step-circle{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid rgba(255,255,255,0.1);background:#111;transition:all 0.3s;color:rgba(255,255,255,0.2);}
                
                .tk-step.done .tk-step-circle{background:#ffc107;border-color:#ffc107;color:#000;}
                .tk-step.curr .tk-step-circle{background:#000;border-color:#ffc107;color:#ffc107;box-shadow:0 0 15px rgba(255,193,7,0.2);}
                
                .tk-step-label{font-size:10px;font-weight:500;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.5px;}
                .tk-step.done .tk-step-label,.tk-step.curr .tk-step-label{color:#ffc107;}
                
                .tk-step-line{flex:1;height:2px;background:rgba(255,255,255,0.1);margin:0 4px;margin-bottom:20px;transition:background 0.3s;}
                .tk-step-line.done{background:#ffc107;}

                /* Info rows */
                .tk-info{border:1px solid rgba(255,193,7,0.15);background:#0a0a0a;border-top:none;border-bottom:none;}
                .tk-row{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);}
                .tk-row-label{font-size:12px;font-weight:400;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;}
                .tk-row-value{font-size:14px;font-weight:300;color:rgba(255,255,255,0.85);text-align:right;}
                .tk-status-badge{display:inline-block;padding:4px 12px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;border:1px solid;letter-spacing:0.5px;}

                /* Map container */
                .tk-map-wrap{border:1px solid rgba(255,193,7,0.15);overflow:hidden;border-radius:0 0 12px 12px;background:#0a0a0a;}
                .tk-map-head{padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ffc107;}
                .tk-no-map{border:1px solid rgba(255,193,7,0.15);padding:48px 24px;text-align:center;font-size:13px;font-weight:300;color:rgba(255,255,255,0.3);background:#0a0a0a;border-radius:0 0 12px 12px;}

                /* Leaflet Dark mode adjustment */
                .leaflet-container{background:#0a0a0a !important; filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);}
            `}</style>

            <div className="tk">
                <div className="tk-wrap">
                    <button className="tk-back" onClick={() => navigate('/my-orders')}>
                        <span>←</span> BACK TO ORDERS
                    </button>

                    {loading ? (
                        <div className="tk-loading"><span className="tk-dot"/><span className="tk-dot"/><span className="tk-dot"/></div>
                    ) : error ? (
                        <div className="tk-err">{error}</div>
                    ) : delivery && (() => {
                        const curr = stepIndex(delivery.status);
                        const s    = statusStyle[delivery.status] || statusStyle.PROCESSING;
                        const hasLoc = delivery.latitude && delivery.longitude;

                        return (
                            <>
                                <h1 className="tk-title">Track <span>Order</span></h1>

                                <div className="tk-steps">
                                    {STEPS.map((step, i) => (
                                        <div key={step.key} style={{ display: 'flex', flex: i === STEPS.length - 1 ? 'none' : '1', alignItems: 'center' }}>
                                            <div className={`tk-step${i < curr ? ' done' : i === curr ? ' curr' : ''}`}>
                                                <div className="tk-step-circle">{step.icon}</div>
                                                <div className="tk-step-label">{step.label}</div>
                                            </div>
                                            {i < STEPS.length - 1 && (
                                                <div className={`tk-step-line${i < curr ? ' done' : ''}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="tk-info">
                                    <div className="tk-row">
                                        <span className="tk-row-label">Status</span>
                                        <span className="tk-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                            {delivery.status?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="tk-row">
                                        <span className="tk-row-label">Current Location</span>
                                        <span className="tk-row-value">{delivery.currentLocation || 'Awaiting update'}</span>
                                    </div>
                                    <div className="tk-row">
                                        <span className="tk-row-label">Update</span>
                                        <span className="tk-row-value">{delivery.message || 'Processing your shipment'}</span>
                                    </div>
                                    <div className="tk-row">
                                        <span className="tk-row-label">Timestamp</span>
                                        <span className="tk-row-value">{fmt(delivery.updatedAt)}</span>
                                    </div>
                                </div>

                                {hasLoc ? (
                                    <div className="tk-map-wrap">
                                        <div className="tk-map-head">Live Tracking</div>
                                        <MapContainer
                                            center={[delivery.latitude, delivery.longitude]}
                                            zoom={13}
                                            style={{ height: '320px' }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; OpenStreetMap'
                                            />
                                            <Marker position={[delivery.latitude, delivery.longitude]}>
                                                <Popup>
                                                    <span style={{color: '#000'}}>📦 Parcel is currently at: <br/>{delivery.currentLocation}</span>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                ) : (
                                    <div className="tk-no-map">
                                        The live tracking map will activate once the package is in transit.
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
};

export default TrackOrder;