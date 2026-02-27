import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiGetClassAnalytics, apiGetStudentsList } from '../../api/client';
import { classPerformanceData } from '../../data/dummy';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        apiGetClassAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
        apiGetStudentsList().then(setStudents).catch(() => setStudents([]));
    }, []);

    // Use API data or fallback
    const classAvg = analytics?.class_average ?? 78;
    const mostWeak = analytics?.most_weak_topic ?? 'Dynamic Programming';
    const strongest = analytics?.strongest_topic ?? 'Trees';
    const aiRisk = analytics?.ai_risk_students ?? 5;
    const totalStudents = analytics?.total_students ?? students.length;

    const dist = analytics?.performance_distribution || { high: 45, medium: 35, low: 20 };
    const distributionData = [
        { name: 'High', value: dist.high },
        { name: 'Medium', value: dist.medium },
        { name: 'Low', value: dist.low },
    ];

    const trendData = analytics?.score_trend?.length
        ? analytics.score_trend.map((s: any) => ({ name: s.date, avg: s.avg }))
        : classPerformanceData.map((c) => ({ name: c.name, avg: c.avg }));

    const topicAvgs = analytics?.topic_averages?.length
        ? analytics.topic_averages
        : [
            { topic: 'Recursion', avg: 72 },
            { topic: 'Graphs', avg: 65 },
            { topic: 'DP', avg: 58 },
            { topic: 'Trees', avg: 85 },
        ];

    // Student table: use API list or fallback
    const studentTable = students.length ? students : [
        { id: 1, name: 'Alice Johnson', score: 92, weak_topic: 'Dynamic Programming', trend: '+5%', status: 'Strong' },
        { id: 2, name: 'Bob Smith', score: 76, weak_topic: 'Graphs', trend: '+2%', status: 'Stable' },
        { id: 3, name: 'Charlie Davis', score: 58, weak_topic: 'Recursion', trend: '-4%', status: 'At Risk' },
    ];

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1>Class Overview</h1>
                    <p>Analyze class performance, trends, and risk metrics. {totalStudents} students enrolled.</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2">
                    <Users size={18} /> Manage Class
                </button>
            </div>

            <div className="grid-4 mb-6">
                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Class Avg Score</h2>
                        <div className={`score-badge ${classAvg >= 80 ? 'score-high' : classAvg >= 60 ? 'score-medium' : 'score-low'}`}>
                            {Math.round(classAvg)}%
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-success text-sm">
                        <TrendingUp size={16} /> Class average
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Most Weak Topic</h2>
                        <div className="score-badge score-low">{mostWeak.length > 12 ? mostWeak.slice(0, 12) + '…' : mostWeak}</div>
                    </div>
                    <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>Needs attention</div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Strongest Topic</h2>
                        <div className="score-badge score-high">{strongest}</div>
                    </div>
                    <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>Best performing</div>
                </div>

                <div className="card" style={{ borderColor: aiRisk > 0 ? 'var(--danger)' : 'var(--border)' }}>
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>AI Dependency Risk</h2>
                        <div className="score-badge score-low flex items-center gap-1">
                            <AlertTriangle size={14} /> {aiRisk}
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-danger">{aiRisk} students flagged</div>
                </div>
            </div>

            <div className="grid-3 mb-6">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h2 className="mb-4">Class Performance Trend</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="avg" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="mb-4">Student Distribution</h2>
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                                    {distributionData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span> High</div>
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span> Medium</div>
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span> Low</div>
                    </div>
                </div>
            </div>

            <div className="card mb-6">
                <h2 className="mb-4">Topic-wise Average</h2>
                <div style={{ width: '100%', height: '250px' }}>
                    <ResponsiveContainer>
                        <BarChart data={topicAvgs} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="topic" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                            <Bar dataKey="avg" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '22px 20px 12px' }}>
                    <h2>Student Performance</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last Score</th>
                            <th>Weakest Topic</th>
                            <th>Growth Trend</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentTable.map((s: any) => (
                            <tr key={s.id}>
                                <td className="font-semibold">{s.name}</td>
                                <td>{s.score}%</td>
                                <td className="text-muted">{s.weak_topic || s.weakTopic}</td>
                                <td>
                                    <span className={`flex items-center gap-1 ${(s.trend || '').startsWith('-') ? 'text-danger' : 'text-success'}`}>
                                        {(s.trend || '').startsWith('-') ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {s.trend}
                                    </span>
                                </td>
                                <td>
                                    <span className={`score-badge ${s.status === 'Strong' ? 'score-high' : s.status === 'Stable' ? 'score-medium' : 'score-low'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-outline py-1 px-3 text-sm" onClick={() => navigate(`/teacher/student-analytics/${s.id}`)}>
                                        View Analytics
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherDashboard;
