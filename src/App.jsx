import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to <span>BookNest</span> 📚</h1>
        <p>Buy, Sell, Rent & Exchange books with people around you!</p>
        <div className="home-buttons">
          <button onClick={() => window.location.href = '/books'}
            className="hero-btn-primary">
            Browse Books
          </button>
          {user && (
            <button onClick={() => window.location.href = '/add-book'}
              className="hero-btn-secondary">
              + Post a Book
            </button>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <span>🛒</span>
          <h3>Buy Books</h3>
          <p>Find affordable books from sellers near you</p>
        </div>
        <div className="feature-card">
          <span>📅</span>
          <h3>Rent Books</h3>
          <p>Rent books for a few days at low cost</p>
        </div>
        <div className="feature-card">
          <span>🔄</span>
          <h3>Exchange Books</h3>
          <p>Swap your books with other readers</p>
        </div>
        <div className="feature-card">
          <span>🏆</span>
          <h3>Earn Points</h3>
          <p>Get rewarded for every transaction</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/checkout/:id" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute><MyOrders /></ProtectedRoute>
        } />
        <Route path="/add-book" element={
          <ProtectedRoute><AddBook /></ProtectedRoute>
        } />
        <Route path="/track/:orderId" element={
          <ProtectedRoute><TrackOrder /></ProtectedRoute>
        } />
        <Route path="/exchange/:bookId" element={
    <ProtectedRoute><Exchange /></ProtectedRoute>
} />
<Route path="/my-exchanges" element={
    <ProtectedRoute><MyExchanges /></ProtectedRoute>
} />
<Route path="/my-books" element={
    <ProtectedRoute><MyBooks /></ProtectedRoute>
} />
<Route path="/edit-book/:id" element={
    <ProtectedRoute><EditBook /></ProtectedRoute>
} />
<Route path="/clubs" element={<BookClubs />} />
<Route path="/clubs/:id" element={
    <ProtectedRoute><ClubDetail /></ProtectedRoute>
} />
<Route path="/leaderboard" element={<Leaderboard />} />
<Route path="/admin" element={
    <ProtectedRoute><AdminDashboard /></ProtectedRoute>
} />
      </Routes>
    </>
  );
};

export default App;