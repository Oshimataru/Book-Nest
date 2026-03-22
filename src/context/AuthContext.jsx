// it holds the logged in user info so any page in your app can access it
//  without passing it around manually!

import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// This wraps your whole app and provides user data everywhere
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    // Called after successful login/register
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Called on logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Easy hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);