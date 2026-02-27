import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, Send, Loader2 } from 'lucide-react';

const StudentSubmit: React.FC = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setShowQuestions(true);
        }, 2000);
    };

    const handleSubmit = () => {
        navigate('/student/results');
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

            {!showQuestions ? (
                <>
                    <div className="form-group mb-4">
                        <textarea
                            className="input-field"
                            rows={12}
                            placeholder="Start typing your assignment response here..."
                            style={{ padding: '16px', fontSize: '16px', lineHeight: '1.6', resize: 'vertical' }}
                        ></textarea>
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
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            style={{ width: '100%' }}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    Analyzing Understanding...
                                </>
                            ) : (
                                'Analyze Understanding'
                            )}
                        </button>
                        <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
                    </div>
                </>
            ) : (
                <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div className="card mb-6" style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--primary)' }}>
                        <h2 className="text-primary mb-2 flex items-center gap-2">
                            <span className="score-badge score-high" style={{ padding: '2px', width: '24px', height: '24px' }}>AI</span>
                            Follow-up Question
                        </h2>
                        <p className="text-sm">
                            I noticed you used dynamic programming for this problem. However, your base cases seem to omit the edge case where the array is empty. Can you explain how your code would handle that scenario, or how you would modify it to do so?
                        </p>
                    </div>

                    <div className="form-group mb-4">
                        <label>Your Response to Follow-up</label>
                        <textarea
                            className="input-field mt-2"
                            rows={5}
                            placeholder="Explain your approach..."
                        ></textarea>
                    </div>

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleSubmit}
                        style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        Submit Response <Send size={18} />
                    </button>

                    <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
                </div>
            )}
        </div>
    );
};

export default StudentSubmit;
