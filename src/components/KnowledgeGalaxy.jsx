import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Search, 
  RotateCcw, 
  BookOpen, 
  Compass, 
  X,
  Sparkles
} from 'lucide-react';

// Scholarly Citation Dataset (Nodes & Directed Citation Links)
const initialGalaxyData = {
  nodes: [
    // Computer Science & AI (Cyan)
    { id: 'cs-1', title: 'Quantum Advantage in Neural Swarm Navigation', authors: 'Dr. Sarah Lin, Prof. M. Vance', citations: 128, subject: 'Computer Science & AI', doi: '10.5555/vowles.2026.0101', year: 2026 },
    { id: 'cs-2', title: 'Decentralized Graph Optimization under Noisy Sensors', authors: 'Dr. Arthur Dent et al.', citations: 84, subject: 'Computer Science & AI', doi: '10.5555/vowles.2025.0412', year: 2025 },
    { id: 'cs-3', title: 'Hamiltonian Path Solvers in Low-Power Robotics', authors: 'Prof. Li Wei, Dr. S. Lin', citations: 96, subject: 'Computer Science & AI', doi: '10.5555/vowles.2025.0841', year: 2025 },
    { id: 'cs-4', title: 'Asymptotic Latency in Multi-Agent Swarms', authors: 'Dr. K. Svensson', citations: 42, subject: 'Computer Science & AI', doi: '10.5555/vowles.2024.0321', year: 2024 },

    // Medicine & Genetics (Deep Purple)
    { id: 'med-1', title: 'CRISPR-Cas24 Precision Gene Editing in Lung Carcinoma', authors: 'Prof. Elena Rostova, Dr. K. Takahashi', citations: 142, subject: 'Medicine & Genetics', doi: '10.5555/vowles.2026.0102', year: 2026 },
    { id: 'med-2', title: 'Off-Target Cleavage Mitigation via Synthetic Allosterics', authors: 'Dr. Miriam Vance et al.', citations: 110, subject: 'Medicine & Genetics', doi: '10.5555/vowles.2025.0921', year: 2025 },
    { id: 'med-3', title: 'Cellular Endonuclease Selectivity in Xenografts', authors: 'Prof. Elena Rostova', citations: 76, subject: 'Medicine & Genetics', doi: '10.5555/vowles.2024.0614', year: 2024 },
    { id: 'med-4', title: 'Single-Cell Transcriptomics in Targeted Therapeutics', authors: 'Dr. Julian Thorne', citations: 58, subject: 'Medicine & Genetics', doi: '10.5555/vowles.2024.0118', year: 2024 },

    // Materials Science (Gold / Amber)
    { id: 'mat-1', title: 'Solid-State Electrolyte Degradation in Li-S Cells', authors: 'Dr. Tariq Al-Mansoor, Prof. J. Becker', citations: 88, subject: 'Materials Science', doi: '10.5555/vowles.2026.0103', year: 2026 },
    { id: 'mat-2', title: 'In-Situ Synchrotron X-Ray of Dendrite Kinetics', authors: 'Dr. Tariq Al-Mansoor', citations: 64, subject: 'Materials Science', doi: '10.5555/vowles.2025.0719', year: 2025 },
    { id: 'mat-3', title: 'Fluorinated Interphase for Ceramic Electrolytes', authors: 'Prof. Julia Becker, Dr. D. Chen', citations: 94, subject: 'Materials Science', doi: '10.5555/vowles.2025.0210', year: 2025 },

    // Renewable Energy (Emerald)
    { id: 'eng-1', title: 'Perovskite-Silicon Tandems Exceeding 34% Efficiency', authors: 'Prof. David Chen, Dr. A. Sharma', citations: 115, subject: 'Renewable Energy', doi: '10.5555/vowles.2026.0104', year: 2026 },
    { id: 'eng-2', title: 'Wide-Bandgap Metal-Halide Heterojunction Physics', authors: 'Dr. Peter Lindholm', citations: 72, subject: 'Renewable Energy', doi: '10.5555/vowles.2025.0511', year: 2025 },
    { id: 'eng-3', title: 'Non-Thermal Recombination in Photovoltaic Absorbers', authors: 'Prof. David Chen', citations: 53, subject: 'Renewable Energy', doi: '10.5555/vowles.2024.1102', year: 2024 },

    // Pharmacology (Rose)
    { id: 'pharma-1', title: 'Synthetic CB1/CB2 Receptor Agonist Pharmacokinetics', authors: 'Dr. Rebecca O’Connor, Prof. M. Chang', citations: 67, subject: 'Pharmacology', doi: '10.5555/vowles.2026.0105', year: 2026 },
    { id: 'pharma-2', title: 'Blood-Brain Barrier Microdialysis in Neuroreceptors', authors: 'Dr. Rebecca O’Connor', citations: 81, subject: 'Pharmacology', doi: '10.5555/vowles.2025.0315', year: 2025 },
    { id: 'pharma-3', title: 'Lipophilic Partition Coefficients in Central Uptake', authors: 'Prof. Michael Chang', citations: 49, subject: 'Pharmacology', doi: '10.5555/vowles.2024.0820', year: 2024 },
  ],
  links: [
    { source: 'cs-1', target: 'cs-2' },
    { source: 'cs-1', target: 'cs-3' },
    { source: 'cs-2', target: 'cs-4' },
    { source: 'cs-3', target: 'cs-4' },
    { source: 'med-1', target: 'med-2' },
    { source: 'med-1', target: 'med-3' },
    { source: 'med-2', target: 'med-4' },
    { source: 'mat-1', target: 'mat-2' },
    { source: 'mat-1', target: 'mat-3' },
    { source: 'eng-1', target: 'eng-2' },
    { source: 'eng-1', target: 'eng-3' },
    { source: 'pharma-1', target: 'pharma-2' },
    { source: 'pharma-2', target: 'pharma-3' },
    { source: 'cs-1', target: 'mat-1' },
    { source: 'med-1', target: 'pharma-1' },
    { source: 'eng-1', target: 'mat-3' },
    { source: 'cs-2', target: 'eng-1' },
  ]
};

const subjectThemes = {
  'Computer Science & AI': { color: '#06b6d4', label: 'AI & Robotics' },
  'Medicine & Genetics': { color: '#a855f7', label: 'Medicine & Genetics' },
  'Materials Science': { color: '#f59e0b', label: 'Materials Science' },
  'Renewable Energy': { color: '#10b981', label: 'Renewable Energy' },
  'Pharmacology': { color: '#f43f5e', label: 'Pharmacology' },
};

export default function KnowledgeGalaxy({ onSelectPaper }) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [ForceGraph3D, setForceGraph3D] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    import('react-force-graph-3d').then((mod) => {
      setForceGraph3D(() => mod.default);
    });

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || window.innerWidth,
          height: containerRef.current.clientHeight || 650
        });
      } else {
        setDimensions({ width: window.innerWidth, height: 650 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      const controls = fgRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
      }
    }
  }, [ForceGraph3D]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filteredNodes = initialGalaxyData.nodes.filter(node => {
      const matchesSubject = activeSubjectFilter === 'All' || node.subject === activeSubjectFilter;
      const matchesSearch = !q || 
        node.title.toLowerCase().includes(q) || 
        node.authors.toLowerCase().includes(q) ||
        node.subject.toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = initialGalaxyData.links.filter(link => {
      const src = typeof link.source === 'object' ? link.source.id : link.source;
      const tgt = typeof link.target === 'object' ? link.target.id : link.target;
      return nodeIds.has(src) && nodeIds.has(tgt);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [searchQuery, activeSubjectFilter]);

  const renderCustomNode = useCallback((node) => {
    const theme = subjectThemes[node.subject] || { color: '#38bdf8' };
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;

    const baseRadius = Math.max(3.5, Math.min(8, Math.sqrt(node.citations) * 0.7));
    const radius = isHovered || isSelected ? baseRadius * 1.4 : baseRadius;

    const group = new THREE.Group();

    // 1. Core Sphere
    const sphereGeometry = new THREE.SphereGeometry(radius, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: theme.color,
      emissive: theme.color,
      emissiveIntensity: isHovered || isSelected ? 0.95 : 0.45,
      roughness: 0.25,
      metalness: 0.75
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphereMesh);

    // 2. Halo Mesh
    const haloGeometry = new THREE.SphereGeometry(radius * 1.5, 16, 16);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: theme.color,
      transparent: true,
      opacity: isHovered || isSelected ? 0.35 : 0.12,
      wireframe: isHovered
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    group.add(haloMesh);

    return group;
  }, [hoveredNode, selectedNode]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        { x: node.x, y: node.y, z: node.z },
        1400
      );
    }
  };

  const handleResetCamera = () => {
    setSelectedNode(null);
    setHoveredNode(null);
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 280 }, { x: 0, y: 0, z: 0 }, 1400);
      const controls = fgRef.current.controls();
      if (controls) controls.autoRotate = true;
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '650px', background: '#07090e', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
      {/* 3D WebGL Canvas */}
      {ForceGraph3D ? (
        <ForceGraph3D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={filteredData}
          backgroundColor="#07090e"
          showNavInfo={false}
          nodeThreeObject={renderCustomNode}
          nodeLabel={() => ''}
          onNodeHover={(node) => {
            setHoveredNode(node || null);
            if (fgRef.current) {
              const controls = fgRef.current.controls();
              if (controls) controls.autoRotate = !node && !selectedNode;
            }
          }}
          onNodeClick={handleNodeClick}
          linkColor={() => 'rgba(255, 255, 255, 0.12)'}
          linkWidth={(link) => {
            const isConnected = hoveredNode && (link.source.id === hoveredNode.id || link.target.id === hoveredNode.id);
            return isConnected ? 2.4 : 0.8;
          }}
          linkDirectionalParticles={3}
          linkDirectionalParticleSpeed={0.007}
          linkDirectionalParticleWidth={1.8}
          linkDirectionalParticleColor={(link) => {
            const theme = subjectThemes[link.source.subject] || { color: '#38bdf8' };
            return theme.color;
          }}
          warmupTicks={50}
          cooldownTicks={100}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #38bdf8', borderTopColor: 'transparent' }} className="spin-animation" />
          <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '2px' }}>
            INITIALIZING 3D CITATION COSMOS...
          </span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '680px', pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--card-border)',
          borderRadius: '1rem',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          pointerEvents: 'auto'
        }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search 3D paper cosmos by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={handleResetCamera}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.85rem', whiteSpace: 'nowrap' }}
          >
            <RotateCcw size={12} color="#38bdf8" /> Recenter Orbit
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.65rem', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          {['All', ...Object.keys(subjectThemes)].map((subj) => {
            const theme = subjectThemes[subj];
            const isSelected = activeSubjectFilter === subj;

            return (
              <button
                key={subj}
                onClick={() => setActiveSubjectFilter(subj)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.4)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--card-border)',
                  color: isSelected ? '#38bdf8' : 'var(--text-muted)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {theme && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.color }} />
                )}
                <span>{subj === 'All' ? 'All Disciplines' : theme?.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Left Title Tag */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
          <Compass size={14} className="spin-slow" />
          <span>KNOWLEDGE GALAXY</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {filteredData.nodes.length} Papers • {filteredData.links.length} Connected Citations
        </p>
      </div>

      {/* Hover / Selected Inspector Card */}
      {(hoveredNode || selectedNode) && (
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 20,
          maxWidth: '340px',
          width: '90%',
          background: 'rgba(9, 13, 22, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--card-border)',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
        }}>
          {(() => {
            const active = selectedNode || hoveredNode;
            const theme = subjectThemes[active.subject] || { color: '#06b6d4' };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: `${theme.color}20`,
                    border: `1px solid ${theme.color}50`,
                    color: theme.color,
                    fontWeight: 600
                  }}>
                    {active.subject}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {active.year}
                  </span>
                </div>

                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 0.25rem', lineHeight: 1.35 }}>
                    {active.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                    {active.authors}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', display: 'block', marginTop: '0.25rem' }}>
                    DOI: {active.doi}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '0.4rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Citations</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{active.citations}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '0.4rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Review</span>
                    <strong style={{ color: '#10b981', fontSize: '0.8rem' }}>Double-Blind</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPaper && onSelectPaper(active)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  <BookOpen size={14} /> Inspect Publication
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom Hint */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.05)' }}>
          Left click + drag to rotate • Scroll to zoom • Click node to zoom in
        </span>
      </div>
    </div>
  );
}