// src/api/auth.js
import api from './axios';

export const login = (username, password) => {
    return api.post('/v1/auth/login', { username, password });
};