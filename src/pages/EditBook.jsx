import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '',
        price: '', rentPrice: '', condition: '', location: ''
    });
    const [image,   setImage]   = useState(null);
    const [preview, setPreview] = useState(null);
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);

    useEffect(() => { fetchBook(); }, [id]);

    const fetchBook = async () => {
        try {
            const res = await getBookById(id);
            const b = res.data;
            setFormData({
                title: b.title || '', author: b.author || '',
                genre: b.genre || '', description: b.description || '',
                price: b.price || '', rentPrice: b.rentPrice || '',
                condition: b.condition || '', location: b.location || ''
            });
            setPreview(b.imageUrl || null);
        } catch { setError('Book not found.'); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImage  = (e) => { const f = e.target.files[0]; if (!f) return; setImage(f); setPreview(URL.createObjectURL(f)); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(k => data.append(k, formData[k]));
            if (image) data.append('image', image);
            await updateBook(id, data);
            navigate('/my-books');
        } catch (err) { setError(err.response?.data || 'Something went wrong.'); }
        finally { setSaving(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                .eb*{box-sizing:border-box;margin:0;padding:0;}
                .eb{min-height:100vh;background:#f7f3ee;font-family:'Inter',sans-serif;color:#1a1610;display:flex;align-items:flex-start;justify-content:center;padding:48px 24px 80px;}
                .eb-box{width:100%;max-width:660px;}

                .eb-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'Inter',sans-serif;font-size:13px;color:rgba(26,22,16,0.38);cursor:pointer;padding:0;margin-bottom:24px;transition:color 0.15s;}
                .eb-back:hover{color:#a07828;}

                .eb-title{font-family:'Fraunces',serif;font-size:clamp(26px,4vw,38px);font-weight:600;color:#1a1610;letter-spacing:-0.5px;line-height:1;margin-bottom:6px;}
                .eb-title span{color:#a07828;font-style:italic;font-weight:400;}
                .eb-sub{font-size:13px;font-weight:300;color:rgba(26,22,16,0.38);margin-bottom:32px;}

                .eb-err{padding:12px 16px;border:1px solid rgba(180,60,50,0.2);border-radius:4px;background:rgba(200,60,50,0.05);color:rgba(180,60,50,0.8);font-size:13px;font-weight:300;margin-bottom:20px;}

                .eb-loading{text-align:center;padding:60px 0;font-size:14px;font-weight:300;color:rgba(26,22,16,0.3);}
                .eb-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a07828;margin:0 3px;animation:ebB 1.2s ease-in-out infinite;}
                .eb-dot:nth-child(2){animation-delay:0.15s;}.eb-dot:nth-child(3){animation-delay:0.3s;}
                @keyframes ebB{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

                .eb-sec{font-size:10.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(160,120,40,0.45);margin-bottom:14px;margin-top:28px;padding-bottom:8px;border-bottom:1px solid rgba(160,120,40,0.08);}
                .eb-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
                .eb-group{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
                .eb-group.nm{margin-bottom:0;}
                .eb-label{font-size:12px;font-weight:400;color:rgba(26,22,16,0.45);}
                .eb-input,.eb-select,.eb-textarea{padding:10px 13px;background:#faf7f2;border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:#1a1610;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:300;outline:none;transition:border-color 0.15s,background 0.15s;width:100%;}
                .eb-input::placeholder,.eb-textarea::placeholder{color:rgba(26,22,16,0.2);}
                .eb-input:focus,.eb-select:focus,.eb-textarea:focus{border-color:rgba(160,120,40,0.4);background:#f7f3ee;}
                .eb-select{appearance:none;-webkit-appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' stroke='rgba(160,120,40,0.45)' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M1 1l4 4 4-4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;}
                .eb-select option{background:#faf7f2;color:#1a1610;}
                .eb-textarea{resize:vertical;min-height:92px;line-height:1.6;}
                .eb-div{height:1px;background:rgba(160,120,40,0.08);margin:24px 0;}

                .eb-upload{border:1px dashed rgba(160,120,40,0.2);border-radius:4px;overflow:hidden;}
                .eb-upload-label{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;padding:24px 20px;cursor:pointer;transition:background 0.15s;background:rgba(160,120,40,0.02);}
                .eb-upload-label:hover{background:rgba(160,120,40,0.05);}
                .eb-upload-icon{font-size:20px;color:rgba(160,120,40,0.3);}
                .eb-upload-text{font-size:13px;font-weight:300;color:rgba(26,22,16,0.35);}
                .eb-upload-hint{font-size:11px;color:rgba(26,22,16,0.2);}
                .eb-file{display:none;}
                .eb-preview{width:100%;max-height:200px;object-fit:cover;display:block;border-top:1px solid rgba(160,120,40,0.1);}

                .eb-actions{display:flex;gap:10px;margin-top:28px;}
                .eb-cancel{flex:1;padding:12px;background:transparent;border:1px solid rgba(160,120,40,0.22);border-radius:4px;color:rgba(26,22,16,0.5);font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:border-color 0.15s,color 0.15s;}
                .eb-cancel:hover{border-color:rgba(160,120,40,0.4);color:rgba(26,22,16,0.8);}
                .eb-save{flex:2;padding:12px;background:#a07828;color:#fff;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;transition:background 0.15s,transform 0.15s;}
                .eb-save:hover:not(:disabled){background:#b5892e;transform:translateY(-1px);}
                .eb-save:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

                @media(max-width:540px){.eb{padding:32px 16px 60px;}.eb-row{grid-template-columns:1fr;}.eb-actions{flex-direction:column;}}
            `}</style>

            <div className="eb">
                <div className="eb-box">
                    <button className="eb-back" onClick={() => navigate('/my-books')}>← Back to my books</button>

                    {loading ? (
                        <div className="eb-loading"><span className="eb-dot"/><span className="eb-dot"/><span className="eb-dot"/></div>
                    ) : (
                        <>
                            <h1 className="eb-title">Edit <span>Book</span></h1>
                            <p className="eb-sub">Update your listing details below.</p>

                            {error && <div className="eb-err">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <p className="eb-sec">Book Details</p>
                                <div className="eb-row">
                                    <div className="eb-group nm">
                                        <label className="eb-label">Title</label>
                                        <input className="eb-input" type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="eb-group nm">
                                        <label className="eb-label">Author</label>
                                        <input className="eb-input" type="text" name="author" value={formData.author} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="eb-row">
                                    <div className="eb-group nm">
                                        <label className="eb-label">Genre</label>
                                        <select className="eb-select" name="genre" value={formData.genre} onChange={handleChange} required>
                                            <option value="">Select genre</option>
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
                                    <div className="eb-group nm">
                                        <label className="eb-label">Condition</label>
                                        <select className="eb-select" name="condition" value={formData.condition} onChange={handleChange} required>
                                            <option value="">Select condition</option>
                                            <option value="New">New</option>
                                            <option value="Like New">Like New</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="eb-group">
                                    <label className="eb-label">Description</label>
                                    <textarea className="eb-textarea" name="description" value={formData.description} onChange={handleChange} rows="3" required />
                                </div>

                                <div className="eb-div" />
                                <p className="eb-sec">Listing Details</p>

                                <div className="eb-row">
                                    <div className="eb-group nm">
                                        <label className="eb-label">Price (₹)</label>
                                        <input className="eb-input" type="number" name="price" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="eb-group nm">
                                        <label className="eb-label">Rent Price (₹/day)</label>
                                        <input className="eb-input" type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="eb-group">
                                    <label className="eb-label">Location</label>
                                    <input className="eb-input" type="text" name="location" value={formData.location} onChange={handleChange} required />
                                </div>

                                <div className="eb-div" />
                                <p className="eb-sec">Book Image</p>

                                <div className="eb-upload">
                                    <label className="eb-upload-label" htmlFor="eb-file">
                                        <span className="eb-upload-icon">📷</span>
                                        <span className="eb-upload-text">{preview ? 'Change image' : 'Click to upload'}</span>
                                        <span className="eb-upload-hint">JPG, PNG, WEBP — max 5MB</span>
                                    </label>
                                    <input id="eb-file" className="eb-file" type="file" accept="image/*" onChange={handleImage} />
                                    {preview && <img src={preview} alt="preview" className="eb-preview" />}
                                </div>

                                <div className="eb-actions">
                                    <button type="button" className="eb-cancel" onClick={() => navigate('/my-books')}>Cancel</button>
                                    <button type="submit" className="eb-save" disabled={saving}>
                                        {saving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditBook;