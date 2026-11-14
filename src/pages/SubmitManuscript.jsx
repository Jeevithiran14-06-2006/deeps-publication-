import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Info,
  Clock
} from 'lucide-react';
import { journalsList } from './Journals';

export default function SubmitManuscript() {
  const [status, setStatus] = useState('');
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [abstractText, setAbstractText] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(journalsList[0].title);

  const wordCount = abstractText.trim() ? abstractText.trim().split(/\s+/).length : 0;
  const isWordCountValid = wordCount >= 50 && wordCount <= 350;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Uploading manuscript and running automated integrity check...');
    
    const formData = new FormData(e.target);
    const chosenJournalObj = journalsList.find(j => j.title === selectedJournal);
    if (chosenJournalObj) {
      formData.set('subject', chosenJournalObj.subject);
    }

    try {
      const res = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('');
        setSubmissionReceipt({
          id: data.id,
          trackingNumber: data.trackingNumber,
          title: formData.get('title'),
          authors: formData.get('authors'),
          journal: selectedJournal,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
        e.target.reset();
        setAbstractText('');
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (err) {
      setStatus('Failed to connect to backend server. Make sure it is running!');
    }
  };

  return (
    <section className="section" style={{ minHeight: '85vh', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-yellow">Author Submission Gateway</span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Submit Your Manuscript</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Submit to Vowles Publications with rapid double-blind peer review, COPE ethical standards, and direct Google Drive database backup.
          </p>
        </div>

        {submissionReceipt ? (
          /* Submission Receipt Card */
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1.25rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Submission Successfully Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
              Your paper has entered the editorial intake queue. Initial integrity and plagiarism screening will commence within 24 hours.
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--card-border)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '520px',
              margin: '0 auto 2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tracking ID:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.05rem' }}>{submissionReceipt.trackingNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Target Journal:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem', maxWidth: '280px', textAlign: 'right' }}>{submissionReceipt.journal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manuscript Title:</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '280px', textAlign: 'right' }}>{submissionReceipt.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Submission Date:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{submissionReceipt.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/track" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                Track Manuscript Status Live <ArrowRight size={16} />
              </Link>
              <button 
                onClick={() => setSubmissionReceipt(null)} 
                className="btn btn-outline" 
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Submit Another Paper
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--card-border)',
            borderRadius: '1.25rem',
            padding: '2.5rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Target Journal Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Target Journal <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="journal"
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  {journalsList.map(j => (
                    <option key={j.id} value={j.title}>
                      {j.title} (IF: {j.impactFactor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Manuscript Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Full Manuscript Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }} 
                  placeholder="e.g. Deep Reinforcement Learning in Multi-Agent Swarm Dynamics" 
                />
              </div>

              {/* Authors & ORCID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Authors (Comma-separated) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    name="authors" 
                    type="text" 
                    required 
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }} 
                    placeholder="e.g. Dr. Jane Doe, Prof. John Smith" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    ORCID iD (Optional)
                  </label>
                  <input 
                    name="orcid" 
                    type="text" 
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }} 
                    placeholder="0000-0002-1825-0097" 
                  />
                </div>
              </div>

              {/* Affiliation & Keywords */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Primary Academic Affiliation
                  </label>
                  <input 
                    name="affiliation" 
                    type="text" 
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }} 
                    placeholder="e.g. Department of Physics, Oxford University" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Keywords (Comma-separated)
                  </label>
                  <input 
                    name="keywords" 
                    type="text" 
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }} 
                    placeholder="e.g. robotics, neural networks, optimization" 
                  />
                </div>
              </div>

              {/* Abstract with Live Word Counter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Abstract <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span style={{
                    fontSize: '0.8rem',
                    color: isWordCountValid ? '#10b981' : '#eab308',
                    fontWeight: 600
                  }}>
                    {wordCount} words (Target: 150-300)
                  </span>
                </div>
                <textarea 
                  name="abstract" 
                  required 
                  rows="5" 
                  value={abstractText}
                  onChange={(e) => setAbstractText(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }} 
                  placeholder="Provide a concise summary detailing the problem statement, empirical methodology, observed results, and conclusions..."
                />
              </div>

              {/* File Upload Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Manuscript PDF File <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{
                  border: '2px dashed var(--card-border)',
                  borderRadius: '0.75rem',
                  padding: '1.75rem',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.2)'
                }}>
                  <Upload size={32} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
                    Upload complete manuscript PDF (including figures and tables)
                  </p>
                  <input 
                    name="manuscriptFile" 
                    type="file" 
                    accept=".pdf" 
                    required 
                    style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>

              {/* Ethics Declaration Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input type="checkbox" required id="ethics" style={{ marginTop: '0.25rem' }} />
                <label htmlFor="ethics" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  I confirm that this manuscript represents original scholarship, is not under review elsewhere, and complies with COPE ethical research standards.
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              >
                Submit Manuscript for Peer Review
              </button>

              {status && (
                <p style={{
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  color: status.includes('Uploading') ? '#38bdf8' : '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  {status}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}