import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClubs, createClub, joinClub } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/BookClubs.css';

const BookClubs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '', description: '', currentBook: ''
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await getAllClubs();
            setClubs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await createClub(formData.name,
                formData.description, formData.currentBook);
            setShowCreate(false);
            setFormData({ name: '', description: '', currentBook: '' });
            // Auto navigate to club after creation
            navigate(`/clubs/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const handleJoin = async (id) => {
        try {
            await joinClub(id);
            navigate(`/clubs/${id}`);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        }
    };

    const isMember = (club) => {
        return club.members?.some(m => m.email === user?.email);
    };

    if (loading) return <div className="loading">Loading clubs...</div>;

    return (
        <div className="clubs-container">
            <div className="clubs-header">
                <h2>Book Clubs 📖</h2>
                {user && (
                    <button className="create-club-btn"
                        onClick={() => setShowCreate(!showCreate)}>
                        + Create Club
                    </button>
                )}
            </div>

            {error && <div className="error-msg">{error}</div>}

            {showCreate && (
                <div className="create-club-form">
                    <h3>Create New Club</h3>
                    <form onSubmit={handleCreate}>
                        <input type="text" placeholder="Club Name"
                            value={formData.name}
                            onChange={(e) => setFormData({
                                ...formData, name: e.target.value})}
                            required />
                        <textarea placeholder="Description..."
                            value={formData.description}
                            onChange={(e) => setFormData({
                                ...formData, description: e.target.value})}
                            rows="3" required />
                        <input type="text"
                            placeholder="Current book (optional)"
                            value={formData.currentBook}
                            onChange={(e) => setFormData({
                                ...formData, currentBook: e.target.value})} />
                        <div className="form-actions">
                            <button type="button"
                                onClick={() => setShowCreate(false)}
                                className="cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn">
                                Create Club
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {clubs.length === 0 ? (
                <div className="no-clubs">
                    No book clubs yet! Create one! 😊
                </div>
            ) : (
                <div className="clubs-grid">
                    {clubs.map((club) => (
                        <div key={club.id} className="club-card">
                            <div className="club-icon">📖</div>
                            <h3>{club.name}</h3>
                            <p className="club-desc">{club.description}</p>
                            {club.currentBook && (
                                <p className="club-book">
                                    📚 Reading: {club.currentBook}
                                </p>
                            )}
                            <div className="club-footer">
                                <span className="club-members">
                                    👥 {club.members?.length || 0} members
                                </span>
                                <div className="club-btns">
                                    <button className="view-btn"
                                        onClick={() => navigate(`/clubs/${club.id}`)}>
                                        View
                                    </button>
                                    {/* Show Join only if not a member */}
                                    {!isMember(club) && (
                                        <button className="join-btn"
                                            onClick={() => handleJoin(club.id)}>
                                            Join
                                        </button>
                                    )}
                                    {/* Show Joined badge if member */}
                                    {isMember(club) && (
                                        <span className="joined-badge">
                                            ✅ Joined
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookClubs;