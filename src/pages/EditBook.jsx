import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';
import '../styles/AddBook.css';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        price: '',
        rentPrice: '',
        condition: '',
        location: ''
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await getBookById(id);
            const book = res.data;
            setFormData({
                title: book.title || '',
                author: book.author || '',
                genre: book.genre || '',
                description: book.description || '',
                price: book.price || '',
                rentPrice: book.rentPrice || '',
                condition: book.condition || '',
                location: book.location || ''
            });
            setPreview(book.imageUrl || null);
        } catch (err) {
            setError('Book not found!');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (image) data.append('image', image);
            await updateBook(id, data);
            navigate('/my-books');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="addbook-container">
            <div className="addbook-box">
                <h2>Edit Book ✏️</h2>
                <p className="addbook-subtitle">Update your book details!</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title"
                                value={formData.title}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" name="author"
                                value={formData.author}
                                onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Genre</label>
                            <select name="genre"
                                value={formData.genre}
                                onChange={handleChange} required>
                                <option value="">Select Genre</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Biography">Biography</option>
                                <option value="Technology">Technology</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Condition</label>
                            <select name="condition"
                                value={formData.condition}
                                onChange={handleChange} required>
                                <option value="">Select Condition</option>
                                <option value="New">New</option>
                                <option value="Like New">Like New</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input type="number" name="price"
                                value={formData.price}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Rent Price (₹/day)</label>
                            <input type="number" name="rentPrice"
                                value={formData.rentPrice}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location"
                            value={formData.location}
                            onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Book Image</label>
                        <input type="file" accept="image/*"
                            onChange={handleImage} />
                        {preview && (
                            <img src={preview} alt="preview"
                                className="image-preview" />
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button"
                            onClick={() => navigate('/my-books')}
                            style={{ flex: 1, padding: '12px',
                                background: 'transparent', color: '#8b949e',
                                border: '1px solid #30363d', borderRadius: '8px',
                                cursor: 'pointer', fontSize: '15px' }}>
                            Cancel
                        </button>
                        <button type="submit"
                            className="addbook-btn"
                            style={{ flex: 2 }}
                            disabled={saving}>
                            {saving ? 'Saving...' : '✏️ Update Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBook;