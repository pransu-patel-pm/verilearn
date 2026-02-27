import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGetDashboard } from '../../api/client';
import { learningData, weakTopicsData, recommendedBooks } from '../../data/dummy';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState<any>(null);

    useEffect(() => {
        apiGetDashboard()
            .then(setDashboard)
            .catch(() => setDashboard(null));
    }, []);

    // Use API data if available, otherwise dummy
    const overallScore = dashboard?.overall_score ?? 92;
    const growthTrend = dashboard?.growth_trend ?? 7;
    const totalAssignments = dashboard?.total_assignments ?? 5;
    const aiDep = dashboard?.ai_dependency_score ?? 28;

    const chartData = dashboard?.score_history?.length
        ? dashboard.score_history.map((s: any, i: number) => ({
            name: `#${i + 1}`,
            score: s.score,
        }))
        : learningData;

    const weakData = dashboard?.weak_topic_summary?.length
        ? dashboard.weak_topic_summary.map((t: any) => ({
            topic: t.topic,
            mistakes: t.count,
        }))
        : weakTopicsData;

    const scoreStatus = overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work';
    const scoreClass = overallScore >= 80 ? 'score-high' : overallScore >= 60 ? 'score-medium' : 'score-low';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
                    <p>Here's your learning progress overview.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/student/submit')}>
                    Submit New Assignment
                </button>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '16px', color: 'var(--muted)' }}>Overall Understanding Score</h2>
                        <div className={`score-badge ${scoreClass}`}>{scoreStatus}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span style={{ fontSize: '36px', fontWeight: '700' }}>{Math.round(overallScore)}%</span>
                        <div className={`flex items-center text-sm ${growthTrend >= 0 ? 'text-success' : 'text-danger'}`}>
                            <TrendingUp size={16} style={{ marginRight: '4px' }} />
                            <span>{growthTrend >= 0 ? '+' : ''}{growthTrend.toFixed(1)}% trend</span>
                        </div>
                    </div>
                    <div className="progress-bg mt-4">
                        <div className="progress-fill" style={{ width: `${overallScore}%` }}></div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '16px', color: 'var(--muted)' }}>Activity Summary</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span style={{ fontSize: '36px', fontWeight: '700' }}>{totalAssignments}</span>
                        <div className="text-sm" style={{ color: 'var(--muted)' }}>Assignments submitted</div>
                    </div>
                    <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                        AI Dependency Score: <strong className={aiDep > 50 ? 'text-danger' : 'text-success'}>{aiDep.toFixed(1)}%</strong>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="mb-4">Understanding Score Over Time</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="mb-4">Weak Topics Analysis</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={weakData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal vertical={false} />
                                <XAxis type="number" stroke="var(--muted)" fontSize={12} hide />
                                <YAxis dataKey="topic" type="category" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} width={120} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} cursor={{ fill: 'var(--surface-hover)' }} />
                                <Bar dataKey="mistakes" fill="var(--danger)" radius={[0, 4, 4, 0]} barSize={20} name="Occurrences" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-6 card">
                <div className="flex justify-between items-center mb-4">
                    <h2>Recommended Books</h2>
                    <button className="text-sm text-primary flex items-center">View all <ChevronRight size={16} /></button>
                </div>
                <div className="grid-3">
                    {recommendedBooks.map((book) => (
                        <div key={book.id} className="card" style={{ padding: '16px', backgroundColor: 'var(--surface-hover)', border: 'none' }}>
                            <div className="flex gap-4 items-start">
                                <div style={{ padding: '12px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                                    <BookOpen className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '14px', lineHeight: '1.2', marginBottom: '4px' }}>{book.title}</h3>
                                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{book.author}</p>
                                    <div className="mt-2 text-xs flex items-center gap-2">
                                        <span style={{ padding: '2px 6px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
                                            {book.match}% Match
                                        </span>
                                        <span style={{ color: 'var(--muted)' }}>{book.topic}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
