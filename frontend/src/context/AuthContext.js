// --- File: frontend/src/context/AuthContext.js ---
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Helper to set auth token for axios
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To check initial auth status

    // Function to load user data based on token
    const loadUser = useCallback(async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            try {
                const res = await axios.get('http://localhost:3002/api/profile');
                setUser(res.data);
                setToken(localStorage.token); // Ensure token state is set
            } catch (err) {
                console.error("Auth Error:", err.response?.data?.msg || err.message);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setAuthToken(null); // Clear axios header
            }
        }
         setLoading(false); // Finished loading attempt
    }, []);

    // Load user on initial app load
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Login function (updates token and loads user)
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        loadUser(); // Load user info after setting token
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAuthToken(null); // Clear axios header
         window.location.href = '/login'; // Redirect to login
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {!loading && children} {/* Render children only after loading check */}
        </AuthContext.Provider>
    );
};