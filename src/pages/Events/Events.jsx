// src/pages/Events/Events.jsx
import { useState, useEffect } from 'react';
import { getEvents, deleteEvent, updateEventStatus } from '../../api/events';
import EventForm from './EventForm';
import './Events.css';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const res = await getEvents();
            setEvents(res.data.data || []);
        } catch (error) {
            console.error('Error loading events:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
                await loadEvents();
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateEventStatus(id, status);
            await loadEvents();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>Events</h1>
                <button className="add-btn" onClick={() => {
                    setEditingEvent(null);
                    setShowForm(true);
                }}>
                    + Create Event
                </button>
            </div>

            <div className="table-wrapper">
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Venue</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Registration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty">No events found</td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td className="event-name">{event.eventName}</td>
                                    <td>{event.venue}</td>
                                    <td>{new Date(event.eventDateTime).toLocaleString()}</td>
                                    <td>
                                        <span className={`status ${event.status?.toLowerCase() || 'draft'}`}>
                                            {event.status || 'DRAFT'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="mode">{event.registrationMode || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <select
                                                className="status-select"
                                                value={event.status || 'DRAFT'}
                                                onChange={(e) => handleStatusChange(event.id, e.target.value)}
                                            >
                                                <option value="DRAFT">Draft</option>
                                                <option value="OPEN">Open</option>
                                                <option value="CLOSED">Closed</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setEditingEvent(event);
                                                    setShowForm(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <EventForm
                    onClose={() => setShowForm(false)}
                    onSave={loadEvents}
                    editData={editingEvent}
                />
            )}
        </div>
    );
}