// src/pages/Public/GroupRegistration.jsx
import { useState } from 'react';
import { registerGroup } from '../../api/registrations';
import './GroupRegistration.css';

export default function GroupRegistration({ event, onClose, onSuccess }) {
    const [leader, setLeader] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        collegeName: '',
        course: ''
    });
    const [teamMembers, setTeamMembers] = useState([{
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        collegeName: '',
        course: ''
    }]);
    const [utrNo, setUtrNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLeaderChange = (e) => {
        const { name, value } = e.target;
        setLeader(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...teamMembers];
        updated[index][name] = value;
        setTeamMembers(updated);
    };

    const addMember = () => {
        if (teamMembers.length < event.maxParticipantsPerGroup - 1) {
            setTeamMembers([...teamMembers, {
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                dateOfBirth: '',
                collegeName: '',
                course: ''
            }]);
        }
    };

    const removeMember = (index) => {
        if (teamMembers.length > 1) {
            setTeamMembers(teamMembers.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await registerGroup({
                eventId: event.id,
                leader,
                teamMembers,
                utrNo
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Group Registration</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="event-info">
                    <h3>{event.eventName}</h3>
                    <p>{event.venue} • {new Date(event.eventDateTime).toLocaleString()}</p>
                    <p className="info-note">Max {event.maxParticipantsPerGroup} members per group</p>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    {error && <div className="form-error">{error}</div>}

                    <h4 className="section-title">Group Leader</h4>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={leader.firstName}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input
                                type="text"
                                name="middleName"
                                value={leader.middleName}
                                onChange={handleLeaderChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={leader.lastName}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={leader.email}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={leader.phoneNumber}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Birth *</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={leader.dateOfBirth}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>College *</label>
                            <input
                                type="text"
                                name="collegeName"
                                value={leader.collegeName}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Course *</label>
                            <input
                                type="text"
                                name="course"
                                value={leader.course}
                                onChange={handleLeaderChange}
                                required
                            />
                        </div>
                    </div>

                    <h4 className="section-title">Team Members</h4>

                    {teamMembers.map((member, index) => (
                        <div key={index} className="member-section">
                            <div className="member-header">
                                <span>Member {index + 1}</span>
                                {teamMembers.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeMember(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={member.firstName}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Middle Name</label>
                                    <input
                                        type="text"
                                        name="middleName"
                                        value={member.middleName}
                                        onChange={(e) => handleMemberChange(index, e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={member.lastName}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={member.email}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone *</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={member.phoneNumber}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={member.dateOfBirth}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>College *</label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        value={member.collegeName}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Course *</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={member.course}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {teamMembers.length < event.maxParticipantsPerGroup - 1 && (
                        <button type="button" className="add-member-btn" onClick={addMember}>
                            + Add Team Member
                        </button>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>UTR Number *</label>
                            <input
                                type="text"
                                value={utrNo}
                                onChange={(e) => setUtrNo(e.target.value)}
                                placeholder="10-20 alphanumeric"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Registering...' : 'Register Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}