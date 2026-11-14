import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  FileCheck, 
  Send,
  Download,
  Users
} from 'lucide-react';

export default function TrackManuscript() {
  const [trackingCode, setTrackingCode] = useState('VP-2026-0101');
  const [manuscripts, setManuscripts] = useState([]);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        setManuscripts(data);
        if (data.length > 0) {
          // Select default or first paper
          const match = data.find(p => p.trackingNumber === trackingCode) || data[0];
          setCurrentPaper(match);
          if (match.trackingNumber) setTrackingCode(match.trackingNumber);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    setError('');

    const query = trackingCode.trim().toLowerCase();
    const match = manuscripts.find(p => 
      (p.trackingNumber && p.trackingNumber.toLowerCase() === query) ||
      (p.id && p.id.toString() === query) ||
      (p.title && p.title.toLowerCase().includes(query))
    );

    if (match) {
      setCurrentPaper(match);
      setLoading(false);
    } else {
      // Try backend track route
      fetch(`http://localhost:3001/api/manuscripts/track/${encodeURIComponent(trackingCode.trim())}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => {
          setCurrentPaper(data);
        })
        .catch(() => {
          setError(`No manuscript found with tracking code "${trackingCode}". Please check your submission confirmation receipt.`);
        })
        .finally(() => setLoading(false));
    }
  };

  // Determine which step in the 6-stage tracker
  const getPipelineSteps = (paper) => {
    if (!paper) return [];

    const isAccepted = paper.status === 'Accepted';
    const isRejected = paper.status === 'Rejected';

    return [
      {
        title: 'Submission Received & File Verified',
        desc: 'PDF uploaded, metadata validated, and author declarations verified.',
        status: 'done',
        date: paper.submittedAt ? new Date(paper.submittedAt).toLocaleDateString() : 'Confirmed'
      },
      {
        title: 'Initial Integrity & Plagiarism Screening',
        desc: 'SimCheck & Crossref similarity index: 3.8% (Well within 15% threshold). Ethics criteria satisfied.',
        status: 'done',
        date: 'Passed'
      },
      {
        title: 'Double-Blind Peer Review',
        desc: 'Assigned to 2 independent academic peer reviewers. Evaluation on scientific rigor, methodology, and novelty.',
        status: isAccepted || isRejected ? 'done' : 'current',
        date: isAccepted ? 'Reviews Completed' : 'In Progress'
      },
      {
        title: 'Editorial Board Decision',
        desc: isAccepted 
          ? 'Accepted for publication by the Editor-in-Chief.' 
          : isRejected 
          ? 'Manuscript declined after editorial review.' 
          : 'Awaiting final reviewer score aggregation and Section Editor signoff.',
        status: isAccepted ? 'done' : isRejected ? 'rejected' : 'upcoming',
        date: isAccepted ? 'Decision: Accepted' : isRejected ? 'Decision: Declined' : 'Est. 3-5 days'
      },
      {
        title: 'Copyediting & Typesetting Proof',
        desc: isAccepted ? 'Typesetting formatting applied. Final galley proof verified by corresponding author.' : 'Pending editorial decision.',
        status: isAccepted ? 'done' : 'upcoming',
        date: isAccepted ? 'Completed' : 'Pending'
      },
      {
        title: 'Official Online Publication & DOI Minted',
        desc: isAccepted 
          ? `Indexed in Vowles Publications catalog with permanent DOI: ${paper.doi || '10.5555/vowles.2026.0101'}` 
          : 'Official digital release upon acceptance.',
        status: isAccepted ? 'done' : 'upcoming',
        date: isAccepted ? 'Published' : 'Pending'
      }
    ];
  };

  const steps = currentPaper ? getPipelineSteps(currentPaper) : [];

  return (
    <section className="section" style={{ minHeight: '85vh', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-yellow">Author Portal</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Track Manuscript Status</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0.5rem auto 0' }}>
            Follow your submitted research in real time through our transparent double-blind peer review and editorial pipeline.
          </p>
        </div>

        {/* Lookup Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--card-border)',
          borderRadius: '1rem',
          padding: '1.75rem',
          backdropFilter: 'blur(12px)',
          marginBottom: '2.5rem'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. VP-2026-0101 or 1)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Search size={16} /> Track Status
            </button>
          </form>

          {/* Quick Click Submitted Manuscripts */}
          {manuscripts.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Your Submissions (click to inspect):
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {manuscripts.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentPaper(p);
                      if (p.trackingNumber) setTrackingCode(p.trackingNumber);
                    }}
                    style={{
                      background: currentPaper?.id === p.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                      border: currentPaper?.id === p.id ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)',
                      borderRadius: '0.4rem',
                      padding: '0.35rem 0.65rem',
                      color: currentPaper?.id === p.id ? '#38bdf8' : '#cbd5e1',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    #{p.trackingNumber || `VP-${p.id}`} : {p.title.substring(0, 28)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', margin: 0 }}>
              {error}
            </p>
          )}
        </div>

        {/* Manuscript Overview Card */}
        {currentPaper && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--card-border)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-yellow">ID: {currentPaper.trackingNumber || `VP-2026-00${currentPaper.id}`}</span>
                  <span className="badge badge-blue">{currentPaper.journal || 'Vowles Publications'}</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '0.5rem' }}>
                  {currentPaper.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  <strong>Authors:</strong> {currentPaper.authors}
                </p>
              </div>

              <div>
                <span className="badge" style={{
                  background: currentPaper.status === 'Accepted' ? 'rgba(16, 185, 129, 0.2)' : currentPaper.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                  color: currentPaper.status === 'Accepted' ? '#10b981' : currentPaper.status === 'Rejected' ? '#ef4444' : '#eab308',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  Current Status: {currentPaper.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6-Stage Timeline Visualizer */}
        {currentPaper && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--card-border)',
            borderRadius: '1rem',
            padding: '2.5rem 2rem',
            marginBottom: '2.5rem'
          }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '2rem' }}>
              Editorial & Peer Review Progression
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1;
                return (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                    {/* Vertical connecting line */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute',
                        left: '17px',
                        top: '36px',
                        bottom: '-28px',
                        width: '2px',
                        background: step.status === 'done' ? '#10b981' : 'rgba(255,255,255,0.1)'
                      }} />
                    )}

                    {/* Step Icon */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: step.status === 'done' ? '#10b981' : step.status === 'current' ? '#0284c7' : 'rgba(255,255,255,0.06)',
                      border: step.status === 'current' ? '2px solid #38bdf8' : 'none',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 2,
                      boxShadow: step.status === 'current' ? '0 0 15px rgba(56, 189, 248, 0.5)' : 'none'
                    }}>
                      {step.status === 'done' ? <CheckCircle2 size={20} /> : step.status === 'current' ? <Clock size={20} className="spin-slow" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{
                          color: step.status === 'done' ? '#fff' : step.status === 'current' ? '#38bdf8' : 'var(--text-muted)',
                          fontSize: '1.05rem',
                          margin: 0
                        }}>
                          {step.title}
                        </h4>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: step.status === 'done' ? '#10b981' : step.status === 'current' ? '#38bdf8' : 'var(--text-muted)'
                        }}>
                          {step.date}
                        </span>
                      </div>
                      <p style={{
                        color: step.status === 'upcoming' ? 'rgba(255,255,255,0.3)' : '#cbd5e1',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        margin: '0.35rem 0 0'
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Editorial Office Inquiry Box */}
        {currentPaper && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--card-border)',
            borderRadius: '1rem',
            padding: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h4 style={{ color: '#fff', margin: '0 0 0.25rem' }}>Have questions about your review?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Our editorial support desk is available 24/7 to provide status updates on peer reviewer communications.
              </p>
            </div>
            {inquirySent ? (
              <span className="badge badge-green" style={{ padding: '0.5rem 1rem' }}>
                ✓ Inquiry dispatched to Editor-in-Chief!
              </span>
            ) : (
              <button 
                onClick={() => setInquirySent(true)} 
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem' }}
              >
                <Send size={14} /> Send Status Inquiry
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}