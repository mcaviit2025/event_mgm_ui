// src/pages/Public/PublicEvents.jsx
import { useState, useEffect } from 'react';
import { getEvents } from '../../api/events';
import SoloRegistration from './SoloRegistration';
import GroupRegistration from './GroupRegistration';
import './PublicEvents.css';

export default function PublicEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showSoloForm, setShowSoloForm] = useState(false);
    const [showGroupForm, setShowGroupForm] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const res = await getEvents();
            const openEvents = res.data.data?.filter(e => e.status === 'OPEN') || [];
            setEvents(openEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        }
        setLoading(false);
    };

    const handleRegister = (event, type) => {
        setSelectedEvent(event);
        if (type === 'solo') {
            setShowSoloForm(true);
        } else {
            setShowGroupForm(true);
        }
    };

    if (loading) return <div className="public-loading">Loading events...</div>;

    return (
        <div className="public-container">
            <div className="public-header">
                <h1>Available Events</h1>
                <p>Register for upcoming events</p>
            </div>

            <div className="event-grid">
                {events.length === 0 ? (
                    <div className="no-events">No open events available</div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3 className="event-title">{event.eventName}</h3>
                            <p className="event-desc">{event.description}</p>
                            <div className="event-details">
                                <span>📍 {event.venue}</span>
                                <span>📅 {new Date(event.eventDateTime).toLocaleString()}</span>
                                <span>👥 {event.maxParticipants} spots</span>
                            </div>
                            <div className="event-meta">
                                <span className="mode">{event.registrationMode}</span>
                                {event.registrationMode !== 'GROUP_ONLY' && (
                                    <button
                                        className="register-btn solo"
                                        onClick={() => handleRegister(event, 'solo')}
                                    >
                                        Register Solo
                                    </button>
                                )}
                                {event.registrationMode !== 'SOLO_ONLY' && (
                                    <button
                                        className="register-btn group"
                                        onClick={() => handleRegister(event, 'group')}
                                    >
                                        Register Group
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showSoloForm && selectedEvent && (
                <SoloRegistration
                    event={selectedEvent}
                    onClose={() => setShowSoloForm(false)}
                    onSuccess={() => {
                        setShowSoloForm(false);
                        alert('Registration successful!');
                    }}
                />
            )}

            {showGroupForm && selectedEvent && (
                <GroupRegistration
                    event={selectedEvent}
                    onClose={() => setShowGroupForm(false)}
                    onSuccess={() => {
                        setShowGroupForm(false);
                        alert('Registration successful!');
                    }}
                />
            )}
        </div>
    );
}