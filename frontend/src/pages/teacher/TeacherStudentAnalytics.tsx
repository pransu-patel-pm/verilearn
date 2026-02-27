import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ArrowLeft, TrendingDown, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { apiGetStudentAnalytics } from '../../api/client';
import { learningData, radarData as dummyRadar } from '../../data/dummy';

const TeacherStudentAnalytics: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            apiGetStudentAnalytics(parseInt(id))
                .then(setData)
                .catch(() => setData(null))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [id]);

    const name = data?.student_name || 'Student';
    const overallScore = data?.overall_score ?? 58;
    const growth = data?.growth_trend ?? -4;
    const aiDep = data?.ai_dependency_score ?? 45;

    const scoreHistory = data?.score_history?.length
        ? data.score_history.map((s: any, i: number) => ({ name: `#${i + 1}`, score: s.score }))
        : learningData;

    const radar = data?.radar_scores;
    const radarChartData = radar
        ? [
            { subject: 'Clarity', A: radar.clarity, fullMark: 100 },
            { subject: 'Application', A: radar.application, fullMark: 100 },
            { subject: 'Logic', A: radar.logic, fullMark: 100 },
            { subject: 'Critical Thinking', A: radar.critical_thinking, fullMark: 100 },
            { subject: 'Retention', A: radar.retention, fullMark: 100 },
        ]
        : dummyRadar;

    const timeline = data?.topic_timeline || [];
    const suggestions = data?.intervention_suggestions || [];
    const weakTopics = data?.weak_topics || ['Recursion', 'Dynamic Programming'];

    const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    if (loading) {
        return <div className="text-center mt-6"><p style={{ color: 'var(--muted)' }}>Loading analytics...</p></div>;
    }

    return (
        <div>
            <div className="mb-6">
                <button
                    className="btn text-sm flex gap-2 items-center mb-4"
                    onClick={() => navigate('/teacher/dashboard')}
                    style={{ paddingLeft: 0, color: 'var(--muted)' }}
                >
                    <ArrowLeft size={16} /> Back to Class Dashboard
                </button>
                <div className="flex gap-4 items-center">
                    <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>{initials}</div>
                    <div>
                        <h1>{name}</h1>
                        <p style={{ color: 'var(--muted)' }}>Individual Performance Analytics</p>
                    </div>
                </div>
            </div>

            <div className="grid-4 mb-6">
                <div className="card text-center">
                    <div className={`score-badge ${overallScore >= 80 ? 'score-high' : overallScore >= 60 ? 'score-medium' : 'score-low'} mb-2`}>Overall Score</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{Math.round(overallScore)}%</div>
                </div>
                <div className="card text-center">
                    <div className={`score-badge ${growth >= 0 ? 'score-high' : 'score-low'} flex items-center gap-1 mx-auto mb-2`}>
                        {growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} Growth
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</div>
                </div>
                <div className="card text-center">
                    <div className={`score-badge ${aiDep > 50 ? 'score-low' : aiDep > 30 ? 'score-medium' : 'score-high'} mb-2`}>AI Dependency</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{aiDep.toFixed(1)}%</div>
                </div>
                <div className="card text-center">
                    <div className="score-badge score-medium mb-2">Weak Areas</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{weakTopics.length}</div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <h2 className="mb-4">Performance Over Time</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <LineChart data={scoreHistory} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="score" stroke={growth >= 0 ? 'var(--success)' : 'var(--danger)'} strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="mb-4 text-center">Concept Mastery</h2>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                                <PolarGrid stroke="var(--border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                                <Radar name={name} dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card">
                    <h2 className="mb-4 flex items-center gap-2"><Calendar className="text-primary" size={20} /> Weak Topic Timeline</h2>
                    <div className="flex flex-col gap-4">
                        {timeline.length > 0 ? timeline.map((t: any, i: number) => (
                            <div key={i} className="flex gap-4 p-3" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: 'var(--surface-hover)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                                <div className="font-semibold text-sm" style={{ width: '80px', flexShrink: 0 }}>{t.week}</div>
                                <div className="text-sm">{t.detail} <span className="text-muted">({t.topics})</span></div>
                            </div>
                        )) : (
                            <p className="text-sm" style={{ color: 'var(--muted)' }}>No timeline data available yet.</p>
                        )}
                    </div>
                </div>

                <div className="card" style={{ border: '1px solid var(--primary)' }}>
                    <h2 className="mb-4 flex items-center gap-2 text-primary">
                        <AlertCircle size={20} /> AI Intervention Suggestions
                    </h2>
                    <div className="flex flex-col gap-3">
                        {suggestions.length > 0 ? suggestions.map((s: any, i: number) => (
                            <div key={i} className="p-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)' }}>
                                <h3 className="text-primary text-sm font-semibold mb-1">{s.title}</h3>
                                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{s.description}</p>
                            </div>
                        )) : (
                            <p className="text-sm" style={{ color: 'var(--muted)' }}>No suggestions available.</p>
                        )}
                    </div>
                    <button className="btn btn-primary mt-4 w-full">Apply Suggested Interventions</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherStudentAnalytics;
