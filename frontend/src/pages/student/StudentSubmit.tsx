import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, Send, Loader2 } from 'lucide-react';
import { apiSubmitAssignment, apiSubmitFollowup } from '../../api/client';

const StudentSubmit: React.FC = () => {
    const [text, setText] = useState('');
    const [subject, setSubject] = useState('General');
    const [analyzing, setAnalyzing] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [assignmentId, setAssignmentId] = useState<number | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (text.trim().length < 20) {
            setError('Please enter at least 20 characters.');
            return;
        }
        setError('');
        setAnalyzing(true);

        try {
            const res = await apiSubmitAssignment(text, subject);
            setQuestions(res.followup_questions || []);
            setAssignmentId(res.assignment_id);
            setShowQuestions(true);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze. Is the backend running?');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmitFollowup = async () => {
        if (!assignmentId) return;
        setSubmitting(true);
        setError('');

        try {
            await apiSubmitFollowup(assignmentId, responses);
            navigate(`/student/results/${assignmentId}`);
        } catch (err: any) {
            setError(err.message || 'Failed to submit follow-up.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', border: 'none' }}>
            <div className="mb-6">
                <h1 className="flex items-center gap-2">
                    <BookOpen className="text-primary" />
                    Assignment Submission
                </h1>
                <p>Paste your essay, code, or explanation below.</p>
            </div>

            {error && (
                <div className="mb-4 text-sm" style={{
                    padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                }}>
                    {error}
                </div>
            )}

            {!showQuestions ? (
                <>
                    <div className="form-group mb-2">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            className="input-field"
                            placeholder="e.g. Data Structures"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="assignment-text">Assignment Text</label>
                        <textarea
                            id="assignment-text"
                            className="input-field"
                            rows={12}
                            placeholder="Start typing your assignment response here... (min 20 characters)"
                            style={{ padding: '16px', fontSize: '15px', lineHeight: '1.6', resize: 'vertical' }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                        <span className="text-xs" style={{ color: 'var(--muted)', textAlign: 'right' }}>
                            {text.length} characters
                        </span>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
                            <Upload size={18} />
                            Upload PDF or Docx
                        </button>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                        <h3 className="mb-2">Ready for analysis?</h3>
                        <p className="text-sm mb-4">We'll evaluate your submission contextually and identify any conceptual gaps.</p>
                        <button
                            className="btn btn-primary w-full"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    Analyzing Understanding...
                                </>
                            ) : (
                                'Analyze Understanding'
                            )}
                        </button>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                </>
            ) : (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                    {questions.map((q, i) => (
                        <div key={q.id || i} className="card mb-4" style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--primary)' }}>
                            <h2 className="text-primary mb-2 flex items-center gap-2 text-sm">
                                <span className="score-badge score-high" style={{ padding: '2px 8px' }}>Q{i + 1}</span>
                                Follow-up Question
                            </h2>
                            <p className="text-sm mb-4" style={{ color: 'var(--foreground)' }}>{q.question}</p>

                            <textarea
                                className="input-field"
                                rows={3}
                                placeholder="Your response..."
                                value={responses[q.id] || ''}
                                onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                            ></textarea>
                        </div>
                    ))}

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleSubmitFollowup}
                        disabled={submitting}
                        style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        {submitting ? 'Submitting...' : <>Submit Responses <Send size={18} /></>}
                    </button>

                    <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
                </div>
            )}
        </div>
    );
};

export default StudentSubmit;
