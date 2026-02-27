import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { classPerformanceData, studentList } from '../../data/dummy';

const COLORS = ['var(--success)', 'var(--warning)', 'var(--danger)'];

const distributionData = [
    { name: 'High', value: 45 },
    { name: 'Medium', value: 35 },
    { name: 'Low', value: 20 },
];

const topicAverages = [
    { topic: 'Recursion', avg: 72 },
    { topic: 'Graphs', avg: 65 },
    { topic: 'DP', avg: 58 },
    { topic: 'Trees', avg: 85 },
];

const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1>Class Overview (CS301)</h1>
                    <p>Analyze class performance, trends, and risk metrics.</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2">
                    <Users size={18} /> Manage Class
                </button>
            </div>

            <div className="grid-4 mb-6">
                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Class Avg Score</h2>
                        <div className="score-badge score-high">78%</div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-success text-sm">
                        <TrendingUp size={16} /> +4% from last exam
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Most Weak Topic</h2>
                        <div className="score-badge score-low">DP</div>
                    </div>
                    <div className="mt-4 text-sm text-muted">15 students struggling</div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>Strongest Topic</h2>
                        <div className="score-badge score-high">Trees</div>
                    </div>
                    <div className="mt-4 text-sm text-muted">85% average score</div>
                </div>

                <div className="card" style={{ borderColor: 'var(--danger)' }}>
                    <div className="flex justify-between items-center mb-2">
                        <h2 style={{ fontSize: '14px', color: 'var(--muted)' }}>AI Dependency Risk</h2>
                        <div className="score-badge score-low flex items-center gap-1">
                            <AlertTriangle size={14} /> High
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-danger">5 students flagged for high risk</div>
                </div>
            </div>

            <div className="grid-3 mb-6">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h2 className="mb-4">Class Performance Trend</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={classPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
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
                    <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {distributionData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> High</div>
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> Medium</div>
                        <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span> Low</div>
                    </div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h2 className="mb-4">Topic-wise Average</h2>
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer>
                            <BarChart data={topicAverages} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="topic" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} cursor={{ fill: 'var(--surface-hover)' }} />
                                <Bar dataKey="avg" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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
                        {studentList.map(student => (
                            <tr key={student.id}>
                                <td className="font-semibold">{student.name}</td>
                                <td>{student.score}%</td>
                                <td className="text-muted">{student.weakTopic}</td>
                                <td>
                                    <span className={`flex items-center gap-1 ${student.trend.startsWith('-') ? 'text-danger' : 'text-success'}`}>
                                        {student.trend.startsWith('-') ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {student.trend}
                                    </span>
                                </td>
                                <td>
                                    <span className={`score-badge ${student.status === 'Strong' ? 'score-high' : student.status === 'Stable' ? 'score-medium' : 'score-low'}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline py-1 px-3 text-sm"
                                        onClick={() => navigate('/teacher/student-analytics')}
                                    >
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
