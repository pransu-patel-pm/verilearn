import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { BookOpen, Map, AlertCircle, TrendingUp } from 'lucide-react';
import { radarData, recommendedBooks, weakTopicsData } from '../../data/dummy';

const StudentResults: React.FC = () => {
    return (
        <div>
            <h1 className="mb-6">Latest Assignment Results</h1>

            <div className="grid-4 mb-6">
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-high mb-2">Overall Score</div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>88</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-medium mb-2">Concept Depth</div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>75</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-high mb-2">Application</div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>85</div>
                </div>
                <div className="card text-center" style={{ backgroundColor: 'var(--surface)' }}>
                    <div className="score-badge score-high mb-2">Logical Consistency</div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>92</div>
                </div>
            </div>

            <div className="grid-2 mb-6">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="mb-4 text-center">Understanding Attributes</h2>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="var(--border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                                <Radar
                                    name="Student"
                                    dataKey="A"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex-col gap-4">
                    <div className="card h-full" style={{ marginBottom: '24px' }}>
                        <h2 className="mb-4 flex items-center gap-2">
                            <AlertCircle className="text-danger" size={20} /> Areas to Improve
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {weakTopicsData.map((w, i) => (
                                <li key={i} className="flex justify-between items-center p-3" style={{ backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                                    <span className="font-semibold">{w.topic}</span>
                                    <span className="text-sm text-danger">{w.mistakes} errors</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="mb-4 flex items-center gap-2">
                    <Map className="text-primary" size={20} /> Learning Roadmap
                </h2>
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

export default StudentResults;
