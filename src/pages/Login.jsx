import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('password123');
  const navigate = useNavigate();

  const handleAuth = (email) => {
    localStorage.setItem('user', email);
    if (email === 'admin@vowles.com') {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/publications';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailValue.trim() || e.target.email.value.trim();
    handleAuth(email);
  };

  return (
    <section className="section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--card-border)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
              {isLogin ? 'Academic Single Sign-On' : 'Join Vowles Community'}
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
              {isLogin ? 'Log in to your account' : 'Register as Author / Reader'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {isLogin 
                ? 'Access peer-reviewed articles, manuscript tracking, and purchases.' 
                : 'Publish open-access research and join our peer review collective.'}
            </p>
          </div>

          {/* Quick 1-Click Demo Login Pills */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              ⚡ 1-Click Quick Demo Sign-In:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleAuth('admin@vowles.com')}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.4rem',
                  padding: '0.5rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldCheck size={14} color="#a855f7" /> Admin Access
              </button>

              <button
                type="button"
                onClick={() => handleAuth('dr.sarah@mit.edu')}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.4rem',
                  padding: '0.5rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <UserCheck size={14} color="#38bdf8" /> Author Access
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }} 
                  placeholder="Dr. Jane Doe" 
                />
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Email Address
              </label>
              <input 
                name="email" 
                type="email" 
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required 
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem'
                }} 
                placeholder="name@university.edu" 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                required 
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem'
                }} 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              {isLogin ? 'Sign In to Vowles' : 'Create Free Account'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle Tab */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {isLogin ? "Don't have an institutional account?" : "Already registered?"}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
              >
                {isLogin ? 'Create one now' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}