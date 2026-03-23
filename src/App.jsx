import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/AdminDashboard';
import Exchange from './pages/Exchange';
import MyExchanges from './pages/MyExchanges';
import Leaderboard from './pages/Leaderboard';
import MyBooks from './pages/MyBooks';
import BookClubs from './pages/BookClubs';
import ClubDetail from './pages/ClubDetail';
import EditBook from './pages/EditBook';
import './styles/Auth.css';
import './styles/Global.css';

/* ─────────────────────────────────────────────
   PROTECTED ROUTE
───────────────────────────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

/* ─────────────────────────────────────────────
   BOTANICAL HOME PAGE
───────────────────────────────────────────── */
const Home = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  /* ---------- Firefly canvas animation ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fireflies = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: 80 + Math.random() * window.innerHeight * 0.62,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
      r: 1.5 + Math.random() * 1.2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.011;

      fireflies.forEach((f) => {
        f.x += f.vx + Math.sin(t + f.phase) * 0.28;
        f.y += f.vy + Math.cos(t * 0.65 + f.phase) * 0.22;
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 60) f.y = canvas.height * 0.65;
        if (f.y > canvas.height * 0.8) f.y = 90;

        const glow = 0.35 + 0.65 * Math.sin(t * 1.4 + f.phase * 2);
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
        grad.addColorStop(0, `rgba(5,200,180,${glow * 0.9})`);
        grad.addColorStop(0.4, `rgba(5,180,160,${glow * 0.45})`);
        grad.addColorStop(1, 'rgba(5,124,133,0)');

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,255,248,${glow})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Inject Google Fonts once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .bn-root *, .bn-root *::before, .bn-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bn-root {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          font-family: 'DM Sans', sans-serif;
          background: #041318;
        }

        /* ── Sky ── */
        .bn-sky {
          position: fixed; inset: 0; z-index: 0;
          background: linear-gradient(175deg,
            #020d10 0%, #041c22 35%, #062a30 60%,
            #083340 80%, #0a3d3a 100%);
        }

        /* ── Stars ── */
        .bn-stars {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
        }
        .bn-star {
          position: absolute; border-radius: 50%;
          background: rgba(160,240,230,0.75);
          animation: bnTwinkle 3s ease-in-out infinite;
        }
        @keyframes bnTwinkle {
          0%,100%{ opacity:0.2; transform:scale(1); }
          50%    { opacity:1;   transform:scale(1.5); }
        }

        /* ── Firefly canvas ── */
        .bn-canvas {
          position: fixed; inset: 0; z-index: 15;
          pointer-events: none;
        }

        /* ── Mist ── */
        .bn-mist {
          position: fixed; left: -10%; width: 120%;
          border-radius: 50%; pointer-events: none; z-index: 4;
          animation: bnDrift 20s ease-in-out infinite alternate;
        }
        .bn-mist2 { animation-duration: 15s; animation-delay: -7s; }
        @keyframes bnDrift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(3%); }
        }

        /* ── Side vines ── */
        .bn-vine {
          position: fixed; bottom: 0; width: 110px;
          height: 68vh; z-index: 6; pointer-events: none;
        }
        .bn-vine-left  { left: 0; }
        .bn-vine-right { right: 0; transform: scaleX(-1); }

        .bn-vine-path {
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: bnDrawVine 3.5s 0.8s ease forwards;
        }
        @keyframes bnDrawVine { to { stroke-dashoffset: 0; } }

        .bn-leaf {
          transform-origin: 50% 100%;
          transform: scale(0);
          animation: bnLeafPop 0.4s ease forwards;
        }
        @keyframes bnLeafPop { to { transform: scale(1); } }

        /* ── Scene SVG ── */
        .bn-scene {
          position: fixed; bottom: 0; left: 0; right: 0;
          height: 78vh; z-index: 5; pointer-events: none;
        }

        /* ── Content ── */
        .bn-content {
          position: relative; z-index: 20;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          min-height: 100vh;
          padding: 5vh 20px 220px;
        }

        /* ── Logo pill ── */
        .bn-logo-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 22px; margin-bottom: 28px;
          border: 1px solid rgba(5,124,133,0.45);
          border-radius: 40px;
          background: rgba(5,35,40,0.6);
          backdrop-filter: blur(10px);
          animation: bnFadeUp 0.9s ease both;
        }
        .bn-logo-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #057c85;
          box-shadow: 0 0 8px 2px rgba(5,124,133,0.7);
          animation: bnPulse 2.5s ease-in-out infinite;
        }
        @keyframes bnPulse {
          0%,100%{ box-shadow: 0 0 6px 1px rgba(5,124,133,0.5); }
          50%    { box-shadow: 0 0 14px 4px rgba(5,124,133,0.9); }
        }
        .bn-logo-label {
          font-family: 'Playfair Display', serif;
          color: #5dcfc8; font-size: 14px;
          letter-spacing: 4px; text-transform: uppercase;
        }

        /* ── Headline ── */
        .bn-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6.5vw, 78px);
          font-weight: 700; text-align: center;
          line-height: 1.08; margin-bottom: 18px;
          color: #c8f0ec;
          animation: bnFadeUp 0.9s 0.15s ease both;
        }
        .bn-h1 em {
          font-style: italic; color: #057c85;
          -webkit-text-stroke: 1px rgba(5,180,190,0.4);
        }

        .bn-sub {
          font-size: clamp(13px, 1.8vw, 17px);
          color: rgba(140,220,215,0.6);
          text-align: center; max-width: 460px;
          line-height: 1.65; margin-bottom: 38px;
          font-weight: 300;
          animation: bnFadeUp 0.9s 0.3s ease both;
        }

        /* ── Buttons ── */
        .bn-btns {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center; margin-bottom: 56px;
          animation: bnFadeUp 0.9s 0.45s ease both;
        }
        .bn-btn-primary {
          padding: 13px 30px;
          background: #057c85;
          color: #d0f5f2; border: none; border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 4px 18px rgba(5,124,133,0.45);
        }
        .bn-btn-primary:hover { background: #069aaa; transform: translateY(-2px); }

        .bn-btn-secondary {
          padding: 13px 30px;
          background: transparent; color: #5dcfc8;
          border: 1.5px solid rgba(5,124,133,0.5);
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400; cursor: pointer;
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
          backdrop-filter: blur(6px);
        }
        .bn-btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(5,90,100,0.25);
          border-color: rgba(5,160,175,0.7);
        }

        /* ── Feature cards ── */
        .bn-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px; max-width: 780px; width: 100%;
          animation: bnFadeUp 0.9s 0.6s ease both;
        }
        .bn-card {
          background: rgba(4,28,34,0.65);
          border: 1px solid rgba(5,124,133,0.18);
          border-radius: 16px; padding: 20px 16px;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: transform 0.3s, border-color 0.3s, background 0.3s;
          cursor: default;
        }
        .bn-card:hover {
          transform: translateY(-5px);
          border-color: rgba(5,180,195,0.4);
          background: rgba(5,40,48,0.8);
        }
        .bn-card-icon {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(5,124,133,0.2);
          border: 1px solid rgba(5,124,133,0.35);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-size: 16px;
          animation: bnFloat 4s ease-in-out infinite;
        }
        .bn-card:nth-child(2) .bn-card-icon { animation-delay: -1s; }
        .bn-card:nth-child(3) .bn-card-icon { animation-delay: -2s; }
        .bn-card:nth-child(4) .bn-card-icon { animation-delay: -3s; }
        @keyframes bnFloat {
          0%,100%{ transform: translateY(0); }
          50%    { transform: translateY(-4px); }
        }
        .bn-card h3 {
          font-family: 'Playfair Display', serif;
          color: #9ee8e2; font-size: 15px; font-weight: 700;
          margin-bottom: 5px;
        }
        .bn-card p {
          color: rgba(100,200,195,0.55);
          font-size: 12px; line-height: 1.5; font-weight: 300;
        }

        @keyframes bnFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .bn-vine { display: none; }
          .bn-cards { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="bn-root">
        {/* Sky */}
        <div className="bn-sky" />

        {/* Stars — rendered via JS in useEffect side-effect below */}
        <StarField />

        {/* Firefly canvas */}
        <canvas ref={canvasRef} className="bn-canvas" />

        {/* Mist */}
        <div
          className="bn-mist"
          style={{
            bottom: '20%', height: 70,
            background: 'radial-gradient(ellipse,rgba(5,124,133,0.07) 0%,transparent 70%)',
          }}
        />
        <div
          className="bn-mist bn-mist2"
          style={{
            bottom: '12%', height: 50,
            background: 'radial-gradient(ellipse,rgba(5,100,110,0.05) 0%,transparent 70%)',
          }}
        />

        {/* Botanical SVG scene */}
        <BotanicalScene />

        {/* Side vines */}
        <VineSide side="left" />
        <VineSide side="right" />

        {/* ── Main content ── */}
        <div className="bn-content">
          <div className="bn-logo-pill">
            <div className="bn-logo-dot" />
            <span className="bn-logo-label">BookNest</span>
          </div>

          <h1 className="bn-h1">
            Where Stories<br /><em>Grow Wild</em>
          </h1>

          <p className="bn-sub">
            Buy, sell, rent & exchange books —<br />
            rooted in community, alive with discovery.
          </p>

          <div className="bn-btns">
            <button
              className="bn-btn-primary"
              onClick={() => (window.location.href = '/books')}
            >
              Browse Books
            </button>
            {user && (
              <button
                className="bn-btn-secondary"
                onClick={() => (window.location.href = '/add-book')}
              >
                + Post a Book
              </button>
            )}
          </div>

          <div className="bn-cards">
            {[
              { icon: '🛒', title: 'Buy Books',     desc: 'Find affordable reads from nearby sellers' },
              { icon: '📅', title: 'Rent Books',    desc: 'Borrow for days at minimal cost' },
              { icon: '🔄', title: 'Exchange',      desc: 'Swap books with fellow readers' },
              { icon: '🏆', title: 'Earn Points',   desc: 'Rewarded for every transaction' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bn-card">
                <div className="bn-card-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS (co-located, no extra files)
───────────────────────────────────────────── */

/** Randomly placed twinkling stars */
const StarField = () => {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.2 + 0.7,
    top: Math.random() * 52,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    dur: 2 + Math.random() * 4,
  }));

  return (
    <div className="bn-stars">
      {stars.map((s) => (
        <div
          key={s.id}
          className="bn-star"
          style={{
            width: s.size,
            height: s.size,
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
};

/** Full botanical SVG landscape */
const BotanicalScene = () => (
  <svg
    className="bn-scene"
    viewBox="0 0 1440 620"
    preserveAspectRatio="xMidYMax meet"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bnGnd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#062830" />
        <stop offset="100%" stopColor="#020d10" />
      </linearGradient>
      <linearGradient id="bnWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#04404a" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#020d10" />
      </linearGradient>
      <radialGradient id="bnTealGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#057c85" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#057c85" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bnGreenGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#1a7a20" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#1a7a20" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ground */}
    <rect x="0" y="440" width="1440" height="180" fill="url(#bnGnd)" />

    {/* Water pool */}
    <ellipse cx="720" cy="568" rx="360" ry="38" fill="url(#bnWater)" opacity="0.85" />
    <ellipse cx="720" cy="562" rx="280" ry="20" fill="#05303a" opacity="0.6" />
    <ellipse cx="680" cy="562" rx="60" ry="6" fill="none" stroke="rgba(5,180,190,0.18)" strokeWidth="1">
      <animate attributeName="rx" values="60;80;60" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.18;0.05;0.18" dur="5s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="760" cy="566" rx="40" ry="4" fill="none" stroke="rgba(5,160,175,0.15)" strokeWidth="0.8">
      <animate attributeName="rx" values="40;55;40" dur="7s" begin="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.15;0.04;0.15" dur="7s" begin="2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="720" cy="558" rx="200" ry="12" fill="rgba(5,124,133,0.08)">
      <animate attributeName="opacity" values="0.08;0.18;0.08" dur="6s" repeatCount="indefinite" />
    </ellipse>

    {/* Left mangrove */}
    <path d="M155 620 C152 575 148 530 155 480 C162 430 170 390 178 350" stroke="#0a4a30" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M153 520 C136 555 126 588 122 620" stroke="#083d28" strokeWidth="7"   fill="none" strokeLinecap="round" opacity="0.85" />
    <path d="M156 498 C140 528 130 562 128 620" stroke="#0a4535" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.75" />
    <path d="M158 540 C178 566 188 592 184 620" stroke="#083d28" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.8"  />
    <path d="M160 510 C192 538 204 568 198 620" stroke="#072e20" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.65" />
    <path d="M155 560 C134 580 120 604 116 620" stroke="#083520" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.6"  />
    <path d="M178 350 C195 318 228 298 262 282" stroke="#0d5a38" strokeWidth="14"  fill="none" strokeLinecap="round" />
    <path d="M178 350 C165 318 152 295 140 278" stroke="#0d5a38" strokeWidth="12"  fill="none" strokeLinecap="round" />
    <path d="M180 368 C208 356 242 350 274 346" stroke="#0d5a38" strokeWidth="11"  fill="none" strokeLinecap="round" />
    <ellipse cx="248" cy="262" rx="80" ry="58" fill="#0d5c2e" opacity="0.92" />
    <ellipse cx="248" cy="250" rx="64" ry="46" fill="#115e30" opacity="0.85" />
    <ellipse cx="222" cy="268" rx="54" ry="42" fill="#0e6030" opacity="0.82" />
    <ellipse cx="252" cy="245" rx="38" ry="26" fill="#0a5c50" opacity="0.5"  />
    <ellipse cx="140" cy="260" rx="64" ry="48" fill="#0c5828" opacity="0.88" />
    <ellipse cx="140" cy="248" rx="50" ry="38" fill="#105c2c" opacity="0.8"  />
    <ellipse cx="274" cy="330" rx="58" ry="40" fill="#0d5a2c" opacity="0.82" />
    <ellipse cx="278" cy="322" rx="44" ry="32" fill="#116030" opacity="0.75" />
    <ellipse cx="236" cy="234" rx="24" ry="14" fill="#057c85" opacity="0.18" />
    <ellipse cx="142" cy="238" rx="20" ry="12" fill="#057c85" opacity="0.14" />
    <path d="M215 305 C213 325 215 345 212 365" stroke="#0a4a20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"  />
    <path d="M255 310 C257 330 254 350 256 370" stroke="#0a4a20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45" />

    {/* Right mangrove */}
    <path d="M1285 620 C1288 575 1292 530 1285 480 C1278 430 1270 390 1262 350" stroke="#0a4a30" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M1287 520 C1304 555 1314 588 1318 620" stroke="#083d28" strokeWidth="7"   fill="none" strokeLinecap="round" opacity="0.85" />
    <path d="M1284 498 C1300 528 1310 562 1312 620" stroke="#0a4535" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.75" />
    <path d="M1282 540 C1262 566 1252 592 1256 620" stroke="#083d28" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.8"  />
    <path d="M1280 510 C1248 538 1236 568 1242 620" stroke="#072e20" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.65" />
    <path d="M1285 560 C1306 580 1320 604 1324 620" stroke="#083520" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.6"  />
    <path d="M1262 350 C1245 318 1212 298 1178 282" stroke="#0d5a38" strokeWidth="14"  fill="none" strokeLinecap="round" />
    <path d="M1262 350 C1275 318 1288 295 1300 278" stroke="#0d5a38" strokeWidth="12"  fill="none" strokeLinecap="round" />
    <path d="M1260 368 C1232 356 1198 350 1166 346" stroke="#0d5a38" strokeWidth="11"  fill="none" strokeLinecap="round" />
    <ellipse cx="1192" cy="262" rx="80" ry="58" fill="#0d5c2e" opacity="0.92" />
    <ellipse cx="1192" cy="250" rx="64" ry="46" fill="#115e30" opacity="0.85" />
    <ellipse cx="1218" cy="268" rx="54" ry="42" fill="#0e6030" opacity="0.82" />
    <ellipse cx="1188" cy="245" rx="38" ry="26" fill="#0a5c50" opacity="0.5"  />
    <ellipse cx="1300" cy="260" rx="64" ry="48" fill="#0c5828" opacity="0.88" />
    <ellipse cx="1300" cy="248" rx="50" ry="38" fill="#105c2c" opacity="0.8"  />
    <ellipse cx="1166" cy="330" rx="58" ry="40" fill="#0d5a2c" opacity="0.82" />
    <ellipse cx="1162" cy="322" rx="44" ry="32" fill="#116030" opacity="0.75" />
    <ellipse cx="1204" cy="234" rx="24" ry="14" fill="#057c85" opacity="0.18" />
    <ellipse cx="1298" cy="238" rx="20" ry="12" fill="#057c85" opacity="0.14" />

    {/* Mid trees — left */}
    <path d="M440 620 C438 590 436 555 440 518 C444 482 448 452 452 422" stroke="#0c4828" strokeWidth="13" fill="none" strokeLinecap="round" />
    <path d="M452 422 C462 396 478 376 494 360" stroke="#0f5830" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M452 435 C436 408 420 390 406 372" stroke="#0f5830" strokeWidth="9"  fill="none" strokeLinecap="round" />
    <ellipse cx="492" cy="342" rx="60" ry="46" fill="#0e6030" opacity="0.9"  />
    <ellipse cx="492" cy="330" rx="48" ry="36" fill="#126834" opacity="0.82" />
    <ellipse cx="490" cy="324" rx="28" ry="18" fill="#0a5c50" opacity="0.4"  />
    <ellipse cx="406" cy="355" rx="54" ry="44" fill="#0d5c2c" opacity="0.88" />
    <ellipse cx="404" cy="344" rx="42" ry="34" fill="#126030" opacity="0.78" />

    {/* Mid trees — right */}
    <path d="M1000 620 C1002 590 1004 555 1000 518 C996 482 992 452 988 422" stroke="#0c4828" strokeWidth="13" fill="none" strokeLinecap="round" />
    <path d="M988 422 C978 396 962 376 946 360"   stroke="#0f5830" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M988 435 C1004 408 1020 390 1034 372" stroke="#0f5830" strokeWidth="9"  fill="none" strokeLinecap="round" />
    <ellipse cx="948"  cy="342" rx="60" ry="46" fill="#0e6030" opacity="0.9"  />
    <ellipse cx="948"  cy="330" rx="48" ry="36" fill="#126834" opacity="0.82" />
    <ellipse cx="948"  cy="324" rx="28" ry="18" fill="#0a5c50" opacity="0.4"  />
    <ellipse cx="1034" cy="355" rx="54" ry="44" fill="#0d5c2c" opacity="0.88" />
    <ellipse cx="1036" cy="344" rx="42" ry="34" fill="#126030" opacity="0.78" />

    {/* Background haze trees */}
    <ellipse cx="340"  cy="420" rx="58" ry="40" fill="#083a22" opacity="0.48" />
    <ellipse cx="520"  cy="430" rx="46" ry="32" fill="#073522" opacity="0.42" />
    <ellipse cx="920"  cy="428" rx="52" ry="36" fill="#083a22" opacity="0.45" />
    <ellipse cx="1100" cy="432" rx="48" ry="32" fill="#073522" opacity="0.42" />
    <ellipse cx="620"  cy="445" rx="36" ry="26" fill="#072e1a" opacity="0.38" />
    <ellipse cx="820"  cy="448" rx="36" ry="26" fill="#072e1a" opacity="0.38" />

    {/* Grass — left */}
    {[
      { x1:50,  x2:57,  c:'#1a7a38', w:3,   d:'-1s' },
      { x1:68,  x2:77,  c:'#057c85', w:2.5, d:'-2s' },
      { x1:84,  x2:82,  c:'#1a7a38', w:2.5, d:'-3s' },
      { x1:98,  x2:106, c:'#0a6a48', w:2,   d:'-4s' },
    ].map(({ x1, x2, c, w, d }, i) => (
      <path key={i} d={`M${x1} 620 C${x1+3} 596 ${x1-1} 568 ${x2} 542`}
        stroke={c} strokeWidth={w} fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values={`0 ${x1} 620;2 ${x1} 620;-1.5 ${x1} 620;0 ${x1} 620`}
          dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
      </path>
    ))}

    {/* Grass — centre */}
    {[658,674,690,748,764].map((x, i) => (
      <path key={x} d={`M${x} 620 C${x+3} 596 ${x-1} 566 ${x+8} 540`}
        stroke={i % 2 === 1 ? '#057c85' : '#1a7a38'}
        strokeWidth={i < 3 ? 2.5 : 2} fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values={`0 ${x} 620;${i%2===0?2:-2} ${x} 620;${i%2===0?-1.5:1.5} ${x} 620;0 ${x} 620`}
          dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite" />
      </path>
    ))}

    {/* Grass — right */}
    {[1342,1358,1374,1390].map((x, i) => (
      <path key={x} d={`M${x} 620 C${x+2} 598 ${x-2} 568 ${x+6} 542`}
        stroke={i % 2 === 1 ? '#057c85' : '#1a7a38'}
        strokeWidth={i === 0 ? 3 : 2.5} fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values={`0 ${x} 620;${i%2===0?-2:2} ${x} 620;${i%2===0?1.5:-1.5} ${x} 620;0 ${x} 620`}
          dur={`${3.8 + i * 0.4}s`} repeatCount="indefinite" />
      </path>
    ))}

    {/* Ferns — left */}
    <path d="M330 600 C318 580 304 566 293 554" stroke="#126840" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M330 600 C326 580 323 560 319 542" stroke="#057c85" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.7" />
    <path d="M330 600 C342 580 350 566 355 550" stroke="#126840" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <ellipse cx="290" cy="550" rx="13" ry="7" fill="#0f6038" opacity="0.75" transform="rotate(-35 290 550)" />
    <ellipse cx="317" cy="538" rx="12" ry="6" fill="#057c85" opacity="0.5"  transform="rotate(-65 317 538)" />
    <ellipse cx="356" cy="546" rx="13" ry="6" fill="#0f6038" opacity="0.72" transform="rotate(28 356 546)"  />

    {/* Ferns — right */}
    <path d="M1110 600 C1122 580 1136 566 1147 554" stroke="#126840" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M1110 600 C1114 580 1117 560 1121 542" stroke="#057c85" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.7" />
    <path d="M1110 600 C1098 580 1090 566 1085 550" stroke="#126840" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <ellipse cx="1150" cy="550" rx="13" ry="7" fill="#0f6038" opacity="0.75" transform="rotate(35 1150 550)"  />
    <ellipse cx="1123" cy="538" rx="12" ry="6" fill="#057c85" opacity="0.5"  transform="rotate(65 1123 538)"  />
    <ellipse cx="1083" cy="546" rx="13" ry="6" fill="#0f6038" opacity="0.72" transform="rotate(-28 1083 546)" />

    {/* Floating spores */}
    {[
      { cx:360,  cy:360, r:2.5, c:'rgba(5,180,190,0.35)',  dur:'7s',  begin:'0s' },
      { cx:720,  cy:305, r:2,   c:'rgba(5,160,175,0.3)',   dur:'9s',  begin:'0s' },
      { cx:1080, cy:345, r:2.5, c:'rgba(5,180,190,0.3)',   dur:'8s',  begin:'2s' },
      { cx:510,  cy:395, r:1.8, c:'rgba(30,160,120,0.3)',  dur:'6s',  begin:'1s' },
      { cx:930,  cy:378, r:1.8, c:'rgba(5,160,175,0.28)',  dur:'10s', begin:'3s' },
    ].map(({ cx, cy, r, c, dur, begin }) => (
      <circle key={cx} cx={cx} cy={cy} r={r} fill={c}>
        <animate attributeName="cy" values={`${cy};${cy - 32};${cy}`} dur={dur} begin={begin} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur={dur} begin={begin} repeatCount="indefinite" />
      </circle>
    ))}

    {/* Glow pools */}
    <ellipse cx="720" cy="448" rx="380" ry="42" fill="url(#bnTealGlow)"  opacity="0.7" />
    <ellipse cx="720" cy="448" rx="200" ry="22" fill="url(#bnGreenGlow)" opacity="0.6" />
  </svg>
);

/** Animated growing vine on left or right side */
const VineSide = ({ side }) => (
  <svg
    className={`bn-vine bn-vine-${side}`}
    viewBox="0 0 110 480"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M18 480 C22 432 14 386 20 338 C26 290 16 244 22 196 C28 148 18 102 22 54"
      stroke="#0a5840" strokeWidth="2.5" fill="none" strokeLinecap="round"
      className="bn-vine-path"
      style={side === 'right' ? { animationDelay: '0.6s' } : undefined}
    />
    {[
      { cx:28, cy:408, rx:18, ry:9,   color:'#0e5c30', op:0.85, rot:-42, delay:'2.2s' },
      { cx:12, cy:345, rx:16, ry:8,   color:'#057c85', op:0.55, rot:32,  delay:'2.7s' },
      { cx:28, cy:282, rx:17, ry:8.5, color:'#0e5c30', op:0.82, rot:-48, delay:'3.2s' },
      { cx:12, cy:218, rx:15, ry:7.5, color:'#057c85', op:0.5,  rot:28,  delay:'3.7s' },
      { cx:26, cy:155, rx:16, ry:8,   color:'#0e5c30', op:0.8,  rot:-38, delay:'4.2s' },
      { cx:11, cy:92,  rx:14, ry:7,   color:'#057c85', op:0.48, rot:42,  delay:'4.7s' },
    ].map(({ cx, cy, rx, ry, color, op, rot, delay }) => (
      <ellipse
        key={cy}
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill={color} opacity={op}
        transform={`rotate(${rot} ${cx} ${cy})`}
        className="bn-leaf"
        style={{ animationDelay: delay }}
      />
    ))}
  </svg>
);

/* ─────────────────────────────────────────────
   APP — ROUTER
───────────────────────────────────────────── */
const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={!user ? <Login />    : <Navigate to="/" />} />
        <Route path="/register"  element={!user ? <Register /> : <Navigate to="/" />} />

        <Route path="/books"     element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />

        <Route path="/checkout/:id"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders"     element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/add-book"      element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/track/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

        <Route path="/exchange/:bookId" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
        <Route path="/my-exchanges"     element={<ProtectedRoute><MyExchanges /></ProtectedRoute>} />
        <Route path="/my-books"         element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
        <Route path="/edit-book/:id"    element={<ProtectedRoute><EditBook /></ProtectedRoute>} />

        <Route path="/clubs"     element={<BookClubs />} />
        <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetail /></ProtectedRoute>} />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
