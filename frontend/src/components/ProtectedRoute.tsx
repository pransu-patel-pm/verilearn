import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
    children: ReactNode;
    role?: 'student' | 'teacher';
}

const ProtectedRoute = ({ children, role }: Props) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted)' }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
