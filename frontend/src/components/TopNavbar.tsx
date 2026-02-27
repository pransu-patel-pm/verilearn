import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopNavbarProps {
    role: 'student' | 'teacher';
}

const TopNavbar: React.FC<TopNavbarProps> = ({ role }) => {
    const { user } = useAuth();

    const initials = user
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : role === 'student' ? 'S' : 'T';

    return (
        <div className="top-navbar">
            <div className="flex items-center gap-4">
                <button className="nav-item" style={{ padding: '8px', color: 'var(--muted)' }}>
                    <Bell size={20} />
                </button>
                <div className="profile-menu">
                    <div className="avatar">{initials}</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {user?.name || (role === 'student' ? 'Student' : 'Teacher')}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>
                            {role} Profile
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNavbar;
