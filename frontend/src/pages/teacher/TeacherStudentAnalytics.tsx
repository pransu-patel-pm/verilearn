import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ArrowLeft, User, TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { learningData, radarData } from '../../data/dummy';

const TeacherStudentAnalytics: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-6">
                <button
                    className="btn btn-outline py-2 px-3 text-sm flex gap-2 items-center mb-4"
                    onClick={() => navigate('/teacher/dashboard')}
                    style={{ width: 'fit-content', border: 'none', background: 'transparent', paddingLeft: 0, color: 'var(--muted)' }}
                >
                    <ArrowLeft size={16} /> Back to Class Dashboard
                </button>
                <div className="flex gap-4 items-center">
                    <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>CD</div>
                    <div>
                        <h1>Charlie Davis</h1>
                        <p className="text-muted">CS301 Data Structures & Algorithms</p>
                    </div>
                </div>
            </div>

            <div className="grid-4 mb-6">
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-low mb-2">Overall Score</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>58%</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-low flex items-center gap-1 mx-auto mb-2"><TrendingDown size={14} /> Growth Trend</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>-4%</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-low mb-2">AI Dependency Risk</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>High</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-high mb-2">Engagement</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>Good</div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <h2 className="mb-4">Performance Over Time</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={learningData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="score" stroke="var(--danger)" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="mb-4 text-center">Concept Mastery</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="var(--border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                                <Radar name="Charlie" dataKey="A" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <h2 className="mb-4 flex items-center gap-2"><Calendar className="text-primary" size={20} /> Weak Topic Timeline</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 p-3 bg-surface-hover rounded-md" style={{ borderLeft: '4px solid var(--danger)' }}>
                            <div className="font-semibold text-sm w-24">Week 4</div>
                            <div className="text-sm">Consistently struggling with <strong className="text-danger">Recursion</strong> base cases. Missed 4 key logical steps in assignment.</div>
                        </div>
                        <div className="flex gap-4 p-3 bg-surface-hover rounded-md" style={{ borderLeft: '4px solid var(--warning)' }}>
                            <div className="font-semibold text-sm w-24">Week 5</div>
                            <div className="text-sm">Slight improvement. Still minor issues translating mathematical logic to algorithmic steps.</div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: '1px solid var(--primary)', backgroundColor: 'var(--surface)' }}>
                    <h2 className="mb-4 flex items-center gap-2 text-primary">
                        <AlertCircle size={20} /> AI Intervention Suggestions
                    </h2>
                    <div className="flex flex-col gap-3">
                        <div className="p-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                            <h3 className="text-primary text-sm font-semibold mb-1">Focus on Step-by-Step Logic</h3>
                            <p className="text-sm text-foreground">Charlie repeatedly copies complex recursive solutions but fails on minor variations. Recommend a 1-on-1 session tracing stack frames without an IDE.</p>
                        </div>
                        <div className="p-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                            <h3 className="text-primary text-sm font-semibold mb-1">Peer Programming</h3>
                            <p className="text-sm text-foreground">Pair with Diana Prince, who shows strong mastery in Trees and solid fundamental logic framing, for the next mini-project.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary mt-4 w-full">Apply Suggested Interventions</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherStudentAnalytics;
