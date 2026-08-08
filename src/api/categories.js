// src/api/categories.js
import api from './axios';

export const getCategories = () => {
    return api.get('/v1/admin/categories');
};