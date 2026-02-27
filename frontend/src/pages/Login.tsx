import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Login: React.FC = () => {
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const navigate = useNavigate();

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (role === 'student') {
            navigate('/student/dashboard');
        } else {
            navigate('/teacher/dashboard');
        }
    };

    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div className="text-center mb-6">
                    <BookOpen className="text-primary mb-2" size={48} style={{ margin: '0 auto' }} />
                    <h1 style={{ fontSize: '28px', color: 'var(--foreground)' }}>VeriLearn</h1>
                    <p className="mt-2 text-sm text-muted">Measure Understanding. Not Just Output.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Enter your password"
                            autoComplete="current-password"
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

                    <button type="submit" className="btn btn-primary w-full mb-4 px-4 py-3" style={{ fontSize: '16px' }}>
                        Login
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline w-full px-4 py-3"
                        style={{ fontSize: '16px' }}
                        onClick={() => handleLogin()}
                    >
                        Demo Login as {role === 'student' ? 'Student' : 'Teacher'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
