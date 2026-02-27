import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Users, LogOut } from 'lucide-react';

interface SidebarProps {
    role: 'student' | 'teacher';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
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
                <NavLink to="/login" className="nav-item text-danger">
                    <LogOut size={20} />
                    Logout
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
