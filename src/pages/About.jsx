import React from 'react';

export default function About() {
  return (
    <section className="section" style={{minHeight: '80vh', display: 'flex', alignItems: 'center'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '1rem', padding: '3rem', backdropFilter: 'blur(12px)'}}>
          <span className="badge badge-yellow" style={{marginBottom: '1rem'}}>About Us</span>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>Vowles Publications</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem'}}>
            Vowles Publications is a premier open-access platform dedicated to accelerating global scientific discovery. We believe that rigorous ideas deserve an audience, unhindered by paywalls.
          </p>
          <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8'}}>
            Our peer-review process is designed to be rigorous yet rapid, ensuring that researchers can focus on their work while we handle the logistics of global distribution and indexing. We support disciplines spanning the physical sciences, medical informatics, humanities, and beyond.
          </p>
        </div>
      </div>
    </section>
  );
}
