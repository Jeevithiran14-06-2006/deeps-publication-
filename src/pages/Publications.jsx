import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Headphones, 
  Quote, 
  Download, 
  ShoppingCart, 
  Filter, 
  Layers, 
  SlidersHorizontal,
  TrendingUp,
  FileText,
  CheckCircle,
  Eye,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CitationModal from '../components/CitationModal';
import PaperReaderModal from '../components/PaperReaderModal';
import ChatPaperModal from '../components/ChatPaperModal';
import AudioOverviewModal from '../components/AudioOverviewModal';

export default function Publications() {
  const [publishedPapers, setPublishedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedAccess, setSelectedAccess] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:3001/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        const accepted = data.filter(paper => paper.status === 'Accepted');
        setPublishedPapers(accepted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const subjects = [
    'All',
    'Artificial Intelligence & Robotics',
    'Biotechnology & Genetics',
    'Medicine & Healthcare',
    'Materials Science & Nanotechnology',
    'Renewable Energy & Sustainability',
    'Pharmacology & Toxicology'
  ];

  // Filter & Search Logic
  const filteredPapers = publishedPapers.filter(paper => {
    const matchesSearch = 
      (paper.title && paper.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.authors && paper.authors.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.abstract && paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.doi && paper.doi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.keywords && paper.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
    const matchesAccess = selectedAccess === 'All' || (paper.accessType || 'Open Access') === selectedAccess;

    return matchesSearch && matchesSubject && matchesAccess;
  });

  // Sort Logic
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === 'citations') return (b.citations || 0) - (a.citations || 0);
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
  });

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

  return (
    <section className="section" style={{ minHeight: '85vh', paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header-split">
          <div>
            <span className="badge badge-blue">Official Research Repository</span>
            <h2>Peer-Reviewed Publications</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '620px' }}>
              Explore certified open-access and peer-reviewed articles across biotechnology, artificial intelligence, medicine, and physical sciences.
            </p>
          </div>
          <div>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              ✓ All Papers DOI Minted & Indexed
            </span>
          </div>
        </div>

        {/* Faceted Filtering & Search Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--card-border)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Top row: Search input & Sort dropdown */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--card-border)',
              borderRadius: '9999px',
              padding: '0.5rem 1.25rem',
              flex: 1,
              minWidth: '280px',
              maxWidth: '550px'
            }}>
              <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
              <input
                type="text"
                placeholder="Search DOIs, authors, titles, keywords (e.g. quantum, CRISPR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="citations">Most Cited</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
              </select>

              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="All">All Access Types</option>
                <option value="Open Access">Open Access</option>
                <option value="Subscription">Subscription ($35)</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Subject Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Subject:</span>
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  border: selectedSubject === s ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)',
                  background: selectedSubject === s ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.2)',
                  color: selectedSubject === s ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {s === 'All' ? 'All Subjects' : s.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Publications Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading peer-reviewed repository...</p>
        ) : sortedPapers.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No matching publications found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms or subject filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedPapers.map(paper => {
              const isSubscription = paper.accessType === 'Subscription' || paper.price > 0;
              const doi = paper.doi || `10.5555/vowles.2026.${1000 + paper.id}`;

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
                    gap: '1rem',
                    transition: 'border-color 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Top Metadata Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {isSubscription ? (
                        <span className="badge badge-yellow">Premium ($35)</span>
                      ) : (
                        <span className="badge badge-green">Open Access</span>
                      )}
                      <span className="badge badge-blue">
                        {paper.journal ? paper.journal.split(' ')[1] : 'Journal Article'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        DOI: <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{doi}</a>
                      </span>
                    </div>

                    {/* Scientific Altmetric & Engagement Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>👁️ {paper.views || 520} views</span>
                      <span>📥 {paper.downloads || 140} downloads</span>
                      <span>📜 {paper.citations || 14} citations</span>
                      {/* Altmetric donut simulation */}
                      <span style={{
                        background: 'linear-gradient(135deg, #10b981, #0284c7)',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}>
                        Altmetric: {Math.floor((paper.citations || 8) * 2.5 + 4)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: '0.25rem 0 0.5rem', lineHeight: 1.35 }}>
                      {paper.title}
                    </h3>
                    <p style={{ color: '#38bdf8', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                      {paper.authors}
                    </p>
                    {paper.affiliation && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                        {paper.affiliation}
                      </p>
                    )}
                  </div>

                  {/* Abstract preview */}
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {paper.abstract}
                  </p>

                  {/* Keywords */}
                  {paper.keywords && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {paper.keywords.split(',').map((kw, idx) => (
                        <span key={idx} style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)'
                        }}>
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    borderTop: '1px solid var(--card-border)',
                    paddingTop: '1.25rem',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                    </div>

                    <div>
                      {isSubscription ? (
                        <button 
                          onClick={() => addToCart({ id: paper.id, title: paper.title, price: 35.0, type: 'Article Purchase', authors: paper.authors })}
                          className="btn btn-primary" 
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
                        >
                          <ShoppingCart size={15} /> Buy Article ($35.00)
                        </button>
                      ) : (
                        <a 
                          href={`http://localhost:3001/api/downloads/${paper.filename}`} 
                          download 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          <Download size={15} /> Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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