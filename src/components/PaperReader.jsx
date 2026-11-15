import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Quote, 
  Share2, 
  Sliders, 
  BookOpen, 
  ChevronRight, 
  X,
  Volume2
} from 'lucide-react';

export default function PaperReader({
  paper = {
    title: "Quantum Advantage in Autonomous Neural Navigation Systems",
    authors: "Dr. Sarah Lin, Prof. Marcus Vance, Dr. Arthur Dent",
    affiliation: "Quantum AI Laboratory, Stanford University • Oxford Quantum Institute",
    doi: "10.5555/vowles.2026.0101",
    publishedDate: "November 14, 2026",
    journal: "Vowles Journal of Artificial Intelligence & Autonomous Systems",
    verificationHash: "0x8F9A4E72B01C99D34F1A8E62B",
    abstract: "We demonstrate an algorithmic paradigm implementing quantum annealing heuristics to solve multi-agent collision-avoidance graphs in swarm robotics. Testing across 10,000 simulations yielded an empirical 42.8% latency reduction compared to standard Dijkstra and A* baselines in high-density sensor networks."
  },
  onClose,
  onOpenCitation,
  onOpenAudio,
  onOpenAI
}) {
  const [activeSection, setActiveSection] = useState('abstract');
  const [readingProgress, setReadingProgress] = useState(0);

  // Interactive Methodology Simulation Parameters
  const [temperature, setTemperature] = useState(0.85); // Kelvin / Annealing Temp
  const [swarmDensity, setSwarmDensity] = useState(2400); // Agents
  const [learningRate, setLearningRate] = useState(0.018); // Alpha

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setReadingProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const latency = (12.4 * Math.exp(-temperature * 0.8) + (swarmDensity / 800)).toFixed(1);
  const efficiencyGain = Math.min(99.4, (78.2 + (learningRate * 420) + (temperature * 4.5))).toFixed(1);
  const energySaving = Math.round(34 + (temperature * 12) - (swarmDensity / 600));

  const sections = [
    { id: 'abstract', label: '01. Abstract & Scope' },
    { id: 'methodology', label: '02. Methodology Lab' },
    { id: 'results', label: '03. Empirical Results' },
    { id: 'references', label: '04. Verified References' },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#07090e', color: '#f8fafc', paddingBottom: '4rem' }}>
      
      {/* Slow Glowing Orbital Space Radiants */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.08)', filter: 'blur(120px)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 20, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '40%', right: '-100px', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.08)', filter: 'blur(140px)' }}
        />
      </div>

      {/* Reading Progress Line */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.05)', zIndex: 50 }}>
        <div style={{ height: '100%', width: `${readingProgress}%`, background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)', boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)' }} />
      </div>

      {/* Sticky Reader Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(7, 9, 14, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--card-border)', padding: '0.75rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>Peer-Reviewed</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>DOI: {paper.doi || '10.5555/vowles.2026.0101'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onOpenCitation && (
              <button onClick={() => onOpenCitation(paper)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                <Quote size={13} color="#38bdf8" /> Cite
              </button>
            )}
            {onOpenAudio && (
              <button onClick={() => onOpenAudio(paper)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                <Volume2 size={13} color="#c084fc" /> Listen
              </button>
            )}
            {onClose && (
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid: Floating Sidebar + Reading Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem' }}>
        
        {/* Floating Glassmorphic Left Sidebar */}
        <aside style={{ display: 'block' }}>
          <div style={{
            position: 'sticky',
            top: '5.5rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--card-border)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Contents
              </span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {Math.round(readingProgress)}% read
              </span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  style={{
                    textAlign: 'left',
                    background: activeSection === s.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: activeSection === s.id ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                    color: activeSection === s.id ? '#38bdf8' : 'var(--text-muted)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{s.label}</span>
                  <ChevronRight size={12} style={{ opacity: activeSection === s.id ? 1 : 0 }} />
                </button>
              ))}
            </nav>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>
                Certification
              </span>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <div>Status: <strong style={{ color: '#10b981' }}>Double-Blind Verified</strong></div>
                <div style={{ marginTop: '0.25rem' }}>Ethics: <strong style={{ color: '#38bdf8' }}>COPE Adherence</strong></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Reading Sheet */}
        <main style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid var(--card-border)',
          borderRadius: '1.5rem',
          padding: '3rem 2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          lineHeight: 1.8
        }}>
          {/* Holographic Peer-Review Seal */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #f59e0b, #06b6d4, #8b5cf6)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '100%', height: '100%', background: '#0a0f1d', borderRadius: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="#fcd34d" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Verified Double-Blind Peer Reviewed
                  </strong>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06b6d4' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  COPE Certified • Cryptographic Hash: {paper.verificationHash || '0x8F9A4E72B01C99D34F1A8E62B'}
                </div>
              </div>
            </div>

            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              Immutable Record
            </span>
          </div>

          {/* Paper Title & Metadata */}
          <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '1px' }}>
              {paper.journal || 'Vowles Publications Official Journal'}
            </span>
            <h1 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.25, fontFamily: 'Playfair Display, serif' }}>
              {paper.title}
            </h1>
            <p style={{ color: '#38bdf8', fontSize: '1.05rem', margin: 0, fontWeight: 500 }}>
              {paper.authors}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {paper.affiliation || 'Department of Quantum Computing, Stanford University'}
            </p>
          </div>

          {/* Section 1: Abstract */}
          <section id="abstract" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '0.75rem' }}>
              01. Abstract & Scope
            </h2>
            <div style={{ background: 'rgba(56, 189, 248, 0.04)', borderLeft: '3px solid #38bdf8', padding: '1.25rem 1.5rem', borderRadius: '0 0.75rem 0.75rem 0', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, color: '#e2e8f0', fontStyle: 'italic', fontSize: '1.05rem' }}>
                "{paper.abstract}"
              </p>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
              Autonomous multi-agent orchestration within cluttered dynamical environments represents one of the foundational bottlenecks of contemporary cyber-physical robotics. Conventional deterministic graph search frameworks degrade quadratically under non-stationary sensor interference. Here, we formulate a non-equilibrium state projection that resolves topological routing constraints within sub-millisecond convergence windows.
            </p>
          </section>

          {/* Section 2: Live Methodology Lab */}
          <section id="methodology" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '0.85rem', color: '#c084fc', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '0.75rem' }}>
              02. Methodology & Live Simulation Lab
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
              Rather than treating the mathematical formulation as a static proof, modulate the quantum annealing temperature (\(T\)), agent swarm density (\(\rho\)), and learning rate parameter (\(\alpha\)) to verify real-time convergence stability below:
            </p>

            {/* Interactive Simulation Card */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>Live Parametric Simulation Kernel</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Executable WebAssembly v2.4</span>
                  </div>
                </div>

                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  ● Real-Time Sync
                </span>
              </div>

              {/* Sliders Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Annealing Temp (\(T\))</span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{temperature} K</strong>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="2.50"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Swarm Density (\(\rho\))</span>
                    <strong style={{ color: '#c084fc', fontFamily: 'monospace' }}>{swarmDensity} agents</strong>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={swarmDensity}
                    onChange={(e) => setSwarmDensity(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Learning Rate (\(\alpha\))</span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{learningRate}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.050"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Dynamic Live Metrics Output */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Latency</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                    {latency} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ms</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Efficiency Gain</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                    +{efficiencyGain}%
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Energy Saved</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                    ~{energySaving}%
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Results */}
          <section id="results" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '0.75rem' }}>
              03. Empirical Results
            </h2>
            <p style={{ color: '#cbd5e1' }}>
              Across 10,000 independent Monte Carlo validation passes, the system maintained monotonic convergence with zero deadlock incidents recorded under dense obstacle distributions (\(&gt; 45\%\) spatial occupancy). As indicated by the live simulation test above, scaling swarm density preserves asymptotic sub-linear growth in computational overhead.
            </p>
          </section>

          {/* Section 4: References */}
          <section id="references" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '1rem' }}>
              04. Verified References
            </h2>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li>Vance, M. & Lin, S. (2025). Non-Equilibrium Annealing in High-Dimensional Routing Networks. <em>Vowles Academic Press</em>, 4(2), pp. 112–129. DOI: 10.5555/vowles.2025.0841.</li>
              <li>Dent, A. et al. (2024). Decentralized Graph Heuristics under Imperfect Sensor Observability. <em>Nature Computational Science</em>, 6, pp. 410–424.</li>
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}