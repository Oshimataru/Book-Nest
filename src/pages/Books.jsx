import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, searchBooks } from '../services/api';
import '../styles/Books.css';

const Books = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        genre: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        sort: ''
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [books, filters]);

    const fetchBooks = async () => {
        try {
            const res = await getAllBooks();
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...books];

        if (filters.type) {
            result = result.filter(b => b.type === filters.type);
        }
        if (filters.genre) {
            result = result.filter(b => b.genre === filters.genre);
        }
        if (filters.condition) {
            result = result.filter(b => b.condition === filters.condition);
        }
        if (filters.minPrice) {
            result = result.filter(b => b.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            result = result.filter(b => b.price <= Number(filters.maxPrice));
        }
        if (filters.sort === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sort === 'low') {
            result.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'high') {
            result.sort((a, b) => b.price - a.price);
        }

        setFiltered(result);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            fetchBooks();
            return;
        }
        try {
            const res = await searchBooks(keyword);
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFilter = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            type: '', genre: '', condition: '',
            minPrice: '', maxPrice: '', sort: ''
        });
        setKeyword('');
        fetchBooks();
    };

    return (
        <div className="books-container">
            <div className="books-header">
                <h2>Browse Books 📚</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className="filters-bar">
                <select name="type" value={filters.type} onChange={handleFilter}>
                    <option value="">All Types</option>
                    <option value="SELL">Sell</option>
                    <option value="RENT">Rent</option>
                    <option value="EXCHANGE">Exchange</option>
                </select>

                <select name="genre" value={filters.genre} onChange={handleFilter}>
                    <option value="">All Genres</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                </select>

                <select name="condition" value={filters.condition} onChange={handleFilter}>
                    <option value="">All Conditions</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                </select>

                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilter}
                />

                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilter}
                />

                <select name="sort" value={filters.sort} onChange={handleFilter}>
                    <option value="">Sort By</option>
                    <option value="newest">Newest First</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                </select>

                <button onClick={clearFilters} className="clear-btn">
                    Clear All
                </button>
            </div>

            <div className="results-count">
                Showing {filtered.length} books
            </div>

            {loading ? (
                <div className="loading">Loading books...</div>
            ) : filtered.length === 0 ? (
                <div className="no-books">No books found! 😔</div>
            ) : (
                <div className="books-grid">
                  {filtered.filter(book => book.status === 'AVAILABLE').map((book) => (
                        <div key={book.id} className="book-card"
                            onClick={() => navigate(`/books/${book.id}`)}>
                            <div className="book-image">
                                {book.imageUrl ? (
                                    <img src={book.imageUrl} alt={book.title} />
                                ) : (
                                    <div className="no-image">📚</div>
                                )}
                            </div>
                            <div className="book-info">
                                <span className={`book-type ${book.type.toLowerCase()}`}>
                                    {book.type}
                                </span>
                                <h3>{book.title}</h3>
                                <p className="book-author">by {book.author}</p>
                                <p className="book-genre">{book.genre}</p>
                                <p className="book-location">📍 {book.location}</p>
                             <p className="book-price">
    {book.type === 'EXCHANGE' ? '🔄 Free Exchange' : `₹${book.price}`}
</p>
                                <p className="book-condition">{book.condition}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Books;