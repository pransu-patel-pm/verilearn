import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import { learningData, weakTopicsData, recommendedBooks } from '../../data/dummy';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Welcome back, Alex</h1>
                    <p>Here's your learning progress overview.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/student/submit')}
                >
                    Submit New Assignment
                </button>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '16px', color: 'var(--muted)' }}>Overall Understanding Score</h2>
                        <div className="score-badge score-high">Excellent</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--foreground)' }}>92%</span>
                        <div className="flex items-center text-success text-sm">
                            <TrendingUp size={16} style={{ marginRight: '4px' }} />
                            <span>+7% this week</span>
                        </div>
                    </div>
                    <div className="progress-bg mt-4">
                        <div className="progress-fill bg-primary" style={{ width: '92%', backgroundColor: 'var(--primary)' }}></div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '16px', color: 'var(--muted)' }}>Growth Trend</h2>
                        <div className="score-badge score-medium">Consistent</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--foreground)' }}>1.2x</span>
                        <div className="text-sm text-muted">Faster learning rate</div>
                    </div>
                    <div className="mt-4 text-sm text-muted">
                        You are moving through analytical topics faster than last week. Maintain this focus!
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="mb-4">Understanding Score Over Time</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={learningData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="mb-4">Weak Topics Analysis</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={weakTopicsData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="var(--muted)" fontSize={12} hide />
                                <YAxis dataKey="topic" type="category" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} width={120} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--surface-hover)' }}
                                />
                                <Bar dataKey="mistakes" fill="var(--danger)" radius={[0, 4, 4, 0]} barSize={20} />
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
                                    <p className="text-xs text-muted">{book.author}</p>
                                    <div className="mt-2 text-xs flex items-center gap-2">
                                        <span style={{ padding: '2px 6px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
                                            {book.match}% Match
                                        </span>
                                        <span className="text-muted">{book.topic}</span>
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
