// src/api/eventTypes.js
import api from './axios';

export const getEventTypes = () => {
    return api.get('/v1/admin/event-types');
};