// src/components/Layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Layout.css';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-left">
                    <h1>Event Management</h1>
                </div>
                <div className="header-right">
                    <span>{user?.fullName || 'Admin'}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="layout-body">
                <nav className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/admin/events')}>Events</li>
                    </ul>
                </nav>
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}