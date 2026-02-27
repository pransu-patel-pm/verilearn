import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { BookOpen, AlertCircle, Map } from 'lucide-react';
import { apiGetResults } from '../../api/client';
import { radarData as dummyRadar, recommendedBooks, weakTopicsData } from '../../data/dummy';

const StudentResults: React.FC = () => {
    const { id } = useParams();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            apiGetResults(parseInt(id))
                .then(setResult)
                .catch(() => setResult(null))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [id]);

    // Use API data or fallback
    const scores = result?.scores || { concept_clarity: 75, application: 85, logical_consistency: 92, depth: 70, final_score: 88 };
    const radar = result?.radar_scores;
    const radarChartData = radar
        ? [
            { subject: 'Clarity', A: radar.clarity, fullMark: 100 },
            { subject: 'Application', A: radar.application, fullMark: 100 },
            { subject: 'Logic', A: radar.logic, fullMark: 100 },
            { subject: 'Critical Thinking', A: radar.critical_thinking, fullMark: 100 },
            { subject: 'Retention', A: radar.retention, fullMark: 100 },
        ]
        : dummyRadar;

    const weakTopics = result?.weak_topics?.map((t: string, i: number) => ({ topic: t, mistakes: Math.max(6, 15 - i * 3) })) || weakTopicsData;
    const recs = result?.recommendations?.length ? result.recommendations : recommendedBooks;
    const aiDep = result?.ai_dependency_score ?? 28;

    if (loading) {
        return <div className="text-center mt-6"><p style={{ color: 'var(--muted)' }}>Loading results...</p></div>;
    }

    return (
        <div>
            <h1 className="mb-6">{id ? `Assignment #${id} Results` : 'Latest Assignment Results'}</h1>

            <div className="grid-4 mb-6">
                {[
                    { label: 'Overall Score', value: Math.round(scores.final_score), cls: scores.final_score >= 80 ? 'score-high' : scores.final_score >= 60 ? 'score-medium' : 'score-low' },
                    { label: 'Concept Depth', value: Math.round(scores.concept_clarity), cls: scores.concept_clarity >= 80 ? 'score-high' : 'score-medium' },
                    { label: 'Application', value: Math.round(scores.application), cls: scores.application >= 80 ? 'score-high' : 'score-medium' },
                    { label: 'Logical Consistency', value: Math.round(scores.logical_consistency), cls: scores.logical_consistency >= 80 ? 'score-high' : 'score-medium' },
                ].map((card) => (
                    <div key={card.label} className="card text-center">
                        <div className={`score-badge ${card.cls} mb-2`}>{card.label}</div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {aiDep > 0 && (
                <div className="card mb-6 flex items-center gap-4" style={{ borderColor: aiDep > 50 ? 'var(--danger)' : 'var(--border)' }}>
                    <AlertCircle size={20} className={aiDep > 50 ? 'text-danger' : 'text-warning'} />
                    <div>
                        <span className="font-semibold">AI Dependency Score: </span>
                        <span className={aiDep > 50 ? 'text-danger' : aiDep > 30 ? 'text-warning' : 'text-success'}>
                            {aiDep.toFixed(1)}%
                        </span>
                        <span className="text-sm ml-2" style={{ color: 'var(--muted)', marginLeft: '8px' }}>
                            {aiDep > 50 ? 'High risk — verify authenticity' : aiDep > 30 ? 'Moderate' : 'Low risk'}
                        </span>
                    </div>
                </div>
            )}

            <div className="grid-2 mb-6">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="mb-4 text-center">Understanding Attributes</h2>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                                <PolarGrid stroke="var(--border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                                <Radar name="Student" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="mb-4 flex items-center gap-2">
                        <AlertCircle className="text-danger" size={20} /> Areas to Improve
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {weakTopics.map((w: any, i: number) => (
                            <li key={i} className="flex justify-between items-center p-3" style={{ backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                                <span className="font-semibold">{w.topic}</span>
                                <span className="text-sm text-danger">{w.mistakes} errors</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="card">
                <h2 className="mb-4 flex items-center gap-2">
                    <Map className="text-primary" size={20} /> Learning Roadmap
                </h2>
                <div className="grid-3">
                    {recs.map((book: any, i: number) => (
                        <div key={i} className="card" style={{ padding: '16px', backgroundColor: 'var(--surface-hover)', border: 'none' }}>
                            <div className="flex gap-4 items-start">
                                <div style={{ padding: '12px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                                    <BookOpen className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '14px', lineHeight: '1.2', marginBottom: '4px' }}>{book.title}</h3>
                                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{book.author}</p>
                                    <div className="mt-2 text-xs flex items-center gap-2">
                                        <span style={{ padding: '2px 6px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
                                            {book.match_percentage || book.match}% Match
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

export default StudentResults;
