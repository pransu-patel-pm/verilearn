import React from 'react';
import { Bell, User } from 'lucide-react';

interface TopNavbarProps {
    role: 'student' | 'teacher';
}

const TopNavbar: React.FC<TopNavbarProps> = ({ role }) => {
    return (
        <div className="top-navbar">
            <div className="flex items-center gap-4">
                <button className="nav-item" style={{ padding: '8px', color: 'var(--muted)' }}>
                    <Bell size={20} />
                </button>
                <div className="profile-menu">
                    <div className="avatar">
                        {role === 'student' ? 'S' : 'T'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{role === 'student' ? 'Alex Student' : 'Prof. Teacher'}</span>
                        <span className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>{role} Profile</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNavbar;
