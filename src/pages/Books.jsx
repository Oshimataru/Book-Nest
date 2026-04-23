import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, searchBooks } from '../services/api';

const Books = () => {
    const navigate = useNavigate();
    const [books,    setBooks]    = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [keyword,  setKeyword]  = useState('');
    const [filters,  setFilters]  = useState({ type:'', genre:'', condition:'', minPrice:'', maxPrice:'', sort:'' });

    useEffect(() => { fetchBooks(); }, []);
    useEffect(() => { applyFilters(); }, [books, filters]);

    const fetchBooks = async () => {
        try { const res = await getAllBooks(); setBooks(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const applyFilters = () => {
        let r = [...books];
        if (filters.type)      r = r.filter(b => b.type === filters.type);
        if (filters.genre)     r = r.filter(b => b.genre === filters.genre);
        if (filters.condition) r = r.filter(b => b.condition === filters.condition);
        if (filters.minPrice)  r = r.filter(b => b.price >= Number(filters.minPrice));
        if (filters.maxPrice)  r = r.filter(b => b.price <= Number(filters.maxPrice));
        if (filters.sort === 'newest') r.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
        if (filters.sort === 'low')    r.sort((a,b) => a.price-b.price);
        if (filters.sort === 'high')   r.sort((a,b) => b.price-a.price);
        setFiltered(r);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) { fetchBooks(); return; }
        try { const res = await searchBooks(keyword); setBooks(res.data); }
        catch (err) { console.error(err); }
    };

    const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const clearFilters = () => { setFilters({ type:'', genre:'', condition:'', minPrice:'', maxPrice:'', sort:'' }); setKeyword(''); fetchBooks(); };

    const available = filtered.filter(b => b.status === 'AVAILABLE');

    // Updated Color Palette for Gold/Black theme
    const typeColor = { SELL:'#FFC107', RENT:'#FFD54F', EXCHANGE:'#BDBDBD' };

    return (
        <>
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,600;1,400&display=swap');

.bk{
    min-height:100vh;
    background: #000000;
    background-image: radial-gradient(circle at top, #0a0a0a 0%, #000000 100%);
    font-family:'Inter',sans-serif;
    color:#ffffff;
    padding:60px 20px 100px;
}

/* HEADER */
.bk-header{
    max-width:1200px;
    margin:0 auto 40px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:30px;
    flex-wrap:wrap;
}

.bk-title{
    font-family:'Fraunces',serif;
    font-size:clamp(32px, 5vw, 48px);
    font-weight:600;
    color:#fff;
}
.bk-title span{
    color: #FFC107;
    font-style: italic;
    font-weight: 400;
}

/* SEARCH */
.bk-search{
    display:flex;
    border-radius:12px;
    overflow:hidden;
    max-width:400px;
    width:100%;
    background: #111;
    border:1px solid rgba(255, 193, 7, 0.2);
    transition: border-color 0.3s;
}
.bk-search:focus-within {
    border-color: #FFC107;
}
.bk-search input{
    flex:1;
    padding:14px;
    border:none;
    background:transparent;
    color:#fff;
    outline:none;
}
.bk-search button{
    padding:0 24px;
    background: #FFC107;
    color:#000;
    font-weight: 600;
    border:none;
    cursor:pointer;
}

/* FILTERS */
.bk-filters{
    max-width:1200px;
    margin:0 auto 40px;
    display:flex;
    gap:12px;
    flex-wrap:wrap;
}

.bk-sel, .bk-inp{
    padding:12px 16px;
    border-radius:8px;
    border:1px solid rgba(255, 255, 255, 0.05);
    background: #0a0a0a;
    color:#fff;
    outline:none;
    font-size:14px;
    transition: border-color 0.2s;
}
.bk-sel:focus, .bk-inp:focus {
    border-color: #FFC107;
}

/* GRID */
.bk-grid{
    max-width:1200px;
    margin:0 auto;
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
    gap:30px;
}

/* CARD */
.bk-card{
    background: #0a0a0a;
    border-radius:16px;
    overflow:hidden;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    border:1px solid rgba(255, 255, 255, 0.05);
    transition:all 0.3s ease; /* KEPT YOUR ANIMATION */
    position:relative;
}

/* HOVER ANIMATION - KEPT AS REQUESTED */
.bk-card:hover{
    transform:translateY(-8px) scale(1.02);
    box-shadow:0 30px 60px rgba(0,0,0,0.8);
    border-color:rgba(255, 193, 7, 0.4);
}

/* IMAGE */
.bk-img{
    width:100%;
    aspect-ratio:3/4;
    overflow:hidden;
    background:#111;
    position:relative;
}
.bk-img img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:transform 0.5s ease;
}
.bk-card:hover .bk-img img{
    transform:scale(1.1);
}

/* BADGE */
.bk-badge{
    position:absolute;
    bottom:12px;
    left:12px;
    padding:4px 12px;
    font-size:10px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:1px;
    color:#000;
    border-radius:4px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* BODY */
.bk-body{
    padding:20px;
    display:flex;
    flex-direction:column;
    gap:8px;
}

/* TITLE */
.bk-book-title{
    font-family:'Fraunces',serif;
    font-size:18px;
    font-weight:600;
    color:#fff;
    line-height:1.3;
}

/* AUTHOR */
.bk-author{
    font-size:13px;
    color:rgba(255,255,255,0.4);
}

/* META */
.bk-meta{
    display:flex;
    align-items:center;
    gap:10px;
    margin-top:4px;
}
.bk-genre{
    font-size:11px;
    padding:2px 10px;
    border-radius:100px;
    border:1px solid rgba(255, 193, 7, 0.3);
    color:#FFC107;
}
.bk-cond{
    font-size:11px;
    color:rgba(255,255,255,0.3);
}

/* FOOTER */
.bk-footer{
    margin-top:12px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-top:15px;
    border-top: 1px solid rgba(255,255,255,0.05);
}

.bk-price{
    font-size:18px;
    font-weight:700;
    color:#FFC107;
}
.bk-price.ex {
    font-size:14px;
    color: #fff;
    font-style: italic;
}

.bk-loc{
    font-size:11px;
    color:rgba(255,255,255,0.4);
}

/* ARROW */
.bk-arrow{
    position:absolute;
    top:15px;
    right:15px;
    color: #FFC107;
    font-size: 20px;
    opacity:0;
    transition:all 0.2s;
    z-index: 2;
}
.bk-card:hover .bk-arrow{
    opacity:1;
    transform:translate(2px, -2px);
}

/* CLEAR BUTTON */
.bk-clear{
    padding:12px 24px;
    border-radius:8px;
    border:1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color:#fff;
    font-size:13px;
    font-weight: 500;
    cursor:pointer;
    transition:all 0.2s;
    margin-left:auto;
}

.bk-clear:hover{
    background: rgba(255, 255, 255, 0.05);
    border-color: #FFC107;
    color: #FFC107;
}

.bk-count {
    max-width: 1200px;
    margin: 0 auto 20px;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
}
.bk-count b { color: #FFC107; }

/* LOADING */
.bk-loading {
    display: flex;
    justify-content: center;
    padding: 100px;
    color: #FFC107;
}

@media(max-width:640px){
    .bk{padding:40px 16px;}
    .bk-header { flex-direction: column; align-items: flex-start; }
    .bk-search { max-width: 100%; }
}
`}</style>

            <div className="bk">
                <div className="bk-header">
                    <h1 className="bk-title">Library <span>Archive</span></h1>
                    <form className="bk-search" onSubmit={handleSearch}>
                        <input type="text" placeholder="Search by title, author..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                        <button type="submit">Find</button>
                    </form>
                </div>

                <div className="bk-filters">
                    <select className="bk-sel" name="type" value={filters.type} onChange={handleFilter}>
                        <option value="">Availability</option>
                        <option value="SELL">Buy</option>
                        <option value="RENT">Rent</option>
                        <option value="EXCHANGE">Exchange</option>
                    </select>
                    <select className="bk-sel" name="genre" value={filters.genre} onChange={handleFilter}>
                        <option value="">All Genres</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Science">Science</option>
                        <option value="Technology">Technology</option>
                    </select>
                    <select className="bk-sel" name="condition" value={filters.condition} onChange={handleFilter}>
                        <option value="">Condition</option>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                    <input className="bk-inp" style={{width: '100px'}} type="number" name="minPrice" placeholder="Min ₹" value={filters.minPrice} onChange={handleFilter} />
                    <input className="bk-inp" style={{width: '100px'}} type="number" name="maxPrice" placeholder="Max ₹" value={filters.maxPrice} onChange={handleFilter} />
                    <select className="bk-sel" name="sort" value={filters.sort} onChange={handleFilter}>
                        <option value="">Sort By</option>
                        <option value="newest">Recent</option>
                        <option value="low">Price: Low</option>
                        <option value="high">Price: High</option>
                    </select>
                    <button className="bk-clear" onClick={clearFilters}>Reset</button>
                </div>

                <div className="bk-count">Displaying <b>{available.length}</b> Curated Titles</div>

                {loading ? (
                    <div className="bk-loading">Loading Archive...</div>
                ) : available.length === 0 ? (
                    <div className="bk-empty" style={{textAlign: 'center', padding: '100px', color: 'rgba(255,255,255,0.2)'}}>No matches found in the collection.</div>
                ) : (
                    <div className="bk-grid">
                        {available.map(book => (
                            <div key={book.id} className="bk-card" onClick={() => navigate(`/books/${book.id}`)}>
                                <span className="bk-arrow">↗</span>
                                <div className="bk-img">
                                    {book.imageUrl
                                        ? <img src={book.imageUrl} alt={book.title} />
                                        : <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: '#111'}}>📖</div>
                                    }
                                    <span className="bk-badge" style={{ background: typeColor[book.type] || '#FFC107' }}>{book.type}</span>
                                </div>
                                <div className="bk-body">
                                    <div className="bk-book-title">{book.title}</div>
                                    <div className="bk-author">by {book.author}</div>
                                    <div className="bk-meta">
                                        <span className="bk-genre">{book.genre}</span>
                                        <span className="bk-cond">{book.condition}</span>
                                    </div>
                                    <div className="bk-footer">
                                        {book.type === 'EXCHANGE'
                                            ? <span className="bk-price ex">Exchange Only</span>
                                            : <span className="bk-price">₹{book.price}</span>
                                        }
                                        <span className="bk-loc">📍 {book.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Books;