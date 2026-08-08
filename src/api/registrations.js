// src/api/registrations.js
import api from './axios';

export const registerSolo = (data) => {
    return api.post('/v1/registrations/solo', data);
};

export const registerGroup = (data) => {
    return api.post('/v1/registrations/group', data);
};