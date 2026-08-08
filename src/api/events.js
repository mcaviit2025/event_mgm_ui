// src/api/events.js
import api from './axios';

export const getEvents = () => {
    return api.get('/v1/admin/events');
};

export const createEvent = (data) => {
    return api.post('/v1/admin/events', data);
};

export const updateEvent = (id, data) => {
    return api.put(`/v1/admin/events/${id}`, data);
};

export const deleteEvent = (id) => {
    return api.delete(`/v1/admin/events/${id}`);
};

export const updateEventStatus = (id, status) => {
    return api.patch(`/v1/admin/events/${id}/status?status=${status}`);
};