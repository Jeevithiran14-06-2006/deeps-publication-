import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { journalsList } from './Journals';
import { 
  BookOpen, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Headphones, 
  Quote, 
  ShoppingCart, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe2, 
  FileText,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CitationModal from '../components/CitationModal';
import PaperReaderModal from '../components/PaperReaderModal';
import ChatPaperModal from '../components/ChatPaperModal';
import AudioOverviewModal from '../components/AudioOverviewModal';

export default function JournalDetail() {
  const { journalId } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('articles');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  const journal = journalsList.find(j => j.id === journalId) || journalsList[0];

  useEffect(() => {
    fetch('http://localhost:3001/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        const accepted = data.filter(p => p.status === 'Accepted');
        // Match by exact journal title or subject
        const matches = accepted.filter(p => 
          (p.journal && p.journal.toLowerCase().includes(journal.title.toLowerCase())) ||
          (p.subject && p.subject.toLowerCase() === journal.subject.toLowerCase())
        );
        // If no direct matches, show accepted papers
        setPapers(matches.length > 0 ? matches : accepted.slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [journal]);

  const handleOpenCitation = (paper) => {
    setSelectedPaper(paper);
    setIsCitationOpen(true);
  };

  const handleOpenReader = (paper) => {
    setSelectedPaper(paper);
    setIsReaderOpen(true);
  };

  const handleOpenAI = (paper) => {
    setSelectedPaper(paper);
    setIsAIOpen(true);
  };

  const handleOpenAudio = (paper) => {
    setSelectedPaper(paper);
    setIsAudioOpen(true);
  };

  const editorialBoardMembers = [
    { role: 'Editor-in-Chief', name: journal.editorInChief },
    { role: 'Senior Associate Editor', name: 'Prof. Katherine Vance (University of Cambridge)' },
    { role: 'Senior Associate Editor', name: 'Dr. Hiroshi Tanaka (Tokyo Institute of Technology)' },
    { role: 'Methodology Editor', name: 'Prof. Marie Curie Institute Fellow (Sorbonne Université)' },
    { role: 'Editorial Board Member', name: 'Dr. Ananya Sharma (Indian Institute of Science)' },
    { role: 'Editorial Board Member', name: 'Dr. Arthur Dent (Max Planck Institute for Informatics)' }
  ];

  return (
    <section className="section" style={{ minHeight: '85vh', paddingTop: '2rem' }}>
      <div className="container">
        {/* Journal Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid var(--card-border)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-yellow">Official EurekaSelect Journal</span>
                <span className="badge badge-blue">ISSN: {journal.issn}</span>
                <span className="badge badge-green">Double-Blind Peer Reviewed</span>
              </div>
              <h1 style={{ fontSize: '2.1rem', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                {journal.title}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {journal.scope}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/submit" className="btn btn-primary">
                  Submit Manuscript <ArrowRight size={16} />
                </Link>
                <button 
                  onClick={() => addToCart({ id: journal.id, title: `Annual Subscription: ${journal.title}`, price: 120.0, type: 'Journal Subscription', journal: journal.title })}
                  className="btn btn-outline"
                >
                  <ShoppingCart size={16} /> Subscribe ($120/yr)
                </button>
              </div>
            </div>

            {/* Metrics Widget Box */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--card-border)',
              borderRadius: '1rem',
              padding: '1.5rem',
              minWidth: '220px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Impact Factor (Clarivate)</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>{journal.impactFactor}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CiteScore (Scopus)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{journal.citeScore}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div>Acceptance Rate: <strong style={{ color: '#fff' }}>{journal.acceptanceRate}</strong></div>
                <div>First Decision: <strong style={{ color: '#fff' }}>{journal.avgReviewDays}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid var(--card-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'articles', label: 'Published Articles & Issues' },
            { id: 'scope', label: 'Aims & Scope' },
            { id: 'board', label: 'Editorial Board' },
            { id: 'indexing', label: 'Indexing & Metrics' },
            { id: 'guidelines', label: 'Author Guidelines & APC' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--primary-blue)' : '1px solid transparent',
                color: activeTab === tab.id ? '#38bdf8' : 'var(--text-muted)',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Articles */}
        {activeTab === 'articles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Volume 12, Issue 3 (Current Issue - 2026)</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{papers.length} peer-reviewed articles</span>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading articles...</p>
            ) : papers.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No articles published in this volume yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {papers.map(paper => (
                  <div
                    key={paper.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '1rem',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-green">Open Access</span>
                        <span className="badge badge-blue">DOI: {paper.doi || '10.5555/vowles.2026.0101'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>👁️ {paper.views || 480} views</span>
                        <span>📥 {paper.downloads || 120} downloads</span>
                        <span>📜 {paper.citations || 12} citations</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0.25rem 0' }}>{paper.title}</h3>
                    <p style={{ color: '#38bdf8', fontSize: '0.9rem', margin: 0 }}>{paper.authors}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{paper.abstract}</p>

                    {/* Action Toolbar */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                      <button 
                        onClick={() => handleOpenReader(paper)} 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        <BookOpen size={15} /> Read Online
                      </button>

                      <button 
                        onClick={() => handleOpenCitation(paper)} 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                      >
                        <Quote size={15} /> Cite
                      </button>

                      <button 
                        onClick={() => handleOpenAI(paper)} 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                      >
                        <Sparkles size={15} /> Ask AI
                      </button>

                      <button 
                        onClick={() => handleOpenAudio(paper)} 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                      >
                        <Headphones size={15} /> Audio Digest
                      </button>

                      <a 
                        href={`http://localhost:3001/api/downloads/${paper.filename}`} 
                        download 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                      >
                        <Download size={15} /> PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Aims & Scope */}
        {activeTab === 'scope' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '2.5rem', lineHeight: 1.7, color: '#cbd5e1' }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Aims & Scope</h3>
            <p>{journal.scope}</p>
            <p>
              The journal operates under full adherence to the ethical guidelines established by the Committee on Publication Ethics (COPE). Manuscripts are assessed exclusively based on intellectual merit, scientific validity, methodological soundness, and transformative potential.
            </p>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Subject Disciplines Covered:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
              <li>Empirical and theoretical foundational breakthroughs</li>
              <li>Algorithmic and laboratory experimental validations</li>
              <li>Cross-disciplinary translational synthesis</li>
              <li>Reproducibility benchmark studies and critical replications</li>
            </ul>
          </div>
        )}

        {/* Tab Content: Editorial Board */}
        {activeTab === 'board' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {editorialBoardMembers.map((member, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem'
                }}
              >
                <span className="badge badge-blue" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{member.role}</span>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0.25rem 0' }}>{member.name.split('(')[0]}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  {member.name.includes('(') ? member.name.substring(member.name.indexOf('(')) : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Indexing */}
        {activeTab === 'indexing' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '2.5rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>Indexing & Abstracting Databases</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {journal.indexing.concat(['Crossref', 'Chemical Abstracts Service (CAS)', 'Baidu Scholar', 'Dimensions']).map((idx, i) => (
                <div key={i} style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}>
                  <CheckCircle size={18} color="#10b981" />
                  <span>{idx}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Guidelines & APC */}
        {activeTab === 'guidelines' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '2.5rem', lineHeight: 1.7, color: '#cbd5e1' }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Author Submission Guidelines & APC</h3>
            <p>
              Vowles Publications offers Gold Open Access under Creative Commons CC-BY 4.0 licenses. Authors retain full copyright ownership of their scholarly output.
            </p>
            <div style={{
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              margin: '1.5rem 0'
            }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem' }}>Article Processing Charge (APC) Waiver Policy</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Standard Gold Open Access APC: <strong>$450.00 USD</strong>. Automatic 100% waivers are granted to corresponding authors affiliated with research institutions in lower-middle-income nations designated by Research4Life.
              </p>
            </div>
            <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Submit Your Paper to {journal.shortTitle}
            </Link>
          </div>
        )}

        {/* Modals */}
        <CitationModal 
          paper={selectedPaper} 
          isOpen={isCitationOpen} 
          onClose={() => setIsCitationOpen(false)} 
        />

        <PaperReaderModal 
          paper={selectedPaper} 
          isOpen={isReaderOpen} 
          onClose={() => setIsReaderOpen(false)}
          onOpenAI={handleOpenAI}
          onOpenAudio={handleOpenAudio}
          onOpenCitation={handleOpenCitation}
        />

        <ChatPaperModal 
          paper={selectedPaper} 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)} 
        />

        <AudioOverviewModal 
          paper={selectedPaper} 
          isOpen={isAudioOpen} 
          onClose={() => setIsAudioOpen(false)} 
        />
      </div>
    </section>
  );
}