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

    const typeColor = { SELL:'#a07828', RENT:'#4a7fa5', EXCHANGE:'#7a68a8' };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .bk*{box-sizing:border-box;margin:0;padding:0;}
                .bk{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;padding:48px 32px 80px;}

                .bk-header{max-width:1100px;margin:0 auto 32px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;}
                .bk-title{font-family:'Fraunces',serif;font-size:clamp(26px,4vw,40px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;}
                .bk-title span{color:#a07828;font-style:italic;font-weight:400;}

                .bk-search{display:flex;border:1px solid rgba(160,120,40,0.2);border-radius:4px;overflow:hidden;flex:1;max-width:360px;min-width:220px;}
                .bk-search input{flex:1;padding:10px 14px;background:#faf7f2;border:none;outline:none;font-family:'Inter',sans-serif;font-size:13px;color:#1a1610;}
                .bk-search input::placeholder{color:rgba(26,22,16,0.25);}
                .bk-search input:focus{background:#f7f3ee;}
                .bk-search button{padding:10px 18px;background:#a07828;border:none;color:#fff;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:background 0.15s;}
                .bk-search button:hover{background:#b5892e;}

                .bk-filters{max-width:1100px;margin:0 auto 24px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
                .bk-sel,.bk-inp{padding:8px 12px;background:#faf7f2;border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:rgba(26,22,16,0.6);font-family:'Inter',sans-serif;font-size:12.5px;outline:none;cursor:pointer;transition:border-color 0.15s,background 0.15s;appearance:none;-webkit-appearance:none;}
                .bk-sel{padding-right:28px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' stroke='rgba(160,120,40,0.45)' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M1 1l4 4 4-4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;}
                .bk-sel:focus,.bk-inp:focus{border-color:rgba(160,120,40,0.4);background:#f7f3ee;color:rgba(26,22,16,0.9);}
                .bk-sel option{background:#faf7f2;color:#1a1610;}
                .bk-inp{width:96px;}
                .bk-inp::placeholder{color:rgba(26,22,16,0.2);}
                .bk-clear{padding:8px 14px;background:transparent;border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:rgba(160,120,40,0.55);font-family:'Inter',sans-serif;font-size:12.5px;cursor:pointer;transition:border-color 0.15s,color 0.15s;margin-left:auto;}
                .bk-clear:hover{border-color:rgba(160,120,40,0.4);color:#a07828;}

                .bk-count{max-width:1100px;margin:0 auto 20px;font-size:12px;font-weight:300;color:rgba(26,22,16,0.3);}
                .bk-count b{color:rgba(160,120,40,0.6);font-weight:400;}

                .bk-loading,.bk-empty{max-width:1100px;margin:80px auto;text-align:center;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .bk-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:bkB 1.2s ease-in-out infinite;}
                .bk-dot:nth-child(2){animation-delay:0.15s;}.bk-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes bkB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                .bk-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1px;border:1px solid rgba(160,120,40,0.1);}

                .bk-card{background:#f7f3ee;cursor:pointer;transition:background 0.18s;display:flex;flex-direction:column;border-right:1px solid rgba(160,120,40,0.08);border-bottom:1px solid rgba(160,120,40,0.08);position:relative;}
                .bk-card:hover{background:#faf7f2;}
                .bk-card:hover .bk-arrow{opacity:1;transform:translate(0,0);}

                .bk-img{width:100%;aspect-ratio:3/4;background:#ede8e0;overflow:hidden;position:relative;border-bottom:1px solid rgba(160,120,40,0.08);}
                .bk-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s;}
                .bk-card:hover .bk-img img{transform:scale(1.04);}
                .bk-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:36px;color:rgba(160,120,40,0.2);background:repeating-linear-gradient(45deg,rgba(160,120,40,0.03),rgba(160,120,40,0.03) 1px,transparent 1px,transparent 12px);}

                .bk-badge{position:absolute;top:10px;left:10px;padding:3px 9px;border-radius:2px;font-size:10px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#fff;}

                .bk-body{padding:16px;flex:1;display:flex;flex-direction:column;gap:4px;}
                .bk-book-title{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:#1a1610;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
                .bk-author{font-size:12px;font-weight:300;color:rgba(26,22,16,0.38);}
                .bk-meta{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;}
                .bk-genre{font-size:11px;font-weight:400;color:rgba(160,120,40,0.6);padding:2px 8px;border:1px solid rgba(160,120,40,0.18);border-radius:2px;}
                .bk-cond{font-size:11px;font-weight:300;color:rgba(26,22,16,0.3);}
                .bk-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid rgba(160,120,40,0.07);}
                .bk-price{font-family:'Fraunces',serif;font-size:17px;font-weight:600;color:#a07828;}
                .bk-price.ex{font-size:12px;font-weight:400;color:rgba(160,120,40,0.5);font-family:'Inter',sans-serif;}
                .bk-loc{font-size:11px;font-weight:300;color:rgba(26,22,16,0.25);}
                .bk-arrow{position:absolute;top:12px;right:12px;font-size:14px;color:rgba(160,120,40,0.5);opacity:0;transform:translate(-3px,3px);transition:opacity 0.2s,transform 0.2s;}

                @media(max-width:640px){.bk{padding:32px 16px 60px;}.bk-header{flex-direction:column;align-items:flex-start;}.bk-search{max-width:100%;}.bk-grid{grid-template-columns:repeat(auto-fill,minmax(155px,1fr));}.bk-clear{margin-left:0;}}
            `}</style>

            <div className="bk">
                <div className="bk-header">
                    <h1 className="bk-title">Browse <span>Books</span></h1>
                    <form className="bk-search" onSubmit={handleSearch}>
                        <input type="text" placeholder="Search title or author…" value={keyword} onChange={e => setKeyword(e.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                </div>

                <div className="bk-filters">
                    <select className="bk-sel" name="type" value={filters.type} onChange={handleFilter}>
                        <option value="">All Types</option>
                        <option value="SELL">Sell</option>
                        <option value="RENT">Rent</option>
                        <option value="EXCHANGE">Exchange</option>
                    </select>
                    <select className="bk-sel" name="genre" value={filters.genre} onChange={handleFilter}>
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
                    <select className="bk-sel" name="condition" value={filters.condition} onChange={handleFilter}>
                        <option value="">All Conditions</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                    <input className="bk-inp" type="number" name="minPrice" placeholder="Min ₹" value={filters.minPrice} onChange={handleFilter} />
                    <input className="bk-inp" type="number" name="maxPrice" placeholder="Max ₹" value={filters.maxPrice} onChange={handleFilter} />
                    <select className="bk-sel" name="sort" value={filters.sort} onChange={handleFilter}>
                        <option value="">Sort By</option>
                        <option value="newest">Newest First</option>
                        <option value="low">Price: Low → High</option>
                        <option value="high">Price: High → Low</option>
                    </select>
                    <button className="bk-clear" onClick={clearFilters}>Clear</button>
                </div>

                <div className="bk-count">Showing <b>{available.length}</b> books</div>

                {loading ? (
                    <div className="bk-loading"><span className="bk-dot"/><span className="bk-dot"/><span className="bk-dot"/></div>
                ) : available.length === 0 ? (
                    <div className="bk-empty">No books found.</div>
                ) : (
                    <div className="bk-grid">
                        {available.map(book => (
                            <div key={book.id} className="bk-card" onClick={() => navigate(`/books/${book.id}`)}>
                                <span className="bk-arrow">↗</span>
                                <div className="bk-img">
                                    {book.imageUrl
                                        ? <img src={book.imageUrl} alt={book.title} />
                                        : <div className="bk-noimg">📚</div>
                                    }
                                    <span className="bk-badge" style={{ background: typeColor[book.type] || '#a07828' }}>{book.type}</span>
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
                                            ? <span className="bk-price ex">Free Exchange</span>
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
