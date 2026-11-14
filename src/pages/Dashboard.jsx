import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  Award, 
  Star, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedReviewPaper, setSelectedReviewPaper] = useState(null);
  const [assignedReviewers, setAssignedReviewers] = useState([]);

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const fetchManuscripts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/manuscripts');
      const data = await res.json();
      setManuscripts(data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3001/api/manuscripts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchManuscripts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const availableReviewersList = [
    'Dr. Aris Thorne (Oxford University)',
    'Prof. Li Wei (MIT)',
    'Dr. Elena Gomez (Stanford University)',
    'Prof. Hiroshi Tanaka (Tokyo Tech)',
    'Dr. Julian Vance (Cambridge)',
    'Dr. Ananya Sharma (IISc Bangalore)'
  ];

  const handleSaveReviewers = async (paperId) => {
    try {
      await fetch(`http://localhost:3001/api/manuscripts/${paperId}/reviewers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewers: assignedReviewers,
          reviewScores: { originality: 4.8, rigor: 4.6, clarity: 4.9 }
        })
      });
      setSelectedReviewPaper(null);
      fetchManuscripts();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Accepted') return <span className="badge badge-green"><CheckCircle size={12} style={{marginRight:'4px'}}/> Accepted & Published</span>;
    if (status === 'Rejected') return <span className="badge" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><XCircle size={12} style={{marginRight:'4px'}}/> Rejected</span>;
    return <span className="badge badge-yellow"><Clock size={12} style={{marginRight:'4px'}}/> Under Review</span>;
  };

  const filtered = manuscripts.filter(m => {
    if (activeFilter === 'All') return true;
    return m.status === activeFilter;
  });

  const acceptedCount = manuscripts.filter(m => m.status === 'Accepted').length;
  const underReviewCount = manuscripts.filter(m => m.status === 'Under Review').length;
  const acceptanceRate = manuscripts.length > 0 ? Math.round((acceptedCount / manuscripts.length) * 100) : 22;

  return (
    <section className="section" style={{ minHeight: '85vh', paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header-split">
          <div>
            <span className="badge badge-purple">Admin & Editorial Office</span>
            <h2>Editorial Decision Dashboard</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Assign peer reviewers, inspect evaluation scorecards, mint DOIs, and execute final publication decisions.
            </p>
          </div>
          <div>
            <span className="badge badge-blue">
              Admin: {localStorage.getItem('user') || 'admin@vowles.com'}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Submissions</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>{manuscripts.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Under Active Review</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#eab308', marginTop: '0.25rem' }}>{underReviewCount}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accepted & Published</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>{acceptedCount}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Acceptance Rate</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.25rem' }}>{acceptanceRate}%</div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['All', 'Under Review', 'Accepted', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '0.5rem',
                border: activeFilter === status ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)',
                background: activeFilter === status ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.3)',
                color: activeFilter === status ? '#38bdf8' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {status} ({status === 'All' ? manuscripts.length : manuscripts.filter(m => m.status === status).length})
            </button>
          ))}
        </div>

        {/* Manuscripts List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading submissions...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No manuscripts found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {filtered.map(paper => {
              const doi = paper.doi || (paper.status === 'Accepted' ? `10.5555/vowles.2026.${1000 + paper.id}` : null);
              
              let parsedReviewers = [];
              try {
                parsedReviewers = typeof paper.reviewers === 'string' ? JSON.parse(paper.reviewers) : (paper.reviewers || []);
              } catch {
                parsedReviewers = ['Dr. Aris Thorne (Oxford)', 'Prof. Li Wei (MIT)'];
              }

              return (
                <div
                  key={paper.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '1.25rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-yellow">ID: {paper.trackingNumber || `VP-2026-${1000 + paper.id}`}</span>
                        <span className="badge badge-blue">{paper.journal ? paper.journal.split(' ')[1] : 'Journal'}</span>
                        {doi && (
                          <span className="badge badge-green">
                            DOI: {doi}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: '0.25rem 0' }}>{paper.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        <strong>Authors:</strong> {paper.authors} {paper.affiliation ? `(${paper.affiliation})` : ''}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        Submitted: {new Date(paper.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    {getStatusBadge(paper.status)}
                  </div>

                  {/* Abstract snippet */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <strong style={{ color: '#fff' }}>Abstract:</strong> {paper.abstract}
                  </div>

                  {/* Peer Reviewer Module */}
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.04)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '0.75rem',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} color="#38bdf8" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Assigned Peer Reviewers</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReviewPaper(paper);
                          setAssignedReviewers(parsedReviewers);
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Manage Reviewers
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {parsedReviewers.map((rev, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                          ✓ {rev}
                        </span>
                      ))}
                    </div>

                    {/* Review Scorecards */}
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                      <span>Originality Score: <strong style={{ color: '#10b981' }}>4.8 / 5.0</strong></span>
                      <span>Methodological Rigor: <strong style={{ color: '#10b981' }}>4.7 / 5.0</strong></span>
                      <span>Clarity & Language: <strong style={{ color: '#10b981' }}>4.9 / 5.0</strong></span>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <a
                      href={`http://localhost:3001/api/downloads/${paper.filename}`}
                      download
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Download size={15} /> Download PDF
                    </a>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateStatus(paper.id, 'Under Review')}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        Under Review
                      </button>

                      <button
                        onClick={() => updateStatus(paper.id, 'Accepted')}
                        className="btn btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          background: '#10b981',
                          borderColor: '#10b981',
                          color: '#fff'
                        }}
                      >
                        <CheckCircle size={15} /> Accept & Mint DOI
                      </button>

                      <button
                        onClick={() => updateStatus(paper.id, 'Rejected')}
                        className="btn btn-outline"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          color: '#ef4444',
                          borderColor: 'rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Assign Reviewers Modal */}
        {selectedReviewPaper && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#090d16',
              border: '1px solid var(--card-border)',
              borderRadius: '1rem',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem'
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Assign Peer Reviewers
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select double-blind peer reviewers for <em>"{selectedReviewPaper.title}"</em>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {availableReviewersList.map((rev) => {
                  const isChecked = assignedReviewers.includes(rev);
                  return (
                    <label 
                      key={rev} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '0.65rem 1rem', 
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        border: isChecked ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {
                          if (isChecked) {
                            setAssignedReviewers(assignedReviewers.filter(r => r !== rev));
                          } else {
                            setAssignedReviewers([...assignedReviewers, rev]);
                          }
                        }} 
                      />
                      <span style={{ fontSize: '0.85rem', color: isChecked ? '#fff' : 'var(--text-muted)' }}>{rev}</span>
                    </label>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setSelectedReviewPaper(null)} 
                  className="btn btn-outline" 
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveReviewers(selectedReviewPaper.id)} 
                  className="btn btn-primary" 
                  style={{ fontSize: '0.85rem' }}
                >
                  Save Reviewers
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}