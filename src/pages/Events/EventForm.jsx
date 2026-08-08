// src/pages/Events/EventForm.jsx
import { useState, useEffect } from 'react';
import { createEvent, updateEvent } from '../../api/events';
import { getCategories } from '../../api/categories';
import { getEventTypes } from '../../api/eventTypes';
import './EventForm.css';

export default function EventForm({ onClose, onSave, editData }) {
    const [formData, setFormData] = useState({
        eventName: '',
        venue: '',
        eventDateTime: '',
        registrationDeadline: '',
        description: '',
        maxParticipants: '',
        maxParticipantsPerGroup: '',
        registrationMode: 'BOTH',
        status: 'DRAFT',
        eventTypeId: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isEditing = !!editData;

    useEffect(() => {
        loadOptions();
        if (editData) {
            loadEditData();
        }
    }, [editData]);

    const loadOptions = async () => {
        try {
            const [catRes, typeRes] = await Promise.all([
                getCategories(),
                getEventTypes()
            ]);
            setCategories(catRes.data.data || []);
            setEventTypes(typeRes.data.data || []);
        } catch (error) {
            console.error('Error loading options:', error);
        }
    };

    const loadEditData = () => {
        setFormData({
            eventName: editData.eventName || '',
            venue: editData.venue || '',
            eventDateTime: editData.eventDateTime ? editData.eventDateTime.slice(0, 16) : '',
            registrationDeadline: editData.registrationDeadline ? editData.registrationDeadline.slice(0, 16) : '',
            description: editData.description || '',
            maxParticipants: editData.maxParticipants || '',
            maxParticipantsPerGroup: editData.maxParticipantsPerGroup || '',
            registrationMode: editData.registrationMode || 'BOTH',
            status: editData.status || 'DRAFT',
            eventTypeId: editData.eventType?.id || '',
            categoryId: editData.category?.id || ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                maxParticipants: parseInt(formData.maxParticipants),
                maxParticipantsPerGroup: parseInt(formData.maxParticipantsPerGroup),
                eventTypeId: parseInt(formData.eventTypeId),
                categoryId: parseInt(formData.categoryId)
            };

            if (isEditing) {
                await updateEvent(editData.id, payload);
            } else {
                await createEvent(payload);
            }

            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Event' : 'Create Event'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Event Name *</label>
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Venue *</label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Event Date & Time *</label>
                            <input
                                type="datetime-local"
                                name="eventDateTime"
                                value={formData.eventDateTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Registration Deadline *</label>
                            <input
                                type="datetime-local"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Event Type *</label>
                            <select
                                name="eventTypeId"
                                value={formData.eventTypeId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Event Type</option>
                                {eventTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Registration Mode *</label>
                            <select
                                name="registrationMode"
                                value={formData.registrationMode}
                                onChange={handleChange}
                            >
                                <option value="SOLO_ONLY">Solo Only</option>
                                <option value="GROUP_ONLY">Group Only</option>
                                <option value="BOTH">Both</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Max Participants *</label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Per Group *</label>
                            <input
                                type="number"
                                name="maxParticipantsPerGroup"
                                value={formData.maxParticipantsPerGroup}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}