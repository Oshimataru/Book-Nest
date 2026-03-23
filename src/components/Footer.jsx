import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:wght@600&display=swap');
        .ft*,.ft *::before,.ft *::after{box-sizing:border-box;margin:0;padding:0;}
        .ft{background:#f7f3ee;border-top:1px solid rgba(160,120,40,0.12);font-family:'Inter',sans-serif;}
        .ft-inner{max-width:1200px;margin:0 auto;padding:40px 32px 24px;}
        .ft-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:48px;padding-bottom:32px;border-bottom:1px solid rgba(160,120,40,0.08);}
        .ft-brand{display:flex;flex-direction:column;gap:12px;}
        .ft-logo{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:#1a1610;cursor:pointer;letter-spacing:-0.3px;width:fit-content;}
        .ft-logo span{color:#a07828;}
        .ft-desc{font-size:13px;font-weight:300;color:rgba(26,22,16,0.38);line-height:1.65;max-width:240px;}
        .ft-gh{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;width:fit-content;background:rgba(160,120,40,0.06);border:1px solid rgba(160,120,40,0.16);border-radius:4px;color:rgba(160,120,40,0.6);font-size:12.5px;text-decoration:none;font-family:'Inter',sans-serif;transition:background 0.15s,color 0.15s;}
        .ft-gh:hover{background:rgba(160,120,40,0.1);color:#a07828;}
        .ft-col{display:flex;flex-direction:column;gap:2px;}
        .ft-col-head{font-size:10.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(160,120,40,0.5);margin-bottom:10px;}
        .ft-col-link{background:none;border:none;text-align:left;font-family:'Inter',sans-serif;font-size:13px;font-weight:300;color:rgba(26,22,16,0.38);padding:4px 0;cursor:pointer;transition:color 0.14s;width:fit-content;}
        .ft-col-link:hover{color:rgba(26,22,16,0.75);}
        .ft-bottom{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:20px;}
        .ft-copy{font-size:12px;color:rgba(26,22,16,0.22);font-weight:300;}
        .ft-copy b{color:rgba(160,120,40,0.4);font-weight:400;}
        .ft-legal{display:flex;gap:18px;}
        .ft-ll{font-size:12px;color:rgba(26,22,16,0.2);background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;padding:0;transition:color 0.14s;}
        .ft-ll:hover{color:rgba(26,22,16,0.5);}
        @media(max-width:700px){.ft-grid{grid-template-columns:1fr 1fr;gap:28px;}.ft-brand{grid-column:1 / -1;}}
        @media(max-width:440px){.ft-inner{padding:32px 20px 20px;}.ft-grid{grid-template-columns:1fr;}.ft-bottom{flex-direction:column;align-items:flex-start;}}
      `}</style>

      <footer className="ft" role="contentinfo">
        <div className="ft-inner">
          <div className="ft-grid">
            <div className="ft-brand">
              <div className="ft-logo" onClick={() => navigate('/')}>Book<span>Nest</span></div>
              <p className="ft-desc">A marketplace for books — buy, sell, rent and exchange with readers near you.</p>
              <a className="ft-gh" href="https://github.com/Oshimataru" target="_blank" rel="noopener noreferrer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                Oshimataru
              </a>
            </div>

            <div className="ft-col">
              <p className="ft-col-head">Explore</p>
              <button className="ft-col-link" onClick={() => navigate('/books')}>Browse Books</button>
              <button className="ft-col-link" onClick={() => navigate('/clubs')}>Book Clubs</button>
              <button className="ft-col-link" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
              {!user && <button className="ft-col-link" onClick={() => navigate('/register')}>Create Account</button>}
            </div>

            <div className="ft-col">
              <p className="ft-col-head">{user ? 'Account' : 'Get Started'}</p>
              {user ? <>
                <button className="ft-col-link" onClick={() => navigate('/my-books')}>My Books</button>
                <button className="ft-col-link" onClick={() => navigate('/my-orders')}>My Orders</button>
                <button className="ft-col-link" onClick={() => navigate('/my-exchanges')}>My Exchanges</button>
                <button className="ft-col-link" onClick={() => navigate('/add-book')}>+ Post a Book</button>
              </> : <>
                <button className="ft-col-link" onClick={() => navigate('/login')}>Login</button>
                <button className="ft-col-link" onClick={() => navigate('/register')}>Register</button>
                <button className="ft-col-link" onClick={() => navigate('/books')}>Browse as Guest</button>
              </>}
            </div>
          </div>

          <div className="ft-bottom">
            <p className="ft-copy">© {year} <b>BookNest</b></p>
            <div className="ft-legal">
              <button className="ft-ll">Privacy</button>
              <button className="ft-ll">Terms</button>
              <button className="ft-ll">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
