import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiLogin, apiRegister } from '../api/client';

const Login: React.FC = () => {
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (isRegister) {
                if (!name.trim()) {
                    setError('Name is required.');
                    setLoading(false);
                    return;
                }
                res = await apiRegister(name, email, password, role);
            } else {
                res = await apiLogin(email, password);
            }

            login(res.access_token, res.user);
            navigate(`/${res.user.role}/dashboard`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setError('');
        setLoading(true);

        const demoEmail = role === 'student' ? 'demo.student@verilearn.app' : 'demo.teacher@verilearn.app';
        const demoName = role === 'student' ? 'Alex Student' : 'Prof. Smith';
        const demoPassword = 'demo123456';

        try {
            // Try login first
            let res;
            try {
                res = await apiLogin(demoEmail, demoPassword);
            } catch {
                // If login fails, register the demo user
                res = await apiRegister(demoName, demoEmail, demoPassword, role);
            }

            login(res.access_token, res.user);
            navigate(`/${res.user.role}/dashboard`);
        } catch (err: any) {
            setError(err.message || 'Demo login failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <div className="text-center mb-6">
                    <BookOpen className="text-primary mb-2" size={48} style={{ margin: '0 auto' }} />
                    <h1 style={{ fontSize: '28px', color: 'var(--foreground)' }}>VeriLearn</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                        Measure Understanding. Not Just Output.
                    </p>
                </div>

                {error && (
                    <div
                        className="mb-4 text-sm"
                        style={{
                            padding: '10px 14px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="input-field"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group mb-6">
                        <div className="toggle-group">
                            <button
                                type="button"
                                className={`toggle-btn ${role === 'student' ? 'active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${role === 'teacher' ? 'active' : ''}`}
                                onClick={() => setRole('teacher')}
                            >
                                Teacher
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mb-3"
                        style={{ fontSize: '15px', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline w-full mb-4"
                        style={{ fontSize: '15px', padding: '12px' }}
                        onClick={handleDemo}
                        disabled={loading}
                    >
                        Demo Login as {role === 'student' ? 'Student' : 'Teacher'}
                    </button>

                    <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            className="text-primary"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        >
                            {isRegister ? 'Login' : 'Register'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
