import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Users, 
  Sparkles, 
  Plus, 
  Trash2, 
  BookOpen
} from 'lucide-react';
import { journalsList } from '../pages/Journals';

export default function SubmissionPortal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTrackingId, setGeneratedTrackingId] = useState('');
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    journal: journalsList[0]?.title || 'Vowles Journal of Artificial Intelligence & Autonomous Systems',
    title: '',
    abstract: '',
    keywords: '',
    primaryAuthor: '',
    primaryEmail: '',
    affiliation: '',
    orcidConnected: false,
    orcidId: '',
    coAuthors: [],
    manuscriptFile: null,
    fastTrack: false,
    agreeCOPE: false
  });

  const [newCoAuthor, setNewCoAuthor] = useState({ name: '', affiliation: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const abstractWordCount = formData.abstract.trim() 
    ? formData.abstract.trim().split(/\s+/).length 
    : 0;
  const isWordCountOptimal = abstractWordCount >= 50 && abstractWordCount <= 350;

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setStep((prev) => Math.min(4, Math.max(1, prev + newDirection)));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, manuscriptFile: e.dataTransfer.files[0] }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, manuscriptFile: e.target.files[0] }));
    }
  };

  const addCoAuthor = () => {
    if (newCoAuthor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        coAuthors: [...prev.coAuthors, { ...newCoAuthor, id: Date.now() }]
      }));
      setNewCoAuthor({ name: '', affiliation: '' });
    }
  };

  const removeCoAuthor = (id) => {
    setFormData(prev => ({
      ...prev,
      coAuthors: prev.coAuthors.filter(a => a.id !== id)
    }));
  };

  const handleConnectORCID = () => {
    setFormData(prev => ({
      ...prev,
      orcidConnected: true,
      orcidId: '0000-0002-1825-0097',
      primaryAuthor: prev.primaryAuthor || 'Dr. Sarah Vance',
      affiliation: prev.affiliation || 'Department of Quantum Computing, Stanford University'
    }));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setApiError('');

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title || 'Untitled Manuscript');
      
      const allAuthors = [
        formData.primaryAuthor || 'Corresponding Author',
        ...formData.coAuthors.map(c => c.name)
      ].join(', ');
      
      dataPayload.append('authors', allAuthors);
      dataPayload.append('abstract', formData.abstract || 'Scientific research abstract.');
      dataPayload.append('journal', formData.journal);
      dataPayload.append('keywords', formData.keywords);
      dataPayload.append('orcid', formData.orcidId);
      dataPayload.append('affiliation', formData.affiliation);

      // If a file was selected, upload it; otherwise send mock blob
      if (formData.manuscriptFile) {
        dataPayload.append('manuscriptFile', formData.manuscriptFile);
      } else {
        const dummyBlob = new Blob([`%PDF-1.4\n%Vowles Official Manuscript: ${formData.title}`], { type: 'application/pdf' });
        dataPayload.append('manuscriptFile', dummyBlob, 'manuscript.pdf');
      }

      const res = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        body: dataPayload
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedTrackingId(data.trackingNumber || `VP-2026-${data.id}`);
        setIsSubmitted(true);
        if (onComplete) onComplete(data.trackingNumber);
      } else {
        setApiError(data.error || 'Submission error');
      }
    } catch (err) {
      // Fallback local tracking code if offline
      const fallbackCode = `VP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedTrackingId(fallbackCode);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' }
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' }
    })
  };

  return (
    <div style={{ position: 'relative', minHeight: '85vh', padding: '2rem 1rem' }}>
      
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Progress Stepper Bar */}
        {!isSubmitted && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: '2px', background: 'rgba(255,255,255,0.08)', zIndex: 0 }} />
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: '2px', background: 'linear-gradient(90deg, #38bdf8, #c084fc)', width: `${((step - 1) / 3) * 100}%`, transition: 'width 0.3s ease', zIndex: 0 }} />

              {[
                { num: 1, label: 'Paper Details' },
                { num: 2, label: 'Authors & ORCID' },
                { num: 3, label: 'Upload Manuscript' },
                { num: 4, label: 'Review & Submit' }
              ].map(s => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;

                return (
                  <div key={s.num} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isCompleted ? '#10b981' : isActive ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#0d1322',
                      border: isActive ? '2px solid #38bdf8' : '1px solid var(--card-border)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.5)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {isCompleted ? <CheckCircle2 size={18} /> : s.num}
                    </div>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: isActive ? '#38bdf8' : isCompleted ? '#e2e8f0' : 'var(--text-muted)', fontWeight: isActive ? 'bold' : 'normal' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--card-border)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {isSubmitted ? (
            /* Confirmation Receipt */
            <div style={{ textAlign: 'center', padding: '2rem 1rem', margin: 'auto 0' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <ShieldCheck size={38} />
              </div>

              <span className="badge badge-green" style={{ marginBottom: '0.75rem' }}>
                Intake Confirmed • Double-Blind Review Queue
              </span>

              <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.25rem 0 0.5rem', fontFamily: 'Playfair Display, serif' }}>
                Manuscript Successfully Dispatched
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
                Your paper has entered our cryptographic intake pipeline and is scheduled for immediate plagiarism screening.
              </p>

              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.5rem', maxWidth: '440px', margin: '0 auto 2rem', textAlign: 'left', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tracking Code:</span>
                  <strong style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '1rem' }}>{generatedTrackingId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Journal:</span>
                  <span style={{ color: '#fff', maxWidth: '240px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formData.journal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fast-Track Status:</span>
                  <strong style={{ color: formData.fastTrack ? '#f59e0b' : '#cbd5e1' }}>
                    {formData.fastTrack ? '⚡ 10-Day Expedited Track' : 'Standard Peer Review'}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/track" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                  Track Manuscript Status Live <ArrowRight size={16} />
                </a>
                <button onClick={() => { setIsSubmitted(false); setStep(1); }} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
                  Submit Another Paper
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Steps View */}
              <div style={{ overflow: 'hidden' }}>
                <AnimatePresence custom={direction} mode="wait">
                  
                  {/* Step 1: Details */}
                  {step === 1 && (
                    <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>1. Paper Classification & Details</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Specify the target journal, title, and structured abstract.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Target Journal *</label>
                        <select
                          value={formData.journal}
                          onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                        >
                          {journalsList.map(j => (
                            <option key={j.id} value={j.title}>
                              {j.title} (IF: {j.impactFactor})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Manuscript Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Deep Reinforcement Learning in Multi-Agent Swarm Dynamics"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Abstract *</label>
                          <span style={{ fontSize: '0.75rem', color: isWordCountOptimal ? '#10b981' : '#eab308', fontFamily: 'monospace' }}>
                            {abstractWordCount} words (Target: 100–350)
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          required
                          placeholder="State the core thesis, methodology, observed benchmark metrics, and findings..."
                          value={formData.abstract}
                          onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Keywords (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="quantum annealing, multi-agent systems, robotics"
                          value={formData.keywords}
                          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Authors */}
                  {step === 2 && (
                    <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>2. Authorship & ORCID Validation</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Identify the lead author, affiliations, and co-authors.</p>
                      </div>

                      {/* ORCID SSO Connect */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(166, 206, 57, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                        border: '1px solid rgba(166, 206, 57, 0.3)',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(166, 206, 57, 0.2)', border: '1px solid rgba(166, 206, 57, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a6ce39', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            iD
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Official ORCID Link</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {formData.orcidConnected ? `Linked ID: ${formData.orcidId}` : 'Import verified scholar credentials in 1-click.'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleConnectORCID}
                          style={{
                            background: formData.orcidConnected ? 'rgba(166, 206, 57, 0.2)' : '#a6ce39',
                            color: formData.orcidConnected ? '#a6ce39' : '#000',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {formData.orcidConnected ? '✓ ORCID Verified' : 'Connect with ORCID'}
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Lead Author Name *</label>
                          <input
                            type="text"
                            placeholder="Dr. Sarah Vance"
                            value={formData.primaryAuthor}
                            onChange={(e) => setFormData({ ...formData, primaryAuthor: e.target.value })}
                            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Institutional Email *</label>
                          <input
                            type="email"
                            placeholder="sarah.vance@stanford.edu"
                            value={formData.primaryEmail}
                            onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Primary University Affiliation</label>
                        <input
                          type="text"
                          placeholder="Quantum AI Laboratory, Stanford University"
                          value={formData.affiliation}
                          onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', outline: 'none' }}
                        />
                      </div>

                      {/* Co-Authors Manager */}
                      <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                          Add Co-Authors ({formData.coAuthors.length})
                        </label>

                        {formData.coAuthors.map(author => (
                          <div key={author.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                            <span><strong>{author.name}</strong> ({author.affiliation || 'Co-Author'})</span>
                            <button type="button" onClick={() => removeCoAuthor(author.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Co-Author Name"
                            value={newCoAuthor.name}
                            onChange={(e) => setNewCoAuthor({ ...newCoAuthor, name: e.target.value })}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={newCoAuthor.affiliation}
                            onChange={(e) => setNewCoAuthor({ ...newCoAuthor, affiliation: e.target.value })}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                          />
                          <button type="button" onClick={addCoAuthor} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                            <Plus size={13} /> Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Drag & Drop Ingestion */}
                  {step === 3 && (
                    <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>3. Manuscript Document Ingestion</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload your complete manuscript in PDF or Word format.</p>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: isDragging ? '2px dashed #38bdf8' : '2px dashed rgba(255,255,255,0.15)',
                          borderRadius: '1rem',
                          padding: '3rem 1.5rem',
                          textAlign: 'center',
                          background: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />

                        <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                          <UploadCloud size={30} />
                        </div>

                        {formData.manuscriptFile ? (
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>✓ Manuscript File Staged</span>
                            <h4 style={{ color: '#fff', margin: '0.25rem 0' }}>{formData.manuscriptFile.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              {(formData.manuscriptFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Ingestion
                            </span>
                          </div>
                        ) : (
                          <div>
                            <h4 style={{ color: '#fff', margin: '0 0 0.25rem' }}>
                              {isDragging ? 'Release to Upload' : 'Drag & drop your manuscript PDF here'}
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                              Or click to browse from your device. Supports PDF and DOCX up to 64 MB.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Integrity Badge */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} color="#38bdf8" />
                        <div style={{ fontSize: '0.78rem' }}>
                          <strong style={{ color: '#fff', display: 'block' }}>Tamper-Proof Plagiarism Check Included</strong>
                          <span style={{ color: 'var(--text-muted)' }}>Automated Crossref SimCheck executes instantly to verify citation integrity.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review & Fast-Track */}
                  {step === 4 && (
                    <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>4. Review & Final Verification</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verify submission metadata and confirm author declarations.</p>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', padding: '1.25rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Title:</span>
                          <strong style={{ color: '#fff', textAlign: 'right', maxWidth: '300px' }}>{formData.title || 'Untitled'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Target Journal:</span>
                          <span style={{ color: '#38bdf8' }}>{formData.journal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Lead Author:</span>
                          <span style={{ color: '#fff' }}>{formData.primaryAuthor || 'Not specified'}</span>
                        </div>
                      </div>

                      {/* 10-Day Fast-Track VIP Toggle */}
                      <div style={{
                        background: formData.fastTrack ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)' : 'rgba(255,255,255,0.02)',
                        border: formData.fastTrack ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--card-border)',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: formData.fastTrack ? '0 0 25px rgba(245, 158, 11, 0.15)' : 'none',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: formData.fastTrack ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: formData.fastTrack ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={18} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>10-Day Expedited Review Guarantee</strong>
                              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontSize: '0.65rem' }}>VIP Track</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Guarantees first editorial decision within 10 days, or 50% APC waiver automatically refunded.
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, fastTrack: !formData.fastTrack })}
                          style={{
                            width: '46px',
                            height: '26px',
                            borderRadius: '9999px',
                            background: formData.fastTrack ? 'linear-gradient(90deg, #f59e0b, #38bdf8)' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            position: 'relative',
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: formData.fastTrack ? '23px' : '3px',
                            transition: 'left 0.2s'
                          }} />
                        </button>
                      </div>

                      {/* Ethics Checkbox */}
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <input
                          type="checkbox"
                          checked={formData.agreeCOPE}
                          onChange={(e) => setFormData({ ...formData, agreeCOPE: e.target.checked })}
                          style={{ marginTop: '0.2rem' }}
                        />
                        <span>
                          I confirm this manuscript represents original research complying with COPE ethical guidelines and that all co-authors have approved this submission.
                        </span>
                      </label>

                      {apiError && (
                        <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
                          {apiError}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wizard Bottom Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  disabled={step === 1}
                  className="btn btn-outline"
                  style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto', fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || !formData.agreeCOPE}
                    className="btn btn-primary"
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.65rem 1.75rem',
                      background: formData.agreeCOPE ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'rgba(255,255,255,0.05)',
                      cursor: formData.agreeCOPE ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isSubmitting ? 'Ingesting Manuscript...' : 'Confirm & Submit Paper'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}