import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    role: 'student' | 'teacher';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const studentLinks = [
        { to: '/student/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/student/submit', icon: <BookOpen size={20} />, label: 'Submit Assignment' },
        { to: '/student/results', icon: <BarChart2 size={20} />, label: 'My Results' },
    ];

    const teacherLinks = [
        { to: '/teacher/dashboard', icon: <LayoutDashboard size={20} />, label: 'Class Dashboard' },
        { to: '/teacher/student-analytics', icon: <Users size={20} />, label: 'Student Analytics' },
    ];

    const links = role === 'student' ? studentLinks : teacherLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">VeriLearn</div>
            </div>
            <div className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    >
                        {link.icon}
                        {link.label}
                    </NavLink>
                ))}
            </div>
            <div className="sidebar-nav" style={{ flex: 0, borderTop: '1px solid var(--border)' }}>
                <button onClick={handleLogout} className="nav-item text-danger">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
