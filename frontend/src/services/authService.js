import api from './api';

// Auth API calls
export const register = (userData) => {
    return api.post('/api/auth/signup', userData);
};

export const login = (credentials) => {
    return api.post('/api/auth/login', credentials);
};

export const forgotPassword = (email) => {
    return api.post('/api/auth/forgot-password', { email });
};

export const resetPassword = (token, password) => {
    return api.post(`/api/auth/reset-password/${token}`, { password });
};

// Profile API calls
export const getProfile = () => {
    return api.get('/api/profile');
};

export const updateProfile = (data) => {
    return api.put('/api/profile', data);
};

export const updatePassword = (data) => {
    return api.put('/api/profile/password', data);
};

export const uploadAvatar = (formData) => {
    return api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Admin API calls
export const getUsers = () => {
    return api.get('/api/users');
};

export const deleteUser = (userId) => {
    return api.delete(`/api/users/${userId}`);
};

// Export other API functions as needed