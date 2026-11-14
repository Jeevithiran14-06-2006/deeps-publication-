import React, { useState } from 'react';
import { X, Copy, Check, Quote, Download } from 'lucide-react';

export default function CitationModal({ paper, isOpen, onClose }) {
  const [activeFormat, setActiveFormat] = useState('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !paper) return null;

  const year = paper.submittedAt ? new Date(paper.submittedAt).getFullYear() : '2026';
  const journal = paper.journal || 'Vowles Publications Journal';
  const doi = paper.doi || `10.5555/vowles.${year}.${1000 + (paper.id || 1)}`;
  const authors = paper.authors || 'Anonymous Author';

  const getCitation = (format) => {
    switch (format) {
      case 'APA':
        return `${authors} (${year}). ${paper.title}. ${journal}, 12(3), 145-162. https://doi.org/${doi}`;
      case 'MLA':
        return `${authors}. "${paper.title}." ${journal}, vol. 12, no. 3, ${year}, pp. 145-162. DOI: ${doi}.`;
      case 'Chicago':
        return `${authors}. "${paper.title}." ${journal} 12, no. 3 (${year}): 145-162. https://doi.org/${doi}.`;
      case 'Harvard':
        return `${authors}, ${year}. ${paper.title}. ${journal}, 12(3), pp.145-162. Available at: <https://doi.org/${doi}>.`;
      case 'IEEE':
        return `[1] ${authors}, "${paper.title}," ${journal}, vol. 12, no. 3, pp. 145-162, ${year}, doi: ${doi}.`;
      case 'BibTeX':
        return `@article{vowles_${paper.id || 1}_${year},
  title={${paper.title}},
  author={${authors}},
  journal={${journal}},
  volume={12},
  number={3},
  pages={145--162},
  year={${year}},
  doi={${doi}}
}`;
      case 'RIS':
        return `TY  - JOUR
T1  - ${paper.title}
AU  - ${authors}
JO  - ${journal}
VL  - 12
IS  - 3
SP  - 145
EP  - 162
PY  - ${year}
DO  - ${doi}
ER  - `;
      default:
        return '';
    }
  };

  const currentCitation = getCitation(activeFormat);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeFormat === 'BibTeX' ? 'bib' : activeFormat === 'RIS' ? 'ris' : 'txt';
    const blob = new Blob([currentCitation], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `citation_${paper.id || 'article'}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formats = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'BibTeX', 'RIS'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#0b1120',
        border: '1px solid var(--card-border)',
        borderRadius: '1rem',
        maxWidth: '640px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Quote size={20} color="var(--primary-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Cite this Publication</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  border: activeFormat === fmt ? '1px solid var(--primary-blue)' : '1px solid var(--card-border)',
                  background: activeFormat === fmt ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.3)',
                  color: activeFormat === fmt ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Citation Preview Box */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--card-border)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            fontFamily: activeFormat === 'BibTeX' || activeFormat === 'RIS' ? 'monospace' : 'inherit',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: '#e2e8f0',
            whiteSpace: activeFormat === 'BibTeX' || activeFormat === 'RIS' ? 'pre-wrap' : 'normal',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {currentCitation}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Compatible with Zotero, Mendeley, EndNote & Papers.
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(activeFormat === 'BibTeX' || activeFormat === 'RIS') && (
                <button onClick={handleDownload} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}>
                  <Download size={15} /> Export .{activeFormat === 'BibTeX' ? 'bib' : 'ris'}
                </button>
              )}
              <button 
                onClick={handleCopy} 
                className="btn btn-primary" 
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Citation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}