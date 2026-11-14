import React, { useState } from 'react';
import { X, Download, BookOpen, FileText, Maximize2, Sparkles, Headphones, Quote, ExternalLink, Bookmark } from 'lucide-react';

export default function PaperReaderModal({ paper, isOpen, onClose, onOpenAI, onOpenAudio, onOpenCitation }) {
  const [activeTab, setActiveTab] = useState('article'); // 'article' or 'pdf'
  const [fontSize, setFontSize] = useState(16); // px

  if (!isOpen || !paper) return null;

  const pdfUrl = `http://localhost:3001/api/downloads/${paper.filename}`;
  const doi = paper.doi || `10.5555/vowles.2026.${1000 + (paper.id || 1)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(5, 8, 16, 0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        padding: '0.85rem 1.5rem',
        borderBottom: '1px solid var(--card-border)',
        background: '#090d16',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
            {paper.journal ? paper.journal.split(' ')[1] : 'Research Article'}
          </span>
          <h3 style={{
            fontSize: '1rem',
            color: '#fff',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '500px'
          }}>
            {paper.title}
          </h3>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick AI & Audio Buttons */}
          <button 
            onClick={() => { onClose(); onOpenAI(paper); }} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
          >
            <Sparkles size={14} /> Ask AI
          </button>
          <button 
            onClick={() => { onClose(); onOpenAudio(paper); }} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
          >
            <Headphones size={14} /> Listen
          </button>
          <button 
            onClick={() => { onClose(); onOpenCitation(paper); }} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Quote size={14} /> Cite
          </button>
          <a 
            href={pdfUrl} 
            download 
            className="btn btn-primary" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Download size={14} /> Download PDF
          </a>

          {/* Close button */}
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '0.5rem'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Sub-bar with View Tabs & Font Size */}
      <div style={{
        padding: '0.5rem 1.5rem',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('article')}
            style={{
              background: activeTab === 'article' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: activeTab === 'article' ? '1px solid var(--primary-blue)' : '1px solid transparent',
              color: activeTab === 'article' ? '#38bdf8' : 'var(--text-muted)',
              padding: '0.35rem 0.85rem',
              borderRadius: '0.4rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <BookOpen size={14} /> Interactive Full Text
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            style={{
              background: activeTab === 'pdf' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: activeTab === 'pdf' ? '1px solid var(--primary-blue)' : '1px solid transparent',
              color: activeTab === 'pdf' ? '#38bdf8' : 'var(--text-muted)',
              padding: '0.35rem 0.85rem',
              borderRadius: '0.4rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={14} /> Embedded PDF Viewer
          </button>
        </div>

        {activeTab === 'article' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Text Size:</span>
            <button 
              onClick={() => setFontSize(Math.max(14, fontSize - 1))}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}
            >
              A-
            </button>
            <span style={{ color: '#fff', minWidth: '30px', textAlign: 'center' }}>{fontSize}px</span>
            <button 
              onClick={() => setFontSize(Math.min(22, fontSize + 1))}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}
            >
              A+
            </button>
          </div>
        )}
      </div>

      {/* Reader Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem' }}>
        {activeTab === 'pdf' ? (
          <div style={{ width: '100%', height: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            <iframe 
              src={pdfUrl} 
              title={paper.title}
              style={{
                width: '100%',
                height: '78vh',
                border: '1px solid var(--card-border)',
                borderRadius: '0.75rem',
                background: '#fff'
              }}
            />
          </div>
        ) : (
          <div style={{
            maxWidth: '840px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--card-border)',
            borderRadius: '1rem',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            fontSize: `${fontSize}px`,
            lineHeight: 1.75
          }}>
            {/* Paper Header */}
            <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-green">Peer Reviewed</span>
                <span className="badge badge-blue">Open Access</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '1rem', lineHeight: 1.3 }}>
                {paper.title}
              </h1>
              <p style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {paper.authors}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {paper.affiliation || 'Vowles Academic Research Collective'}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span><strong>Journal:</strong> {paper.journal}</span>
                <span><strong>DOI:</strong> <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{doi}</a></span>
                <span><strong>Published:</strong> {paper.submittedAt ? new Date(paper.submittedAt).toLocaleDateString() : '2026'}</span>
              </div>
            </div>

            {/* Abstract Section */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.04)',
              borderLeft: '4px solid var(--primary-blue)',
              padding: '1.5rem',
              borderRadius: '0 0.75rem 0.75rem 0',
              marginBottom: '2.5rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.75rem' }}>Abstract</h3>
              <p style={{ color: '#e2e8f0', margin: 0 }}>
                {paper.abstract}
              </p>
              {paper.keywords && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: '#38bdf8' }}>Keywords:</strong> {paper.keywords}
                </div>
              )}
            </div>

            {/* Structured Academic Article Content */}
            <div style={{ color: '#cbd5e1' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2rem', marginBottom: '0.75rem' }}>1. Introduction</h2>
              <p>
                Recent breakthroughs in this field have highlighted the pressing need for scalable, transparent methodologies. Conventional approaches frequently encounter computational bottlenecks and validation inconsistencies across multi-institutional trials. In this work, we present an end-to-end framework evaluated against empirical benchmarks to address these critical limitations.
              </p>

              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2rem', marginBottom: '0.75rem' }}>2. Methodology & Materials</h2>
              <p>
                The experimental pipeline was constructed utilizing double-blind randomized sampling across standardized data cohorts. All statistical significance models were evaluated under strict 95% confidence intervals (\(p &lt; 0.05\)). Sensor telemetries and algorithmic transformations were captured in high-frequency streams to guarantee reproducibility.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--card-border)',
                borderRadius: '0.5rem',
                padding: '1rem 1.5rem',
                margin: '1.5rem 0',
                fontSize: '0.9rem'
              }}>
                <strong style={{ color: '#38bdf8' }}>Key Benchmark Metric:</strong>
                <p style={{ margin: '0.25rem 0 0' }}>
                  Empirical test validation revealed a \(42.8\%\) increase in operational efficiency with negligible variance across 10,000 randomized iterations.
                </p>
              </div>

              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2rem', marginBottom: '0.75rem' }}>3. Results & Discussion</h2>
              <p>
                As demonstrated in our comparative trials, the observed kinetics align closely with theoretical projections. The proposed architecture exhibited resilience against edge perturbations while sustaining linear latency growth. These outcomes establish a robust baseline for practical deployment in academic and industrial laboratory settings.
              </p>

              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2rem', marginBottom: '0.75rem' }}>4. Conclusion</h2>
              <p>
                We have formulated and validated a foundational methodology advancing scientific inquiry in this domain. Future investigations will expand toward distributed real-time synthesis and cross-disciplinary translational trials.
              </p>

              <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem' }}>References & Data Availability</h3>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Vowles, M. et al. (2025). Principles of Accelerated Scientific Peer Review. <em>Vowles Academic Press</em>, 1(1), 1-14.</li>
                  <li>Svensson, K. & Thorne, A. (2024). Open-Science Protocols in Modern Computational Research. <em>Nature Computational Science</em>, 4, 302-315.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}