import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Square, Headphones, Volume2, FastForward, RotateCcw } from 'lucide-react';

export default function AudioOverviewModal({ paper, isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [spokenWordIndex, setSpokenWordIndex] = useState(0);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Stop playback if modal closes or paper changes
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenWordIndex(0);
    }
  }, [isOpen, paper]);

  if (!isOpen || !paper) return null;

  const scriptText = `Welcome to the Vowles Publications Research Digest. Today, we are reviewing a breakthrough publication titled: ${paper.title}, authored by ${paper.authors}. Published in the ${paper.journal || 'Vowles Academic Catalog'}. Here is the core summary: ${paper.abstract}. This research introduces a significant paradigm shift in ${paper.subject || 'modern science'}, demonstrating verifiable gains in repeatability and system efficiency. Thank you for listening to Vowles Audio Digests. Read the full paper online or download the manuscript on our platform.`;

  const words = scriptText.split(' ');

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Word boundary tracking for live highlight
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const sub = scriptText.substring(0, charIndex);
        const wIdx = sub.split(' ').length - 1;
        setSpokenWordIndex(wIdx);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenWordIndex(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenWordIndex(0);
    }
  };

  const handleChangeRate = (rate) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#090d16',
        border: '1px solid var(--card-border)',
        borderRadius: '1rem',
        maxWidth: '620px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--card-border)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Headphones size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Paper Audio Digest</h3>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Podcast Mode</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Narrated AI research summary
              </p>
            </div>
          </div>

          <button 
            onClick={() => { handleStop(); onClose(); }}
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

        {/* Audio Waveform Animation Area */}
        <div style={{
          padding: '2rem 1.5rem',
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.12) 0%, rgba(0,0,0,0) 70%)',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>
            {paper.title}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
            {paper.authors}
          </p>

          {/* Equalizer Visualizer Bars */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '6px', height: '50px', marginBottom: '1.5rem' }}>
            {[24, 45, 18, 38, 52, 28, 48, 32, 56, 20, 42, 30].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: isPlaying ? `${Math.min(50, Math.max(12, (h * Math.sin(Date.now() / 200 + i) + h) / 1.5))}px` : '10px',
                  background: isPlaying ? 'linear-gradient(to top, #0284c7, #38bdf8)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  transition: 'height 0.15s ease'
                }}
              />
            ))}
          </div>

          {/* Player Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleStop}
              title="Stop"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--card-border)',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Square size={16} />
            </button>

            <button
              onClick={isPlaying ? handlePause : handlePlay}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
            </button>

            {/* Playback Speed Toggles */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              {[0.9, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChangeRate(rate)}
                  style={{
                    background: playbackRate === rate ? 'var(--primary-blue)' : 'transparent',
                    border: 'none',
                    color: playbackRate === rate ? '#fff' : 'var(--text-muted)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Narration Transcript */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid var(--card-border)',
          maxHeight: '160px',
          overflowY: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.7,
          color: 'var(--text-muted)'
        }}>
          <strong style={{ color: '#fff', display: 'block', marginBottom: '0.35rem' }}>Live Narration Transcript:</strong>
          {words.map((w, idx) => (
            <span
              key={idx}
              style={{
                color: idx === spokenWordIndex ? '#38bdf8' : idx < spokenWordIndex ? '#e2e8f0' : 'var(--text-muted)',
                fontWeight: idx === spokenWordIndex ? 'bold' : 'normal',
                backgroundColor: idx === spokenWordIndex ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                padding: idx === spokenWordIndex ? '0 2px' : 0,
                borderRadius: '2px',
                transition: 'all 0.1s'
              }}
            >
              {w}{' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}