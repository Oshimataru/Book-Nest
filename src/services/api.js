import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api'
});
```

Then make sure your Vercel project has the environment variable set. Go to Vercel → **Settings → Environment Variables** and confirm:
```
VITE_API_BASE_URL = https://booknest-backend-production-a8ed.up.railway.app

// Automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

export default API;

// Book APIs
export const addBook = (formData) => API.post('/books/add', formData);
export const getAllBooks = () => API.get('/books');
export const getBookById = (id) => API.get(`/books/${id}`);
export const getMyBooks = () => API.get('/books/my-books');
export const searchBooks = (keyword) => API.get(`/books/search?keyword=${keyword}`);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const updateBook = (id, formData) => API.put(`/books/${id}`, formData);


// Order APIs
export const placeOrder = (bookId, type, address) =>
    API.post(`/orders/place?bookId=${bookId}&type=${type}&address=${address}`);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getSellerOrders = () => API.get('/orders/seller-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
    API.put(`/orders/${id}/status?status=${status}`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);

// Payment APIs
export const createPaymentOrder = (amount) =>
    API.post(`/payment/create-order?amount=${amount}`);
export const verifyPayment = (orderId, paymentId, signature) =>
    API.post(`/payment/verify?orderId=${orderId}&paymentId=${paymentId}&signature=${signature}`);

// Delivery APIs
export const getDelivery = (orderId) => API.get(`/delivery/${orderId}`);
export const createDelivery = (orderId) => API.post(`/delivery/create/${orderId}`);
export const updateDelivery = (orderId, location, lat, lng, status, message) =>
    API.put(`/delivery/update/${orderId}?location=${location}&lat=${lat}&lng=${lng}&status=${status}&message=${message}`);

// Exchange APIs
export const sendExchangeRequest = (requestedBookId, offeredBookId, message) =>
    API.post(`/exchange/request?requestedBookId=${requestedBookId}&offeredBookId=${offeredBookId}&message=${message}`);
export const getSentRequests = () => API.get('/exchange/sent');
export const getReceivedRequests = () => API.get('/exchange/received');
export const acceptExchange = (id) => API.put(`/exchange/${id}/accept`);
export const rejectExchange = (id) => API.put(`/exchange/${id}/reject`);

// Review APIs
export const addReview = (bookId, rating, comment) =>
    API.post(`/reviews/add?bookId=${bookId}&rating=${rating}&comment=${comment}`);
export const getBookReviews = (bookId) => API.get(`/reviews/book/${bookId}`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Book Club APIs
export const createClub = (name, description, currentBook) =>
    API.post(`/clubs/create?name=${name}&description=${description}&currentBook=${currentBook}`);
export const getAllClubs = () => API.get('/clubs');
export const getClubById = (id) => API.get(`/clubs/${id}`);
export const joinClub = (id) => API.post(`/clubs/${id}/join`);
export const leaveClub = (id) => API.post(`/clubs/${id}/leave`);
export const postDiscussion = (id, message) =>
    API.post(`/clubs/${id}/discussion?message=${message}`);
export const getDiscussions = (id) => API.get(`/clubs/${id}/discussions`);

// Gamification APIs
export const getGamificationProfile = () => API.get('/gamification/profile');
export const getLeaderboard = () => API.get('/gamification/leaderboard');

// Admin APIs
export const getAdminAnalytics = () => API.get('/admin/analytics');
export const getAdminUsers = () => API.get('/admin/users');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminBooks = () => API.get('/admin/books');
export const deleteAdminBook = (id) => API.delete(`/admin/books/${id}`);
export const getAdminOrders = () => API.get('/admin/orders');