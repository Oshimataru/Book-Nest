import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/api';
import '../styles/AddBook.css';

const AddBook = () => {
    const navigate = useNavigate();

   const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    rentPrice: '',
    condition: '',
    type: 'SELL',
    location: '',
    quantity: 1
});

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (image) data.append('image', image);

            await addBook(data);
            navigate('/books');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addbook-container">
            <div className="addbook-box">
                <h2>Post a Book 📚</h2>
                <p className="addbook-subtitle">Fill in the details below!</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title"
                                placeholder="Book title"
                                value={formData.title}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" name="author"
                                placeholder="Author name"
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
                            placeholder="Describe the book..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="3" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type"
                                value={formData.type}
                                onChange={handleChange}>
                                <option value="SELL">Sell</option>
                                <option value="RENT">Rent</option>
                                <option value="EXCHANGE">Exchange</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location"
                                placeholder="Your city"
                                value={formData.location}
                                onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input type="number" name="price"
                                placeholder="Selling price"
                                value={formData.price}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" name="quantity"
                                placeholder="Number of copies"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required />
                        </div>
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

                    <button type="submit"
                        className="addbook-btn"
                        disabled={loading}>
                        {loading ? 'Posting...' : 'Post Book 📚'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;