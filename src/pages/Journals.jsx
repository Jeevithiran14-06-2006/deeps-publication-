import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Layers, 
  Clock, 
  FileCheck,
  Cpu,
  Dna,
  HeartPulse,
  Atom,
  Zap,
  Pill
} from 'lucide-react';

export const journalsList = [
  {
    id: 'vowles-ai-robotics',
    title: 'Vowles Journal of Artificial Intelligence & Autonomous Systems',
    shortTitle: 'VJ-AI & Robotics',
    subject: 'Artificial Intelligence & Robotics',
    icon: Cpu,
    color: '#38bdf8',
    impactFactor: '5.4',
    citeScore: '7.2',
    issn: '2981-4011',
    acceptanceRate: '19%',
    avgReviewDays: '16 days',
    editorInChief: 'Prof. Marcus Vance (Stanford University)',
    scope: 'Pioneering peer-reviewed research in deep learning, reinforcement heuristics, humanoid robotics, quantum machine algorithms, and autonomous multi-agent coordination.',
    indexing: ['Scopus', 'Google Scholar', 'Web of Science (ESCI)', 'DOAJ']
  },
  {
    id: 'vowles-biotech',
    title: 'Vowles Biotechnology & Bioengineering Letters',
    shortTitle: 'VJ-Biotechnology',
    subject: 'Biotechnology & Genetics',
    icon: Dna,
    color: '#10b981',
    impactFactor: '6.1',
    citeScore: '8.5',
    issn: '2981-402X',
    acceptanceRate: '22%',
    avgReviewDays: '14 days',
    editorInChief: 'Dr. Elena Rostova (Harvard Medical School)',
    scope: 'Translational discoveries in CRISPR-Cas genetic engineering, synthetic biology, recombinant protein expression, and bio-nanomaterials.',
    indexing: ['PubMed/MEDLINE', 'Scopus', 'Crossref', 'Embase']
  },
  {
    id: 'vowles-molecular-med',
    title: 'Vowles Journal of Clinical & Molecular Medicine',
    shortTitle: 'VJ-Clinical Medicine',
    subject: 'Medicine & Healthcare',
    icon: HeartPulse,
    color: '#f43f5e',
    impactFactor: '7.3',
    citeScore: '9.8',
    issn: '2981-4038',
    acceptanceRate: '16%',
    avgReviewDays: '18 days',
    editorInChief: 'Prof. Julian Thorne (Oxford University)',
    scope: 'High-impact clinical trials, oncology therapeutics, immunology biomarkers, precision patient diagnostics, and regenerative cellular therapies.',
    indexing: ['PubMed', 'Index Medicus', 'Scopus', 'Web of Science']
  },
  {
    id: 'vowles-materials-nano',
    title: 'Vowles Advanced Materials & Nanotechnology',
    shortTitle: 'VJ-Advanced Materials',
    subject: 'Materials Science & Nanotechnology',
    icon: Atom,
    color: '#a855f7',
    impactFactor: '4.9',
    citeScore: '6.4',
    issn: '2981-4046',
    acceptanceRate: '24%',
    avgReviewDays: '21 days',
    editorInChief: 'Dr. Tariq Al-Mansoor (ETH Zurich)',
    scope: 'Solid-state interface physics, 2D graphene superstructures, piezoelectric metamaterials, and nanoscale quantum dot devices.',
    indexing: ['Scopus', 'Chemical Abstracts (CAS)', 'Google Scholar']
  },
  {
    id: 'vowles-green-energy',
    title: 'Vowles Renewable Energy & Sustainable Engineering',
    shortTitle: 'VJ-Sustainable Energy',
    subject: 'Renewable Energy & Sustainability',
    icon: Zap,
    color: '#eab308',
    impactFactor: '5.8',
    citeScore: '7.9',
    issn: '2981-4054',
    acceptanceRate: '21%',
    avgReviewDays: '15 days',
    editorInChief: 'Prof. David Chen (National University of Singapore)',
    scope: 'Perovskite solar conversion, green hydrogen electrolysis, grid-scale solid-state storage, and carbon-negative chemical manufacturing.',
    indexing: ['Scopus', 'Ei Compendex', 'Web of Science', 'DOAJ']
  },
  {
    id: 'vowles-pharma',
    title: 'Vowles International Review of Pharmacological Sciences',
    shortTitle: 'VJ-Pharmacology',
    subject: 'Pharmacology & Toxicology',
    icon: Pill,
    color: '#ec4899',
    impactFactor: '6.5',
    citeScore: '8.1',
    issn: '2981-4062',
    acceptanceRate: '18%',
    avgReviewDays: '19 days',
    editorInChief: 'Dr. Rebecca O’Connor (University College London)',
    scope: 'Receptor kinetics, computational drug discovery, blood-brain barrier microdialysis, molecular toxicology, and targeted pharmacokinetics.',
    indexing: ['PubMed/MEDLINE', 'BIOSIS Previews', 'Scopus', 'EMBASE']
  }
];

export default function Journals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', 'Artificial Intelligence & Robotics', 'Biotechnology & Genetics', 'Medicine & Healthcare', 'Materials Science & Nanotechnology', 'Renewable Energy & Sustainability', 'Pharmacology & Toxicology'];

  const filteredJournals = journalsList.filter(j => {
    const matchesSubject = selectedSubject === 'All' || j.subject === selectedSubject;
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          j.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.issn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <section className="section" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header-split">
          <div>
            <span className="badge badge-yellow">EurekaSelect Peer-Reviewed Directory</span>
            <h2>Flagship Indexed Journals</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '650px' }}>
              Explore Vowles Publications' internationally indexed, peer-reviewed journals adhering to rigorous COPE publication ethics and rapid double-blind peer review.
            </p>
          </div>
          <div>
            <Link to="/submit" className="btn btn-primary">
              Submit to a Journal <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Search & Subject Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--card-border)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            width: '100%',
            maxWidth: '380px'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search journals, ISSN, keywords..." 
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

          {/* Subject Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  border: selectedSubject === s ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)',
                  background: selectedSubject === s ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.2)',
                  color: selectedSubject === s ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {s === 'All' ? 'All Disciplines' : s.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Journals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredJournals.map(journal => {
            const Icon = journal.icon;
            return (
              <div 
                key={journal.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                <div>
                  {/* Top Bar with Icon and Metrics */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '0.75rem',
                      background: `rgba(${journal.color === '#38bdf8' ? '56,189,248' : journal.color === '#10b981' ? '16,185,129' : journal.color === '#f43f5e' ? '244,63,94' : '168,85,247'}, 0.15)`,
                      border: `1px solid ${journal.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: journal.color
                    }}>
                      <Icon size={24} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                        IF: {journal.impactFactor}
                      </span>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        CS: {journal.citeScore}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {journal.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    ISSN: {journal.issn} • {journal.subject}
                  </p>

                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {journal.scope}
                  </p>

                  {/* Highlights Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Avg. Review:</span>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{journal.avgReviewDays}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Acceptance:</span>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{journal.acceptanceRate}</div>
                    </div>
                  </div>

                  {/* Indexing Badges */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {journal.indexing.map(idx => (
                      <span key={idx} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        {idx}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link 
                    to={`/journals/${journal.id}`} 
                    className="btn btn-primary" 
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    View Journal <ArrowRight size={14} />
                  </Link>
                  <Link 
                    to="/submit" 
                    className="btn btn-outline" 
                    style={{ fontSize: '0.85rem' }}
                  >
                    Submit Paper
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}