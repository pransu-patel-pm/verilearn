import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGetMe } from '../api/client';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('verilearn_token');
        const storedUser = localStorage.getItem('verilearn_user');

        if (stored && storedUser) {
            setToken(stored);
            setUser(JSON.parse(storedUser));

            // Validate token with backend
            apiGetMe()
                .then((u) => {
                    setUser(u as AuthUser);
                    localStorage.setItem('verilearn_user', JSON.stringify(u));
                })
                .catch(() => {
                    // Token expired or invalid
                    localStorage.removeItem('verilearn_token');
                    localStorage.removeItem('verilearn_user');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: AuthUser) => {
        localStorage.setItem('verilearn_token', newToken);
        localStorage.setItem('verilearn_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('verilearn_token');
        localStorage.removeItem('verilearn_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
