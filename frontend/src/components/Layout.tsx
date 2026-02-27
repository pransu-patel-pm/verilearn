import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface LayoutProps {
    role: 'student' | 'teacher';
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
    return (
        <div className="app-container">
            <Sidebar role={role} />
            <div className="main-content">
                <TopNavbar role={role} />
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
